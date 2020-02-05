//RECALIBRATOR: claims or reserves a foreign controller
//violet trail

module.exports = {
    run: function(unit,nexus_id,ctrl_id,waypoint){
        
        //move to a pre-placed flag outside the homeroom
        if (unit.room != waypoint.room){
            unit.moveTo(waypoint.room, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
        
        //claim the controller in the adjacent room
        else if (unit.claimController(Game.getObjectById(ctrl_id)) == ERR_NOT_IN_RANGE){
            unit.moveTo(Game.getObjectById(ctrl_id), {visualizePathStyle: {stroke: '#ff00ff'}});
        }
    }
};