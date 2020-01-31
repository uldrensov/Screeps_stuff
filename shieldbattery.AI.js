//SHIELD BATTERY: <tower> repair heavily decaying structures

module.exports = {
    run: function(tower,thresholdT,thresholdR){
        
        //structures below a certain HP thresholds
        var repairTargets25 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax * .25
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART) ||
                (structure.hits < thresholdT * .25
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        var repairTargets50 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax * .5
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART) ||
                (structure.hits < thresholdT * .5
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        var repairTargets75 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax * .75
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART) ||
                (structure.hits < thresholdT * .75
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        var repairRamparts = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < thresholdR
                && structure.structureType == STRUCTURE_RAMPART));
            }
        });

        
        //prioritise attacking
        //otherwise, or repair structures (in priority order) if energy can be spared
        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy){
            tower.attack(enemy);
            Game.notify('SCREEPS: TOWER HAS ENGAGED THE ENEMY',30);
        }
        else if (tower.energy > tower.store.getCapacity(RESOURCE_ENERGY) * .5){
            if (repairRamparts.length){
                tower.repair(repairRamparts[0]);
            }
            else if (repairTargets25.length){
                tower.repair(repairTargets25[0]);
            }
            else if (repairTargets50.length){
                tower.repair(repairTargets50[0]);
            }
            else if (repairTargets75.length){
                tower.repair(repairTargets75[0]);
            }
        }
    }
};