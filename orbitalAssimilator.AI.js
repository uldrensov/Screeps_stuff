//ORBITAL ASSIMILATOR: heavily equipped remote mining unit
//yellow trail

module.exports = {
    run: function(unit,src_id,remote_flag,dropoff_id){
        
        var src = Game.getObjectById(src_id);
        var dropoff = Game.getObjectById(dropoff_id);
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
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
        //deposit: container (if chosen), vault
        if (unit.memory.homebound){
            
            //navigate to homeroom
            if (unit.room.name != unit.memory.home){
                unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            //deposit in vault if a container is designated but full
            else{
                if (dropoff.store.getFreeCapacity() == 0 && unit.room.storage != undefined){
                    unit.moveTo(unit.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else if (unit.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        //fetch energy: pickups, tombstones, sources
        else{
            //rally at flag first
            if (!unit.memory.in_place){
                if (!unit.pos.isEqualTo(remote_flag.pos)){
                    unit.moveTo(remote_flag, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else{
                    unit.memory.in_place = true;
                }
            }
            //fetch
            else{
                //scrap/tomb search algorithms are greatly simplified for orbital assimilators
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
                
                if (scraps.length){
                    if (unit.pickup(scraps[0]) == ERR_NOT_IN_RANGE){
                        unit.moveTo(scraps[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else if (tombs.length){
                    if (unit.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        unit.moveTo(tombs[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else if (unit.harvest(src) == ERR_NOT_IN_RANGE){
                    unit.moveTo(src, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};