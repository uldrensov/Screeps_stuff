//ARCHITECT: standard construction unit
//green trail ("builder")

module.exports = {
    run: function(unit, nexus, bias, reserve){
        
        if (!unit.memory.killswitch){
            //inputs: energy sources, containers (non-empty)
            var sources = unit.room.find(FIND_SOURCES);
            var canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            //outputs: construction hotspot
            var hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            
            //2-state fetch/unload FSM...
            //if carry amt reaches full while fetching, switch to unloading
            if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while unloading, switch to fetching
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;
                
                
            //behaviour execution...
            //unload: construction hotspot
            if (!unit.memory.fetching && hotspot){
                if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                    unit.moveTo(hotspot);
            }
            else if (unit.memory.fetching){
                //fetch: vault (respect limit)
                if (unit.room.storage != undefined && unit.room.storage.store.energy > reserve){
                    if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
                //fetch: containers (fullest)
                else if (canisters.length){
                    var fullest_canister = canisters[0];
                    if (canisters.length == 2 && canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) > canisters[0].store.getUsedCapacity(RESOURCE_ENERGY) + bias)
                        fullest_canister = canisters[1];
                    
                    if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(fullest_canister);
                }
                //fetch: sources
                else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                    unit.moveTo(sources[0]);
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};