//ORBITAL DRONE: relays energy from ORBITAL ASSIMILATOR to a container/link/vault
//yellow trail ("traveller")

module.exports = {
    run: function(unit,canister_id,remote_flag,dropoff_id,ignore_lim,flee_point,home_index){
        
        //no enemies present
        if (Memory.evac_timer[home_index] == 0){
            //inputs: container
            var canister = Game.getObjectById(canister_id);
            
            //outputs: container/link/vault
            var dropoff = Game.getObjectById(dropoff_id);
            
            
            //two-states...
            //if full pockets while outbound, come back
            if (!unit.memory.homebound && unit.store.getFreeCapacity() == 0){
                unit.memory.homebound = true;
                unit.memory.in_place = false;
            }
            //if empty energy while inbound, go harvest
            if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
                unit.memory.homebound = false;
            }
            
            
            //behaviour execution...
            if (unit.memory.homebound){
                //navigate to homeroom
                if (unit.room.name != unit.memory.home){
                    unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffff00'}});
                }
                else{
                    //unload: vault (if container/link is designated, but full)
                    if (dropoff.store.getFreeCapacity(RESOURCE_ENERGY) == 0 && unit.room.storage != undefined){
                        unit.moveTo(unit.room.storage, {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                    //unload: container/link/vault
                    else if (unit.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        unit.moveTo(dropoff, {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                }
            }
            else{
                //rally at flag first
                if (!unit.memory.in_place){
                    if (!unit.pos.isEqualTo(remote_flag.pos)){
                        unit.moveTo(remote_flag, {visualizePathStyle: {stroke: '#ffff00'}});
                    }
                    else{
                        unit.memory.in_place = true;
                    }
                }
                else{
                    //watch for invaders/intruders
                    var threat = false;
                    var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                    if (enemy.length){
                        //assess threat level
assess:                 for (let i=0; i<enemy.length; i++){
                            for (let j=0; j<enemy[i].body.length; j++){
                                if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK){
                                    Memory.evac_timer[home_index] = 1500;
                                    unit.memory.in_place = false;
                                    threat = true;
                                    console.log('------------------------------');
                                    console.log('>>>EVACUATING SECTOR #' + home_index + '...HOSTILE INBOUND<<<');
                                    console.log('------------------------------');
                                    break assess;
                                }
                            }
                        }
                    }
                    //watch for hostile cores
                    var invadercores = unit.room.find(FIND_HOSTILE_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_INVADER_CORE;
                        }
                    });
                    if (invadercores.length && Memory.core_sighting[home_index] == false){
                        Memory.core_sighting[home_index] = true;
                        threat = true;
                        console.log('------------------------------');
                        console.log('>>>LOCKING SECTOR #' + home_index + '...CORE SIGHTED<<<');
                        console.log('------------------------------');
                    }
                    //fetch from inputs
                    if (!threat){
                        //inputs: pickups, tombstones (non-empty)
                        var scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                            filter: resource => {
                                return resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim;
                            }
                        });
                        var tombs = unit.room.find(FIND_TOMBSTONES, {
                            filter: RoomObject => {
                                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                            }
                        });
                
                
                        //fetch: pickups<energy>
                        if (scraps.length){
                            if (unit.pickup(scraps[0]) == ERR_NOT_IN_RANGE){
                                unit.moveTo(scraps[0], {visualizePathStyle: {stroke: '#ffff00'}});
                            }
                        }
                        //fetch: tombstones<energy>
                        else if (tombs.length){
                            if (unit.withdraw(tombs[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                                unit.moveTo(tombs[0], {visualizePathStyle: {stroke: '#ffff00'}});
                            }
                        }
                        //fetch: container
                        else if (unit.withdraw(canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                            unit.moveTo(canister, {visualizePathStyle: {stroke: '#ffff00'}});
                        }
                    }
                }
            }
        }
        //enemies detected
        else{
            unit.moveTo(Game.getObjectById(flee_point), {visualizePathStyle: {stroke: '#ffff00'}});
        }
    }
};