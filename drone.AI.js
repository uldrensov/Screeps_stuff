//DRONE: harvest energy and feed any structures which require it

module.exports = {
    run: function(unit){
        //array containing the room's energy sources
        //var sources = unit.room.find(FIND_SOURCES);
        var sources = Game.getObjectById('5bbcae989099fc012e639476');
        
        //array containing the room's non-full structures (of types we want)
        var feedTargets = unit.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        
        //if full energy capacity, find and feed a structure (if any)
        if (unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            if (feedTargets.length){
                if (unit.transfer(feedTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(feedTargets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        //else, find and harvest from a source
        else{
            if (unit.harvest(sources) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};