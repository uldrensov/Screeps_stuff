var SD =                    require('SOFTDATA');
var MEMORYINIT =            require('MEMORYINIT');
var SPAWNCYCLE =            require('SPAWNCYCLE');
var UNITDRIVE =             require('UNITDRIVE');


module.exports.loop = function(){
    
    MEMORYINIT.run();
    var nexi = [Game.getObjectById(SD.nexus_id[0]), Game.getObjectById(SD.nexus_id[1]), Game.getObjectById(SD.nexus_id[2])];
    
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    //remote mining security system
    for (let i=0; i<Memory.evac_timer.length; i++){
        //generic handling...
        //if anything is disturbing remote mining, disable remote worker spawns
        if (Memory.evac_timer[i] > 0 || Memory.core_sighting[i] == true){
            if (Memory.recalibrator_MAX[i] > 0) Memory.recalibrator_MAX[i] = -1;
            if (Memory.orbitalAssimilator_MAX[i] > 0) Memory.orbitalAssimilator_MAX[i] = -1;
            if (Memory.orbitalDrone_MAX[i] > 0) Memory.orbitalDrone_MAX[i] = -1;
        }
        //if neither of the 2 cases are occurring, restore worker spawns
        else{
            if (Memory.recalibrator_MAX[i] < 0) Memory.recalibrator_MAX[i] = 1;
            if (Memory.orbitalAssimilator_MAX[i] < 0) Memory.orbitalAssimilator_MAX[i] = 1;
            if (Memory.orbitalDrone_MAX[i] < 0) Memory.orbitalDrone_MAX[i] = 1;
        }
        
        //additional case-specific handling...
        //if it's an invader, count down the timer and possibly enable blood hunters
        if (Memory.evac_timer[i] > 0){
            Memory.evac_timer[i]--;
            if (Memory.viable_prey[i] == true)
                Memory.bloodhunter_MAX[i] = 1;
        }
        else{
            Memory.bloodhunter_MAX[i] = -1;
            Memory.viable_prey[i] = false;
        }
            
        //if it's a core, enable enforcers
        if (Memory.core_sighting[i] == true)
            Memory.enforcer_MAX[i] = 1;
        else Memory.enforcer_MAX[i] = -1;
    }
    
    //email alerts for vault energy conservation
    for (let i=0; i<Memory.vaultAlert_EN.length; i++){
        //enable alert for a room when its vault rises past 15% of the minimum threshold
        if ((nexi[i].room.storage.store.energy > SD.vault_reserve_min * 1.15) && !Memory.vaultAlert_EN[i])
            Memory.vaultAlert_EN[i] = true;
        //disable further alerts from a room when it raises one
        else if (nexi[i].room.storage.store.energy < SD.vault_reserve_min && Memory.vaultAlert_EN[i]){
            console.log('------------------------------');
            console.log('Vault #' + i + ' has entered conservation mode.');
            console.log('------------------------------');
            Game.notify('Vault #' + i + ' has entered conservation mode.',0);
            Memory.vaultAlert_EN[i] = false;
        }
    }
    
    
    //run spawning algorithm
    SPAWNCYCLE.run();
    
    //run unit AI scripts
    UNITDRIVE.run();
}