//ORBITAL ASSIMILATOR: heavily equipped remote mining unit
//yellow trail

module.exports = {
    run: function(unit,src_id,remote_flag,dropoff_id){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
        //inputs: source
        var src = Game.getObjectById(src_id);
        
        //outputs: container/link/vault
        var dropoff = Game.getObjectById(dropoff_id);
        
        
        //two-states...
        //if full pockets while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity() == 0){
            unit.memory.homebound = true;
            unit.memory.in_place = false;
        }
        //if empty energy while inbound, go harvest
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        if (unit.memory.homebound){
            //navigate to homeroom
            if (unit.room.name != unit.memory.home){
                unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffff00'}});
            }
            else{
                //unload: vault (if container/link is designated, but full)
                if (dropoff.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && unit.room.storage != undefined){
                    unit.moveTo(unit.room.storage, {visualizePathStyle: {stroke: '#ffff00'}});
                }
                //unload: container/link/vault
                else if (unit.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
        }
        else{
            //rally at flag first
            if (!unit.memory.in_place){
                if (!unit.pos.isEqualTo(remote_flag.pos)){
                    unit.moveTo(remote_flag, {visualizePathStyle: {stroke: '#ffff00'}});
                }
                else{
                    unit.memory.in_place = true;
                }
            }
            else{
                //inputs: pickups, tombstones (non-empty)
                var scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                    filter: resource => {
                        return resource.resourceType == RESOURCE_ENERGY;
                    }
                });
                var tombs = unit.room.find(FIND_TOMBSTONES, {
                    filter: RoomObject => {
                        return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                
                //fetch: pickups<energy>
                if (scraps.length){
                    if (unit.pickup(scraps[0]) == ERR_NOT_IN_RANGE){
                        unit.moveTo(scraps[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                //fetch: tombstones<energy>
                else if (tombs.length){
                    if (unit.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        unit.moveTo(tombs[0], {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
                //fetch: sources
                else if (unit.harvest(src) == ERR_NOT_IN_RANGE){
                    unit.moveTo(src, {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
        }
    }
};