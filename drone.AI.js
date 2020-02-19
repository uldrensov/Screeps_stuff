//DRONE: collects treasure and resupplies spawning structures
//white trail ("carrier")

module.exports = {
    run: function(unit,nexus_id,ignore_lim){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        //inputs: containers (ample), pickups<energy> (ample), pickups<mineral>, tombstones (non-empty), ruins (non-empty)
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
            }
        });
        var scraps = nexus.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim) ||
                resource.resourceType != RESOURCE_ENERGY;
            }
        });
        var tombs = nexus.room.find(FIND_TOMBSTONES, {
            filter: RoomObject => {
                return RoomObject.store.getUsedCapacity() > 0;
            }
        });
        var remains = nexus.room.find(FIND_RUINS, {
            filter: RoomObject => {
                return RoomObject.store.getUsedCapacity() > 0;
            }
        });
        
        //outputs: extensions (non-full)
        var pylons = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        
        //two-states...
        //if full pockets while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity() == 0){
            unit.memory.homebound = true;
        }
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        if (unit.memory.homebound){
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
            if (treasure_held){
                if (unit.transfer(nexus.room.storage, treasure_to_deposit) == ERR_NOT_IN_RANGE)
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else{
                //unload: extensions
                if (pylons.length){
                    var nearest_pylon = unit.pos.findClosestByPath(pylons);
                    if (unit.transfer(nearest_pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nearest_pylon, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                //unload: nexus
                else if (nexus.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
                    if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                //unload: vault<energy>
                else if (nexus.room.storage != undefined){
                    if (unit.transfer(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else{
            //fetch: ruins
            if (remains.length){
                if (unit.withdraw(remains[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(remains[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
            ///*
            //fetch: tombstones<minerals>, tombstones<energy> (fullest)
            else if (tombs.length){
                var richest_tomb = tombs[0];
                var treasure_found_t = false;
                var treasure_to_withdraw = RESOURCE_ENERGY;
                
                //search each tombstone for any minerals (index 1 to skip energy)
                for (let i=0; i<tombs.length; i++){
                    for (let j=1; j<RESOURCES_ALL.length; j++){
                        if (tombs[i].store.getUsedCapacity(RESOURCES_ALL[j]) != 0){
                            treasure_found_t = true;
                            richest_tomb = tombs[i];
                            treasure_to_withdraw = RESOURCES_ALL[j];
                            break;
                        }
                    }
                    if (treasure_found_t)
                        break;
                }
                
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_t){
                    for (let i=0; i<tombs.length; i++){
                        if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY) >
                            richest_tomb.store.getUsedCapacity(RESOURCE_ENERGY)){
                            richest_tomb = tombs[i];
                        }
                    }
                }
                if (unit.withdraw(richest_tomb, treasure_to_withdraw) == ERR_NOT_IN_RANGE){
                    unit.moveTo(richest_tomb, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            //*/
            ///*
            //fetch: pickups<minerals> (least TTL), pickups<energy> (fullest))
            else if (scraps.length){
                var chosen_scrap = scraps[0];
                var treasure_found_s = false;
                
                //find the most endangered mineral pickup
                for (let i=0; i<scraps.length; i++){
                    if (scraps[i].resourceType != RESOURCE_ENERGY && scraps[i].amount < chosen_scrap.amount){
                        chosen_scrap = scraps[i];
                        treasure_found_s = true;
                    }
                }
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_s){
                    for (let i=0; i<scraps.length; i++){
                        if (scraps[i].energy > chosen_scrap.energy)
                            chosen_scrap = scraps[i];
                    }
                }
                
                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE){
                    unit.moveTo(chosen_scrap, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            //*/
            //fetch: terminal
            /*
            else if (nexus.room.terminal != undefined){
                if (nexus.room.terminal.store.energy != 0){
                    if (unit.withdraw(nexus.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nexus.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            */
            //fetch: containers (fullest; fixation)
            else if (canisters.length){
                //determine the fullest container in play
                var fullest_canister = canisters[0];
                for (let i=0; i<canisters.length; i++){
                    if (canisters[i].store.getUsedCapacity(RESOURCE_ENERGY) >
                    fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY)){
                        fullest_canister = canisters[i];
                    }
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
                    unit.moveTo(canister_target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            //fetch: vault
            else if (nexus.room.storage != undefined){
                //only fetch from the vault if the energy will actually be used
                if (pylons.length || nexus.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
                    if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};