//function: automates economic functions (vault monitor, market transactions, power procession)

var SD =                    require('SOFTDATA');
var TRANSACTION =           require('TRANSACTION.exe');


module.exports = {
    run: function(){
        
        var nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        
        //email alerts for vault status
        for (let i=0; i<SD.roomcount; i++){
            //bypasses
            if (nexi[i] == null) continue;
            if (nexi[i].room.storage == undefined) continue;
        
            //LO...
            //enable potential LO alert for a room when its vault energy recovers above 50% of the low boundary
            if ((nexi[i].room.storage.store.energy > SD.vault_boundary * 1.5) && !Memory.vaultAlertLO_EN[i])
                Memory.vaultAlertLO_EN[i] = true;
            //disable further alerts from a room when it raises one
            else if ((nexi[i].room.storage.store.energy < SD.vault_boundary) && Memory.vaultAlertLO_EN[i]){
                console.log('------------------------------');
                console.log('Vault #' + i + ' SHORTAGE');
                console.log('------------------------------');
                Game.notify('Vault #' + i + ' SHORTAGE',0);
                Memory.vaultAlertLO_EN[i] = false;
            }
        
            //HI...
            //enable potential HI alert for a room when its vault subducts below 50% of the high boundary
            if ((nexi[i].room.storage.store.getUsedCapacity() < nexi[i].room.storage.store.getCapacity() - (SD.vault_boundary * 1.5)) && !Memory.vaultAlertHI_EN[i])
                Memory.vaultAlertHI_EN[i] = true;
            //disable further alerts from a room when it raises one
            else if ((nexi[i].room.storage.store.getUsedCapacity() > nexi[i].room.storage.store.getCapacity() - SD.vault_boundary) && Memory.vaultAlertHI_EN[i]){
                console.log('------------------------------');
                console.log('Vault #' + i + ' SURPLUS');
                console.log('------------------------------');
                Game.notify('Vault #' + i + ' SURPLUS',0);
                Memory.vaultAlertHI_EN[i] = false;
            }
        }
    
        //export terminal contents
        if (Game.time % SD.autosell_interval == 0 && Memory.autosell_EN == true){
            var transactionResult = false;
            console.log('<<----------------------------');
            for (let i=0; i<SD.nexus_id.length; i++){
                //emergency bypass
                if (nexi[i] == null) continue;
            
                if (nexi[i].room.terminal != undefined){
                    if (nexi[i].room.terminal.store.getUsedCapacity(Memory.mineral_type[i].mineralType) > 0)
                        if (TRANSACTION.run(i) == OK) transactionResult = true;
                }
            }
            if (!transactionResult) console.log('NO AUTO-TRANSACTION MADE');
            console.log('---------------------------->>');
        }
    
        //process power
        if (Game.time % SD.std_interval == 0){
            var powernex;
            for (let i=0; i<SD.nexus_id.length; i++){
                //emergency bypass
                if (nexi[i] == null) continue;
            
                powernex = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_POWER_SPAWN;
                    }
                });
                Memory.powernex_id[i] = powernex.length? powernex[0].id:'NULL';
            }
        }
        var getPowerNex;
        for (let i=0; i<SD.nexus_id.length; i++){
            getPowerNex = Game.getObjectById(Memory.powernex_id[i]);
            if (getPowerNex != null){
                if (getPowerNex.store.getUsedCapacity(RESOURCE_POWER) > 0 && getPowerNex.store.getUsedCapacity(RESOURCE_ENERGY) >= 50)
                    getPowerNex.processPower();
            }
        }
    }
};