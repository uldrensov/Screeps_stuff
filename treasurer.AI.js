//TREASURER: carries items between the vault and the terminal/powernex/nuker, on a per-order/command basis
//white trail ("carrier")

module.exports = {
    run: function(unit){
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //clear the 'done' flag for every new command issued
            if (unit.memory.task_progress == 0)
                unit.memory.done = false;
                

            //determine inputs and outputs
            if (unit.memory.task_progress < unit.memory.order_amt){
                //[false] transfer direction (e.g. unload terminal into vault)
                let input =     unit.room.terminal;
                let output =    unit.room.storage;

                //[true] transfer direction (e.g. load terminal/powernex/nuker from vault)
                if (unit.memory.dir){
                    input = unit.room.storage;

                    switch (unit.memory.spec_dest){
                        case 'TRM':
                            output = unit.room.terminal;
                            break;

                        case 'PWR':
                            //memorise the powernex id
                            if (!unit.memory.powernex){
                                unit.memory.powernex = unit.room.find(FIND_STRUCTURES, {
                                    filter: structure => {
                                        return structure.structureType == STRUCTURE_POWER_SPAWN;
                                    }
                                });
                            }
                            output = Game.getObjectById(unit.memory.powernex[0].id);
                            break;

                        case 'NUK':
                            //memorise the nuker id
                            if (!unit.memory.kimmyJ){
                                unit.memory.kimmyJ = unit.room.find(FIND_STRUCTURES, {
                                    filter: structure => {
                                        return structure.structureType == STRUCTURE_NUKER;
                                    }
                                });
                            }
                            output = Game.getObjectById(unit.memory.kimmyJ[0].id);
                            break;

                        case 'FAC':
                            //memorise the factory id
                            if (!unit.memory.factory){
                                unit.memory.factory = unit.room.find(FIND_STRUCTURES, {
                                    filter: structure => {
                                        return structure.structureType == STRUCTURE_FACTORY;
                                    }
                                });
                            }
                            output = Game.getObjectById(unit.memory.factory[0].id);
                            break;

                        default:
                            console.log(unit.name + ':: INVALID DESTINATION');
                    }
                }
                

                let finaltrip = false;

                //FETCH
                if (unit.store.getFreeCapacity(unit.memory.order_type) > 0){ //if unit is not fully loaded...
                    if (input.store.getUsedCapacity(unit.memory.order_type) == 0) //...but there is no more for the unit to withdraw: hot-switch to unload mode
                        finaltrip = true;
                    else if (unit.withdraw(input, unit.memory.order_type) == ERR_NOT_IN_RANGE)
                        unit.moveTo(input);
                }

                //UNLOAD
                if (unit.store.getFreeCapacity(unit.memory.order_type) == 0 || finaltrip){ //if unit is fully loaded, or if carrying its final load
                    const most_recent_load = unit.store.getUsedCapacity(unit.memory.order_type);
                    const unload_result = unit.transfer(output, unit.memory.order_type);

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
                console.log(unit.name + ':: ORDER COMPLETE (ROOM #' + unit.memory.home_index + ')');

                //killswitch message
                if (unit.memory.autokill){
                    unit.memory.killswitch = true;
                    console.log(unit.name + ':: RECYCLING UNIT...');
                }
            }
        }


        //built-in economic killswitch
        else{
            if (!Game.getObjectById(unit.memory.suicide_nexus_ID)){
                const sui_nexi = unit.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_SPAWN;
                    }
                });

                unit.memory.suicide_nexus_ID = sui_nexi[0].id;
            }

            if (Game.getObjectById(unit.memory.suicide_nexus_ID).recycleCreep(unit) == ERR_NOT_IN_RANGE)
                unit.moveTo(Game.getObjectById(unit.memory.suicide_nexus_ID));
        }
    }
};