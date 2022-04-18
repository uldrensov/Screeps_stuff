//ARCHITECT: standard construction unit
//green trail ("builder")

module.exports = {
    run: function(unit, nexus_id, bias, reserve){
        
        let nexus = Game.getObjectById(nexus_id);


        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //INPUTS: energy sources, containers (non-empty)
            let sources = unit.room.find(FIND_SOURCES);
            let canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            //OUTPUTS: construction hotspot
            let hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            
            //2-state FETCH / UNLOAD FSM...
            //if carry amt reaches full while FETCHING, switch to UNLOADING
            if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while UNLOADING, switch to FETCHING
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;
                
                
            //behaviour execution...
            //UNLOAD: construction hotspot
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
                    let fullest_canister = canisters[0];

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