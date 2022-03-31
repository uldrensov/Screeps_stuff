var SD =                    require('SOFTDATA');
var MEMORYINIT =            require('MEMORYINIT');
var SPAWNCYCLE =            require('SPAWNCYCLE');
var UNITDRIVE =             require('UNITDRIVE');
var TOWERDRIVE =            require('TOWERDRIVE');
var ECONDRIVE =             require('ECONDRIVE');


module.exports.loop = function(){
    
    //memory initialisation
    if (Memory.init_true == undefined)
        Memory.init_true = false;

    //run memory init periodically to ensure new rooms have initialised data
    //if this is the first time the software is run, call MEMORYINIT immediately
    if (Game.time % SD.std_interval == 0 || !Memory.init_true){
        MEMORYINIT.run(SD.nexus_id.length);
        Memory.init_true = true;
    }
    

    let nexi = [];
    for (let i=0; i<SD.nexus_id.length; i++){
        nexi[i] = Game.getObjectById(SD.nexus_id[i]);
    }
    
    
    let room_of_origin;

    //garbage collect the names of expired units
    for (let name in Memory.creeps){
        if (!Game.creeps[name]){
            //TODO: add room # to every unit's memory; then delete this if-block
            if (Memory.creeps[name].home_index == undefined)
                room_of_origin = '_';
            else
                room_of_origin = Memory.creeps[name].home_index;

            console.log('MAIN:: Room #' + room_of_origin + ': ' + name + ' has expired.');
            delete Memory.creeps[name];
        }
    }
    
    //remote mining security response
    for (let i=0; i<SD.nexus_id.length; i++){
        //high alert: count down the timer, disable remote worker spawns, and enable blood hunter spawn (if prey is killable)
        if (Memory.evac_timer[i] > 0){
            Memory.evac_timer[i]--;

            if (Memory.recalibrator_MAX[i] > 0)         Memory.recalibrator_MAX[i] =        -1;
            if (Memory.orbitalAssimilator_MAX[i] > 0)   Memory.orbitalAssimilator_MAX[i] =  -1;
            if (Memory.orbitalDrone_MAX[i] > 0)         Memory.orbitalDrone_MAX[i] =        -1;

            if (Memory.viable_prey[i] == true)          Memory.bloodhunter_MAX[i] =         1;
            else                                        Memory.bloodhunter_MAX[i] =         -1;
        }
        //no alert: clear prey flag, re-enable remote worker spawns, disable blood hunter spawn, and reset bloodhunter flags
        else{
            if (Memory.recalibrator_MAX[i] < 0)         Memory.recalibrator_MAX[i] =        1;
            if (Memory.orbitalAssimilator_MAX[i] < 0)   Memory.orbitalAssimilator_MAX[i] =  1;
            if (Memory.orbitalDrone_MAX[i] < 0)         Memory.orbitalDrone_MAX[i] =        1;

            Memory.bloodhunter_MAX[i] =         -1;
            Memory.viable_prey[i] =             false;
            Memory.bloodhunter_casualty[i] =    false;
        }
    }
    
    //(periodic) probe spawn management
    if (Game.time % SD.std_interval == 0){
        let roomStructs_sub50;
        let roomStructs_sub75;

        for (let i=0; i<SD.nexus_id.length; i++){
            if (Memory.probe_MAX[i] != 0){
                if (nexi[i] == null)    continue; //error: if nexus fails to retrieve, skip the room
                
                roomStructs_sub50 = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.5          && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                                ||
                                (structure.hits < Memory.wall_threshold*.5      && structure.structureType == STRUCTURE_WALL)
                                ||
                                (structure.hits < Memory.rampart_threshold*.5   && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                roomStructs_sub75 = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.75         && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART)
                                ||
                                (structure.hits < Memory.wall_threshold*.75     && structure.structureType == STRUCTURE_WALL)
                                ||
                                (structure.hits < Memory.rampart_threshold*.75  && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                
                if (roomStructs_sub50.length)           Memory.probe_MAX[i] = 1; //enable probe spawn if there are structures below 50%
                if (!roomStructs_sub75.length)          Memory.probe_MAX[i] = -1; //disable probe spawn if all structures are above 75%
            }
        }
    }
    
    
    //run economy automation script
    ECONDRIVE.run();
    
    //run spawning algorithm (periodically)
    if (Game.time % SD.std_interval == 0)
        SPAWNCYCLE.run();
    
    //run tower AI script
    TOWERDRIVE.run();
    
    //run unit AI scripts
    UNITDRIVE.run();
}