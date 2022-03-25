var SD =                    require('SOFTDATA');
var MEMORYINIT =            require('MEMORYINIT');
var SPAWNCYCLE =            require('SPAWNCYCLE');
var UNITDRIVE =             require('UNITDRIVE');
var TOWERDRIVE =            require('TOWERDRIVE');
var ECONDRIVE =             require('ECONDRIVE');


module.exports.loop = function(){
    
    if (Game.time % SD.std_interval == 0)
        MEMORYINIT.run(SD.nexus_id.length);
    
    let nexi = [];
    for (let i=0; i<SD.nexus_id.length; i++){
        nexi[i] = Game.getObjectById(SD.nexus_id[i]);
    }
    
    
    //garbage collect the names of expired units
    for (let name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            //console.log(name + ' has expired.');
        }
    }
    
    //remote mining security response
    for (let i=0; i<SD.nexus_id.length; i++){
        //high alert: count down the timer, disable remote worker spawns, and enable blood hunter spawn (if necessary)
        if (Memory.evac_timer[i] > 0){
            Memory.evac_timer[i]--;
            if (Memory.recalibrator_MAX[i] > 0)         Memory.recalibrator_MAX[i] =        -1;
            if (Memory.orbitalAssimilator_MAX[i] > 0)   Memory.orbitalAssimilator_MAX[i] =  -1;
            if (Memory.orbitalDrone_MAX[i] > 0)         Memory.orbitalDrone_MAX[i] =        -1;
            if (Memory.viable_prey[i] == true)          Memory.bloodhunter_MAX[i] =         1;
        }
        //no alert: clear prey flag, re-enable remote worker spawns, and disable blood hunter spawn
        else{
            if (Memory.recalibrator_MAX[i] < 0)         Memory.recalibrator_MAX[i] =        1;
            if (Memory.orbitalAssimilator_MAX[i] < 0)   Memory.orbitalAssimilator_MAX[i] =  1;
            if (Memory.orbitalDrone_MAX[i] < 0)         Memory.orbitalDrone_MAX[i] =        1;
            Memory.bloodhunter_MAX[i] = -1;
            Memory.viable_prey[i] = false;
        }
    }
    
    //probe spawn management
    if (Game.time % SD.std_interval == 0){
        let roomStructs_sub50;
        let roomStructs_sub75;

        for (let i=0; i<nexi.length; i++){
            if (Memory.probe_MAX[i] != 0){
                if (nexi[i] == null)    continue; //emergency bypass
                
                roomStructs_sub50 = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.5          && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) ||
                                (structure.hits < Memory.wall_threshold*.5      && structure.structureType == STRUCTURE_WALL) ||
                                (structure.hits < Memory.rampart_threshold*.5   && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                roomStructs_sub75 = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return ((structure.hits < structure.hitsMax*.75         && structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART) ||
                                (structure.hits < Memory.wall_threshold*.75     && structure.structureType == STRUCTURE_WALL) ||
                                (structure.hits < Memory.rampart_threshold*.75  && structure.structureType == STRUCTURE_RAMPART));
                    }
                });
                
                if (roomStructs_sub50.length)           Memory.probe_MAX[i] = 1; //enable probe spawn if there are structures below 50%
                if (!roomStructs_sub75.length)          Memory.probe_MAX[i] = -1; //disable probe spawn if all structures are above 75%
                
                //clear vars
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