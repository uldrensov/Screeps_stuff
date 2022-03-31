//FORGEHAND: carries items between the vault and the labs, on a per-order/command basis
//white trail ("carrier")

var SD = require('SOFTDATA');


module.exports = {
    run: function(unit, nexus_id, home_index){
        
        let nexus = Game.getObjectById(nexus_id);

        //init lab ids to memory
        if (unit.memory.reactant1_id == undefined){ //if one is undefined, then both are
            unit.memory.reactant1_id = SD.reactant_id[home_index][0];
            unit.memory.reactant2_id = SD.reactant_id[home_index][1];
        }

        let r1 = Game.getObjectById(unit.memory.reactant1_id);
        let r2 = Game.getObjectById(unit.memory.reactant2_id);


        //if lab1 is not empty, clean it out
        if (r1.store.getUsedCapacity() > 0){
            let cleanout_type = r1.mineralType;
            let finaltrip = false;

            //fetch
            if (unit.store.getFreeCapacity() > 0){ //if unit is not fully loaded...
                if (r1.store.getUsedCapacity() == 0) //...but there is no more for the unit to withdraw: switch to unload mode
                    finaltrip = true;
                else if (unit.withdraw(r1, cleanout_type) == ERR_NOT_IN_RANGE)
                    unit.moveTo(r1);
            }

            //unload
            if (unit.store.getFreeCapacity() == 0 || finaltrip){ //if unit is fully loaded, or if carrying its final load
                if (unit.transfer(nexus.room.storage, cleanout_type) == ERR_NOT_IN_RANGE)
                    unit.moveTo(nexus.room.storage);
            }
        }

        //if lab 2 is not empty, swap IDs with lab 1 in this unit's memory, and re-run the script to clean it out
        else if (r2.store.getUsedCapacity() > 0){
            let placehold = unit.memory.reactant1_id;
            unit.memory.reactant1_id = unit.memory.reactant2_id;
            unit.memory.reactant2_id = placehold;
        }
        
        //both labs are empty and primed for loading
        else{
            //proceed if there is no suicide order
            if (!unit.memory.killswitch){
                //determine inputs and outputs
                if (unit.memory.task1_progress < unit.memory.order1_amt){
                    //[false] transfer direction (unload lab into vault)
                    let input = r1;
                    let output = nexus.room.storage;

                    //[true] transfer direction (load lab from vault)
                    if (unit.memory.dir){
                        input = nexus.room.storage;

                        switch (unit.memory.spec_dest){
                            case 'NA':
                                output = nexus.room.terminal;
                                break;

                            case 'P':
                                //memorise the powernex id
                                if (unit.memory.powernex == undefined){
                                    unit.memory.powernex = unit.room.find(FIND_STRUCTURES, {
                                        filter: structure => {
                                            return structure.structureType == STRUCTURE_POWER_SPAWN;
                                        }
                                    });
                                }
                                output = Game.getObjectById(unit.memory.powernex[0].id);
                                break;

                            default:
                                break;
                        }
                    }
                
                    //fetch
                    let finaltrip = false;

                    if (unit.store.getFreeCapacity(unit.memory.order_type) != 0){ //if unit is not fully loaded...
                        if (input.store.getUsedCapacity(unit.memory.order_type) == 0) //...but there is no more for the unit to withdraw
                            finaltrip = true;
                        else if (unit.withdraw(input, unit.memory.order_type) == ERR_NOT_IN_RANGE)
                            unit.moveTo(input);
                    }

                    //unload
                    if (unit.store.getFreeCapacity(unit.memory.order_type) == 0 || finaltrip){ //if unit is fully loaded, or if carrying its final load
                        let most_recent_load = unit.store.getUsedCapacity(unit.memory.order_type);
                        let unload_result = unit.transfer(output, unit.memory.order_type);

                        if (unload_result == ERR_NOT_IN_RANGE)
                            unit.moveTo(output);

                        //record work done to memory
                        else if (unload_result == OK)
                            unit.memory.task_progress += most_recent_load;
                    }
                }

                //task complete notification
                else if (!unit.memory.done){
                    unit.memory.done = true;
                    console.log('treasurer.AI:: *********************');
                    console.log('treasurer.AI:: ORDER COMPLETE (ROOM #' + home_index + ')');

                    //killswitch message
                    if (unit.memory.autokill){
                        unit.memory.killswitch = true;
                        console.log('treasurer.AI:: RECYCLING UNIT...');
                    }

                    console.log('treasurer.AI:: *********************');
                }
            }

            //built-in economic killswitch
            else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
                    unit.moveTo(nexus);
        }
    }
};