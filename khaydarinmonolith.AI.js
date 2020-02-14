//KHAYDARIN MONOLITH: <tower> globally attacks foes, heals allies, and repairs endangered structures

module.exports = {
    run: function(tower_id,thresholdT,thresholdR,reserve_ratio,disable,nexi_id){
        
        var tower = Game.getObjectById(tower_id);
        
        
        //find room # of tower (for email notification)
        var homeroom;
        for (let i=0; i<nexi_id.length; i++){
            if (tower.room == Game.getObjectById(nexi_id[i]).room){
                homeroom = i;
                break;
            }
        }
        
        
        //outputs: enemies, injured allies, damaged structures
        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var injured_units = tower.room.find(FIND_MY_CREEPS, {
            filter: creep => {
                return creep.hits < creep.hitsMax;
            }
        });
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
        //unload: enemies
        if (enemy){
            tower.attack(enemy);
            if (enemy.owner.username != 'Invader'){
                Game.notify(enemy.owner.username + ' DETECTED IN ROOM #' + homeroom,30);
            }
        }
        //perform other tasks only if energy can be spared, and construction mode is disabled
        else if (!disable && tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * reserve_ratio){
            //unload: injured allies
            if (injured_units.length){
                tower.heal(injured_units[0]);
            }
            //unload: damaged structures
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