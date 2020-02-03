//DRONE: pickup/withdraws energy/minerals and resupplies spawning structures
//white trail

module.exports = {
    run: function(unit,nexus_id,pickup_min,ignore_lim){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        //energy containers of reasonable capacity
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
            }
        });
        
        //all minerals pickups, and sufficiently plentiful energy pickups
        var scraps = nexus.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return (resource.amount > pickup_min && resource.resourceType == RESOURCE_ENERGY) ||
                resource.resourceType != RESOURCE_ENERGY;
            }
        });
        
        //non-empty tombstones
        var tombs = nexus.room.find(FIND_TOMBSTONES, {
            filter: RoomObject => {
                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //energy-deficient extensions
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
        //find and resupply the nearest suitable structure
        if (unit.memory.homebound){
            //prioritise depositing minerals into the vault
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
                if (unit.transfer(nexus.room.storage, treasure_to_deposit) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            
            else{
                //prioritise extensions
                if (pylons.length){
                    var nearest_pylon = unit.pos.findClosestByPath(pylons);
                    if (unit.transfer(nearest_pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        unit.moveTo(nearest_pylon, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else if (nexus.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
                    if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                //if excess energy, dump it in storage
                else if (nexus.room.storage != undefined){
                    if (unit.transfer(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
        
        //or pickup/withdraw
        else{
            //prioritise tombstones
            if (tombs.length){
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
                    if (treasure_found_t){
                        break;
                    }
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
            //prioritise mineral pickups
            else if (scraps.length){
                var chosen_scrap = scraps[0];
                var treasure_found_s = false;
                
                //find the most endangered mineral pickup
                for (let i=0; i<scraps.length; i++){
                    if (scraps[i].resource != RESOURCE_ENERGY &&
                    scraps[i].amount < chosen_scrap.amount){
                        chosen_scrap = scraps[i];
                        treasure_found_s = true;
                    }
                }
                
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_s){
                    for (let i=0; i<scraps.length; i++){
                        if (scraps[i].energy > chosen_scrap.energy){
                            chosen_scrap = scraps[i];
                        }
                    }
                }
                
                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE){
                    //console.log(unit.moveTo(chosen_scrap, {visualizePathStyle: {stroke: '#ffffff'}}));
                    unit.moveTo(chosen_scrap, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
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
                if (unit.memory.fixation == undefined){
                    unit.memory.fixation = fullest_canister.id;
                }
                //otherwise, only switch fixation if the previous one crosses beneath the "ignore" criteria
                else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < ignore_lim){
                    unit.memory.fixation = fullest_canister.id;
                }
                
                //finally, withdraw from the fixated target
                var canister_target = Game.getObjectById(unit.memory.fixation);
                if (unit.withdraw(canister_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(canister_target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (nexus.room.storage != undefined){
                if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};