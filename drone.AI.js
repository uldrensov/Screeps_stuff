//DRONE: collects resources around the room. and resupplies spawning structures
//white trail ("carrier")

module.exports = {
    run: function(unit, ignore_lim){
        
        //FETCH / UNLOAD FSM...
        //init (starts in FETCHING mode)
        if (unit.memory.fetching == undefined){
            unit.memory.fetching = true;
            unit.memory.fetch_target_ID = null;
        }

        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0){
            unit.memory.fetching = false;
            unit.memory.unload_target_ID = null;
        }
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0){
            unit.memory.fetching = true;
            unit.memory.fetch_target_ID = null;
        }


        
        //FSM execution (FETCHING): 
        if (unit.memory.fetching){
            //clear old fetch target if...
            if (unit.memory.fetch_target_ID){
                //...if previous target is no longer valid (destroyed, or scrap expired)
                if (!Game.getObjectById(unit.memory.fetch_target_ID))
                    unit.memory.fetch_target_ID = null;

                //...or if previous target has a store property, and is now empty
                else if (Game.getObjectById(unit.memory.fetch_target_ID).store)
                    if (Game.getObjectById(unit.memory.fetch_target_ID).store.getUsedCapacity() == 0)
                        unit.memory.fetch_target_ID = null;
            }


            //when fetch target is blank, attempt to locate/determine a new one
            if (!unit.memory.fetch_target_ID){
                unit.memory.fetch_type = RESOURCE_ENERGY;


                //FETCH: ruins<non-energy>, ruins<energy> (fullest)
                //find ruins
                let remains = unit.room.find(FIND_RUINS, {
                    filter: RoomObject => {
                        return RoomObject.store.getUsedCapacity() > 0;
                    }
                });

                //inspect any ruins found
                if (remains.length){
                    let richest_remains = remains[0];
                    let treasure_found_r = false;
                    
                    //search each ruin for any non-energy resources, if a vault exists to deposit them into
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
                    
                    //if the resource search fails, search for fullest on energy instead
                    if (!treasure_found_r){
                        for (let i=1; i<remains.length; i++){
                            if (remains[i].store.getUsedCapacity(RESOURCE_ENERGY)
                                >
                                Game.getObjectById(richest_remains.id).store.getUsedCapacity(RESOURCE_ENERGY)){

                                richest_remains = remains[i];
                            }
                        }
                    }
                    
                    //save final choice of ruins
                    unit.memory.fetch_target_ID = richest_remains.id;
                }


                //continue looking for a fetch target, if one is not found yet (choice #2)
                if (!unit.memory.fetch_target_ID){
                    //FETCH: tombstones<non-energy>, tombstones<energy> (fullest)
                    //find tombstones
                    let tombs = unit.room.find(FIND_TOMBSTONES, {
                        filter: RoomObject => {
                            return RoomObject.store.getUsedCapacity() > 0;
                        }
                    });

                    //inspect any tombstones found
                    if (tombs.length){
                        let richest_tomb = tombs[0];
                        let treasure_found_t = false;
                        
                        //search each tombstone for any non-energy resources, if a vault exists to deposit them into
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
                        
                        //if the resource search fails, search for fullest on energy instead
                        if (!treasure_found_t){
                            for (let i=1; i<tombs.length; i++){
                                if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY)
                                    >
                                    Game.getObjectById(richest_tomb.id).store.getUsedCapacity(RESOURCE_ENERGY)){

                                    richest_tomb = tombs[i];
                                }
                            }
                        }
                        
                        //save final choice of tombstone
                        unit.memory.fetch_target_ID = richest_tomb.id;
                    }
                }


                //continue looking for a fetch target, if one is not found yet (choice #3)
                if (!unit.memory.fetch_target_ID){
                    //FETCH: pickups<non-energy> (least TTL), pickups<energy> (fullest)
                    //find pickups
                    let scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                        filter: resource => {
                            return (resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim)
                                ||
                                resource.resourceType != RESOURCE_ENERGY;
                        }
                    });

                    //inspect any pickups found
                    if (scraps.length){
                        let chosen_scrap = scraps[0];
                        let treasure_found_s = false;
                        
                        //find the most endangered non-energy pickup, if a vault exists to deposit them into
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

                        //if the resource search fails, search for fullest on energy instead
                        if (!treasure_found_s){
                            for (let i=1; i<scraps.length; i++){
                                if (scraps[i].energy > chosen_scrap.energy)
                                    chosen_scrap = scraps[i];
                            }
                        }
                        
                        //save final choice of pickup
                        unit.memory.fetch_target_ID = chosen_scrap.id;
                    }
                }


                //continue looking for a fetch target, if one is not found yet (choice #4)
                if (!unit.memory.fetch_target_ID){
                    //FETCH: containers<energy> (fullest)
                    //find containers
                    let canisters = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_CONTAINER
                                &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
                        }
                    });

                    //inspect any containers found
                    if (canisters.length){
                        let fullest_canister = canisters[0];
                        
                        //determine the fullest container
                        for (let i=1; i<canisters.length; i++){
                            if (canisters[i].store.getUsedCapacity(RESOURCE_ENERGY)
                                >
                                fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY)){

                                fullest_canister = canisters[i];
                            }
                        }
                    
                        //save final choice of container
                        unit.memory.fetch_target_ID = fullest_canister.id;
                    }
                }


                //continue looking for a fetch target, if one is not found yet (choice #5 - final)
                if (!unit.memory.fetch_target_ID){
                    //FETCH: vault<energy>
                    //check spawners and extensions...
                    if (unit.room.storage){
                        let pylons = unit.room.find(FIND_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_EXTENSION
                                    &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });
                        let local_nexi = unit.room.find(FIND_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_SPAWN
                                    &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });
                        let powernexi = unit.room.find(FIND_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_POWER_SPAWN
                                    &&
                                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });

                        //...only fetch from the vault if the energy is actually needed for refilling spawners and extensions
                        if (pylons.length || local_nexi.length || powernexi.length)
                            unit.memory.fetch_target_ID = unit.room.storage.id;
                    }
                }
            }


            //if a suitable fetch target is registered, FETCH from it
            if (Game.getObjectById(unit.memory.fetch_target_ID)){
                //.withdraw for most targets
                if (unit.withdraw(Game.getObjectById(unit.memory.fetch_target_ID), unit.memory.fetch_type) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.fetch_target_ID));

                //.pickup for scraps
                else if (unit.pickup(Game.getObjectById(unit.memory.fetch_target_ID)) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.fetch_target_ID));
            }
        }



        //FSM execution (UNLOADING): 
        else{
            //clear old unload target if...
            if (unit.memory.unload_target_ID){
                //...if previous target is no longer valid (e.g. destroyed)
                if (!Game.getObjectById(unit.memory.unload_target_ID))
                    unit.memory.unload_target_ID = null;

                //...or if previous target remains standing, and is now full
                else if (Game.getObjectById(unit.memory.unload_target_ID).store)
                    if (Game.getObjectById(unit.memory.unload_target_ID).store.getFreeCapacity(unit.memory.unload_type) == 0)
                        unit.memory.unload_target_ID = null;

                //...or if the unit was holding multiple resource types, and is finished unloading the most recent type (but not the other types)
                else if (unit.store.getUsedCapacity() > 0 && unit.store.getUsedCapacity(unit.memory.unload_type) == 0)
                    unit.memory.unload_target_ID = null;
            }


            //when unload target is blank, attempt to locate/determine a new one
            if (!unit.memory.unload_target_ID){
                unit.memory.unload_type = RESOURCE_ENERGY;


                //UNLOAD: vault<non-energy>
                let treasure_held = false;
                
                //determine if non-energy pickups are held, if a vault exists to deposit them into
                if (unit.room.storage){
                    //index 1 to skip RESOURCE_ENERGY
                    for (let i=1; i<RESOURCES_ALL.length; i++){
                        if (unit.store.getUsedCapacity(RESOURCES_ALL[i]) > 0){
                            unit.memory.unload_type = RESOURCES_ALL[i];
                            treasure_held = true;
                            break;
                        }
                    }
                }

                //save vault as choice
                if (treasure_held)
                    unit.memory.unload_target_ID = unit.room.storage.id;


                //continue looking for an unload target, if one is not found yet (choice #2)
                if (!unit.memory.unload_target_ID){
                    //UNLOAD: extension (nearest)
                    //find extension
                    let pylon = unit.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_EXTENSION
                                &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });
                    
                    //save extension as choice
                    if (pylon)
                        unit.memory.unload_target_ID = pylon.id;
                }


                //continue looking for an unload target, if one is not found yet (choice #3)
                if (!unit.memory.unload_target_ID){
                    //UNLOAD: spawners
                    //find spawners
                    let local_nexi = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_SPAWN
                                &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });

                    //save spawner as choice
                    if (local_nexi.length)
                        unit.memory.unload_target_ID = local_nexi[0].id;
                }


                //continue looking for an unload target, if one is not found yet (choice #4)
                if (!unit.memory.unload_target_ID){
                    //UNLOAD: power spawner<energy>
                    //find power spawners
                    let powernexi = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_POWER_SPAWN
                                &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });

                    //save power spawner as choice
                    if (powernexi.length)
                        unit.memory.unload_target_ID = powernexi[0].id;
                }


                //continue looking for an unload target, if one is not found yet (choice #5 - final)
                if (!unit.memory.unload_target_ID){
                    //UNLOAD: vault<energy>
                    //save vault as choice
                    if (unit.room.storage)
                        unit.memory.unload_target_ID = unit.room.storage.id;
                }
            }


            //if a suitable unload target is registered, UNLOAD into it
            if (Game.getObjectById(unit.memory.unload_target_ID))
                if (unit.transfer(Game.getObjectById(unit.memory.unload_target_ID), unit.memory.unload_type) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.unload_target_ID));
        }
    }
};