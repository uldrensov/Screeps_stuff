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
            
            //input: sources (non-empty), pickups, ruins (non-empty)
            var sources = unit.room.find(FIND_SOURCES, {
                filter: RoomObject => {
                    return RoomObject.energy > 0;
                }
            });
            var scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => {
                    return resource.resourceType == RESOURCE_ENERGY;
                }
            });
            var remains = unit.room.find(FIND_RUINS, {
                filter: RoomObject => {
                    return RoomObject.store.getUsedCapacity() > 0;
                }
            });
        
            //output: construction hotspot
            var hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        
        
            //2-state fetch/unload FSM...
            //if carry amt reaches full while fetching, switch to unloading
            if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while unloading, switch to fetching
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;
                
                
            //behaviour execution...
            if (!unit.memory.fetching && hotspot){
                //unload: construction hotspot
                if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                    unit.moveTo(hotspot, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            
            else{
                //fetch: pickups (fullest)
                if (scraps.length){
                    //
                    var chosen_scrap = scraps[0];
                    for (let i=0; i<scraps.length; i++){
                        if (scraps[i].energy > chosen_scrap.energy)
                            chosen_scrap = scraps[i];
                    }
                    if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE)
                        unit.moveTo(chosen_scrap, {visualizePathStyle: {stroke: '#00ff00'}});
                }
                //fetch: ruins
                else if (remains.length){
                    if (unit.withdraw(remains[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(remains[0], {visualizePathStyle: {stroke: '#00ff00'}});
                }
                //fetch: source (manual override)
                else if (unit.memory.force_src != undefined){
                    if (unit.harvest(Game.getObjectById(unit.memory.force_src)) == ERR_NOT_IN_RANGE)
                        unit.moveTo(Game.getObjectById(unit.memory.force_src), {visualizePathStyle: {stroke: '#00ff00'}});
                }
                //fetch: sources
                else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                    unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};