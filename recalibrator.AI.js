//RECALIBRATOR: reserves a foreign controller
//yellow trail ("traveller")

module.exports = {
    run: function(unit, standby_flag, flee_point, home_index){
        
        //no enemies present
        if (Memory.evac_timer[home_index] == 0){
            //trek to the standby point once
            if (!unit.memory.in_place)
                unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ffff00'}});
            if (unit.pos.isEqualTo(standby_flag.pos))
                unit.memory.in_place = true;
                
            //actions while outbound
            if (unit.memory.in_place){
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
                        unit.memory.in_place = false;
                        console.log('------------------------------');
                        
                        //case: enemy player(s)
                        if (p_threats > 0){
                            console.log('>>>EVACUATING SECTOR #' + home_index + '...' + p_name + ' INBOUND<<<');
                            Memory.evac_timer[home_index] = 500;
                        }
                        //case: 1 invader
                        else if (i_threats == 1){
                            console.log('>>>EVACUATING SECTOR #' + home_index + '...INVADER INBOUND<<<');
                            Memory.evac_timer[home_index] = 1500;
                            Memory.viable_prey[home_index] = true;
                        }
                        //case: multiple invaders
                        else if (i_threats > 1){
                            console.log('>>>EVACUATING SECTOR #' + home_index + '...INVADER HORDE INBOUND<<<');
                            Memory.evac_timer[home_index] = 1500;
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
                if (invadercores.length && Memory.core_sighting[home_index] == false){
                    Memory.core_sighting[home_index] = true;
                    threat = true;
                    //Game.notify('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<',0);
                    console.log('------------------------------');
                    console.log('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<');
                    console.log('------------------------------');
                }
                //reserve the controller
                if (i_threats == 0 && p_threats == 0){
                    if (unit.reserveController(unit.room.controller) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#ffff00'}});
                }
            }
        }
        //enemies detected
        else unit.moveTo(Game.getObjectById(flee_point), {visualizePathStyle: {stroke: '#ffff00'}});
    }
};