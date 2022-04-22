//SUPPLICANT: semi-stationary controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, reserve){
        
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
        else if (unit.room.storage){
            //FETCH: vault
            if (unit.room.storage.store.energy > reserve)
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
        }

        else
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT');
    }
};