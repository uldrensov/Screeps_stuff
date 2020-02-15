//ORBITAL ASSIMILATOR: semi-mobile high-efficiency mining unit
//yellow trail

module.exports = {
    run: function(unit,src_id,remote_flag,canister_id,flee_point,home_index){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
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
                //watch for invaders
                var enemy = unit.room.find(FIND_HOSTILE_CREEPS);
                if (enemy.length){
                    Memory.evac_timer[home_index] = 1500;
                    console.log('>>>EVACUATING SECTOR ' + home_index + '<<<');
                }
                //fetching and repairing
                else{
                    //unload: containers (2-state)
                    if (unit.memory.able && dmg_canister.hits < dmg_canister.hitsMax){
                        unit.repair(dmg_canister);
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