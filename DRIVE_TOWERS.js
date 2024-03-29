//function: drives towers in each room

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(){
        
        const ctrlLvl_towers =      3;
        const healthy_percent =     0.95;

        
        let ctrl = [];
        for (let i=0; i<SD.ctrl_id.length; i++){
            ctrl[i] = Game.getObjectById(SD.ctrl_id[i]);
        }
        
        
        //per room:
        //1. locate all towers
        //2. select a target, and an action to perform on it
        //3. execute action
        for (let k=0; k<SD.ctrl_id.length; k++){
            if (!ctrl[k])                           continue; //bypass: if controller fails to retrieve, skip the room

            //ignore rooms under level requirement for towers
            if (ctrl[k].level < ctrlLvl_towers)     continue;
            

            //1.

            //periodically update tower ids in memory
            if (Game.time % SD.std_interval == 0){
                let towercheck = true;

                //allow the room to skip this step if all 6 towers can be validated
                //saves some time, but can be improved to allow skips in rooms that can't support 6 towers
                for (let q=0; q<6; q++){
                    if (!Game.getObjectById(Memory.turretsByRoom[k][q])){
                        towercheck = false;
                        break;
                    }
                }

                if (!towercheck){
                    Memory.turretsByRoom[k] = ctrl[k].room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_TOWER;
                        }
                    });
                }
            }
            
            
            //2.

            //reset previous action/target
            Memory.turretCommand[k] = 'IDLE';
            Memory.turretTarget_id[k] = null;

            //detect foreign units and determine presence of hostiles among them
            const foreigner = ctrl[k].room.find(FIND_HOSTILE_CREEPS);

            if (foreigner.length){
                let threatvalues = [];
                let threatvalue;
                let hallpass;

                //calculate each foreigner's threat level based on body part composition
                for (let i=0; i<foreigner.length; i++){
                    threatvalue = 0;
                    hallpass = false;

                    //skip calculation of threat value if the foreigner is an ally
                    for (let z=0; z<SD.allies.length; z++){
                        if (foreigner[i].owner.username == SD.allies[z])
                            hallpass = true;
                            break;
                    }
                    
                    //calculation
                    if (!hallpass){
                        for (let j=0; j<foreigner[i].body.length; j++){
                            switch (foreigner[i].body[j]['type']){
                                case HEAL:
                                    threatvalue += 250;
                                    break;
                                case ATTACK:
                                    threatvalue += 150;
                                    break;
                                case RANGED_ATTACK:
                                    threatvalue += 100;
                                    break;
                                case WORK:
                                    threatvalue += 50;
                                    break;
                                case CLAIM:
                                    threatvalue += 10;
                                default:
                            }
                        }
                    }

                    //register each threat value to a indexed hit-list
                    threatvalues[i] = threatvalue;
                }

                //determine which foreigner poses the greatest threat
                let highest_threat_val = threatvalues[0];
                let highest_threat_ind = 0;

                for (let x=1; x<threatvalues.length; x++){
                    if (threatvalues[x] > highest_threat_val){
                        highest_threat_val = threatvalues[x];
                        highest_threat_ind = x;
                    }
                }

                
                //UNLOAD: designated hostile unit
                if (highest_threat_val > 0){
                    //enemy locked on
                    Memory.turretCommand[k] = 'FIRE';
                    Memory.turretTarget_id[k] = foreigner[highest_threat_ind].id;

                    let notif = true;

                    //send notifications upon detection of hostiles
                    for (let l=0; l<SD.notif_blacklist.length; l++){
                        if (Game.getObjectById(Memory.turretTarget_id[k]).owner.username == SD.notif_blacklist[l]){
                            notif = false; //suppress notifications for certain individuals
                            break;
                        }
                    }
                    if (notif){
                        Game.notify('DRIVE_TOWERS:: >>>>>> ' + Game.getObjectById(Memory.turretTarget_id[k]).owner.username + ' DETECTED IN ROOM #' + k + ' <<<<<<');
                        console.log('DRIVE_TOWERS:: >>>>>> ' + Game.getObjectById(Memory.turretTarget_id[k]).owner.username + ' DETECTED IN ROOM #' + k + ' <<<<<<');
                    }
                }
            }

            //designate heals/repairs only if energy can be spared, and if construction mode is disabled (for repairs)
            else{
                const injured_units = ctrl[k].room.find(FIND_MY_CREEPS, {
                    filter: creep => {
                        return creep.hits < creep.hitsMax;
                    }
                });
                
                //UNLOAD: my units (random)
                if (injured_units.length){
                    Memory.turretCommand[k] = 'HEAL';
                    Memory.turretTarget_id[k] = injured_units[0].id;
                }

                
                //UNLOAD: structures (random; walls/ramparts have lower priority)
                //treat walls and ramparts differently from everything else (hp max reasons)
                else{
                    const repairStructs = ctrl[k].room.find(FIND_STRUCTURES, {
                        filter: structure => { //ignore structures over 95% hp
                            return ((structure.hits < structure.hitsMax * healthy_percent
                                &&
                                structure.structureType != STRUCTURE_WALL
                                &&
                                structure.structureType != STRUCTURE_RAMPART));
                        }
                    });
                    const repairWalls = ctrl[k].room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.hits < Memory.wall_threshold
                                &&
                                structure.structureType == STRUCTURE_WALL));
                        }
                    });
                    const repairRamparts = ctrl[k].room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.hits < Memory.rampart_threshold
                                &&
                                structure.structureType == STRUCTURE_RAMPART));
                        }
                    });

                    if (repairStructs.length || repairWalls.length || repairRamparts.length){
                        Memory.turretCommand[k] = 'REPAIR';

                        if      (repairStructs.length)  Memory.turretTarget_id[k] = repairStructs[0].id;
                        else if (repairWalls.length)    Memory.turretTarget_id[k] = repairWalls[0].id;
                        else if (repairRamparts.length) Memory.turretTarget_id[k] = repairRamparts[0].id;
                    }
                }
            }
            
            
            //3.

            //execute command
            let turret;

            for (let q=0; q<Memory.turretsByRoom[k].length; q++){
                turret = Game.getObjectById(Memory.turretsByRoom[k][q].id);

                switch (Memory.turretCommand[k]){
                    case 'FIRE':
                        turret.attack(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                    case 'HEAL': //check first if turret energy can be spared
                        if (turret.store[RESOURCE_ENERGY] > turret.store.getCapacity(RESOURCE_ENERGY) * SD.towerEnergy_boundary)
                            turret.heal(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                    case 'REPAIR': //check first for construction mode FALSE, and if turret energy can be spared
                        if (!Memory.construction_mode && turret.store[RESOURCE_ENERGY] > turret.store.getCapacity(RESOURCE_ENERGY) * SD.towerEnergy_boundary)
                            turret.repair(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                    case 'IDLE':
                        break;
                    default:
                        console.log("DRIVE_TOWERS:: INVALID COMMAND");
                }
            }
        }
    }
};