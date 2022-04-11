//BLOOD HUNTER: cross-room vengeance warrior designed to counter invader units in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, bloodscent){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        //salvage unit and elevate threat level if too much damage is taken
        if (unit.hits < unit.hitsMax*.25){
            console.log(unit.name + ':: >>>>>> GRAVE CASUALTIES SUSTAINED ... RETREATING <<<<<<');

            Memory.viable_prey[unit.memory.home_index] =            false; //returns bloodhunters to dormant state, in spite of the active evac timer
            Memory.bloodhunter_casualty[unit.memory.home_index] =   true;
            unit.memory.killswitch =                                true;
        }
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //simple cross-room navigation
            if (Game.getObjectById(nexus_id).room.name == unit.room.name)
                unit.moveTo(bloodscent);
                

            //pathing complete
            else{
                let bloodmark = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            
                //attempt to kill the invader
                if (bloodmark){
                    if (unit.attack(bloodmark) == ERR_NOT_IN_RANGE)
                        unit.moveTo(bloodmark);
                }

                //when invader is slain...
                else if (Memory.evac_timer[unit.memory.home_index] > 0){
                    console.log(unit.name + ':: SECTOR #' + unit.memory.home_index + ': HOSTILES ELIMINATED');

                    //reset the evac timer early
                    Memory.evac_timer[unit.memory.home_index] = 0; //triggers blood hunter dormancy
                }
            }
        }


        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};