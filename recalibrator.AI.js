//RECALIBRATOR: reserves or claims a foreign controller
//yellow trail

module.exports = {
    run: function(unit,ctrl_id,standby_flag){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        if (unit.memory.annex == undefined){
            unit.memory.annex = false;
        }
        
        
        //trek to the standby point once
        if (!unit.memory.in_place){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ffff00'}});
        }
        if (unit.pos.isEqualTo(standby_flag.pos)){
            unit.memory.in_place = true;
        }
        
        
        //reserve/attack/claim the controller
        if (unit.memory.in_place){
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
};