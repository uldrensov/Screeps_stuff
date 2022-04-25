var SD =                    require('SET_SOFTDATA');
var SET_MEMORYINIT =        require('SET_MEMORYINIT');
var DRIVE_RESPONSES =       require('DRIVE_RESPONSES');
var DRIVE_DAILIES =         require('DRIVE_DAILIES');
var DRIVE_SPAWN =           require('DRIVE_SPAWN');
var DRIVE_UNITS =           require('DRIVE_UNITS');
var DRIVE_TOWERS =          require('DRIVE_TOWERS');
var DRIVE_ECON =            require('DRIVE_ECON');


module.exports.loop = function(){
    
    //run memory init periodically to maintain configuration standards
    //if this is the first time the software is run, call SET_MEMORYINIT immediately
    if (Game.time % SD.std_interval == 0 || !Memory.init_true){
        SET_MEMORYINIT.run(SD.ctrl_id.length);
        Memory.init_true = true;
    }
    
    
    //garbage collect the names of expired units
    for (let name in Memory.creeps){
        if (!Game.creeps[name]){
            console.log('MAIN:: ' + name + ' has expired.');
            delete Memory.creeps[name];
        }
    }
    

    //run contingent threat responses
    DRIVE_RESPONSES.run();


    //run daily processes
    DRIVE_DAILIES.run();


    //run economy automation script
    DRIVE_ECON.run();

    //TICK LOG BREAKPOINT 0
    if (Memory.recordTick){
        if (!Memory.cpu_log[0])
            Memory.cpu_log[0] = [];
        Memory.cpu_log[0][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
    

    //run spawning algorithm (periodically)
    if (Game.time % SD.std_interval == 0)
        DRIVE_SPAWN.run();

    //TICK LOG BREAKPOINT 1
    if (Memory.recordTick){
        if (!Memory.cpu_log[1])
            Memory.cpu_log[1] = [];
        Memory.cpu_log[1][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
    

    //run tower AI script
    DRIVE_TOWERS.run();

    //TICK LOG BREAKPOINT 2
    if (Memory.recordTick){
        if (!Memory.cpu_log[2])
            Memory.cpu_log[2] = [];
        Memory.cpu_log[2][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
    
    
    //run unit AI scripts
    DRIVE_UNITS.run();

    //TICK LOG BREAKPOINT 9
    if (Memory.recordTick){
        if (!Memory.cpu_log[9])
            Memory.cpu_log[9] = [];
        Memory.cpu_log[9][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
    }
}