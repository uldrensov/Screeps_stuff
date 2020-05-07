//function: drives towers in each room

var SD = require('SOFTDATA');


module.exports = {
    run: function(){
        
        var nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        
        //per room: locate all towers, select an action and target, then execute for each tower
        for (let k=0; k<SD.roomcount; k++){
            
            //reset previous action/target
            Memory.turretCommand[k] = 'IDLE';
            Memory.turretTarget_id[k] = 'NULL';
            
            //ignore brand-new rooms
            if (nexi[k].room.controller.level < 3) continue;
            
            //locate all towers
            if (Memory.turretsByRoom[k] == undefined || Game.time % SD.std_interval == 0){
                Memory.turretsByRoom[k] = nexi[k].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_TOWER;
                    }
                });
            }
            
            
            //outputs: enemies, allies (injured), structures (damaged)
            var threat = false;
            var enemy = nexi[k].room.find(FIND_HOSTILE_CREEPS);
            if (enemy.length){
                //assess threat level
assess:         for (let i=0; i<enemy.length; i++){
                    for (let j=0; j<enemy[i].body.length; j++){
                        if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK || enemy[i].body[j]['type'] == HEAL || enemy[i].body[j]['type'] == WORK){
                            threat = true;
                            Memory.turretTarget_id[k] = enemy[i].id;
                            break assess;
                        }
                    }
                }
            }
            var injured_units;
            var repairStructs;
            var repairRamparts;
        

            //determine action/target by priority...
            //unload: enemies
            if (threat){
                Memory.turretCommand[k] = 'FIRE';
                if (Game.getObjectById(Memory.turretTarget_id[k]).owner.username != 'Invader')
                    Game.notify(Game.getObjectById(Memory.turretTarget_id[k]).owner.username + ' DETECTED IN ROOM #' + k,30);
            }
            //perform other tasks only if energy can be spared, and construction mode is disabled
            else{
                injured_units = nexi[k].room.find(FIND_MY_CREEPS, {
                    filter: creep => {
                        return creep.hits < creep.hitsMax;
                    }
                });
                
                //unload: allies
                if (injured_units.length){
                    Memory.turretCommand[k] = 'HEAL';
                    Memory.turretTarget_id[k] = injured_units[0].id;
                }
                //unload: structures
                else{
                    repairStructs = nexi[k].room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return ((structure.hits < structure.hitsMax * .95 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART));
                        }
                    });
                    repairRamparts = nexi[k].room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.hits < Memory.rampart_threshold && structure.structureType == STRUCTURE_RAMPART));
                        }
                    });
                    if (repairRamparts.length || repairStructs.length){
                        Memory.turretCommand[k] = 'REPAIR';
                        if (repairRamparts.length) Memory.turretTarget_id[k] = repairRamparts[0].id;
                        else if (repairStructs.length) Memory.turretTarget_id[k] = repairStructs[0].id;
                    }
                }
            }
            
            
            //execute
            var turret;
            for (let q=0; q<Memory.turretsByRoom[k].length; q++){
                turret = Game.getObjectById(Memory.turretsByRoom[k][q].id);
                switch (Memory.turretCommand[k]){
                    case 'FIRE':
                        turret.attack(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                    case 'HEAL':
                        if (!Memory.construction_mode && turret.store[RESOURCE_ENERGY] > turret.store.getCapacity(RESOURCE_ENERGY) * SD.tower_reserve_ratio)
                            turret.heal(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                    case 'REPAIR':
                        if (!Memory.construction_mode && turret.store[RESOURCE_ENERGY] > turret.store.getCapacity(RESOURCE_ENERGY) * SD.tower_reserve_ratio)
                            turret.repair(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                }
            }
        }
    }
};