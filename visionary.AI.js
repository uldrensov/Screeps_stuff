//VISIONARY: standard controller claimer
//cyan trail ("support")

module.exports = {
    run: function(unit, standby_flag, home_index){
        
        //trek to the standby point once
        if (!unit.memory.in_place)
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#00ffff'}});
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.in_place = true;
            
        
        //take the room's controller
        if (unit.memory.in_place){
            if (unit.room.controller.reservation){
                if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
            }
            else if (unit.claimController(unit.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
            else if (unit.room.controller.my){
                Memory.visionary_MAX[home_index] = 0;
                unit.suicide();
            }
        }
    }
};