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
                            console.log('recalibrator.AI:: ------------------------------');
                    
                            //enemy player(s) detected: evacuate and call a blood hunter
                            if (p_threats > 0){
                                //Game.notify('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<',0);

                                console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                                console.log('recalibrator.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                            }
                            //lone invader detected: evacuate and call blood hunter
                            else if (i_threats == 1){
                                //Game.notify('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<',0);

                                console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                                console.log('recalibrator.AI:: >>>SIGNALLING BLOOD HUNTER<<<');

                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                Memory.viable_prey[home_index] = true; //triggers blood hunter spawn
                            }
                            //multiple invaders detected: evacuate and suicide
                            else if (i_threats > 1){
                                //Game.notify('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<',0);

                                console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                                console.log('recalibrator.AI:: >>>RECYCLING EVACUATED UNITS<<<');

                                Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                unit.memory.killswitch = true; //reasoning: unit will likely not outlive the threat
                            }
                        
                            console.log('recalibrator.AI:: ------------------------------');
                        }
                    }


                    //STAGE 2 END: proceed if no threats detected
                    else{
                        let invadercores = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                            filter: structure => {
                                return structure.structureType == STRUCTURE_INVADER_CORE;
                            }
                        });

                        //STAGE 3A. watch for hostile cores
                        if (invadercores.length && Memory.enforcer_MAX[home_index] < 0){
                            //Game.notify('recalibrator.AI:: >>>SIGNALLING ENFORCER TO SECTOR #' + home_index + '...CORE SIGHTED<<<',0);

                            console.log('recalibrator.AI:: ------------------------------');
                            console.log('recalibrator.AI:: >>>SIGNALLING ENFORCER TO SECTOR #' + home_index + '...CORE SIGHTED<<<');
                            console.log('recalibrator.AI:: ------------------------------');

                            Memory.enforcer_MAX[home_index] = 1;
                        }


                        let reservation_lost = false;

                        //STAGE 3B START: check room reservation status, and respond appropriately
                        try{
                            //controlled by hostiles: cut off remote worker spawns, call in a purifier, and self-killswitch
                            if (unit.room.controller.reservation.username != 'Hellbuck'){
                                //Game.notify('recalibrator.AI:: >>>SIGNALLING PURIFIER TO SECTOR #' + home_index + '...CONTROLLER HAS FALLEN TO HOSTILE FORCES<<<',0);

                                console.log('recalibrator.AI:: ------------------------------');
                                console.log('recalibrator.AI:: >>>SIGNALLING PURIFIER TO SECTOR #' + home_index + '...CONTROLLER HAS FALLEN TO HOSTILE FORCES<<<');
                                console.log('recalibrator.AI:: ------------------------------');

                                reservation_lost = true;

                                Memory.recalibrator_MAX[home_index] =       -1;
                                Memory.orbitalAssimilator_MAX[home_index] = -1;
                                Memory.orbitalDrone_MAX[home_index] =       -1;

                                Memory.purifier_MAX[home_index] =           1;
                            
                                unit.memory.killswitch = true; //reasoning: unit will likely not survive long enough to see the controller's purification
                            }
                        }
                        catch{
                            //this happens if the room is controlled by nobody
                        }


                        //STAGE 3B END: proceed if room reservation is intact
                        if (!reservation_lost){
                            //STAGE 4. reserve the controller
                            if (unit.reserveController(unit.room.controller) == ERR_NOT_IN_RANGE)
                                unit.moveTo(unit.room.controller);
                        }
                    }
                }
            }


            //evacuation alarm raised
            else{
                unit.moveTo(Game.getObjectById(flee_point));
                unit.memory.rallied = false;

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