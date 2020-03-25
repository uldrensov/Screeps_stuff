//SAVIOUR: cross-room fast-track controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, standby_flag, standby_flag2){
        
        //travelling...
        //trek to the first checkpoint
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.in_place = true;
        if (!unit.memory.in_place){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff00ff'}});
            return;
        }
        
        //second checkpoint
        if (unit.pos.isEqualTo(standby_flag2.pos))
            unit.memory.in_place2 = true;
        if (!unit.memory.in_place2){
            unit.moveTo(standby_flag2, {visualizePathStyle: {stroke: '#ff00ff'}});
            return;
        }
            
            
        //input: sources (non-empty)
        var sources = unit.room.find(FIND_SOURCES, {
            filter: RoomObject => {
                return RoomObject.energy > 0;
            }
        });
            
            
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        if (!unit.memory.fetching){
            //unload: controller
            if (unit.upgradeController(unit.room.controller))
                unit.moveTo(unit.room.controller);
        }
        else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
            //fetch: sources
            unit.moveTo(sources[0]);
    }
};