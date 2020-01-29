//SHIELD BATTERY: <tower> repair heavily decaying structures

module.exports = {
    run: function(tower,threshold){
        
        //structures below a certain HP thresholds
        var repairTargets25 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax * .25
                && structure.structureType != STRUCTURE_WALL) ||
                (structure.hits < threshold * .25
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        var repairTargets50 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax * .5
                && structure.structureType != STRUCTURE_WALL) ||
                (structure.hits < threshold * .5
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        var repairTargets75 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax * .75
                && structure.structureType != STRUCTURE_WALL) ||
                (structure.hits < threshold * .75
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        
        
        //find and repair a suitable structure (ordered by priority)
        
        
        //temp
        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy){
            tower.attack(enemy);
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
};