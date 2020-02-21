//KHAYDARIN MONOLITH: <tower> globally attacks foes, heals allies, and repairs endangered structures

module.exports = {
    run: function(tower_id, reserve_ratio, nexi_id){
        
        var tower = Game.getObjectById(tower_id);
        
        
        //find room # of tower (for email notification)
        var homeroom;
        for (let i=0; i<nexi_id.length; i++){
            if (tower.room == Game.getObjectById(nexi_id[i]).room){
                homeroom = i;
                break;
            }
        }
        
        
        //outputs: enemies, allies (injured), structures (damaged)
        var threat = false;
        var target_enemy;
        var enemy = tower.room.find(FIND_HOSTILE_CREEPS);
        if (enemy.length){
            //assess threat level
assess:     for (let i=0; i<enemy.length; i++){
                for (let j=0; j<enemy[i].body.length; j++){
                    if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK || enemy[i].body[j]['type'] == WORK){
                        threat = true;
                        target_enemy = enemy[i];
                        break assess;
                    }
                }
            }
        }
        var injured_units = tower.room.find(FIND_MY_CREEPS, {
            filter: creep => {
                return creep.hits < creep.hitsMax;
            }
        });
        var repairTargets = tower.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return ((structure.hits < structure.hitsMax * .5 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART));
            }
        });
        var repairRamparts = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < Memory.rampart_threshold && structure.structureType == STRUCTURE_RAMPART));
            }
        });
        

        //priorities...
        //unload: enemies
        if (threat){
            tower.attack(target_enemy);
            if (target_enemy.owner.username != 'Invader')
                Game.notify(target_enemy.owner.username + ' DETECTED IN ROOM #' + homeroom,30);
        }
        //perform other tasks only if energy can be spared, and construction mode is disabled
        else if (!Memory.construction_mode && tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) * reserve_ratio){
            //unload: allies
            if (injured_units.length)
                tower.heal(injured_units[0]);
            //unload: structures
            else{
                if (repairRamparts.length)
                    tower.repair(repairRamparts[0]);
                else if (repairTargets.length)
                    tower.repair(repairTargets[0]);
            }
        }
    }
};