//PURIFIER: cleanses enemy controller reservation
//cyan trail ("support")

module.exports = {
    run: function(unit,pollution,home_index){
        
        //one-way room pathing
        if (unit.memory.home == unit.room.name)
            unit.moveTo(pollution, {visualizePathStyle: {stroke: '#00ffff'}});
        //reclaim the room
        else{
            if (unit.room.controller.reservation != undefined){
                if (unit.room.controller.reservation.username == 'Invader'){
                    if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.controller, {visualizePathStyle: {stroke: '#00ffff'}});
                }
            }
            //disable further purifier spawns when the room is truly clear
            else if (Memory.core_sighting[home_index] == false)
                Memory.purifier_MAX[home_index] = 0;
        }
    }
};