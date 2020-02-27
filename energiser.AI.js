//ENERGISER: standard tower attendant
//blue trail ("maintainer")

module.exports = {
    run: function(unit){
        
        //inputs: containers (non-empty)
        var canisters = unit.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //outputs: towers (non-full)
        var towers = unit.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        
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
            if (towers.length){
                var lowest_tower = towers[0];
                for (let i=0; i<towers.length; i++){
                    if (towers[i].store[RESOURCE_ENERGY] < lowest_tower.store[RESOURCE_ENERGY])
                        lowest_tower = towers[i];
                }
                if (unit.transfer(lowest_tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(lowest_tower, {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
        else{
            //fetch: vault
            if (unit.room.storage != undefined && unit.room.storage.store.energy > 0){
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage, {visualizePathStyle: {stroke: '#0000ff'}});
            }
            //fetch: containers (fullest)
            else if (canisters.length){
                var fullest_canister = canisters[0];
                if (canisters.length == 2 &&
                canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) > canisters[0].store.getUsedCapacity(RESOURCE_ENERGY)){
                    fullest_canister = canisters[1];
                }
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
    }
};