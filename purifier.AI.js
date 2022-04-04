//PURIFIER: cleanses enemy controller reservation in remote mining rooms
//cyan trail ("support")

module.exports = {
    run: function(unit, nexus_id, pollution, flee_point, home_index){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //proceed if the evacuation alarm is not raised
            if (Memory.evac_timer[home_index] == 0){
                //STAGE 1 START: simple cross-room navigation
                if (unit.memory.home == unit.room.name)
                    unit.moveTo(pollution);


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
                                    p_name = foreigner[i].owner.username;
                                    break;
                                }
                            }
                        }
                    
                        //respond to player/invader threats
                        if (i_threats > 0 || p_threats > 0){
                            Memory.lastSeenEnemy_time[home_index] = Game.time;
                            console.log('purifier.AI:: ------------------------------');
                    
                            //enemy player(s) detected: evacuate and call a blood hunter
                            if (p_threats > 0){
                                //Game.notify('purifier.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<',0);

                                console.log('purifier.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                                console.log('purifier.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                Memory.lastSeenEnemy_name[home_index] = p_name;
                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                            }
                            //lone invader detected: evacuate and call blood hunter
                            else if (i_threats == 1){
                                //Game.notify('purifier.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<',0);

                                console.log('purifier.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                                console.log('purifier.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                Memory.lastSeenEnemy_name[home_index] = 'INVADER';
                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                            }
                            //multiple invaders detected: evacuate and suicide
                            else if (i_threats > 1){
                                //Game.notify('purifier.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<',0);

                                console.log('purifier.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                                console.log('purifier.AI:: >>>RECYCLING EVACUATED UNITS<<<');

                                Memory.lastSeenEnemy_name[home_index] = 'INVADER';
                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                unit.memory.killswitch = true; //reasoning: unit will likely not outlive the threat
                            }
                        
                            console.log('purifier.AI:: ------------------------------');
                        }
                    }


                    //STAGE 2 END: proceed if no threats detected
                    else{
                        //STAGE 3: purify the controller
                        if (unit.room.controller.reservation != undefined){
                            if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                                unit.moveTo(unit.room.controller);
                        }

                        //re-enable remote workers only when the controller is purified, and there is no nearby invader core attempting tug-of-war with this unit
                        else if (Memory.enforcer_MAX[home_index] < 0){
                            //Game.notify('purifier.AI:: >>>SECTOR #' + home_index + ' RESTORED: CONTROLLER PURIFIED OF HOSTILE INFLUENCE<<<',0);

                            console.log('purifier.AI:: ------------------------------');
                            console.log('purifier.AI:: >>>SECTOR #' + home_index + ' RESTORED: CONTROLLER PURIFIED OF HOSTILE INFLUENCE<<<');
                            console.log('purifier.AI:: ------------------------------');

                            if (Memory.recalibrator_MAX[home_index] < 0)        Memory.recalibrator_MAX[home_index] =       1;
                            if (Memory.orbitalAssimilator_MAX[home_index] < 0)  Memory.orbitalAssimilator_MAX[home_index] = 1;
                            if (Memory.orbitalDrone_MAX[home_index] < 0)        Memory.orbitalDrone_MAX[home_index] =       1;

                            //self-killswitch and return to dormant state
                            Memory.purifier_MAX[home_index] = -1;
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