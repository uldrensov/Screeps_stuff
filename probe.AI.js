//PROBE: harvest energy, feed towers, and maintain lightly decaying structures
//blue trail

module.exports = {
    run: function(unit,nexus){
        //energy source(s)
        var sources = Game.getObjectById('5bbcae989099fc012e639476');
        
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
                return (structure.hits >= structure.hitsMax * .75);
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
        
        //or harvest
        else{
            if (unit.harvest(sources) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources, {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
    }
};