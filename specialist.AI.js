//SPECIALIST: manually spawned in for a specific construction project
//violet trail
//NOTE: code is intentionally scrappy and kitbashed

module.exports = {
    run: function(unit,nexus){
        
        //energy source(s)
        var sources = Game.getObjectById('5bbcae989099fc012e639475');
        
        //non-empty energy containers
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //target site
        var hotspot = Game.getObjectById('5e30e9403df256c7cbef61eb');
        
        
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
            if (unit.build(hotspot) == ERR_NOT_IN_RANGE){
                unit.moveTo(hotspot, {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
        
        //or withdraw
        else{
            //if (sources.length){
                if (unit.harvest(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(sources, {visualizePathStyle: {stroke: '#ff00ff'}});
                }
            //}
        }
    }
};