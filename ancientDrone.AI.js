//ANCIENT DRONE: relays minerals from ANCIENT ASSIMILATOR to the vault
//white trail ("carrier")

module.exports = {
    run: function(unit,nexus_id,canister_id){
        
        var nexus = Game.getObjectById(nexus_id);
        var mineral_type = unit.room.find(FIND_MINERALS)[0].mineralType;
        
        
        //inputs: container
        var canister = Game.getObjectById(canister_id);
        
            
        //two states...
        //if full pockets while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity() == 0)
            unit.memory.homebound = true;
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[mineral_type] == 0)
            unit.memory.homebound = false;
            
            
        //behaviour execution...
        //unload: vault
        if (unit.memory.homebound){
            if (unit.transfer(nexus.room.storage, mineral_type) == ERR_NOT_IN_RANGE)
                unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        //fetch: container
        else{
            if (unit.withdraw(canister, mineral_type) == ERR_NOT_IN_RANGE)
                unit.moveTo(canister, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};