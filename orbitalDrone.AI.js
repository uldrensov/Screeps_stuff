//ORBITAL DRONE: relays energy from ORBITAL ASSIMILATOR to a vault
//yellow trail ("traveller")

module.exports = {
    run: function(unit, nexus_id, standby_flag, ignore_lim, flee_point, std_interval){
        
        if (!Game.getObjectById(unit.memory.vault_ID)){
            if (Game.getObjectById(nexus_id).room.storage)
                unit.memory.vault_ID = Game.getObjectById(nexus_id).room.storage.id;
            else{
                console.log('orbitalDroneAI:: UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT IN ROOM #' + unit.memory.home_index);
                return;
            }
        }
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //proceed if the evacuation alarm is not raised
            if (Memory.evac_timer[unit.memory.home_index] == 0){
                const vault = Game.getObjectById(unit.memory.vault_ID);
            

            
                //FETCH / UNLOAD FSM...
                //if carry amt reaches full while FETCHING, switch to UNLOADING
                if (unit.memory.fetching && unit.store.getFreeCapacity() == 0){
                    unit.memory.fetching = false;
                    unit.memory.rallied = false;
                }
                //if carry amt depletes while UNLOADING, switch to FETCHING
                if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
                    unit.memory.fetching = true;


                    
                //FSM execution (UNLOADING):
                if (!unit.memory.fetching){
                    //navigate to homeroom
                    if (unit.room.name != Game.getObjectById(nexus_id).room.name)
                        unit.moveTo(vault);
                        
                    //UNLOAD: vault
                    else{
                        let unload_result = unit.transfer(vault, RESOURCE_ENERGY);

                        if (unload_result == ERR_NOT_IN_RANGE)
                            unit.moveTo(vault);

                        //record vaultbound energy unloads to global memory
                        else if (unload_result == OK){
                            if (!Memory.energyGainsToday[unit.memory.home_index])
                                Memory.energyGainsToday[unit.memory.home_index] = [];

                            if (!Memory.energyGainsToday[unit.memory.home_index][1])
                                Memory.energyGainsToday[unit.memory.home_index][1] = 0;

                            Memory.energyGainsToday[unit.memory.home_index][1] +=
                                Math.min(unit.store[RESOURCE_ENERGY], vault.store.getFreeCapacity());
                        }
                    }
                }


                //FSM execution (FETCHING):
                else{
                    //STAGE 1 START: rally to the flag location first
                    if (!unit.memory.rallied)                   unit.moveTo(standby_flag);
                    if (unit.pos.isEqualTo(standby_flag.pos))   unit.memory.rallied = true;
                

                    //STAGE 1 END: proceed when rally is complete
                    if (unit.memory.rallied){
                        let i_threats = 0;
                        let p_threats = 0;
                        let p_name = '[NULL]';

                        const foreigner = unit.room.find(FIND_HOSTILE_CREEPS);

                        //STAGE 2 START: check any foreigners present in the room, and respond appropriately
                        if (foreigner.length){
                            //determine if there are threats among them
                            for (let i=0; i<foreigner.length; i++){
                                //if invader, automatically assume threat (don't check body parts)
                                if (foreigner[i].owner.username == 'Invader'){
                                    i_threats++;
                                    continue;
                                }
                                //if player, inspect body parts to confirm threat
                                for (let j=0; j<foreigner[i].body.length; j++){
                                    if (foreigner[i].body[j]['type'] == ATTACK || foreigner[i].body[j]['type'] == RANGED_ATTACK ||
                                        foreigner[i].body[j]['type'] == CLAIM){

                                        p_threats++;
                                        p_name = foreigner[i].owner.username;
                                        break;
                                    }
                                }
                            }
                    
                            //respond to player/invader threats
                            if (i_threats > 0 || p_threats > 0){
                                Memory.lastSeenEnemy_time[unit.memory.home_index] = Game.time;
                    
                                //enemy player(s) detected: evacuate and call a blood hunter
                                if (p_threats > 0){
                                    //Game.notify(unit.name + ':: >>>>>> EVACUATING SECTOR #' + unit.memory.home_index + ' ... ' + p_name + ' INBOUND <<<<<<');

                                    console.log(unit.name + ':: >>>>>> EVACUATING SECTOR #' + unit.memory.home_index + ' ... ' + p_name + ' INBOUND <<<<<<');
                                    console.log(unit.name + ':: SIGNALLING BLOOD HUNTER');

                                    Memory.lastSeenEnemy_name[unit.memory.home_index] = p_name;
                                    Memory.evac_timer[unit.memory.home_index] = CREEP_LIFE_TIME;
                                    Memory.viable_prey[unit.memory.home_index] = true; //triggers blood hunter spawn
                                }
                                //lone invader detected: evacuate and call blood hunter
                                else if (i_threats == 1){
                                    console.log(unit.name + ':: EVACUATING SECTOR #' + unit.memory.home_index + '...INVADER INBOUND');
                                    console.log(unit.name + ':: SIGNALLING BLOOD HUNTER');

                                    Memory.lastSeenEnemy_name[unit.memory.home_index] = 'INVADER';
                                    Memory.evac_timer[unit.memory.home_index] = CREEP_LIFE_TIME;
                                    Memory.viable_prey[unit.memory.home_index] = true; //triggers blood hunter spawn
                                }
                                //multiple invaders detected: evacuate and suicide
                                else if (i_threats > 1){
                                    console.log(unit.name + ':: >>>>>> EVACUATING SECTOR #' + unit.memory.home_index + '...INVADER HORDE INBOUND <<<<<<');
                                    console.log(unit.name + ':: RECYCLING EVACUATED UNITS');

                                    Memory.lastSeenEnemy_name[unit.memory.home_index] = 'INVADER';
                                    Memory.evac_timer[unit.memory.home_index] = CREEP_LIFE_TIME;
                                    unit.memory.killswitch = true; //reasoning: unit will likely not outlive the threat
                                }
                            }
                        }


                        //STAGE 2 END: proceed if no threats detected
                        else{
                            const invadercores = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                                filter: structure => {
                                    return structure.structureType == STRUCTURE_INVADER_CORE;
                                }
                            });

                            //STAGE 3A: watch for hostile cores
                            if (invadercores.length && Memory.enforcer_MAX[unit.memory.home_index] < 0){
                                console.log(unit.name + ':: >>>>>> SIGNALLING ENFORCER TO SECTOR #' + unit.memory.home_index + '...CORE SIGHTED <<<<<<');

                                Memory.lastSeenCore_time[unit.memory.home_index] = Game.time;
                                Memory.enforcer_MAX[unit.memory.home_index] = 1;
                            }


                            let reservation_lost = false;

                            //STAGE 3B START: check room reservation status, and respond appropriately
                            try{
                                //controlled by hostiles: cut off remote worker spawns, call in a purifier, and self-killswitch
                                if (unit.room.controller.reservation.username != unit.owner.username){
                                    console.log(unit.name + ':: >>>>>> SIGNALLING PURIFIER TO SECTOR #' + unit.memory.home_index + '...CONTROLLER HAS FALLEN TO HOSTILE FORCES <<<<<<');

                                    Memory.lastReserveLoss_time[unit.memory.home_index] =   Game.time;
                                    reservation_lost =                                      true;

                                    Memory.recalibrator_MAX[unit.memory.home_index] =       -1;
                                    Memory.orbitalAssimilator_MAX[unit.memory.home_index] = -1;
                                    Memory.orbitalDrone_MAX[unit.memory.home_index] =       -1;

                                    Memory.purifier_MAX[unit.memory.home_index] =           1;
                            
                                    unit.memory.killswitch =                                true; //reasoning: unit will likely not survive long enough to see the controller's purification
                                }
                            }
                            catch{
                                //this happens if the room is controlled by nobody
                            }


                            //STAGE 3B END: proceed if room reservation is intact
                            if (!reservation_lost){
                                //STAGE 4: fetch from inputs
                                const scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                                    filter: resource => {
                                        return resource.resourceType == RESOURCE_ENERGY
                                            &&
                                            resource.amount > ignore_lim;
                                    }
                                });
                
                                //FETCH: pickups (random)
                                if (scraps.length){
                                    if (unit.pickup(scraps[0]) == ERR_NOT_IN_RANGE)
                                        unit.moveTo(scraps[0]);
                                }


                                //FETCH: tombstones (random)
                                else{
                                    const tombs = unit.room.find(FIND_TOMBSTONES, {
                                        filter: RoomObject => {
                                            return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                                        }
                                    });

                                    if (tombs.length){
                                        if (unit.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                            unit.moveTo(tombs[0]);
                                    }


                                    //FETCH: container
                                    else{
                                        if (!Game.getObjectById(unit.memory.canister_ID) && (Game.time % std_interval == 0)){
                                            const canisters = unit.room.find(FIND_STRUCTURES, {
                                                filter: structure => {
                                                    return structure.structureType == STRUCTURE_CONTAINER;
                                                }
                                            });
                                
                                            for (let i=0; i<canisters.length; i++){
                                                if (canisters[i].my){
                                                    unit.memory.canister_ID = canisters[i].id;
                                                    break;
                                                }
                                            }
                                        }

                                        if (Game.getObjectById(unit.memory.canister_ID))
                                            if (unit.withdraw(Game.getObjectById(unit.memory.canister_ID), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                                unit.moveTo(Game.getObjectById(unit.memory.canister_ID));
                                    }
                                }    
                            }
                        }
                    } 
                }
            }


            //evacuation alarm raised
            else{
                unit.moveTo(Game.getObjectById(flee_point));
                unit.memory.rallied = false;
            }
        }


        //built-in economic killswitch
        else if (Game.getObjectById(nexus_id).recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(Game.getObjectById(nexus_id));
    }
};