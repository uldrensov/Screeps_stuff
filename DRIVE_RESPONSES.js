//function: runs various threat-response mechanisms

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(){

        //remote mining security response
        for (let i=0; i<SD.ctrl_id.length; i++){
            //high alert: count down the timer, disable remote worker spawns, disable enforcer/purifier spawns, and enable blood hunter spawn (if prey is killable)
            if (Memory.evac_timer[i] > 0){
                Memory.evac_timer[i]--;

                if (Memory.recalibrator_MAX[i]              > 0)    Memory.recalibrator_MAX[i] =        -1;
                if (Memory.orbitalAssimilator_MAX[i]        > 0)    Memory.orbitalAssimilator_MAX[i] =  -1;
                if (Memory.orbitalDrone_MAX[i]              > 0)    Memory.orbitalDrone_MAX[i] =        -1;

                Memory.enforcer_MAX[i] =                                                                -1;
                Memory.purifier_MAX[i] =                                                                -1;

                if (Memory.viable_prey[i])                          Memory.bloodhunter_MAX[i] =          1;
                else                                                Memory.bloodhunter_MAX[i] =         -1;
            }

            //no alert: clear prey flag, re-enable remote worker spawns (unless a purifier is active), disable blood hunter spawn, and reset bloodhunter flags
            else{
                if (Memory.purifier_MAX[i] < 1){
                    if (Memory.recalibrator_MAX[i]          < 0)    Memory.recalibrator_MAX[i] =         1;
                    if (Memory.orbitalAssimilator_MAX[i]    < 0)    Memory.orbitalAssimilator_MAX[i] =   1;
                    if (Memory.orbitalDrone_MAX[i]          < 0)    Memory.orbitalDrone_MAX[i] =         1;
                }

                Memory.bloodhunter_MAX[i] =                                                             -1;
                Memory.viable_prey[i] =                                                                 false;
                Memory.bloodhunter_casualty[i] =                                                        false;
            }
        }
    

        //probe spawn response to damaged structures
        if (Game.time % SD.std_interval == 0){
            let roomStructs_sub50;
            let roomStructs_sub75;

            //enable or disable probe spawns in rooms whose structures are sufficiently damaged
            for (let i=0; i<SD.ctrl_id.length; i++){
                //bypass: if controller fails to retrieve, skip the room
                if (!Game.getObjectById(SD.ctrl_id[i]))
                    continue;
                    
                roomStructs_sub50 = Game.getObjectById(SD.ctrl_id[i]).room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.5          && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                                ||
                                (structure.hits < Memory.wall_threshold*.5      && structure.structureType == STRUCTURE_WALL)
                                ||
                                (structure.hits < Memory.rampart_threshold*.5   && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                roomStructs_sub75 = Game.getObjectById(SD.ctrl_id[i]).room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.75         && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                                ||
                                (structure.hits < Memory.wall_threshold*.75     && structure.structureType == STRUCTURE_WALL)
                                ||
                                (structure.hits < Memory.rampart_threshold*.75  && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                    
                if (roomStructs_sub50.length)                       Memory.probe_MAX[i] =                1; //enable probe spawn if there are structures below 50%
                if (!roomStructs_sub75.length)                      Memory.probe_MAX[i] =               -1; //disable probe spawn if all structures are above 75%
            }
        }
        

        //nuke detection alert response
        if (Game.time % SD.nukeCheck_interval == 0){
            for (let i=0; i<SD.ctrl_id.length; i++){
                if (Game.getObjectById(SD.ctrl_id[i]).room.find(FIND_NUKES).length){
                    Game.notify('DRIVE_RESPONSES:: >>>>>> INCOMING NUCLEAR STRIKE -- ROOM #' + i + ' <<<<<<');
                    console.log('DRIVE_RESPONSES:: >>>>>> INCOMING NUCLEAR STRIKE -- ROOM #' + i + ' <<<<<<');
                }
            }
        }
    }
};