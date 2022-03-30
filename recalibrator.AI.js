//RECALIBRATOR: reserves a foreign controller
//yellow trail ("traveller")

module.exports = {
    run: function(unit, nexus_id, standby_flag, flee_point, home_index){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //proceed if the evacuation alarm is not raised
            if (Memory.evac_timer[home_index] == 0){
                //STAGE 1 START: rally to the flag location first
                if (!unit.memory.rallied)                   unit.moveTo(standby_flag);
                if (unit.pos.isEqualTo(standby_flag.pos))   unit.memory.rallied = true;
                

                //STAGE 1 END: proceed when rally is complete
                if (unit.memory.rallied){
                    let reservation_lost = true;

                    //STAGE 2 START: check room reservation status, and respond appropriately
                    try{
                        //controlled by invader: cut off remote worker spawns and self-killswitch
                        if (unit.room.controller.reservation.username == 'Invader'){ //this can throw an error if the room is neutral
                            Memory.recalibrator_MAX[home_index] =       -1;
                            Memory.orbitalAssimilator_MAX[home_index] = -1;
                            Memory.orbitalDrone_MAX[home_index] =       -1;
                            
                            unit.memory.killswitch = true; //reasoning: unit will likely not survive long enough to see the controller's liberation
                        }
                        //controlled by player: all clear
                        else reservation_lost = false;

                        //TODO: what if the reservation is lost to another player?
                    }
                    catch{
                        //controlled by nobody: all clear
                        reservation_lost = false;
                    }


                    //STAGE 2 END: proceed if room reservation is intact
                    if (!reservation_lost){
                        let i_threats = 0;
                        let p_threats = 0;
                        let p_name = '[NULL]';

                        let foreigner = unit.room.find(FIND_HOSTILE_CREEPS);

                        //STAGE 3 START: check any foreigners present in the room, and respond appropriately
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
                                    if (foreigner[i].body[j]['type'] == ATTACK || foreigner[i].body[j]['type'] == RANGED_ATTACK){
                                        p_threats++;
                                        p_name = foreigner.owner.username;
                                        break;
                                    }
                                }
                            }
                        
                            //respond to player/invader threats
                            if (i_threats > 0 || p_threats > 0){
                                console.log('recalibrator.AI:: ------------------------------');
                        
                                //enemy player(s) detected: evacuate for a short time
                                if (p_threats > 0){
                                    console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                                    Memory.evac_timer[home_index] = 500; //in hopes that the player will leave soon
                                }
                                //1 invader detected: evacuate and call blood hunter
                                else if (i_threats == 1){
                                    console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                                    console.log('recalibrator.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                    Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                    Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                                }
                                //multiple invaders detected: evacuate and suicide
                                else if (i_threats > 1){
                                    console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                                    console.log('recalibrator.AI:: >>>RECYCLING EVACUATED UNITS<<<');

                                    Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                    unit.memory.killswitch = true; //reasoning: unit will likely not outlive the threat
                                }
                            
                                console.log('recalibrator.AI:: ------------------------------');
                            }
                        }


                        //STAGE 3 END: proceed if no threats detected
                        let invadercores = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_INVADER_CORE;
                            }
                        });

                        //STAGE 4. watch for hostile cores
                        if (invadercores.length && Memory.enforcer_MAX[home_index] < 0){
                            //Game.notify('recalibrator.AI:: >>>SIGNALLING ENFORCER TO SECTOR #' + home_index + '...CORE SIGHTED<<<',0);

                            console.log('recalibrator.AI:: ------------------------------');
                            console.log('recalibrator.AI:: >>>SIGNALLING ENFORCER TO SECTOR #' + home_index + '...CORE SIGHTED<<<');
                            console.log('recalibrator.AI:: ------------------------------');

                            Memory.enforcer_MAX[home_index] = 1;
                        }

                
                        //STAGE 5. finally, reserve the controller
                        if (unit.reserveController(unit.room.controller) == ERR_NOT_IN_RANGE)
                            unit.moveTo(unit.room.controller);
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
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};