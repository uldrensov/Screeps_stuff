//sacrificer: standard controller attendant
//violet trail ("upgrader")

module.exports = {
    run: function(unit, ignore_lim){
        
        if (unit.memory.ctrl_id == undefined)
            unit.memory.ctrl_id = unit.room.controller.id;
        var obelisk = Game.getObjectById(unit.memory.ctrl_id);
        
        
        //INPUTS: energy sources, containers (ample)
        var sources = obelisk.room.find(FIND_SOURCES);
        var canisters = obelisk.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
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
        if (!unit.memory.fetching){
            //UNLOAD: controller
            if (unit.upgradeController(obelisk) == ERR_NOT_IN_RANGE)
                unit.moveTo(obelisk);
        }
        else{
            //fetch: containers (fullest; fixation)
            if (canisters.length){
                //determine the fullest container in play
                var fullest_canister = canisters[0];
                for (let i=0; i<canisters.length; i++){
                    if (canisters[i].store.getUsedCapacity(RESOURCE_ENERGY) > fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY))
                        fullest_canister = canisters[i];
                }
                
                //if there is no current target container, "fixate" on the fullest one
                if (unit.memory.fixation == undefined)
                    unit.memory.fixation = fullest_canister.id;
                //otherwise, only switch fixation if the previous one crosses beneath the "ignore" criteria
                else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < ignore_lim)
                    unit.memory.fixation = fullest_canister.id;

                //finally, withdraw from the fixated target
                var canister_target = Game.getObjectById(unit.memory.fixation);
                if (unit.withdraw(canister_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(canister_target);
            }
            //fetch: sources
            else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                unit.moveTo(sources[0]);
        }
    }
};