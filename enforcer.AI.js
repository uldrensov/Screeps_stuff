//ENFORCER: cross-room warrior designed to destroy invader cores in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, incident, home_index){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //one-way room pathing
            if (unit.memory.home == unit.room.name)
                unit.moveTo(incident);


            //pathing complete
            else{
                let heretic = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_INVADER_CORE;
                    }
                });
            
                //destroy the core
                if (heretic.length){
                    if (unit.attack(heretic[0]) == ERR_NOT_IN_RANGE)
                        unit.moveTo(heretic[0]);
                }

                //when core is eliminated...
                else{
                    //check the current reservation
                    if (unit.room.controller.reservation != undefined){
                        //controlled by invader: call in a purifier
                        if (unit.room.controller.reservation.username == 'Invader')
                            Memory.purifier_MAX[home_index] = 1;

                        //controlled by player: re-enable remote workers
                        else{
                            //Game.notify('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);

                            console.log('enforcer.AI:: ------------------------------');
                            console.log('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                            console.log('enforcer.AI:: ------------------------------');

                            if (Memory.recalibrator_MAX[home_index] < 0)        Memory.recalibrator_MAX[home_index] =       1;
                            if (Memory.orbitalAssimilator_MAX[home_index] < 0)  Memory.orbitalAssimilator_MAX[home_index] = 1;
                            if (Memory.orbitalDrone_MAX[home_index] < 0)        Memory.orbitalDrone_MAX[home_index] =       1;
                        }
                    }

                    //controlled by nobody: re-enable remote workers
                    else{
                        //Game.notify('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);

                        console.log('enforcer.AI:: ------------------------------');
                        console.log('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                        console.log('enforcer.AI:: ------------------------------');

                        if (Memory.recalibrator_MAX[home_index] < 0)            Memory.recalibrator_MAX[home_index] =       1;
                        if (Memory.orbitalAssimilator_MAX[home_index] < 0)      Memory.orbitalAssimilator_MAX[home_index] = 1;
                        if (Memory.orbitalDrone_MAX[home_index] < 0)            Memory.orbitalDrone_MAX[home_index] =       1;
                    }


                    //self-killswitch and return to dormant state
                    Memory.enforcer_MAX[home_index] = -1;
                    unit.memory.killswitch = true;
                }
            }
        }
        

        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};