//PROBE: standard repair unit
//blue trail ("maintainer")

module.exports = {
    run: function(unit, nexus, override_threshold, ignore_lim, reserve){
        
        //inputs: energy sources, containers (ample)
        var sources = nexus.room.find(FIND_SOURCES);
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
            }
        });
        
        //outputs: structures (non-full/threshold)
        var repairTargets = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return ((structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) ||
                (structure.hits < Memory.wall_threshold && structure.structureType == STRUCTURE_WALL) ||
                (structure.hits < Memory.rampart_threshold && structure.structureType == STRUCTURE_RAMPART));
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
        //unload: structure (weakest %; fixation)
        if (!unit.memory.fetching && repairTargets.length){
            
            //find the weakest structure in terms of %
            var weakest = repairTargets[0];
            
            //get the base case's proper maximum / threshold value before calculating %
            var HPmax_base;
            var base_perc;
            switch (weakest.structureType){
                case STRUCTURE_WALL:
                    HPmax_base = Memory.wall_threshold;
                    break;
                case STRUCTURE_RAMPART:
                    HPmax_base = Memory.rampart_threshold;
                    break;
                default:
                    HPmax_base = weakest.hitsMax;
            }
            base_perc = weakest.hits / HPmax_base;
            
            //repeat for each remaining candidate
            var HPmax_compare;
            var compare_perc;
            for (let i=0; i<repairTargets.length; i++){
                switch (repairTargets[i].structureType){
                    case STRUCTURE_WALL:
                        HPmax_compare = Memory.wall_threshold;
                        break;
                    case STRUCTURE_RAMPART:
                        HPmax_compare = Memory.rampart_threshold;;
                        break;
                    default:
                        HPmax_compare = repairTargets[i].hitsMax;
                }
                compare_perc = repairTargets[i].hits / HPmax_compare;
                
                //compare and update
                if (compare_perc < base_perc){
                    weakest = repairTargets[i];
                    HPmax_base = HPmax_compare;
                    base_perc = compare_perc;
                }
            }
            
            //if there is no current target, "fixate" on the weakest one
            if (unit.memory.fixation == undefined){
                unit.memory.fixation = weakest.id;
                unit.memory.fixation_max = HPmax_base;
            }
            //otherwise, determine if the previous fixation is worth overriding for the new weakest structure
            else if ((Game.getObjectById(unit.memory.fixation).hits / unit.memory.fixation_max) - base_perc > override_threshold){
                unit.memory.fixation = weakest.id;
                unit.memory.fixation_max = HPmax_base;
            }
            
            //finally, attempt to repair the fixated target until its max / threshold
            var final_target = Game.getObjectById(unit.memory.fixation);
            if (final_target.hits < unit.memory.fixation_max){
                if (unit.repair(final_target) == ERR_NOT_IN_RANGE)
                    unit.moveTo(final_target, {visualizePathStyle: {stroke: '#0000ff'}});
            }
            //release the fixation if it reaches max
            else delete unit.memory.fixation;
        }
        else{
            //fetch: vault (respect limit)
            if (nexus.room.storage != undefined && nexus.room.storage.store.energy > reserve){
                if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#0000ff'}});
            }
            //fetch: containers (fullest)
            else if (canisters.length){
                var fullest_canister = canisters[0];
                if (canisters.length == 2 && canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) > canisters[0].store.getUsedCapacity(RESOURCE_ENERGY))
                    fullest_canister = canisters[1];
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
    }
};