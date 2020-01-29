//CRAFTSMAN: withdraw energy and build on designated construction hotspots
//green trail

module.exports = {
    run: function(unit,nexus){
        
        //energy source(s) [only used early game]
        var sources = nexus.room.find(FIND_SOURCES);
        
        //non-empty energy containers
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //construction hotspots
        var hotspots = nexus.room.find(FIND_CONSTRUCTION_SITES);
        
        
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
        //feed the nearest hotspot
        if (unit.memory.homebound){
            if (hotspots.length){
                var nearest_hotspot = unit.pos.findClosestByPath(hotspots);
                if (unit.build(nearest_hotspot) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nearest_hotspot, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
        
        //or withdraw from the fullest canister
        else{
            if (canisters.length){
                var fullest_canister = canisters[0];
                if (canisters.length == 2 &&
                canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) >
                canisters[0].store.getUsedCapacity(RESOURCE_ENERGY)){
                    fullest_canister = canisters[1];
                }
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
    }
};