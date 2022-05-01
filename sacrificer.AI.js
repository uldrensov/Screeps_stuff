//sacrificer: early game controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, ignore_lim){
        
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;


        
        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //UNLOAD: controller
            if (unit.upgradeController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller);
        }


        //FSM execution (FETCHING):
        else{
            const canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER
                        &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
                }
            });

            //FETCH: containers (fullest; fixation)
            if (canisters.length){
                let fullest_canister = canisters[0];

                //determine the fullest container
                for (let i=1; i<canisters.length; i++){
                    if (canisters[i].store.getUsedCapacity(RESOURCE_ENERGY) > fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY))
                        fullest_canister = canisters[i];
                }
                
                //if there is no current target container, "fixate" on the fullest one
                if (!unit.memory.fixation)
                    unit.memory.fixation = fullest_canister.id;
                //otherwise, only switch fixation if the previous one crosses beneath the "ignore" criteria
                else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < ignore_lim)
                    unit.memory.fixation = fullest_canister.id;

                //finally, fetch from the fixated target
                if (unit.withdraw(Game.getObjectById(unit.memory.fixation), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.fixation));
            }
            

            //FETCH: sources (random)
            else{
                if (!unit.memory.src_ID)
                    unit.memory.src_ID = unit.room.find(FIND_SOURCES)[0].id;

                if (unit.harvest(Game.getObjectById(unit.memory.src_ID)) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.src_ID));
            }
        }
    }
};