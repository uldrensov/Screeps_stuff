//DARK TEMPLAR: cross-room aggressive warrior designed to punish defenseless rooms
//red trail ("fighter")

module.exports = {
    run: function(unit,standby_flag){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
        //trek to the standby point once
        if (!unit.memory.in_place){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        if (unit.pos.isEqualTo(standby_flag.pos)){
            unit.memory.in_place = true;
        }
        
        
        //destroy everything in sight
        if (unit.memory.in_place){
            //acquire targets
            var hatcheries = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
            });
            var organs = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_INVADER_CORE;
                }
            });
            var abomination = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var larvae = unit.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            
            //select and attack target
            if (hatcheries.length){
                if (unit.attack(hatcheries[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(hatcheries[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else if (organs.length){
                if (unit.attack(organs[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(organs[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else if (abomination){
                if (unit.attack(abomination) == ERR_NOT_IN_RANGE){
                    unit.moveTo(abomination, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else{
                unit.say('PURIFIED');
            }
        }
    }
};