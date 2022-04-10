//ANCIENT DRONE: relays minerals from ANCIENT ASSIMILATOR to the vault
//white trail ("carrier")

module.exports = {
    run: function(unit, canister_id){
        
        let mineral_type = unit.room.find(FIND_MINERALS)[0].mineralType;
        
        
        //INPUTS: container
        let canister = Game.getObjectById(canister_id);
        
            
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(mineral_type) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[mineral_type] == 0)
            unit.memory.fetching = true;
            
            
        //behaviour execution...
        //UNLOAD: vault
        if (!unit.memory.fetching){
            if (unit.transfer(unit.room.storage, mineral_type) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.storage);
        }
        //fetch: container
        else if (unit.withdraw(canister, mineral_type) == ERR_NOT_IN_RANGE)
            unit.moveTo(canister);
    }
};