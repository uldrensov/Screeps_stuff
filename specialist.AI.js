//SPECIALIST: cross-room fast-track self-fuelling construction unit
//green trail ("builder")

module.exports = {
    run: function(unit, standby_flag){
        
        //trek to the standby point once
        if (!unit.memory.in_place)
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#00ff00'}});
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.in_place = true;
        
        
        if (unit.memory.in_place){
            
            //input: sources
            var sources = unit.room.find(FIND_SOURCES);
        
            //output: construction hotspots
            var hotspots = unit.room.find(FIND_CONSTRUCTION_SITES);
        
        
            //2-state fetch/unload FSM...
            //if carry amt reaches full while fetching, switch to unloading
            if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while unloading, switch to fetching
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;
                
                
            //behaviour execution...
            //unload: construction hotspots (nearest)
            if (!unit.memory.fetching){
                if (unit.build(hotspots[0]) == ERR_NOT_IN_RANGE)
                    unit.moveTo(hotspots[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
            //fetch: sources
            else{
                //manual source selection
                if (unit.memory.force_src != undefined){
                    if (unit.harvest(Game.getObjectById(unit.memory.force_src)) == ERR_NOT_IN_RANGE)
                        unit.moveTo(Game.getObjectById(unit.memory.force_src), {visualizePathStyle: {stroke: '#00ff00'}});
                }
                else{
                    if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                        unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#00ff00'}});
                }
            }
        }
    }
};