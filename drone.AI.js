//DRONE: pickup/withdraws energy/minerals and resupplies spawning structures
//white trail

module.exports = {
    run: function(unit,nexus){
        
        //non-empty energy containers
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //energy on the floor
        var scraps = nexus.room.find(FIND_DROPPED_RESOURCES);
        
        //non-empty tombstones
        var tombs = nexus.room.find(FIND_TOMBSTONES, {
            filter: (RoomObject) => {
                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //energy-deficient extensions
        var pylons = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
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
        //find and resupply the nearest suitable structure
        if (unit.memory.homebound){
            //prioritise depositing minerals into the vault
            var treasure_held = false;
            var treasure_to_deposit;
            
            //determine if mineral pickups are present (index 1 to skip energy)
            for (var i=1; i<RESOURCES_ALL.length; i++){
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
                for (var i=0; i<tombs.length; i++){
                    for (var j=1; j<RESOURCES_ALL.length; j++){
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
                    for (var i=0; i<tombs.length; i++){
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
                for (var i=0; i<scraps.length; i++){
                    if (scraps[i].resource != RESOURCE_ENERGY &&
                    scraps[i].amount < chosen_scrap.amount){
                        chosen_scrap = scraps[i];
                        treasure_found_s = true;
                    }
                }
                
                //if no minerals found, re-run the search with respect to energy
                if (!treasure_found_s){
                    for (var i=0; i<scraps.length; i++){
                        if (scraps[i].energy > chosen_scrap.energy){
                            chosen_scrap = scraps[i];
                        }
                    }
                }
                
                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE){
                    unit.moveTo(chosen_scrap, {visualizePathStyle: {stroke: '#ffffff'}});
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
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};