//CRAFTSMAN: build on designated construction hotspots

module.exports = {
    run: function(unit){
        //arrays containing the room's energy sources and construction hotspots
        var sources = unit.room.find(FIND_SOURCES);
        var hotspots = unit.room.find(FIND_CONSTRUCTION_SITES);
        
        
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
        //feed a hotspot
        if(unit.memory.homebound){
            if (hotspots.length){
                if (unit.build(hotspots[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(hotspots[0], {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
        
        //or find and harvest from a source
        else{
            if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};