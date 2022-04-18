//DRONE: collects treasure and resupplies spawning structures
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, ignore_lim, std_interval){
        
        let nexus = Game.getObjectById(nexus_id);



        //2-state FETCH / UNLOAD FSM...
        //init
        if (unit.memory.fetching == undefined)
            unit.memory.fetching = true;
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0){
            unit.memory.fetching = false;
            unit.memory.unload_target = null;
        }
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0){
            unit.memory.fetching = true;
            unit.memory.fetch_target = null;
        }
        
        

        //OUTPUTS: extension (non-full), nexi (non-full), power nexus (non-full)
        let pylon = unit.pos.findClosestByPath(FIND_STRUCTURES, {
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


        
        //FSM execution (FETCHING): 
        if (unit.memory.fetching){
            //every standard interval where there is no fetch target, attempt to locate/determine one
            if (Game.time % std_interval == 0 && !unit.memory.fetch_target){
                unit.memory.fetch_type = RESOURCE_ENERGY;


                //FETCH: ruins<minerals>, ruins<energy> (fullest)
                //find ruins
                let remains = unit.room.find(FIND_RUINS, {
                    filter: RoomObject => {
                        return RoomObject.store.getUsedCapacity() > 0;
                    }
                });

                //inspect ruins found
                if (remains.length){
                    let richest_remains = remains[0];
                    let treasure_found_r = false;
                    
                    //search each ruin for any minerals, if a vault exists to deposit them into
                    if (unit.room.storage){
                        for (let i=0; i<remains.length; i++){
                            //index 1 to skip RESOURCE_ENERGY
                            for (let j=1; j<RESOURCES_ALL.length; j++){
                                if (remains[i].store.getUsedCapacity(RESOURCES_ALL[j]) > 0){
                                    unit.memory.fetch_type =    RESOURCES_ALL[j];
                                    richest_remains =           remains[i];
                                    treasure_found_r =          true;
                                    break;
                                }
                            }

                            if (treasure_found_r)               break;
                        }
                    }
                    
                    //if the mineral search fails, re-run the search, but for energy instead
                    if (!treasure_found_r){
                        for (let i=0; i<remains.length; i++){
                            if (remains[i].store.getUsedCapacity(RESOURCE_ENERGY)
                                >
                                Game.getObjectById(richest_remains.id).store.getUsedCapacity(RESOURCE_ENERGY)){

                                richest_remains = remains[i];
                            }
                        }
                    }
                    
                    //confirm final choice of ruins
                    unit.memory.fetch_target = richest_remains.id;
                }


                //continue looking for a fetch target, if one is not found yet
                if (!unit.memory.fetch_target){
                    //FETCH: tombstones<minerals>, tombstones<energy> (fullest)
                    //find tombstones
                    let tombs = unit.room.find(FIND_TOMBSTONES, {
                        filter: RoomObject => {
                            return RoomObject.store.getUsedCapacity() > 0;
                        }
                    });

                    //inspect tombstones found
                    if (tombs.length){
                        let richest_tomb = tombs[0];
                        let treasure_found_t = false;
                        
                        //search each tombstone for any minerals, if a vault exists to deposit them into
                        if (unit.room.storage){
                            for (let i=0; i<tombs.length; i++){
                                //index 1 to skip RESOURCE_ENERGY
                                for (let j=1; j<RESOURCES_ALL.length; j++){
                                    if (tombs[i].store.getUsedCapacity(RESOURCES_ALL[j]) > 0){
                                        unit.memory.fetch_type =    RESOURCES_ALL[j];
                                        richest_tomb =              tombs[i];
                                        treasure_found_t =          true;
                                        break;
                                    }
                                }

                                if (treasure_found_t)               break;
                            }
                        }
                        
                        //if the mineral search fails, re-run the search, but for energy instead
                        if (!treasure_found_t){
                            for (let i=0; i<tombs.length; i++){
                                if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY)
                                    >
                                    Game.getObjectById(richest_tomb.id).store.getUsedCapacity(RESOURCE_ENERGY)){

                                    richest_tomb = tombs[i];
                                }
                            }
                        }
                        
                        //confirm final choice of tombstone
                        unit.memory.fetch_target = richest_tomb;
                    }
                }


                //continue looking for a fetch target, if one is not found yet
                if (!unit.memory.fetch_target){
                    //FETCH: pickups<minerals> (least TTL), pickups<energy> (fullest))
                    //find pickups
                    let scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                        filter: resource => {
                            return (resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim) ||
                            resource.resourceType != RESOURCE_ENERGY;
                        }
                    });

                    //inspect pickups found
                    if (scraps.length){
                        let chosen_scrap = scraps[0];
                        let treasure_found_s = false;
                        
                        //find the most endangered mineral pickup, if a vault exists to deposit them into
                        if (unit.room.storage){
                            for (let i=0; i<scraps.length; i++){
                                if (scraps[i].resourceType != RESOURCE_ENERGY
                                    &&
                                    scraps[i].amount < chosen_scrap.amount){

                                    unit.memory.fetch_type = scraps[i].resourceType;
                                    chosen_scrap = scraps[i];
                                    treasure_found_s = true;
                                }
                            }
                        }

                        //if the mineral search fails, re-run the search, but for energy instead
                        if (!treasure_found_s){
                            for (let i=0; i<scraps.length; i++){
                                if (scraps[i].energy > chosen_scrap.energy)
                                    chosen_scrap = scraps[i];
                            }
                        }
                        
                        //confirm final choice of pickup
                        unit.memory.fetch_target = chosen_scrap;
                    }
                }


                //continue looking for a fetch target, if one is not found yet
                if (!unit.memory.fetch_target){
                    //FETCH: containers (fullest; fixation)
                    //find containers
                    let canisters = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_CONTAINER && structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
                        }
                    });

                    //inspect containers found
                    if (canisters.length){
                        let fullest_canister = canisters[0];
                        
                        //determine the fullest container
                        for (let i=0; i<canisters.length; i++){
                            if (getCanister.store.getUsedCapacity(RESOURCE_ENERGY)
                                >
                                fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY)){

                                fullest_canister = getCanister;
                            }
                        }
                        


                        
                        let getFixationPrev = Game.getObjectById(unit.memory.fixation);
                        
                        //if there is no current "fixated" container, set fixation on the fullest one
                        if (getFixationPrev == null)
                            unit.memory.fixation = fullest_canister.id;
                        //otherwise, only switch fixation if the previous one crosses beneath the "ignore" criteria
                        else if (getFixationPrev.store[RESOURCE_ENERGY] < ignore_lim)
                            unit.memory.fixation = fullest_canister.id;
                    
                        //finally, withdraw from the fixated target
                        let getFixationNew = Game.getObjectById(unit.memory.fixation);
                        if (unit.withdraw(getFixationNew, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(getFixationNew);
                    }
                }


                //FETCH: vault
                else if (unit.room.storage != undefined){
                    //only fetch from the vault if the energy will actually be used
                    if (pylon || unit.memory.local_nexi.length){
                        if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(unit.room.storage);
                    }
                }
            }



        }



        //FSM execution (UNLOADING): 
        else{
            //UNLOAD: vault<minerals>
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

            if (treasure_held && unit.room.storage != undefined)
                if (unit.transfer(unit.room.storage, treasure_to_deposit) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);

            else{
                //UNLOAD: extension
                if (pylon){
                    if (unit.transfer(pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(pylon);
                }
                //UNLOAD: main nexus
                else if (nexus.store.getFreeCapacity(RESOURCE_ENERGY) != 0){
                    if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(nexus);
                }
                //UNLOAD: local nexi
                else if (unit.memory.local_nexi.length){
                    var getLocalNex = Game.getObjectById(unit.memory.local_nexi[0].id);
                    if (unit.transfer(getLocalNex, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getLocalNex);
                }
                //UNLOAD: power nexus
                else if (unit.memory.powernex.length){
                    var getPowerNex = Game.getObjectById(unit.memory.powernex[0].id);
                    if (unit.transfer(getPowerNex, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getPowerNex);
                }
                //UNLOAD: vault<energy>
                else if (unit.room.storage != undefined){
                    if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
            }
        }
    }
};