//KHAYDARIN MONOLITH: <tower> attacks foes relentlessly and repairs structures within reason

module.exports = {
    run: function(tower_id,thresholdT,thresholdR,reserve_ratio){
        
        var tower = Game.getObjectById(tower_id);
        
        
        //damaged units
        var injured_units = tower.room.find(FIND_MY_CREEPS, {
            filter: creep => {
                return creep.hits < creep.hitsMax;
            }
        });
        
        
        //structures below a certain HP thresholds
        var repairTargets = tower.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return ((structure.hits < structure.hitsMax * .5
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART) ||
                (structure.hits < thresholdT * .5
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        var repairRamparts = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < thresholdR
                && structure.structureType == STRUCTURE_RAMPART));
            }
        });
        

        //priorities...
        //attack enemies first
        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy){
            tower.attack(enemy);
            Game.notify(enemy.owner.username + ' DETECTED...ATTEMPTING TO PURGE',30);
        }
        //perform other tasks only if energy can be spared
        else if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * reserve_ratio){
            //heal units second
            if (injured_units.length){
                tower.repair(injured_units[0]);
            }
            //repair structures last
            else{
                if (repairRamparts.length){
                    tower.repair(repairRamparts[0]);
                }
                else if (repairTargets.length){
                    tower.repair(repairTargets[0]);
                }
            }
        }
    }
};