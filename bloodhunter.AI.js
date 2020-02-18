//BLOOD HUNTER: cross-room vengeance warrior designed to counter invaders in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit,bloodscent,home_index){
        
        //one-way room pathing
        if (unit.memory.home == unit.room.name)
            unit.moveTo(bloodscent, {visualizePathStyle: {stroke: '#ff0000'}});
        //secure the room
        else{
            var bloodmark = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var heretic = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_INVADER_CORE;
                }
            });
            
            //kill invader
            if (bloodmark){
                if (unit.attack(bloodmark) == ERR_NOT_IN_RANGE)
                    unit.moveTo(bloodmark, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            //regenerate
            else if (unit.hits < unit.hitsMax) unit.heal(unit);
            //kill cores
            else if (heretic.length){
                if (unit.attack(heretic[0]) == ERR_NOT_IN_RANGE)
                    unit.moveTo(heretic[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
            //force-reset evac timer
            else if (Memory.evac_timer[home_index] > 0)
                Memory.evac_timer[home_index] = 0;
        }
    }
};