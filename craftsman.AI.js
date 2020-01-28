//CRAFTSMAN: harvest energy and build on designated construction hotspots
//green trail

module.exports = {
    run: function(unit,nexus){
        //energy source(s)
        var sources = Game.getObjectById('5bbcae989099fc012e639476');
        
        //construction hotspots
        var hotspots = nexus.room.find(FIND_CONSTRUCTION_SITES);
        
        
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
        //feed the nearest hotspot
        if (unit.memory.homebound){
            if (hotspots.length){
                var nearest_hotspot = unit.pos.findClosestByPath(hotspots);
                if (unit.build(nearest_hotspot) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nearest_hotspot, {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
        
        //or harvest
        else{
            if (unit.harvest(sources) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};