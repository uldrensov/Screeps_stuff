//BLOOD HUNTER: cross-room vengeance warrior designed to counter invader units in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, bloodscent, home_index){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        //salvage unit and elevate threat level if too much damage is taken
        if (unit.hits < unit.hitsMax*.25){
            Memory.viable_prey[home_index] =            false; //returns bloodhunters to dormant state, in spite of the active evac timer
            Memory.bloodhunter_casualty[home_index] =   true;
            unit.memory.killswitch =                    true;
        }
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //simple cross-room navigation
            if (unit.memory.home == unit.room.name)
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
                else{
                    //Game.notify('bloodhunter.AI:: SECTOR #' + home_index + ': HOSTILES ELIMINATED',0);

                    console.log('bloodhunter.AI:: ------------------------------');
                    console.log('bloodhunter.AI:: SECTOR #' + home_index + ': HOSTILES ELIMINATED');
                    console.log('bloodhunter.AI:: ------------------------------');

                    //self-killswitch and reset the evac timer early
                    Memory.evac_timer[home_index] = 0; //triggers blood hunter dormancy
                    unit.memory.killswitch = true;
                }
            }
        }


        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};