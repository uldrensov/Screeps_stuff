//DRONE: harvest energy and feed spawning structures
//black trail

module.exports = {
    run: function(unit,nexus){
        //energy source(s)
        var sources = unit.room.find(FIND_SOURCES);
        
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
        
        //if empty energy while inbound, go harvest
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
            else{
                if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        //or harvest
        else{
            if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};