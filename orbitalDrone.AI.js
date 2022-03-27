//ORBITAL DRONE: relays energy from ORBITAL ASSIMILATOR to a container/link/vault
//yellow trail ("traveller")

module.exports = {
    run: function(unit, nexus_id, canister_id, remote_flag, ignore_lim, flee_point, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        if (unit.memory.dropoff_id == undefined){
            if (Game.getObjectById(nexus_id).room.storage != undefined)
                unit.memory.dropoff_id = Game.getObjectById(nexus_id).room.storage.id;
            else return 'UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT';
        }
        
        
        if (!unit.memory.killswitch){
            //no enemies present
            if (Memory.evac_timer[home_index] == 0){
                //INPUTS: container
                var canister = Game.getObjectById(canister_id);
                
                //OUTPUTS: container/link/vault
                var dropoff = Game.getObjectById(unit.memory.dropoff_id);
            
            
                //2-state fetch/unload FSM...
                //if carry amt reaches full while fetching, switch to unloading
                if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                    unit.memory.fetching = false;
                    unit.memory.in_place = false;
                }
                //if carry amt depletes while unloading, switch to fetching
                if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                    unit.memory.fetching = true;

            
                //behaviour execution...
                if (!unit.memory.fetching){
                    //navigate to homeroom
                    if (unit.room.name != unit.memory.home){
                        unit.moveTo(dropoff);
                    }
                    else{
                        //UNLOAD: vault (if container/link is designated, but full)
                        if (dropoff.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && unit.room.storage != undefined)
                            unit.moveTo(unit.room.storage);
                        //UNLOAD: container/link/vault
                        else if (unit.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(dropoff);
                    }
                }
                else{
                    //rally at flag first
                    if (!unit.memory.in_place){
                        if (!unit.pos.isEqualTo(remote_flag.pos))
                            unit.moveTo(remote_flag);
                        else unit.memory.in_place = true;
                    }
                    //if the reservation is lost, cut off remote worker spawns and self-killswitch
                    else{
                        var take_branch = false;
                        try{
                            if (unit.room.controller.reservation.username == 'Invader'){
                                Memory.recalibrator_MAX[home_index] = -1;
                                Memory.orbitalAssimilator_MAX[home_index] = -1;
                                Memory.orbitalDrone_MAX[home_index] = -1;
                                unit.memory.killswitch = true;
                            }
                            else take_branch = true;
                        }
                        catch{
                            take_branch = true;
                        }
                    }
                    if (take_branch){
                        //watch for invaders/intruders
                        var i_threats = 0;
                        var p_threats = 0;
                        var p_name = '[NULL]';
                        var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                        if (enemy.length){
                            //assess threat level
                            for (let i=0; i<enemy.length; i++){
                                //if invader, automatically assume threat (don't check body parts)
                                if (enemy[i].owner.username == 'Invader'){
                                    i_threats++;
                                    continue;
                                }
                                //if player, inspect body parts and verify threat level
                                for (let j=0; j<enemy[i].body.length; j++){
                                    if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK){
                                        p_threats++;
                                        p_name = enemy.owner.username;
                                        break;
                                    }
                                }
                            }
                        
                            //decide how to handle threats
                            if (i_threats > 0 || p_threats > 0){
                                console.log('------------------------------');
                            
                                //case: enemy player(s)
                                if (p_threats > 0){
                                    console.log('>>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                                    Memory.evac_timer[home_index] = 500;
                                }
                                //case: 1 invader
                                else if (i_threats == 1){
                                    console.log('>>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                                    Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                    Memory.viable_prey[home_index] = true;
                                }
                                //case: multiple invaders
                                else if (i_threats > 1){
                                    console.log('>>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                                    Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                    unit.memory.killswitch = true;
                                }
                            
                                console.log('------------------------------');
                            }
                        }
                        //watch for hostile cores
                        var invadercores = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_INVADER_CORE;
                            }
                        });
                        if (invadercores.length && Memory.enforcer_MAX[home_index] < 0){
                            Memory.enforcer_MAX[home_index] = 1;
                            //Game.notify('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<',0);
                            console.log('------------------------------');
                            console.log('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<');
                            console.log('------------------------------');
                        }
                    
                        //fetch from inputs
                        if (i_threats == 0 && p_threats == 0){
                            //INPUTS: pickups, tombstones (non-empty)
                            var scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                                filter: resource => {
                                    return resource.resourceType == RESOURCE_ENERGY
                                        &&
                                        resource.amount > ignore_lim;
                                }
                            });
                            var tombs = unit.room.find(FIND_TOMBSTONES, {
                                filter: RoomObject => {
                                    return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                                }
                            });
                
                
                            //fetch: pickups<energy>
                            if (scraps.length){
                                if (unit.pickup(scraps[0]) == ERR_NOT_IN_RANGE)
                                    unit.moveTo(scraps[0]);
                            }
                            //fetch: tombstones<energy>
                            else if (tombs.length){
                                if (unit.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                    unit.moveTo(tombs[0]);
                            }
                            //fetch: container
                            else if (unit.withdraw(canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                                unit.moveTo(canister);
                        }
                    }
                }
            }
            //enemies detected
            else{
                unit.moveTo(Game.getObjectById(flee_point));
                unit.memory.in_place = false;
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};