//PROBE: withdraws energy and repairs damaged structures
//blue trail

module.exports = {
    run: function(unit,nexus,thresholdT,thresholdR,override_threshold,ignore_lim){
        
        //energy source(s)
        var sources = nexus.room.find(FIND_SOURCES);
        
        //containers of reasonable capacity
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
            }
        });
        
        //structures not at full HP / threshold
        var repairTargets = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return ((structure.hits < structure.hitsMax
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART) ||
                (structure.hits < thresholdT
                && structure.structureType == STRUCTURE_WALL) ||
                (structure.hits < thresholdR
                && structure.structureType == STRUCTURE_RAMPART));
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
        //find a structure to fixate upon, and repair it until a greater emergency arises
        if (unit.memory.homebound && repairTargets.length){
            //find the weakest structure in terms of %
            var weakest = repairTargets[0];
            
            //get the base case's proper maximum / threshold value before calculating %
            var HPmax_base;
            var base_perc;
            switch (weakest.structureType){
                case STRUCTURE_WALL:
                    HPmax_base = thresholdT;
                    break;
                case STRUCTURE_RAMPART:
                    HPmax_base = thresholdR;
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
                        HPmax_compare = thresholdT;
                        break;
                    case STRUCTURE_RAMPART:
                        HPmax_compare = thresholdR;
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
            else if ((Game.getObjectById(unit.memory.fixation).hits / unit.memory.fixation_max)
            - base_perc > override_threshold){
                unit.memory.fixation = weakest.id;
                unit.memory.fixation_max = HPmax_base;
            }
            
            //finally, attempt to repair the fixated target until its max / threshold
            var final_target = Game.getObjectById(unit.memory.fixation);
            if (final_target.hits < unit.memory.fixation_max){
                if (unit.repair(final_target) == ERR_NOT_IN_RANGE){
                    unit.moveTo(final_target, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            //release the fixation if it reaches max
            else{
                delete unit.memory.fixation;
            }
        }
        
        //or withdraw from the vault / fullest canister
        else{
            if (nexus.room.storage != undefined){
                if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
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