//ANCIENT DRONE: relays minerals from ANCIENT ASSIMILATOR to the vault
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, canister_id){
        
        var nexus = Game.getObjectById(nexus_id);
        var mineral_type = unit.room.find(FIND_MINERALS)[0].mineralType;
        
        
        //inputs: container
        var canister = Game.getObjectById(canister_id);
        
            
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(mineral_type) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[mineral_type] == 0)
            unit.memory.fetching = true;
            
            
        //behaviour execution...
        //unload: vault
        if (!unit.memory.fetching){
            if (unit.transfer(nexus.room.storage, mineral_type) == ERR_NOT_IN_RANGE)
                unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        //fetch: container
        else if (unit.withdraw(canister, mineral_type) == ERR_NOT_IN_RANGE)
            unit.moveTo(canister, {visualizePathStyle: {stroke: '#ffffff'}});
    }
};