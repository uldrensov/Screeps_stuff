//ENERGISER: standard tower attendant
//blue trail ("maintainer")

module.exports = {
    run: function(unit, std_interval){
        
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;


        
        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //UNLOAD: towers (most drained)
            if (!unit.memory.towers || Game.time % std_interval == 0){
                unit.memory.towers = unit.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return (structure.structureType == STRUCTURE_TOWER)
                            &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }


            if (unit.memory.towers.length){
                let lowest_tower = Game.getObjectById(unit.memory.towers[0].id);
                
                //determine lowest energy tower
                for (let i=1; i<unit.memory.towers.length; i++){
                    //if memorised tower no longer exists, skip it
                    if (!Game.getObjectById(unit.memory.towers[i].id))
                        continue;

                    //if bad init, assign without comparing anything
                    if (!lowest_tower)
                        lowest_tower = Game.getObjectById(unit.memory.towers[i].id);

                    else if (Game.getObjectById(unit.memory.towers[i].id).store[RESOURCE_ENERGY]
                        <
                        lowest_tower.store[RESOURCE_ENERGY]){

                        lowest_tower = Game.getObjectById(unit.memory.towers[i].id);
                    }
                }

                if (lowest_tower)
                    if (unit.transfer(lowest_tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(lowest_tower);
            }
        }


        //FSM execution (FETCHING):
        else{
            //FETCH: vault
            let canFetch_storage = false;

            if (unit.room.storage)
                if (unit.room.storage.store.energy > 0)
                    canFetch_storage = true;

            if (canFetch_storage){
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            }
            

            //FETCH: containers (fullest)
            else{
                if (!unit.memory.canisters || Game.time % std_interval == 0){
                    unit.memory.canisters = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_CONTAINER
                                &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                }


                if (unit.memory.canisters.length){
                    let fullest_canister = Game.getObjectById(unit.memory.canisters[0].id);

                    for (let i=1; i<unit.memory.canisters.length; i++){
                        //if memorised canister no longer exists, skip it
                        if (!Game.getObjectById(unit.memory.canisters[i].id))
                            continue;

                        //if bad init, assign without comparing anything
                        if (!fullest_canister)
                            fullest_canister = Game.getObjectById(unit.memory.canisters[i].id);
                            
                        if (Game.getObjectById(unit.memory.canisters[i].id).store.getUsedCapacity(RESOURCE_ENERGY)
                            >
                            fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY)){

                            fullest_canister = Game.getObjectById(unit.memory.canisters[i].id);
                        }
                    }

                    if (fullest_canister)
                        if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(fullest_canister);
                }
            }
        }
    }
};