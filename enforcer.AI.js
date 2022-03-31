//ENFORCER: cross-room warrior designed to destroy invader cores in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, incident, flee_point, home_index){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //proceed if the evacuation alarm is not raised
            if (Memory.evac_timer[home_index] == 0){
                //STAGE 1 START: simple cross-room navigation
                if (unit.memory.home == unit.room.name)
                    unit.moveTo(incident);


                //STAGE 1 END: proceed when pathing completes
                else{
                    let i_threats = 0;
                    let p_threats = 0;
                    let p_name = '[NULL]';

                    let foreigner = unit.room.find(FIND_HOSTILE_CREEPS);

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
                                    p_name = foreigner.owner.username;
                                    break;
                                }
                            }
                        }
                    
                        //respond to player/invader threats
                        if (i_threats > 0 || p_threats > 0){
                            console.log('enforcer.AI:: ------------------------------');
                    
                            //enemy player(s) detected: evacuate and call a blood hunter
                            if (p_threats > 0){
                                //Game.notify('enforcer.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<',0);

                                console.log('enforcer.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                                console.log('enforcer.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                            }
                            //lone invader detected: evacuate and call blood hunter
                            else if (i_threats == 1){
                                //Game.notify('enforcer.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<',0);

                                console.log('enforcer.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                                console.log('enforcer.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                            }
                            //multiple invaders detected: evacuate and suicide
                            else if (i_threats > 1){
                                //Game.notify('enforcer.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<',0);

                                console.log('enforcer.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                                console.log('enforcer.AI:: >>>RECYCLING EVACUATED UNITS<<<');

                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                unit.memory.killswitch = true; //reasoning: unit will likely not outlive the threat
                            }
                        
                            console.log('enforcer.AI:: ------------------------------');
                        }
                    }


                    //STAGE 2 END: proceed if no threats detected
                    else{
                        let heretic = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_INVADER_CORE;
                            }
                        });
            
                        //STAGE 3: destroy the core
                        if (heretic.length){
                            if (unit.attack(heretic[0]) == ERR_NOT_IN_RANGE)
                                unit.moveTo(heretic[0]);
                        }

                        //when core is eliminated...
                        else{
                            //Game.notify('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);

                            console.log('enforcer.AI:: ------------------------------');
                            console.log('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                            console.log('enforcer.AI:: ------------------------------');

                            //self-killswitch and return to dormant state
                            Memory.enforcer_MAX[home_index] = -1;
                            unit.memory.killswitch = true;
                        }
                    }
                }
            }


            //evacuation alarm raised
            else{
                unit.moveTo(Game.getObjectById(flee_point));

                //if the blood hunter falls in battle, self-killswitch instead of waiting around pointlessly
                if (Memory.bloodhunter_casualty[home_index] == true)
                    unit.memory.killswitch = true;
            }
        }
        

        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};