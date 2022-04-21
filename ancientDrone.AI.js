//ANCIENT DRONE: relays minerals from ANCIENT ASSIMILATOR to the vault
//white trail ("carrier")

module.exports = {
    run: function(unit, canister_id, std_interval){
        
        let canister = Game.getObjectById(canister_id);


        //periodically confirm the mineral type of the room
        if (Game.time % std_interval == 0){
            let mineral_src = unit.room.find(FIND_MINERALS);

            if (mineral_src.length)
                unit.memory.mineral_type = mineral_src[0].mineralType;
        }
        
            
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;
            
        
        if (unit.memory.mineral_type){
            //FSM execution (UNLOADING):
            if (!unit.memory.fetching)
                if (unit.transfer(unit.room.storage, unit.memory.mineral_type) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            
            //FSM execution (FETCHING):
            else if (unit.withdraw(canister, unit.memory.mineral_type) == ERR_NOT_IN_RANGE)
                unit.moveTo(canister);
        }
    }
};