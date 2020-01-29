//PROBE: withdraw energy, feed towers, and maintain lightly decaying structures
//blue trail

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
        
        //energy-deficient towers
        var towers = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //lightly decaying structures
        var repairTargets = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax &&
                structure.hits > structure.hitsMax * .75);
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
        //find and maintain a tower or structure
        if (unit.memory.homebound){
            //prioritise towers
            if (towers.length){
                if (unit.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(towers[0], {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            else if (repairTargets.length){
                if (unit.repair(repairTargets[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(repairTargets[0], {visualizePathStyle: {stroke: '#0000ff'}});
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
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
        }
    }
};