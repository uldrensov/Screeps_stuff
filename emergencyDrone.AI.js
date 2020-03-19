//EMERGENCY DRONE: cheap DRONE variant designed to replenish spawning energy as fast as possible
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id){
        
        var nexus = Game.getObjectById(nexus_id);
        
        //emergency drone's reduced "ignore limit"
        var lowbound = 50;
        
        
        //inputs: energy sources, containers (ample), pickups (ample), tombstones (non-empty)
        var sources = unit.room.find(FIND_SOURCES);
        var canisters = unit.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > lowbound;
            }
        });
        var scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return resource.amount > lowbound && resource.resourceType == RESOURCE_ENERGY;
            }
        });
        var tombs = unit.room.find(FIND_TOMBSTONES, {
            filter: RoomObject => {
                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //outputs: extension (non-full)
        var pylon = unit.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
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
            //unload: extension
            if (pylon){
                if (unit.transfer(pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(pylon);
            }
            //unload: nexus
            else if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                unit.moveTo(nexus);
        }
        else{
            //fetch: vault
            if (unit.room.storage != undefined && unit.room.storage.store.energy > 0){
                if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            }
            //fetch: containers (fullest; fixation)
            else if (canisters.length){
                //determine the fullest container in play
                var fullest_canister = canisters[0];
                for (let i=0; i<canisters.length; i++){
                    if (canisters[i].store.getUsedCapacity(RESOURCE_ENERGY) > fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY))
                        fullest_canister = canisters[i];
                }
                
                //if there is no current target container, "fixate" on the fullest one
                if (unit.memory.fixation == undefined)
                    unit.memory.fixation = fullest_canister.id;
                //otherwise, only switch fixation if the previous one crosses beneath the (reduced) "ignore" criteria
                else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < lowbound)
                    unit.memory.fixation = fullest_canister.id;

                //finally, withdraw from the fixated target
                var canister_target = Game.getObjectById(unit.memory.fixation);
                if (unit.withdraw(canister_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(canister_target);
            }
            //fetch: tombstones<energy> (fullest)
            else if (tombs.length){
                //determine the fullest tomb in play
                var richest_tomb = tombs[0];
                for (let i=0; i<tombs.length; i++){
                    if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY) > richest_tomb.store.getUsedCapacity(RESOURCE_ENERGY))
                        richest_tomb = tombs[i];
                }
                //approach and withdraw
                if (unit.withdraw(richest_tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(richest_tomb);
            }
            //TODO: pickups
            //fetch: pickups<energy> (fullest)
            else if (scraps.length){
                //
                var chosen_scrap = scraps[0];
                for (let i=0; i<scraps.length; i++){
                    if (scraps[i].energy > chosen_scrap.energy)
                        chosen_scrap = scraps[i];
                }
                
                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE)
                    unit.moveTo(chosen_scrap);
            }
            //fetch: sources
            else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE)
                unit.moveTo(sources[0]);
        }
    }
};