var SD =                    require('SOFTDATA');
var MEMORYINIT =            require('MEMORYINIT');
var SPAWNCYCLE =            require('SPAWNCYCLE');
var UNITDRIVE =             require('UNITDRIVE');


module.exports.loop = function(){
    
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
    
    //email alerts for vault energy conservation
    for (let i=0; i<SD.roomcount; i++){
        if (nexi[i].room.storage == undefined) continue;
        
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
    if (Game.time % 5 == 0)
        SPAWNCYCLE.run();
    
    //run unit AI scripts
    UNITDRIVE.run();
}