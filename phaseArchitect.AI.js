//PHASE ARCHITECT: manually-summoned ARCHITECT variant with automatic self-termination protocols, designed for quick and cost-efficient execution of one-time tasks
//green trail ("builder")

module.exports = {
    run: function(unit, nexus, bias, home_index){
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //INPUTS: energy sources, containers (non-empty)
            var sources = unit.room.find(FIND_SOURCES);
            var canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER
                        &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            
            //OUTPUTS: construction hotspot
            var hotspot_scan = unit.room.find(FIND_CONSTRUCTION_SITES);
            
            
            //self-killswitch routine
            if (!hotspot_scan.length){
                Memory.phaseArchitect_MAX[home_index] = -1;
                console.log('phaseArchitect.AI:: <<----------------------------');
                console.log('phaseArchitect.AI:: PHASE CONSTRUCTION COMPLETE (ROOM #' + home_index + ')');
                console.log('phaseArchitect.AI:: ---------------------------->>');
                unit.memory.killswitch = true;
            }
            else var hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            
            //2-state fetch/unload FSM...
            //if carry amt reaches full while fetching, switch to unloading
            if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while unloading, switch to fetching
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;
                
                
            //behaviour execution...
            //UNLOAD: construction hotspot (nearest)
            if (!unit.memory.fetching && hotspot){
                if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                    unit.moveTo(hotspot);
            }
            else{
                //fetch: vault (respect limit)
                if (unit.room.storage != undefined){
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
            }
        }
        
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};