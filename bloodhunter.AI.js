//BLOOD HUNTER: cross-room vengeance warrior designed to counter enemy units in remote mining rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, bloodscent){

        const dmgPerAtkPart =               30;
        const lowHP_threshold =             0.25;
        const reinforcement_delay =         100;
        const bloodhunterCasualty_delay =   1000;


        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //simple cross-room navigation
            if (Game.getObjectById(nexus_id).room.name == unit.room.name)
                unit.moveTo(bloodscent);
                

            //pathing complete
            else{
                //salvage unit and elevate threat level if too much damage is taken
                if (unit.hits <= unit.hitsMax*lowHP_threshold){
                    console.log(unit.name + ':: >>>>>> GRAVE CASUALTIES SUSTAINED ... ELEVATING EVACUATION STATUS <<<<<<');

                    Memory.evac_timer[unit.memory.home_index] +=            bloodhunterCasualty_delay; //add more evac time if the bloodhunter falls, just to be safe

                    Memory.viable_prey[unit.memory.home_index] =            false; //returns bloodhunters to dormant state, in spite of the active evac timer
                    Memory.bloodhunter_casualty[unit.memory.home_index] =   true;
                    unit.memory.killswitch =                                true;
                }


                //locate and evaluate enemy
                const bloodmark = unit.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

                if (bloodmark){
                    let enemy_attackParts = 0;

                    for (let i=0; i<bloodmark.body.length; i++){
                        if (bloodmark.body[i]['type'] == 'ATTACK')
                            enemy_attackParts++;
                    }

                    //salvage unit and elevate threat level if the enemy is powerful enough to deal over 75% health in one hit
                    if (enemy_attackParts*dmgPerAtkPart >= unit.hitsMax*(1-lowHP_threshold)){
                        Game.notify(unit.name + ':: >>>>>> OVERWHELMING THREAT DETECTED IN SECTOR #' + unit.memory.home_index + ' ... ELEVATING EVACUATION STATUS <<<<<<');
                        console.log(unit.name + ':: >>>>>> OVERWHELMING THREAT DETECTED IN SECTOR #' + unit.memory.home_index + ' ... ELEVATING EVACUATION STATUS <<<<<<');

                        Memory.evac_timer[unit.memory.home_index] =             CREEP_LIFE_TIME; //react with full evac protocol

                        Memory.viable_prey[unit.memory.home_index] =            false; //returns bloodhunters to dormant state, in spite of the active evac timer
                        Memory.bloodhunter_casualty[unit.memory.home_index] =   true;
                        unit.memory.killswitch =                                true;
                    }
            
                    //engage the enemy
                    else if (unit.attack(bloodmark) == ERR_NOT_IN_RANGE)
                        unit.moveTo(bloodmark);
                }


                //when enemy is slain, or otherwise gone from sight...
                else if (Memory.evac_timer[unit.memory.home_index] > reinforcement_delay){
                    console.log(unit.name + ':: SECTOR #' + unit.memory.home_index + ': LAST ENCOUNTERED TARGET LONGER IN SIGHT ... RELEASING EVACUATION LOCKDOWN IN ' +
                        reinforcement_delay + ' TICKS');

                    //wind back the evac timer to near-reset (in case more threats are soon to appear)
                    Memory.evac_timer[unit.memory.home_index] = reinforcement_delay; //eventually triggers blood hunter dormancy
                }
            }
        }


        //built-in economic killswitch
        else if (Game.getObjectById(nexus_id).recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(Game.getObjectById(nexus_id));
    }
};