//SAVIOUR: cross-room fast-track controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, standby_flag, standby_flag2){
        
        //one-time double-flag rally FSM...
        //first checkpoint
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
            
            
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;

        
        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //UNLOAD: controller
            if (unit.upgradeController(unit.room.controller))
                unit.moveTo(unit.room.controller);
        }
        
        //FSM execution (FETCHING):
        else{
            //FETCH: sources
            if (!unit.memory.src_ID)
                unit.memory.src_ID = unit.room.find(FIND_SOURCES)[0].id;

            if (unit.harvest(Game.getObjectById(unit.memory.src_ID)) == ERR_NOT_IN_RANGE)
                unit.moveTo(Game.getObjectById(unit.memory.src_ID));
        }
    }
};