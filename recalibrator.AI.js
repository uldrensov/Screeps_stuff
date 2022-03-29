//RECALIBRATOR: reserves a foreign controller
//yellow trail ("traveller")

module.exports = {
    run: function(unit, nexus_id, standby_flag, flee_point, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //no enemies present
            if (Memory.evac_timer[home_index] == 0){
                //trek to the standby point once
                if (!unit.memory.in_place)
                    unit.moveTo(standby_flag);
                if (unit.pos.isEqualTo(standby_flag.pos))
                    unit.memory.in_place = true;
                
                //actions while outbound
                if (unit.memory.in_place){
                    //if the reservation is lost, cut off remote worker spawns and self-killswitch
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
                                console.log('recalibrator.AI:: ------------------------------');
                        
                                //case: enemy player(s)
                                if (p_threats > 0){
                                    console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                                    Memory.evac_timer[home_index] = 500;
                                }
                                //case: 1 invader
                                else if (i_threats == 1){
                                    console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                                    Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                    Memory.viable_prey[home_index] = true;
                                }
                                //case: multiple invaders
                                else if (i_threats > 1){
                                    console.log('recalibrator.AI:: >>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                                    Memory.evac_timer[home_index] = CREEP_LIFE_TIME;
                                    unit.memory.killswitch = true;
                                }
                            
                                console.log('recalibrator.AI:: ------------------------------');
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
                            //Game.notify('recalibrator.AI:: >>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<',0);
                            console.log('recalibrator.AI:: ------------------------------');
                            console.log('recalibrator.AI:: >>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<');
                            console.log('recalibrator.AI:: ------------------------------');
                        }
                
                        //reserve the controller
                        if (i_threats == 0 && p_threats == 0){
                            if (unit.reserveController(unit.room.controller) == ERR_NOT_IN_RANGE)
                                unit.moveTo(unit.room.controller);
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