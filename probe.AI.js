//PROBE: standard repair unit
//blue trail ("maintainer")

module.exports = {
    run: function(unit, override_threshold, ignore_lim, reserve){

        const energyCanisters_max = 2;

        

        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;


        
        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //UNLOAD: structure (weakest %; fixation)
            //find all damaged structures in the room
            const repairTargets = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return ((structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                        ||
                        (structure.hits < Memory.wall_threshold && structure.structureType == STRUCTURE_WALL)
                        ||
                        (structure.hits < Memory.rampart_threshold && structure.structureType == STRUCTURE_RAMPART));
                }
            });


            //inspect any damaged structures found
            if (repairTargets.length){
                let weakest = repairTargets[0];
                let weakest_HPmax;

                //using the proper HP threshold value
                switch (weakest.structureType){
                    case STRUCTURE_WALL:
                        weakest_HPmax = Memory.wall_threshold;
                        break;
                    case STRUCTURE_RAMPART:
                        weakest_HPmax = Memory.rampart_threshold;
                        break;
                    default:
                        weakest_HPmax = weakest.hitsMax;
                }
                

                //find the weakest structure in terms of HP %, to serve as a fixation candidate
                let compare_HPmax;

                for (let i=1; i<repairTargets.length; i++){
                    //using the proper HP threshold value
                    switch (repairTargets[i].structureType){
                        case STRUCTURE_WALL:
                            compare_HPmax = Memory.wall_threshold;
                            break;
                        case STRUCTURE_RAMPART:
                            compare_HPmax = Memory.rampart_threshold;;
                            break;
                        default:
                            compare_HPmax = repairTargets[i].hitsMax;
                    }
                    
                    if ((repairTargets[i].hits / compare_HPmax) < (weakest.hits / weakest_HPmax)){
                        weakest =           repairTargets[i];
                        weakest_HPmax =     compare_HPmax;
                    }
                }
                

                //if there is already a fixation, calculate difference between the current fixation's HP %, and the candidate structure's HP %
                let HPpercent_diff = 0;
                if (Game.getObjectById(unit.memory.fixation))
                    HPpercent_diff = (Game.getObjectById(unit.memory.fixation).hits / unit.memory.fixation_max) - base_perc;

                //set a new fixation if percent difference is wide enough, or if no fixation currently exists
                if (!Game.getObjectById(unit.memory.fixation)
                    ||
                    (HPpercent_diff > override_threshold)){

                    unit.memory.fixation =      weakest.id;
                    unit.memory.fixation_max =  weakest_HPmax;
                }
            }


            //attempt to repair the fixated target until its max / threshold
            let final_target = Game.getObjectById(unit.memory.fixation);

            if (final_target){
                if (final_target.hits < unit.memory.fixation_max){
                    if (unit.repair(final_target) == ERR_NOT_IN_RANGE)
                        unit.moveTo(final_target);
                }

                //release the fixation if it becomes fully repaired
                else{
                    unit.memory.fixation =      null;
                    unit.memory.fixation_max =  null;
                }
            }
        }

        
        //FSM execution (FETCHING):
        else{
            //FETCH: vault (respect limit)
            let canFetch_storage = false;

            if (unit.room.storage)
                if (unit.room.storage.store.energy > reserve)
                    canFetch_storage = true;

            if (canFetch_storage){
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            }
            
            
            //FETCH: containers (fullest)
            else{
                const canisters = unit.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_CONTAINER
                            &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
                    }
                });

                if (canisters.length){
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
                else{
                    if (!unit.memory.src_ID)
                        unit.memory.src_ID = unit.room.find(FIND_SOURCES)[0].id;

                    if (unit.harvest(Game.getObjectById(unit.memory.src_ID)) == ERR_NOT_IN_RANGE)
                        unit.moveTo(Game.getObjectById(unit.memory.src_ID));
                }
            }
        }
    }
};