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
                var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                var threat = false;
                if (enemy.length){
                    //assess threat level
assess:             for (let i=0; i<enemy.length; i++){
                        for (let j=0; j<enemy[i].body.length; j++){
                            if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK){
                                Memory.evac_timer[home_index] = 1500;
                                console.log('------------------------------');
                                console.log('>>>EVACUATING SECTOR ' + home_index + '<<<');
                                console.log('------------------------------');
                                unit.memory.in_place = false;
                                threat = true;
                                break assess;
                            }
                        }
                    }
                }
                //reserve/claim the controller
                if (!threat){
                    if (unit.memory.annex){
                        if (unit.claimController(unit.room.controller) == ERR_NOT_IN_RANGE){
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