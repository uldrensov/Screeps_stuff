//NULL SUPPLICANT: SUPPLICANT variant designed to mesh with NULL ADHERENT
//violet trail ("upgrader")

module.exports = {
    run: function(unit, warpRX0_id){
        
        //INPUTS: link
        let warpRX0 = Game.getObjectById(warpRX0_id);
        
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        //UNLOAD: controller
        if (!unit.memory.fetching){
            if (unit.upgradeController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller);
        }
        //fetch: link
        else if (unit.withdraw(warpRX0, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            unit.moveTo(warpRX0);
    }
};