//PURIFIER: cleanses enemy controller reservation in remote mining rooms
//cyan trail ("support")

module.exports = {
    run: function(unit, nexus_id, pollution, home_index){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //one-way room pathing
            if (unit.memory.home == unit.room.name)
                unit.moveTo(pollution);


            //pathing complete
            else{
                //check the current reservation
                if (unit.room.controller.reservation != undefined){
                    //controlled by invader: purify it
                    if (unit.room.controller.reservation.username == 'Invader'){
                        if (unit.attackController(unit.room.controller) == ERR_NOT_IN_RANGE)
                            unit.moveTo(unit.room.controller);
                    }
                    //controlled by player: false alarm - could possibly happen if the core turns neutral on its own, and a lucky recalibrator arrives
                    else if (unit.room.controller.reservation.username == unit.owner.username){
                        //self-killswitch and return to dormant state
                        Memory.purifier_MAX[home_index] = -1;
                        unit.memory.killswitch = true;
                    }
                }

                //re-enable remote workers only when the controller is purified, and no /new/ core has arrived to immediately undo purification
                else if (Memory.enforcer_MAX[home_index] < 0){
                    //Game.notify('purifier.AI:: >>>SECTOR #' + home_index + ' RESTORED: CONTROLLER PURIFIED OF HOSTILE INFLUENCE<<<',0);

                    console.log('purifier.AI:: ------------------------------');
                    console.log('purifier.AI:: >>>SECTOR #' + home_index + ' RESTORED: CONTROLLER PURIFIED OF HOSTILE INFLUENCE<<<');
                    console.log('purifier.AI:: ------------------------------');

                    if (Memory.recalibrator_MAX[home_index] < 0)        Memory.recalibrator_MAX[home_index] =       1;
                    if (Memory.orbitalAssimilator_MAX[home_index] < 0)  Memory.orbitalAssimilator_MAX[home_index] = 1;
                    if (Memory.orbitalDrone_MAX[home_index] < 0)        Memory.orbitalDrone_MAX[home_index] =       1;

                    //self-killswitch and return to dormant state
                    Memory.purifier_MAX[home_index] = -1;
                    unit.memory.killswitch = true;
                }
            }
        }


        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};