//VISIONARY: standard controller claimer
//cyan trail ("support")

module.exports = {
    run: function(unit, standby_flag){
        
        //one-time single-flag rally FSM
        if (!unit.memory.rallied)
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#00ffff'}});
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.rallied = true;
            
        
        //take the room's controller
        if (unit.memory.rallied){
            //if controller is reserved by foreign powers
            if (unit.room.controller.reservation)
                if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
            
            //if controller is free for the taking
            else if (unit.claimController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
                
            //when done, disable further spawns and suicide
            else if (unit.room.controller.my){
                Memory.visionary_MAX[unit.memory.home_index] = 0;
                unit.suicide();
            }
        }
    }
};