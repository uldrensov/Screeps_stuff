//ORBITAL ASSIMILATOR: heavily equipped remote mining unit
//yellow trail

module.exports = {
    run: function(unit,src_id,remote_flag,dropoff_id){
        
        var src = Game.getObjectById(src_id);
        var dropoff = Game.getObjectById(dropoff_id);
        
        
        //remember its original room
        if (unit.memory.home == undefined){
            unit.memory.home = unit.room;
        }
        
        
        //two-states...
        //if full pockets while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity() == 0){
            unit.memory.homebound = true;
        }
        //if empty energy while inbound, go harvest
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        //deposit load into the designated storage medium
        if (unit.memory.homebound){
            if (unit.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
        //travel to the remote source via flag and harvest
        else{
            //inter-room navigation
            if (!unit.pos.isEqualTo(remote_flag.pos)){
                unit.moveTo(remote_flag, {visualizePathStyle: {stroke: '#ffff00'}});
            }
            //intra-room navigation
            else if (unit.harvest(src) == ERR_NOT_IN_RANGE){
                unit.moveTo(src, {visualizePathStyle: {stroke: '#ffff00'}});
            }
        }
    }
};