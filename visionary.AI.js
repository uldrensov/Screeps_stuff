//VISIONARY: standard controller claimer
//cyan trail ("support")

module.exports = {
    run: function(unit, standby_flag){
        
        //rally to the flag location first
        if (!unit.memory.rallied)
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#00ffff'}});
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.rallied = true;
            
        
        //take the room's controller
        if (unit.memory.rallied){
            if (unit.room.controller.reservation)
                if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
            
            else if (unit.claimController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
                
            else if (unit.room.controller.my){
                Memory.visionary_MAX[unit.memory.home_index] = 0;
                unit.suicide();
            }
        }
    }
};