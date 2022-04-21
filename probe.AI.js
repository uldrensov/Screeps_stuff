//PROBE: standard repair unit
//blue trail ("maintainer")

module.exports = {
    run: function(unit, override_threshold, ignore_lim, reserve){

        const energyCanisters_max = 2;

        

        //INPUTS: sources, containers (ample)
        let sources = unit.room.find(FIND_SOURCES);
        let canisters = unit.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER
                    &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
            }
        });
        
        //OUTPUTS: structures (non-full/threshold)
        let repairTargets = unit.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return ((structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                    ||
                    (structure.hits < Memory.wall_threshold && structure.structureType == STRUCTURE_WALL)
                    ||
                    (structure.hits < Memory.rampart_threshold && structure.structureType == STRUCTURE_RAMPART));
            }
        });
        

        
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;


        
        //FSM execution (UNLOADING):
        if (!unit.memory.fetching && repairTargets.length){
            //UNLOAD: structure (weakest %; fixation)
            let weakest = repairTargets[0];
            let HPmax_base;
            let base_perc;

            //use the proper HP threshold value
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
            

            //find the weakest structure in terms of HP %
            let HPmax_compare;
            let compare_perc;

            for (let i=1; i<repairTargets.length; i++){
                //use the proper HP threshold value
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
                
                if (compare_perc < base_perc){
                    weakest =       repairTargets[i];
                    HPmax_base =    HPmax_compare;
                    base_perc =     compare_perc;
                }
            }
            

            //select an initial target to fixate upon, or determine if the previous fixation is worth overriding for the new weakest structure (subtract percentage values)
            if (!Game.getObjectById(unit.memory.fixation)
                ||
                ((Game.getObjectById(unit.memory.fixation).hits / unit.memory.fixation_max) - base_perc)
                    >
                override_threshold){

                unit.memory.fixation = weakest.id;
                unit.memory.fixation_max = HPmax_base;
            }
            
            //finally, attempt to repair the fixated target until its max / threshold
            let final_target = Game.getObjectById(unit.memory.fixation);

            if (final_target.hits < unit.memory.fixation_max)
                if (unit.repair(final_target) == ERR_NOT_IN_RANGE)
                    unit.moveTo(final_target);
            
            //release the fixation if it reaches max
            else
                delete unit.memory.fixation;
        }

        
        //FSM execution (FETCHING):
        else{
            //FETCH: vault (respect limit)
            if (unit.room.storage)
                if (unit.room.storage.store.energy > reserve)
                    if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
            
            //FETCH: containers (fullest)
            if (canisters.length || (unit.room.storage.store.energy <= reserve)){
                let fullest_canister = canisters[0];

                if (canisters.length == energyCanisters_max
                    &&
                    canisters[1].store.getUsedCapacity(RESOURCE_ENERGY)
                        >
                    canisters[0].store.getUsedCapacity(RESOURCE_ENERGY)){

                    fullest_canister = canisters[1];
                }
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(fullest_canister);
            }

            //FETCH: sources
            else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                unit.moveTo(sources[0]);
        }
    }
};