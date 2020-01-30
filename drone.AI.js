//DRONE: pickup/withdraw energy and feed spawning structures
//white trail

module.exports = {
    run: function(unit,nexus){
        
        //non-empty energy containers
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //energy on the floor
        var scraps = nexus.room.find(FIND_DROPPED_RESOURCES);
        
        //non-empty tombstones
        var tombs = nexus.room.find(FIND_TOMBSTONES, {
            filter: (RoomObject) => {
                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //energy-deficient extensions
        var pylons = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        
        //two-states...
        //if full energy while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.homebound = true;
        }
        
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        //find and feed the nearest suitable structure
        if (unit.memory.homebound){
            //prioritise extensions
            if (pylons.length){
                var nearest_pylon = unit.pos.findClosestByPath(pylons);
                if (unit.transfer(nearest_pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nearest_pylon, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (nexus.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
                if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            //if excess energy, dump it in storage
            else if (nexus.room.storage != undefined){
                //console.log(unit.transfer(nexus.room.storage, RESOURCE_ENERGY));
                if (unit.transfer(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        //or pickup/withdraw from the most plentiful supply
        else{
            if (tombs.length){
                var richest_tomb = tombs[0];
                if (tombs.length > 1){
                    for (var i=1; i<tombs.length; i++){
                        if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY) >
                        richest_tomb.store.getUsedCapacity(RESOURCE_ENERGY)){
                            richest_tomb = tombs[i];
                        }
                        
                    }
                }
                
                if (unit.withdraw(richest_tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(richest_tomb, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (scraps.length){
                var biggest_scrap = scraps[0];
                if (scraps.length > 1){
                    for (var i=1; i<scraps.length; i++){
                        if (scraps[i].energy > biggest_scrap.energy){
                            biggest_scrap = scraps[i];
                        }
                    }
                }
                
                //avoid "crumbs" left by assimilators
                if (biggest_scrap.energy > 10){
                    if (unit.pickup(biggest_scrap) == ERR_NOT_IN_RANGE){
                        unit.moveTo(biggest_scrap, {visualizePathStyle: {stroke: '#ff0000'}});
                    }
                }
            }
            else if (canisters.length){
                var fullest_canister = canisters[0];
                if (canisters.length == 2 &&
                canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) >
                canisters[0].store.getUsedCapacity(RESOURCE_ENERGY)){
                    fullest_canister = canisters[1];
                }
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};