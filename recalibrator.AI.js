//RECALIBRATOR: reserves or claims a foreign controller
//violet trail

module.exports = {
    run: function(unit,ctrl_id,standby_flag,annex){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
        //trek to the standby point once
        if (!unit.memory.in_place){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
        if (unit.pos.isEqualTo(standby_flag.pos)){
            unit.memory.in_place = true;
        }
        
        
        //reserve/claim the controller
        if (unit.memory.in_place){
            if (annex){
                if (unit.claimController(Game.getObjectById(ctrl_id)) == ERR_NOT_IN_RANGE){
                    unit.moveTo(Game.getObjectById(ctrl_id), {visualizePathStyle: {stroke: '#ff00ff'}});
                }
            }
            else{
                if (unit.reserveController(Game.getObjectById(ctrl_id)) == ERR_NOT_IN_RANGE){
                    unit.moveTo(Game.getObjectById(ctrl_id), {visualizePathStyle: {stroke: '#ff00ff'}});
                }
            }
        }
    }
};