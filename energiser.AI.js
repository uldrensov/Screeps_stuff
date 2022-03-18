//ENERGISER: standard tower attendant
//blue trail ("maintainer")

module.exports = {
    run: function(unit, std_interval){
        
        //inputs: containers (non-empty)
        if (unit.memory.canisters == undefined || Game.time % std_interval == 0){
            unit.memory.canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        //outputs: towers (non-full)
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
        //unload: towers (most drained)
        if (!unit.memory.fetching){
            if (unit.memory.towers.length){
                var lowest_tower = Game.getObjectById(unit.memory.towers[0].id);
                var getTower;
                for (let i=0; i<unit.memory.towers.length; i++){
                    getTower = Game.getObjectById(unit.memory.towers[i].id);
                    if (getTower == null) continue;
                    try{
                        if (getTower.store[RESOURCE_ENERGY] < lowest_tower.store[RESOURCE_ENERGY])
                            lowest_tower = getTower;
                    }
                    catch{
                        lowest_tower = getTower;
                    }
                }
                var getLowestTower = Game.getObjectById(lowest_tower.id);
                if (getLowestTower != null){
                    if (unit.transfer(getLowestTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getLowestTower);
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
                var fullest_canister = Game.getObjectById(unit.memory.canisters[0].id);
                for (let i=0; i<unit.memory.canisters.length; i++){
                    var getCanister = Game.getObjectById(unit.memory.canisters[i].id);
                    if (getCanister == null) continue;
                    try{
                        if (getCanister.store.getUsedCapacity(RESOURCE_ENERGY) > fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY))
                            fullest_canister = getCanister;
                    }
                    catch{
                        fullest_canister = getCanister;
                    }
                }
                var getFullestCanister = Game.getObjectById(fullest_canister.id);
                if (getFullestCanister != null){
                    if (unit.withdraw(getFullestCanister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getFullestCanister);
                }
            }
        }
    }
};