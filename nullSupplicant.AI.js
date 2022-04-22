//NULL SUPPLICANT: SUPPLICANT variant designed to mesh with NULL ADHERENT
//violet trail ("upgrader")

module.exports = {
    run: function(unit, warpRX0_id){
        
        let warpRX0 = Game.getObjectById(warpRX0_id);
        
        if (!warpRX0){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A RX LINK');
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
            if (unit.upgradeController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller);
        }
        
        //FSM execution (FETCHING):
        else if (unit.withdraw(warpRX0, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            //FETCH: RX link
            unit.moveTo(warpRX0);
    }
};