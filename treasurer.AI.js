//TREASURER: loads or unloads to/from the vault, on a per-order/command basis
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            
            //clear this flag for every new command issued
            if (unit.memory.task_progress == 0)
                unit.memory.done = false;
                
            //action...
            if (unit.memory.task_progress < unit.memory.order_amt){
                
                //determine transfer direction (true => load terminal; false => unload terminal)
                var input;
                var output;
                if (unit.memory.dir){
                    input = nexus.room.storage;
                    switch (unit.memory.spec_dest){
                        case 'NA':
                            output = nexus.room.terminal;
                            break;
                        case 'P':
                            if (unit.memory.powernex == undefined){
                                unit.memory.powernex = unit.room.find(FIND_STRUCTURES, {
                                    filter: structure => {
                                        return structure.structureType == STRUCTURE_POWER_SPAWN;
                                    }
                                });
                            }
                            output = Game.getObjectById(unit.memory.powernex[0].id);
                            break;
                        case 'NUK':
                            if (unit.memory.kimmyJ == undefined){
                                unit.memory.kimmyJ = unit.room.find(FIND_STRUCTURES, {
                                    filter: structure => {
                                        return structure.structureType == STRUCTURE_NUKER;
                                    }
                                });
                            }
                            output = Game.getObjectById(unit.memory.kimmyJ[0].id);
                            break;
                    }
                }
                else{
                    input = nexus.room.terminal;
                    output = nexus.room.storage;
                }
                
                //fetch
                var input_remainder = false;
                if (unit.store.getFreeCapacity(unit.memory.order_type) != 0){ //if unit is not fully loaded
                    if (input.store.getUsedCapacity(unit.memory.order_type) == 0) //but there is no more to load
                        input_remainder = true;
                    else if (unit.withdraw(input, unit.memory.order_type) == ERR_NOT_IN_RANGE)
                        unit.moveTo(input);
                }
                //unload
                if (unit.store.getFreeCapacity(unit.memory.order_type) == 0 || input_remainder){ //only when unit is fully loaded
                    var unload_result = unit.transfer(output, unit.memory.order_type);
                    if (unload_result == ERR_NOT_IN_RANGE)
                        unit.moveTo(output);
                    //record work done to memery
                    else if (unload_result == OK)
                        unit.memory.task_progress += unit.store.getUsedCapacity(unit.memory.order_type);
                }
            }
            //task complete notification
            else if (!unit.memory.done){
                unit.memory.done = true;
                console.log('*********************');
                console.log('ORDER COMPLETE (ROOM #' + home_index + ')');
                if (unit.memory.autokill){
                    unit.memory.killswitch = true;
                    console.log('RECYCLING UNIT...');
                }
                console.log('*********************');
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};