//PURIFIER: cleanses enemy controller reservation in remote mining rooms
//cyan trail ("support")

module.exports = {
    run: function(unit, nexus_id, pollution, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //one-way room pathing
            if (unit.memory.home == unit.room.name)
                unit.moveTo(pollution);
            //reclaim the room
            else{
                if (unit.room.controller.reservation != undefined){
                    if (unit.room.controller.reservation.username == 'Invader'){
                        if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                            unit.moveTo(unit.room.controller);
                    }
                    //edge case: false alarm
                    else if (unit.room.controller.reservation.username == unit.owner.username){
                        Memory.purifier_MAX[home_index] = -1;
                        unit.memory.killswitch = true;
                    }
                }
                //disable further purifiers when the room is truly clear, re-enable remote workers, then self-killswitch
                else if (Memory.enforcer_MAX[home_index] < 0){
                    Memory.purifier_MAX[home_index] = -1;
                    Game.notify('>>>SECTOR #' + home_index + ' RESTORED: CORE TRACES PURIFIED<<<',0);
                    console.log('------------------------------');
                    console.log('>>>SECTOR #' + home_index + ' RESTORED: CORE TRACES PURIFIED<<<');
                    console.log('------------------------------');
                    if (Memory.recalibrator_MAX[home_index] < 0) Memory.recalibrator_MAX[home_index] = 1;
                    if (Memory.orbitalAssimilator_MAX[home_index] < 0) Memory.orbitalAssimilator_MAX[home_index] = 1;
                    if (Memory.orbitalDrone_MAX[home_index] < 0) Memory.orbitalDrone_MAX[home_index] = 1;
                    unit.memory.killswitch = true;
                }
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};