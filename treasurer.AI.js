//TREASURER: loads or unloads between terminal and vault, on a per-order/command basis
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            
            //clear this flag for every new command issued
            if (unit.memory.task_progress == 0)
                unit.memory.done = false;
                
            //action...
            if (unit.memory.task_progress != unit.memory.order_amt){
                
                //determine transfer direction (true => load terminal; false => unload terminal)
                var input;
                var output;
                if (unit.memory.dir){
                    input = nexus.room.storage;
                    output = nexus.room.terminal;
                }
                else{
                    input = nexus.room.terminal;
                    output = nexus.room.storage;
                }
                
                //fetch
                if (unit.store.getFreeCapacity(unit.memory.order_type) != 0){ //if unit is not fully loaded
                    if (unit.withdraw(input, unit.memory.order_type) == ERR_NOT_IN_RANGE)
                        unit.moveTo(input, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                //unload
                else if (unit.store.getFreeCapacity(unit.memory.order_type) == 0){ //only when unit is fully loaded
                    unit.memory.task_progress = unit.memory.task_progress + unit.store.getUsedCapacity(unit.memory.order_type);
                    unit.transfer(output, unit.memory.order_type);
                }
            }
            //task complete notification
            else if (!unit.memory.done){
                unit.memory.done = true;
                console.log('*********************');
                console.log('ORDER COMPLETE (ROOM #' + home_index + ')');
                console.log('*********************');
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ffffff'}});
    }
};