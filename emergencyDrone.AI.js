//EMERGENCY DRONE: cheap DRONE variant designed to replenish spawning energy as fast as possible
//white trail ("carrier")

module.exports = {
    run: function(unit){
        
        const lowbound = 50; //emergency drone's reduced "ignore limit"


        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //self-killswitch routine
            let drone_gang =        _.filter(Game.creeps, creep => creep.memory.role == 'drone'         && creep.memory.home_index == unit.memory.home_index);
            let assimilator_gang =  _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'   && creep.memory.home_index == unit.memory.home_index);
            let assimilator2_gang = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'  && creep.memory.home_index == unit.memory.home_index);
            let acolyte_gang =      _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'       && creep.memory.home_index == unit.memory.home_index);
            let acolyte2_gang =     _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'      && creep.memory.home_index == unit.memory.home_index);

            //retire the unit once drones and harvesters are alive again
            if (drone_gang.length
                &&
                (assimilator_gang.length || assimilator2_gang.length || acolyte_gang.length || acolyte2_gang.length)){

                    unit.memory.killswitch = true;
            }



            //FETCH / UNLOAD FSM...
            //if carry amt reaches full while FETCHING, switch to UNLOADING
            if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while UNLOADING, switch to FETCHING
            if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
                unit.memory.fetching = true;

        

            //FSM execution (UNLOADING): 
            if (!unit.memory.fetching){
                //UNLOAD: extensions (nearest)
                const pylon = unit.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_EXTENSION
                            &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                if (pylon){
                    if (unit.transfer(pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(pylon);
                }


                //UNLOAD: spawners (random)
                else{
                    const local_nexi = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_SPAWN
                                &&
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });

                    if (local_nexi.length)
                        if (unit.transfer(local_nexi[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(local_nexi[0]);
                }
            }
            

            //FSM execution (FETCHING): 
            else{
                //FETCH: vault
                let canFetch_storage = false;

                if (unit.room.storage)
                    if (unit.room.storage.store.energy > 0)
                        canFetch_storage = true;

                if (canFetch_storage){
                    if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }


                //FETCH: containers (fullest; fixation)
                else{
                    const canisters = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_CONTAINER
                                &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > lowbound;
                        }
                    });

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
                        //otherwise, only switch fixation if the previous one crosses beneath the (reduced) "ignore" criteria
                        else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < lowbound)
                            unit.memory.fixation = fullest_canister.id;

                        //finally, fetch from the fixated target
                        if (unit.withdraw(Game.getObjectById(unit.memory.fixation), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(Game.getObjectById(unit.memory.fixation));
                    }


                    //FETCH: tombstones (fullest)
                    else{
                        const tombs = unit.room.find(FIND_TOMBSTONES, {
                            filter: RoomObject => {
                                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });
                        
                        if (tombs.length){
                            let richest_tomb = tombs[0];

                            //determine the fullest tomb
                            for (let i=0; i<tombs.length; i++){
                                if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY) > richest_tomb.store.getUsedCapacity(RESOURCE_ENERGY))
                                    richest_tomb = tombs[i];
                            }
                            
                            //approach and withdraw
                            if (unit.withdraw(richest_tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                unit.moveTo(richest_tomb);
                        }


                        //TODO: pickups


                        //FETCH: pickups (fullest)
                        else{
                            const scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                                filter: resource => {
                                    return resource.amount > lowbound
                                        &&
                                        resource.resourceType == RESOURCE_ENERGY;
                                }
                            });

                            if (scraps.length){
                                let chosen_scrap = scraps[0];
            
                                //determine the most plentiful pickup
                                for (let i=1; i<scraps.length; i++){
                                    if (scraps[i].energy > chosen_scrap.energy)
                                        chosen_scrap = scraps[i];
                                }
                                
                                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE)
                                    unit.moveTo(chosen_scrap);
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
                }
            }
        }


        //built-in economic killswitch
        else{
            if (!Game.getObjectById(unit.memory.suicide_nexus_ID)){
                const sui_nexi = unit.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_SPAWN;
                    }
                });

                unit.memory.suicide_nexus_ID = sui_nexi[0].id;
            }

            if (Game.getObjectById(unit.memory.suicide_nexus_ID).recycleCreep(unit) == ERR_NOT_IN_RANGE)
                unit.moveTo(Game.getObjectById(unit.memory.suicide_nexus_ID));
        }
    }
};