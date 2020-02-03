//RECALIBRATOR: claims or reserves a foreign controller
//violet trail

module.exports = {
    run: function(unit,nexus_id,ctrl_id,exitflag){
        
        //move to a pre-placed flag to leave the homeroom
        if (unit.room == Game.getObjectById(nexus_id).room){
            if (!unit.pos.isEqualTo(exitflag.pos)){
                unit.moveTo(exitflag, {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
        //claim the controller in the adjacent room
        else if (unit.claimController(Game.getObjectById(ctrl_id)) == ERR_NOT_IN_RANGE){
            unit.moveTo(Game.getObjectById(ctrl_id), {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    }
};