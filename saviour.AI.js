//SAVIOUR: cross-room fast-track controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, SRCnexus_id, DESTctrl_id, reserve){
        
        var home = Game.getObjectById(SRCnexus_id).room;
        var away = Game.getObjectById(DESTctrl_id).room;
        
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        if (!unit.memory.fetching){
            //leave the home room
            if (unit.room != away)
                unit.moveTo(away.controller, {visualizePathStyle: {stroke: '#ff00ff'}});
            //unload: controller
            else if (unit.upgradeController(away.controller))
                unit.moveTo(away.controller, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
        else if (home.storage.store.energy > reserve){
            //return to home room
            if (unit.room != home)
                unit.moveTo(home.controller, {visualizePathStyle: {stroke: '#ff00ff'}});
            //fetch: vault (respect limit)
            else if (unit.withdraw(home.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                unit.moveTo(home.storage, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    }
};