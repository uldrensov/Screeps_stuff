//DRONE: harvest energy and feed any structures which require it
//todo: currently harvesting from a hardcoded source (keep for now)

module.exports = {
    run: function(unit){
        //array of the room's energy sources
        //var sources = unit.room.find(FIND_SOURCES);
        var sources = Game.getObjectById('5bbcae989099fc012e639475');
        
        //array of the room's energy-deficient structures (of types we want)
        var feedTargets = unit.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        
        //two-states...
        //if full energy while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.homebound = true;
        }
        
        //if empty energy while inbound, go harvest
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        //find and feed a suitable structure
        if (unit.memory.homebound){
            if (feedTargets.length){
                if (unit.transfer(feedTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(feedTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        //or find and harvest from a source
        else{
            if (unit.harvest(sources) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};