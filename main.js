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
    
    //room (dis)repair management
    if (Game.time % SD.std_interval == 0){
        let roomStructs_sub50;
        let roomStructs_sub75;
        for (let i=0; i<nexi.length; i++){
            if (Memory.probe_MAX[i] != 0){
                
                //emergency bypass
                if (nexi[i] == null) continue;
                
                roomStructs_sub50 = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.5 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) ||
                        (structure.hits < Memory.wall_threshold*.5 && structure.structureType == STRUCTURE_WALL) ||
                        (structure.hits < Memory.rampart_threshold*.5 && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                roomStructs_sub75 = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.75 && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) ||
                        (structure.hits < Memory.wall_threshold*.75 && structure.structureType == STRUCTURE_WALL) ||
                        (structure.hits < Memory.rampart_threshold*.75 && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                
                if (roomStructs_sub50.length && Memory.probe_MAX[i] < 0) Memory.probe_MAX[i] = 1; //if probes are dormant but sub-50 structures exist, enable them
                if (!roomStructs_sub75.length && Memory.probe_MAX[i] > 0) Memory.probe_MAX[i] = -1; //if probes are active but no more sub-75 structures exist, disable them
                
                //clear
                roomStructs_sub50 = undefined;
                roomStructs_sub75 = undefined;
            }
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