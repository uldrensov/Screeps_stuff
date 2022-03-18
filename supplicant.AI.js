//SUPPLICANT: semi-stationary controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, reserve){
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;

        
        //state behaviour...
        //unload: controller
        if (!unit.memory.fetching){
            if (unit.upgradeController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller);
        }
        //fetch: vault
        else if (unit.room.storage.store.energy > reserve){
            if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.storage);
        }
        
    }
};