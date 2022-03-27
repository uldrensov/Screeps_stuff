//function: drives towers in each room

var SD = require('SOFTDATA');


module.exports = {
    run: function(){
        
        let nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        
        //per room:
        //1. locate all towers
        //2. select a target, and an action to perform on it
        //3. execute action
        for (let k=0; k<SD.nexus_id.length; k++){
            if (nexi[k] == null)                    continue; //error: if nexus fails to retrieve, skip the room

            //ignore rooms under level requirement for towers
            if (nexi[k].room.controller.level < 3)  continue;
            

            //1.

            //periodically update tower ids in memory
            if (Game.time % SD.std_interval == 0){
                let towercheck = true;

                //allow the room to skip this step if all 6 towers can be validated
                //saves some time, but can be improved to allow skips in rooms that can't support 6 towers
                for (let q=0; q<6; q++){
                    if (Game.getObjectById(Memory.turretsByRoom[k][q]) == null){
                        towercheck = false;
                        break;
                    }
                }

                if (!towercheck){
                    Memory.turretsByRoom[k] = nexi[k].room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_TOWER;
                        }
                    });
                }
            }
            
            
            //2.
            //OUTPUTS: hostiles -> my units (injured) -> my structures (damaged)

            //reset previous action/target
            Memory.turretCommand[k] = 'IDLE';
            Memory.turretTarget_id[k] = 'NULL';

            //detect foreign units and determine presence of hostiles among them
            let foreigner = nexi[k].room.find(FIND_HOSTILE_CREEPS);

            if (foreigner.length){
                let threat = false;

                for (let i=0; i<foreigner.length; i++){
                    //do not mark allies as hostiles
                    for (let z=0; z<SD.allies.length; z++){
                        if (foreigner[i].owner.username == SD.allies[z])
                            continue;
                    }
                    
                    //UNLOAD: hostiles
                    //foreigner is determined hostile if it contains combative/disruptive body parts
                    for (let j=0; j<foreigner[i].body.length; j++){
                        if (foreigner[i].body[j]['type'] == ATTACK  || foreigner[i].body[j]['type'] == RANGED_ATTACK ||
                            foreigner[i].body[j]['type'] == HEAL    || foreigner[i].body[j]['type'] == WORK){

                            threat = true;
                            Memory.turretCommand[k] = 'FIRE';
                            Memory.turretTarget_id[k] = foreigner[i].id; //mark unit as hostile (no specific priority given if multiple hostiles exist)

                            //send notifications upon detection of hostiles
                            let notif = true;

                            for (let l=0; l<SD.notif_blacklist.length; l++){
                                if (Game.getObjectById(Memory.turretTarget_id[k]).owner.username == SD.notif_blacklist[l]){
                                    notif = false; //suppress notifications for certain individuals
                                    break;
                                }
                            }
                            if (notif)
                                Game.notify('TOWERDRIVE:: ' + Game.getObjectById(Memory.turretTarget_id[k]).owner.username + ' DETECTED IN ROOM #' + k,30);

                            break;
                        }
                    }

                    //hostile detected
                    if (threat)
                        break;
                }
            }

            //designate heals/repairs only if energy can be spared, and if construction mode is disabled (for repairs)
            else{
                let injured_units = nexi[k].room.find(FIND_MY_CREEPS, {
                    filter: creep => {
                        return creep.hits < creep.hitsMax;
                    }
                });
                
                //UNLOAD: my units
                if (injured_units.length){
                    Memory.turretCommand[k] = 'HEAL';
                    Memory.turretTarget_id[k] = injured_units[0].id; //no specific priority given to any particular unit
                }

                //UNLOAD: structures
                //treat walls and ramparts differently from everything else (hp max reasons)
                else{
                    let repairStructs = nexi[k].room.find(FIND_STRUCTURES, {
                        filter: structure => { //ignore structures over 95% hp
                            return ((structure.hits < structure.hitsMax * .95 && structure.structureType != STRUCTURE_WALL
                                    &&
                                    structure.structureType != STRUCTURE_RAMPART));
                        }
                    });
                    let repairWalls = nexi[k].room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.hits < Memory.wall_threshold
                                    &&
                                    structure.structureType == STRUCTURE_WALL));
                        }
                    });
                    let repairRamparts = nexi[k].room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return ((structure.hits < Memory.rampart_threshold
                                    &&
                                    structure.structureType == STRUCTURE_RAMPART));
                        }
                    });

                    if (repairStructs.length || repairWalls.length || repairRamparts.length){
                        Memory.turretCommand[k] = 'REPAIR';

                        //no specific priority given to individual structures within each category
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
                        if (turret.store[RESOURCE_ENERGY] > turret.store.getCapacity(RESOURCE_ENERGY) * SD.tower_reserve_ratio)
                            turret.heal(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                    case 'REPAIR': //check first for construction mode FALSE, and if turret energy can be spared
                        if (!Memory.construction_mode && turret.store[RESOURCE_ENERGY] > turret.store.getCapacity(RESOURCE_ENERGY) * SD.tower_reserve_ratio)
                            turret.repair(Game.getObjectById(Memory.turretTarget_id[k]));
                        break;
                }
            }
        }
    }
};