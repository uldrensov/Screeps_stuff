//ENERGISER: withdraws energy and resupplies towers
//blue trail

module.exports = {
    run: function(unit,nexus){
        
        //inputs: containers (non-empty)
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //outputs: towers (non-full)
        var towers = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return (structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        
        //two-states...
        //if full energy while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.homebound = true;
        }
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        //unload: towers (most drained)
        if (unit.memory.homebound){
            if (towers.length){
                var lowest_tower = towers[0];
                for (let i=0; i<towers.length; i++){
                    if (towers[i].store[RESOURCE_ENERGY] < lowest_tower.store[RESOURCE_ENERGY]){
                        lowest_tower = towers[i];
                    }
                }
                if (unit.transfer(lowest_tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(lowest_tower, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
        }
        else{
            //fetch: vault
            if (nexus.room.storage != undefined && nexus.room.storage.store.energy > 0){
                if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            //fetch: containers (fullest)
            else if (canisters.length){
                var fullest_canister = canisters[0];
                if (canisters.length == 2 &&
                canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) >
                canisters[0].store.getUsedCapacity(RESOURCE_ENERGY)){
                    fullest_canister = canisters[1];
                }
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
        }
    }
};