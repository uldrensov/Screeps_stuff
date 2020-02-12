//ZEALOT: cross-room all-out melee unit designed to punish defenseless rooms
//red trail

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
            var hatcheries = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
            });
            var overlords = unit.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_EXTENSION;
                }
            });
            //var opponents = unit.room.find(FIND_CREEPS);
            var enemy = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
            //select and attack target
            if (hatcheries.length){
                if (unit.attack(hatcheries[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(hatcheries[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else if (overlords.length){
                if (unit.attack(overlords[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(overlords[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else if (enemy){
                if (unit.attack(enemy) == ERR_NOT_IN_RANGE){
                    unit.moveTo(enemy, {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
            else{
                unit.say('PURIFIED');
            }
        }
    }
};