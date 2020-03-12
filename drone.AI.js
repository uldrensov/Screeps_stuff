//DRONE: collects treasure and resupplies spawning structures
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, ignore_lim){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        //inputs: containers (ample), pickups<energy> (ample), pickups<mineral>, tombstones (non-empty), ruins (non-empty)
        if (unit.memory.canisters == undefined || Game.time % 10 == 0){
            unit.memory.canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
                }
            });
        }
        if (unit.memory.scraps == undefined || Game.time % 10 == 0){
            unit.memory.scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => {
                    return (resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim) ||
                    resource.resourceType != RESOURCE_ENERGY;
                }
            });
        }
        if (unit.memory.tombs == undefined || Game.time % 10 == 0){
            unit.memory.tombs = unit.room.find(FIND_TOMBSTONES, {
                filter: RoomObject => {
                    return RoomObject.store.getUsedCapacity() > 0;
                }
            });
        }
        if (unit.memory.remains == undefined || Game.time % 10 == 0){
            unit.memory.remains = unit.room.find(FIND_RUINS, {
                filter: RoomObject => {
                    return RoomObject.store.getUsedCapacity() > 0;
                }
            });
        }
        
        //outputs: extension (non-full), nexi (non-full)
        //NOTE: local_nexi includes main nexus as well
        if (unit.memory.pylons == undefined || Game.time % 10 == 0){
            unit.memory.pylons = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        if (unit.memory.pylons.length) var pylon = unit.pos.findClosestByPath(unit.memory.pylons);
        if (unit.memory.local_nexi == undefined || Game.time % 10 == 0){
            unit.memory.local_nexi = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        if (!unit.memory.fetching){
            //unload: vault<minerals>
            var treasure_held = false;
            var treasure_to_deposit;
            
            //determine if mineral pickups are present (index 1 to skip energy)
            for (let i=1; i<RESOURCES_ALL.length; i++){
                if (unit.store.getUsedCapacity(RESOURCES_ALL[i]) != 0){
                    treasure_held = true;
                    treasure_to_deposit = RESOURCES_ALL[i];
                    break;
                }
            }
            if (treasure_held && unit.room.storage != undefined){
                if (unit.transfer(unit.room.storage, treasure_to_deposit) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            }
            else{
                //unload: extension
                if (pylon){
                    if (unit.transfer(pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(pylon);
                }
                //unload: main nexus
                else if (nexus.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
                    if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nexus);
                }
                //unload: local nexi
                //NOTE: if this branch is taken, main nexus is already omitted from local_nexi
                else if (unit.memory.local_nexi.length){
                    if (unit.transfer(Game.getObjectById(unit.memory.local_nexi[0].id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(Game.getObjectById(unit.memory.local_nexi[0].id));
                }
                //unload: vault<energy>
                else if (unit.room.storage != undefined){
                    if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
            }
        }
        else{
            //fetch: ruins
            if (unit.memory.remains.length){
                if (unit.withdraw(Game.getObjectById(unit.memory.remains[0].id), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.remains[0].id));
            }
            ///*
            //fetch: tombstones<minerals>, tombstones<energy> (fullest)
            else if (unit.memory.tombs.length){
                var richest_tomb = unit.memory.tombs[0];
                var treasure_found_t = false;
                var treasure_to_withdraw = RESOURCE_ENERGY;
                
                //search each tombstone for any minerals (index 1 to skip energy)
                for (let i=0; i<unit.memory.tombs.length; i++){
                    for (let j=1; j<RESOURCES_ALL.length; j++){
                        if (Game.getObjectById(unit.memory.tombs[i].id).store.getUsedCapacity(RESOURCES_ALL[j]) != 0){
                            treasure_found_t = true;
                            richest_tomb = unit.memory.tombs[i];
                            treasure_to_withdraw = RESOURCES_ALL[j];
                            break;
                        }
                    }
                    if (treasure_found_t)
                        break;
                }
                
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_t){
                    for (let i=0; i<unit.memory.tombs.length; i++){
                        if (Game.getObjectById(unit.memory.tombs[i].id).store.getUsedCapacity(RESOURCE_ENERGY) >
                            Game.getObjectById(richest_tomb.id).store.getUsedCapacity(RESOURCE_ENERGY)){
                            richest_tomb = unit.memory.tombs[i];
                        }
                    }
                }
                if (unit.withdraw(Game.getObjectById(richest_tomb.id), treasure_to_withdraw) == ERR_NOT_IN_RANGE){
                    unit.moveTo(Game.getObjectById(richest_tomb.id));
                }
            }
            //*/
            ///*
            //fetch: pickups<minerals> (least TTL), pickups<energy> (fullest))
            else if (unit.memory.scraps.length){
                var chosen_scrap = unit.memory.scraps[0];
                var treasure_found_s = false;
                
                //find the most endangered mineral pickup
                for (let i=0; i<unit.memory.scraps.length; i++){
                    if (unit.memory.scraps[i].resourceType != RESOURCE_ENERGY && unit.memory.scraps[i].amount < chosen_scrap.amount){
                        chosen_scrap = unit.memory.scraps[i];
                        treasure_found_s = true;
                    }
                }
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_s){
                    for (let i=0; i<unit.memory.scraps.length; i++){
                        if (unit.memory.scraps[i].energy > chosen_scrap.energy)
                            chosen_scrap = unit.memory.scraps[i];
                    }
                }
                
                if (unit.pickup(Game.getObjectById(chosen_scrap.id)) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(chosen_scrap.id));
            }
            //*/
            //fetch: containers (fullest; fixation)
            else if (unit.memory.canisters.length){
                //determine the fullest container in play
                var fullest_canister = unit.memory.canisters[0];
                for (let i=0; i<unit.memory.canisters.length; i++){
                    if (Game.getObjectById(unit.memory.canisters[i].id).store.getUsedCapacity(RESOURCE_ENERGY) > Game.getObjectById(fullest_canister.id).store.getUsedCapacity(RESOURCE_ENERGY))
                        fullest_canister = unit.memory.canisters[i];
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
            //fetch: vault
            else if (unit.room.storage != undefined){
                //only fetch from the vault if the energy will actually be used
                if (pylon || unit.memory.local_nexi.length){
                    if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
            }
        }
    }
};