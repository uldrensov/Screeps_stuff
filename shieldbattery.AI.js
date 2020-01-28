//SHIELD BATTERY: <tower> repair heavily decaying structures

module.exports = {
    run: function(tower){
        //structures below a certain HP thresholds...
        //under 25%
        var repairTargets25 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .25);
            }
        });
        //under 50%
        var repairTargets50 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .5);
            }
        });
        //under 75%
        var repairTargets75 = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .75);
            }
        });
        
        
        //find and repair a suitable structure (ordered by priority)
        //below 25%
        if (repairTargets25.length){
            tower.repair(repairTargets25[0]);
        }
        //below 50%
        else if (repairTargets50.length){
            tower.repair(repairTargets50[0]);
        }
        //below 75%
        else if (repairTargets75.length){
            tower.repair(repairTargets75[0]);
        }
    }
};