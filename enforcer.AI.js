//ENFORCER: cross-room warrior designed to destroy invader cores in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, incident, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //one-way room pathing
            if (unit.memory.home == unit.room.name)
                unit.moveTo(incident);
            //secure the room
            else{
                var heretic = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_INVADER_CORE;
                    }
                });
            
                //kill cores
                if (heretic.length){
                    if (unit.attack(heretic[0]) == ERR_NOT_IN_RANGE)
                        unit.moveTo(heretic[0]);
                }
                //clear the lockdown, self-killswitch, and possibly re-enable remote workers
                else if (Memory.enforcer_MAX[home_index] > 0){
                    Memory.enforcer_MAX[home_index] = -1;
                    unit.memory.killswitch = true;
                
                    //call in a purifier (if necessary)
                    if (unit.room.controller.reservation != undefined){
                        if (unit.room.controller.reservation.username == 'Invader')
                            Memory.purifier_MAX[home_index] = 1;
                        else{
                            //Game.notify('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);
                            console.log('enforcer.AI:: ------------------------------');
                            console.log('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                            console.log('enforcer.AI:: ------------------------------');
                            if (Memory.recalibrator_MAX[home_index] < 0)        Memory.recalibrator_MAX[home_index] = 1;
                            if (Memory.orbitalAssimilator_MAX[home_index] < 0)  Memory.orbitalAssimilator_MAX[home_index] = 1;
                            if (Memory.orbitalDrone_MAX[home_index] < 0)        Memory.orbitalDrone_MAX[home_index] = 1;
                        }
                    }
                    else{
                        //Game.notify('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);
                        console.log('enforcer.AI:: ------------------------------');
                        console.log('enforcer.AI:: >>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                        console.log('enforcer.AI:: ------------------------------');
                        if (Memory.recalibrator_MAX[home_index] < 0)            Memory.recalibrator_MAX[home_index] = 1;
                        if (Memory.orbitalAssimilator_MAX[home_index] < 0)      Memory.orbitalAssimilator_MAX[home_index] = 1;
                        if (Memory.orbitalDrone_MAX[home_index] < 0)            Memory.orbitalDrone_MAX[home_index] = 1;
                    }
                }
            }
        }
        
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};