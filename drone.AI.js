//DRONE: collects treasure and resupplies spawning structures
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, ignore_lim, std_interval){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        //inputs: containers (ample), pickups<energy> (ample), pickups<mineral>, tombstones (non-empty), ruins (non-empty)
        if (unit.memory.canisters == undefined || Game.time % std_interval == 0){
            unit.memory.canisters = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
                }
            });
        }
        if (unit.memory.scraps == undefined || Game.time % std_interval == 0){
            unit.memory.scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => {
                    return (resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim) ||
                    resource.resourceType != RESOURCE_ENERGY;
                }
            });
        }
        if (unit.memory.tombs == undefined || Game.time % std_interval == 0){
            unit.memory.tombs = unit.room.find(FIND_TOMBSTONES, {
                filter: RoomObject => {
                    return RoomObject.store.getUsedCapacity() > 0;
                }
            });
        }
        if (unit.memory.remains == undefined || Game.time % std_interval == 0){
            unit.memory.remains = unit.room.find(FIND_RUINS, {
                filter: RoomObject => {
                    return RoomObject.store.getUsedCapacity() > 0;
                }
            });
        }
        
        //outputs: extension (non-full), nexi (non-full), power nexus (non-full)
        var pylon = unit.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (unit.memory.local_nexi == undefined || Game.time % std_interval == 0){
            unit.memory.local_nexi = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && structure.name != nexus.name;
                }
            });
        }
        if (unit.memory.powernex == undefined){
            unit.memory.powernex = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_POWER_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;

        
        //behaviour execution...
        if (!unit.memory.fetching){
            //unload: vault<minerals>
            var treasure_held = false;
            var treasure_to_deposit;
            
            //determine if mineral pickups are present (index 1 to skip energy)
            for (let i=1; i<RESOURCES_ALL.length; i++){
                if (unit.store.getUsedCapacity(RESOURCES_ALL[i]) > 0){
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
                else if (unit.memory.local_nexi.length){
                    var getLocalNex = Game.getObjectById(unit.memory.local_nexi[0].id);
                    if (unit.transfer(getLocalNex, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getLocalNex);
                }
                //unload: power nexus
                else if (unit.memory.powernex.length){
                    var getPowerNex = Game.getObjectById(unit.memory.powernex[0].id);
                    if (unit.transfer(getPowerNex, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getPowerNex);
                }
                //unload: vault<energy>
                else if (unit.room.storage != undefined){
                    if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
            }
        }
        else{
            var treasure_to_withdraw = RESOURCE_ENERGY;
            
            //fetch: ruins<minerals>, ruins<energy> (fullest)
            if (unit.memory.remains.length){
                var richest_remains = unit.memory.remains[0];
                var treasure_found_r = false;
                var getRemains;
                
                //search each ruin for any minerals (index 1 to skip energy)
                for (let i=0; i<unit.memory.remains.length; i++){
                    getRemains = Game.getObjectById(unit.memory.remains[i].id);
                    if (getRemains == null) continue;
                    for (let j=1; j<RESOURCES_ALL.length; j++){
                        if (getRemains.store.getUsedCapacity(RESOURCES_ALL[j]) > 0){
                            treasure_found_r = true;
                            richest_remains = getRemains;
                            treasure_to_withdraw = RESOURCES_ALL[j];
                            break;
                        }
                    }
                    if (treasure_found_r) break;
                }
                
                //if no minerals found, or if no vault exists to deposit them in, re-run the search with respect to energy
                if (!treasure_found_r || unit.room.storage == null){
                    for (let i=0; i<unit.memory.remains.length; i++){
                        getRemains = Game.getObjectById(unit.memory.remains[i].id);
                        if (getRemains == null) continue;
                        try{
                            if (getRemains.store.getUsedCapacity(RESOURCE_ENERGY) > Game.getObjectById(richest_remains.id).store.getUsedCapacity(RESOURCE_ENERGY))
                                richest_remains = getRemains;
                        }
                        catch{ //candidate compares against null
                            richest_remains = getRemains;
                        }
                    }
                }
                
                var getRichestRemains = Game.getObjectById(richest_remains.id);
                if (getRichestRemains != null){
                    if (unit.withdraw(getRemains, treasure_to_withdraw) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getRemains);
                }
            }
            //fetch: tombstones<minerals>, tombstones<energy> (fullest)
            else if (unit.memory.tombs.length){
                var richest_tomb = unit.memory.tombs[0];
                var treasure_found_t = false;
                var getTomb;
                
                //search each tombstone for any minerals (index 1 to skip energy)
                for (let i=0; i<unit.memory.tombs.length; i++){
                    getTomb = Game.getObjectById(unit.memory.tombs[i].id);
                    if (getTomb == null) continue;
                    for (let j=1; j<RESOURCES_ALL.length; j++){
                        if (getTomb.store.getUsedCapacity(RESOURCES_ALL[j]) > 0){
                            treasure_found_t = true;
                            richest_tomb = getTomb;
                            treasure_to_withdraw = RESOURCES_ALL[j];
                            break;
                        }
                    }
                    if (treasure_found_t) break;
                }
                
                //if no minerals found, or if no vault exists to deposit them in, re-run the search with respect to energy
                if (!treasure_found_t || unit.room.storage == null){
                    for (let i=0; i<unit.memory.tombs.length; i++){
                        getTomb = Game.getObjectById(unit.memory.tombs[i].id);
                        if (getTomb == null) continue;
                        try{
                            if (getTomb.store.getUsedCapacity(RESOURCE_ENERGY) > Game.getObjectById(richest_tomb.id).store.getUsedCapacity(RESOURCE_ENERGY))
                                richest_tomb = getTomb;
                        }
                        catch{ //candidate compares against null
                            richest_tomb = getTomb;
                        }
                    }
                }
                
                var getRichestTomb = Game.getObjectById(richest_tomb.id);
                if (getRichestTomb != null){
                    if (unit.withdraw(getRichestTomb, treasure_to_withdraw) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getRichestTomb);
                }
            }
            //fetch: pickups<minerals> (least TTL), pickups<energy> (fullest))
            else if (unit.memory.scraps.length){
                var chosen_scrap = unit.memory.scraps[0];
                var treasure_found_s = false;
                var getScrap;
                
                //find the most endangered mineral pickup
                for (let i=0; i<unit.memory.scraps.length; i++){
                    getScrap = Game.getObjectById(unit.memory.scraps[i].id);
                    if (getScrap == null) continue;
                    try{
                        if (getScrap.resourceType != RESOURCE_ENERGY && getScrap.amount < Game.getObjectById(chosen_scrap.id).amount){
                            chosen_scrap = getScrap;
                            treasure_found_s = true;
                        }
                    }
                    catch{
                        if (getScrap.resourceType != RESOURCE_ENERGY){
                            chosen_scrap = getScrap;
                            treasure_found_s = true;
                        }
                    }
                }
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_s){
                    for (let i=0; i<unit.memory.scraps.length; i++){
                        getScrap = Game.getObjectById(unit.memory.scraps[i].id);
                        if (getScrap == null) continue;
                        try{
                            if (getScrap.energy > Game.getObjectById(chosen_scrap.id).energy)
                                chosen_scrap = getScrap;
                        }
                        catch{
                            chosen_scrap = getScrap;
                        }
                    }
                }
                
                var getChosenScrap = Game.getObjectById(chosen_scrap.id);
                if (getChosenScrap != null){
                    if (unit.pickup(getChosenScrap) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getChosenScrap);
                }
            }
            //fetch: containers (fullest; fixation)
            else if (unit.memory.canisters.length){
                var fullest_canister = unit.memory.canisters[0];
                var getCanister;
                
                //determine the fullest container in play
                for (let i=0; i<unit.memory.canisters.length; i++){
                    getCanister = Game.getObjectById(unit.memory.canisters[i].id);
                    if (getCanister == null) continue;
                    try{
                        if (getCanister.store.getUsedCapacity(RESOURCE_ENERGY) > Game.getObjectById(fullest_canister.id).store.getUsedCapacity(RESOURCE_ENERGY))
                            fullest_canister = getCanister;
                    }
                    catch{
                        fullest_canister = getCanister;
                    }
                }
                
                if (Game.getObjectById(fullest_canister.id) != null){
                    var getFixationPrev = Game.getObjectById(unit.memory.fixation);
                    
                    //if there is no current "fixated" container, set fixation on the fullest one
                    if (getFixationPrev == null)
                        unit.memory.fixation = fullest_canister.id;
                    //otherwise, only switch fixation if the previous one crosses beneath the "ignore" criteria
                    else if (getFixationPrev.store[RESOURCE_ENERGY] < ignore_lim)
                        unit.memory.fixation = fullest_canister.id;
                
                    //finally, withdraw from the fixated target
                    var getFixationNew = Game.getObjectById(unit.memory.fixation);
                    if (unit.withdraw(getFixationNew, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getFixationNew);
                }
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