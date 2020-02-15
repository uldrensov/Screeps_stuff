//RECALIBRATOR: reserves or claims a foreign controller
//yellow trail

module.exports = {
    run: function(unit,ctrl_id,standby_flag,flee_point,home_index){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
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
                //watch for invaders
                var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                if (enemy.length){
                    Memory.evac_timer[home_index] = 1500;
                    console.log('>>>EVACUATING SECTOR ' + home_index + '<<<');
                }
                //reserve/attack/claim the controller
                else{
                    if (unit.memory.annex){
                        if (unit.claimController(Game.getObjectById(ctrl_id)) == ERR_NOT_IN_RANGE){
                            unit.moveTo(Game.getObjectById(ctrl_id), {visualizePathStyle: {stroke: '#ffff00'}});
                        }
                    }
                    else{
                        if (unit.reserveController(Game.getObjectById(ctrl_id)) == ERR_NOT_IN_RANGE){
                        unit.moveTo(Game.getObjectById(ctrl_id), {visualizePathStyle: {stroke: '#ffff00'}});
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