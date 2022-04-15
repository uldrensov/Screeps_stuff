//ENERGISER: standard tower attendant
//blue trail ("maintainer")

module.exports = {
    run: function(unit, std_interval){
        
        //INPUTS: containers (non-empty)
        if (unit.memory.canisters == undefined || Game.time % std_interval == 0){
            unit.memory.canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        //OUTPUTS: towers (non-full)
        if (unit.memory.towers == undefined || Game.time % std_interval == 0){
            unit.memory.towers = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        //UNLOAD: towers (most drained)
        if (!unit.memory.fetching){
            if (unit.memory.towers.length){
                let lowest_tower = Game.getObjectById(unit.memory.towers[0].id);
                
                for (let i=1; i<unit.memory.towers.length; i++){
                    //if invalid ID, skip
                    if (Game.getObjectById(unit.memory.towers[i].id) == null)
                        continue;

                    //if bad init, assign without comparing anything
                    if (!lowest_tower)
                        lowest_tower = Game.getObjectById(unit.memory.towers[i].id);

                    //determine lowest energy tower
                    else if (Game.getObjectById(unit.memory.towers[i].id).store[RESOURCE_ENERGY]
                        <
                        lowest_tower.store[RESOURCE_ENERGY]){

                        lowest_tower = Game.getObjectById(unit.memory.towers[i].id);
                    }
                }

                if (Game.getObjectById(lowest_tower.id) != null){
                    if (unit.transfer(Game.getObjectById(lowest_tower.id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(Game.getObjectById(lowest_tower.id));
                }
            }
        }

        else{
            //fetch: vault
            if (unit.room.storage != undefined && unit.room.storage.store.energy > 0){
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            }
            //fetch: containers (fullest)
            else if (unit.memory.canisters.length){
                let fullest_canister = Game.getObjectById(unit.memory.canisters[0].id);

                for (let i=0; i<unit.memory.canisters.length; i++){
                    let getCanister = Game.getObjectById(unit.memory.canisters[i].id);

                    if (getCanister == null) continue;
                    try{
                        if (getCanister.store.getUsedCapacity(RESOURCE_ENERGY) > fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY))
                            fullest_canister = getCanister;
                    }
                    catch{
                        fullest_canister = getCanister;
                    }
                }

                let getFullestCanister = Game.getObjectById(fullest_canister.id);

                if (getFullestCanister != null){
                    if (unit.withdraw(getFullestCanister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getFullestCanister);
                }
            }
        }
    }
};