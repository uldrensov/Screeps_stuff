//RECALIBRATOR: reserves or claims a foreign controller
//yellow trail ("traveller")

module.exports = {
    run: function(unit,standby_flag,flee_point,home_index){
        
        if (unit.memory.annex == undefined){
            unit.memory.annex = false;
        }
        
        
        //no enemies present
        if (Memory.evac_timer[home_index] == 0){
            //trek to the standby point once
            if (!unit.memory.in_place){
                unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ffff00'}});
            }
            if (unit.pos.isEqualTo(standby_flag.pos)){
                unit.memory.in_place = true;
            }
            
            //actions while outbound
            if (unit.memory.in_place){
                //watch for invaders/intruders
                var threat = false;
                var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                if (enemy.length){
                    //assess threat level
assess:             for (let i=0; i<enemy.length; i++){
                        for (let j=0; j<enemy[i].body.length; j++){
                            if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK || enemy[i].body[j]['type'] == WORK){
                                Memory.evac_timer[home_index] = 1500;
                                unit.memory.in_place = false;
                                threat = true;
                                console.log('------------------------------');
                                console.log('>>>EVACUATING SECTOR #' + home_index + '...HOSTILE INBOUND<<<');
                                console.log('------------------------------');
                                break assess;
                            }
                        }
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
                    Game.notify('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<',0);
                    console.log('------------------------------');
                    console.log('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<');
                    console.log('------------------------------');
                }
                //reserve/claim the controller
                if (!threat){
                    if (unit.memory.annex){
                        if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE){
                            unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#ffff00'}});
                        }
                    }
                    else{
                        if (unit.reserveController(unit.room.controller) == ERR_NOT_IN_RANGE){
                        unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#ffff00'}});
                        }
                    }
                }
            }
        }
        //enemies detected
        else{
            unit.moveTo(Game.getObjectById(flee_point), {visualizePathStyle: {stroke: '#ffff00'}});
        }
    }
};