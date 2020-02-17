//ORBITAL ASSIMILATOR: remote miner with light repair capabilities
//yellow trail ("traveller")

module.exports = {
    run: function(unit,src_id,remote_flag,canister_id,flee_point,home_index){
        
        //no enemies present
        if (Memory.evac_timer[home_index] == 0){
            //inputs: source
            var src = Game.getObjectById(src_id);
            
            //outputs: containers (damaged)
            var dmg_canister = Game.getObjectById(canister_id);
            
            
            //two-states...
            if (unit.memory.able == undefined){
                unit.memory.able = false;
            }
            //if energy is over half, unit may repair
            if (unit.store[RESOURCE_ENERGY] > unit.store.getCapacity()/2){
                unit.memory.able = true;
            }
            //if energy depletes to 0, unit may cease repairs
            else if (unit.store[RESOURCE_ENERGY] == 0){
                unit.memory.able = false;
            }
            
            
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
                var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                var threat = false;
                if (enemy.length){
                    //assess threat level
assess:             for (let i=0; i<enemy.length; i++){
                        for (let j=0; j<enemy[i].body.length; j++){
                            if (enemy[i].body[j]['type'] == ATTACK || enemy[i].body[j]['type'] == RANGED_ATTACK){
                                Memory.evac_timer[home_index] = 1500;
                                console.log('------------------------------');
                                console.log('>>>EVACUATING SECTOR ' + home_index + '<<<');
                                console.log('------------------------------');
                                unit.memory.in_place = false;
                                threat = true;
                                break assess;
                            }
                        }
                    }
                }
                //fetching and repairing
                if (!threat){
                    //unload: containers (2-state)
                    if (unit.memory.able && dmg_canister.hits < dmg_canister.hitsMax){
                        if (!unit.pos.isEqualTo(dmg_canister.pos)){
                            unit.moveTo(dmg_canister, {visualizePathStyle: {stroke: '#ffff00'}});
                        }
                        else{
                            unit.repair(dmg_canister);
                        }
                    }
                    //fetch: sources
                    else if (unit.harvest(src) == ERR_NOT_IN_RANGE){
                        unit.moveTo(src, {visualizePathStyle: {stroke: '#ffff00'}});
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