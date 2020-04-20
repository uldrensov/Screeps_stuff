var SD =                    require('SOFTDATA');
var MEMORYINIT =            require('MEMORYINIT');
var SPAWNCYCLE =            require('SPAWNCYCLE');
var UNITDRIVE =             require('UNITDRIVE');
var TOWERDRIVE =            require('TOWERDRIVE');
var ECONDRIVE =             require('ECONDRIVE');


module.exports.loop = function(){
    
    if (Game.time % SD.std_interval == 0)
        MEMORYINIT.run(SD.roomcount);
    
    var nexi = [];
    for (let i=0; i<SD.nexus_id.length; i++){
        nexi[i] = Game.getObjectById(SD.nexus_id[i]);
    }
    
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    //remote mining security system
    for (let i=0; i<SD.roomcount; i++){
        //invader handling: count down the timer, disable remote worker spawns, and possibly enable blood hunters
        if (Memory.evac_timer[i] > 0){
            Memory.evac_timer[i]--;
            if (Memory.recalibrator_MAX[i] > 0) Memory.recalibrator_MAX[i] = -1;
            if (Memory.orbitalAssimilator_MAX[i] > 0) Memory.orbitalAssimilator_MAX[i] = -1;
            if (Memory.orbitalDrone_MAX[i] > 0) Memory.orbitalDrone_MAX[i] = -1;
            if (Memory.viable_prey[i] == true) Memory.bloodhunter_MAX[i] = 1;
        }
        else{
            if (Memory.recalibrator_MAX[i] < 0) Memory.recalibrator_MAX[i] = 1;
            if (Memory.orbitalAssimilator_MAX[i] < 0) Memory.orbitalAssimilator_MAX[i] = 1;
            if (Memory.orbitalDrone_MAX[i] < 0) Memory.orbitalDrone_MAX[i] = 1;
            Memory.bloodhunter_MAX[i] = -1;
            Memory.viable_prey[i] = false;
        }
    }
    
    
    //run economy automation script
    ECONDRIVE.run();
    
    //run spawning algorithm
    if (Game.time % SD.std_interval == 0)
        SPAWNCYCLE.run();
    
    //run tower AI script
    TOWERDRIVE.run();
    
    //run unit AI scripts
    UNITDRIVE.run();
}