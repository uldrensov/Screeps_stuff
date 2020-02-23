//ENFORCER: cross-room warrior designed to destroy invader cores in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, incident, home_index){
        
        //one-way room pathing
        if (unit.memory.home == unit.room.name)
            unit.moveTo(incident, {visualizePathStyle: {stroke: '#ff0000'}});
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
                    unit.moveTo(heretic[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
            //clear the lockdown
            else if (Memory.core_sighting[home_index] == true){
                Memory.core_sighting[home_index] = false;
                
                //call in a purifier (if necessary)
                if (unit.room.controller.reservation != undefined){
                    if (unit.room.controller.reservation.username == 'Invader')
                        Memory.purifier_MAX[home_index] = 1;
                    else{
                        //Game.notify('>>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);
                        console.log('------------------------------');
                        console.log('>>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                        console.log('------------------------------');
                    }
                }
                else{
                    //Game.notify('>>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<',0);
                    console.log('------------------------------');
                    console.log('>>>SECTOR #' + home_index + ' RESTORED: CORE DESTROYED<<<');
                    console.log('------------------------------');
                }
            }
        }
    }
};