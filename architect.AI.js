//ARCHITECT: standard construction unit
//green trail ("builder")

module.exports = {
    run: function(unit, bias, reserve, std_interval){

        const energyCanisters_max = 2;
        
        
        let hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);


        //periodically confirm valid sources and canisters in the room
        if (Game.time % std_interval == 0){
            let sources = unit.room.find(FIND_SOURCES);

            if (sources.length)
                unit.memory.src_ID = sources[0].id;


            let canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER
                        &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (canisters.length)
                unit.memory.canisters = canisters;
        }
        
        

        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;
            
            

        //FSM execution (UNLOADING):
        if (!unit.memory.fetching && hotspot)
            if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                unit.moveTo(hotspot);
        

        //FSM execution (FETCHING):
        else if (unit.memory.fetching){
            //FETCH: vault<energy> (respect limit)
            if (unit.room.storage && (unit.room.storage.store.energy > reserve))
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            
            //FETCH: containers (fullest)
            else if (unit.memory.canisters){
                let fullest_canister_ID = canisters[0].id;

                if (unit.memory.canisters.length == energyCanisters_max
                    &&
                    Game.getObjectById(canisters[1].id).store.getUsedCapacity(RESOURCE_ENERGY)
                        >
                    Game.getObjectById(canisters[0].id).store.getUsedCapacity(RESOURCE_ENERGY) + bias){

                    fullest_canister_ID = canisters[1].id;
                }
                
                if (unit.withdraw(Game.getObjectById(fullest_canister_ID), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(fullest_canister_ID));
            }

            //FETCH: sources
            else if (Game.getObjectById(unit.memory.src_ID))
                if (unit.harvest(Game.getObjectById(unit.memory.src_ID)) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.src_ID));
        }
    }
};