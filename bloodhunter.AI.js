//BLOOD HUNTER: cross-room vengeance warrior designed to counter invader units in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, bloodscent, home_index){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        //salvage unit and elevate threat level if too much damage is taken
        if (unit.hits < unit.hitsMax*.25){
            unit.memory.killswitch = true;
            Memory.viable_prey[home_index] = false;
        }
        
        
        if (!unit.memory.killswitch){
            //one-way room pathing
            if (unit.memory.home == unit.room.name)
                unit.moveTo(bloodscent);
            //secure the room
            else{
                var bloodmark = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
                //kill invader
                if (bloodmark){
                    if (unit.attack(bloodmark) == ERR_NOT_IN_RANGE)
                        unit.moveTo(bloodmark);
                }
                //force-reset evac timer, then self-killswitch
                else if (Memory.evac_timer[home_index] > 0){
                    Memory.evac_timer[home_index] = 0;
                    unit.memory.killswitch = true;
                    console.log('------------------------------');
                    console.log('SECTOR #' + home_index + ': HOSTILES ELIMINATED');
                    console.log('------------------------------');
                }
                //edge case: false alarm
                else unit.memory.killswitch = true;
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};