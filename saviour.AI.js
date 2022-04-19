//SAVIOUR: cross-room fast-track controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, standby_flag, standby_flag2){
        
        //travelling...
        //trek to the first checkpoint
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.rallied = true;
        if (!unit.memory.rallied){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff00ff'}});
            return;
        }
        
        //second checkpoint
        if (unit.pos.isEqualTo(standby_flag2.pos))
            unit.memory.rallied2 = true;
        if (!unit.memory.rallied2){
            unit.moveTo(standby_flag2, {visualizePathStyle: {stroke: '#ff00ff'}});
            return;
        }
            
            
        //input: sources (non-empty)
        let sources = unit.room.find(FIND_SOURCES, {
            filter: RoomObject => {
                return RoomObject.energy > 0;
            }
        });
            
            
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        if (!unit.memory.fetching){
            //UNLOAD: controller
            if (unit.upgradeController(unit.room.controller))
                unit.moveTo(unit.room.controller);
        }
        else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
            //FETCH: sources
            unit.moveTo(sources[0]);
    }
};