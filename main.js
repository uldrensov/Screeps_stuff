var SD =                    require('SET_SOFTDATA');
var SET_MEMORYINIT =        require('SET_MEMORYINIT');
var DRIVE_SPAWN =           require('DRIVE_SPAWN');
var DRIVE_UNITS =           require('DRIVE_UNITS');
var DRIVE_TOWERS =          require('DRIVE_TOWERS');
var DRIVE_ECON =            require('DRIVE_ECON');


module.exports.loop = function(){
    
    //run memory init periodically to maintain configuration standards
    //if this is the first time the software is run, call SET_MEMORYINIT immediately
    if (Game.time % SD.std_interval == 0 || !Memory.init_true){
        SET_MEMORYINIT.run(SD.nexus_id.length);
        Memory.init_true = true;
    }
    

    //every day, log 600 game ticks' worth of CPU usage, and log any credit/pixel revenue
    Memory.recordTick = false;

    //after 24h (~86400 seconds) from the start time, refresh it, clear the tick log, reset the logging counter to 0, and reset revenue counters
    if (Game.time % SD.std_interval == 0){
        if ((Date.now() - Memory.dayStart_timestamp) / 1000
            > 86400){

            Game.notify('MAIN:: Gained ' + Memory.creditGainToday + ' credits today!');
            Game.notify('MAIN:: Gained ' + Memory.pixelGainToday + ' pixels today!');

            Memory.dayStart_timestamp = Date.now();
            Memory.cpu_log =            [];
            Memory.ticksLoggedToday =   0;

            Memory.creditGainToday =    0;
            Memory.pixelGainToday =     0;
        }
    }

    //allow a tick to be logged until the counter reaches 600
    if (Memory.ticksLoggedToday < 600){
        Memory.recordTick = true;
        Memory.ticksLoggedToday++;
    }
    
    
    //garbage collect the names of expired units
    for (let name in Memory.creeps){
        if (!Game.creeps[name]){
            console.log('MAIN:: ' + name + ' has expired.');
            delete Memory.creeps[name];
        }
    }
    

    //remote mining security response
    for (let i=0; i<SD.nexus_id.length; i++){
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
    

    //(periodic) probe spawn management
    if (Game.time % SD.std_interval == 0){
        let roomStructs_sub50;
        let roomStructs_sub75;

        let nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }

        for (let i=0; i<SD.nexus_id.length; i++){
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
                
            if (roomStructs_sub50.length)                       Memory.probe_MAX[i] =                1; //enable probe spawn if there are structures below 50%
            if (!roomStructs_sub75.length)                      Memory.probe_MAX[i] =               -1; //disable probe spawn if all structures are above 75%
        }
    }
    

    //nuke detection alert
    if (Game.time % SD.nukeCheck_interval == 0){
        for (let i=0; i<SD.nexus_id.length; i++){
            if (Game.getObjectById(SD.nexus_id[i]).room.find(FIND_NUKES).length){
                Game.notify('MAIN:: >>>>>> INCOMING NUCLEAR STRIKE -- ROOM #' + i + ' <<<<<<');
                console.log('MAIN:: >>>>>> INCOMING NUCLEAR STRIKE -- ROOM #' + i + ' <<<<<<');
            }
        }
    }


    //run economy automation script
    DRIVE_ECON.run();

    //tick log breakpoint 0
    if (Memory.recordTick){
        if (Memory.cpu_log[0] == undefined)
            Memory.cpu_log[0] = [];
        Memory.cpu_log[0][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
    

    //run spawning algorithm (periodically)
    if (Game.time % SD.std_interval == 0)
        DRIVE_SPAWN.run();

    //tick log breakpoint 1
    if (Memory.recordTick){
        if (Memory.cpu_log[1] == undefined)
            Memory.cpu_log[1] = [];
        Memory.cpu_log[1][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
    

    //run tower AI script
    DRIVE_TOWERS.run();

    //tick log breakpoint 2
    if (Memory.recordTick){
        if (Memory.cpu_log[2] == undefined)
            Memory.cpu_log[2] = [];
        Memory.cpu_log[2][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
    
    
    //run unit AI scripts
    DRIVE_UNITS.run();

    //tick log breakpoint 3
    if (Memory.recordTick){
        if (Memory.cpu_log[3] == undefined)
            Memory.cpu_log[3] = [];
        Memory.cpu_log[3][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
}