//function: automates economic functions (vault monitor, market transactions, power procession)

var SD =                    require('SOFTDATA');
var TRANSACTION =           require('TRANSACTION.exe');
var ENERGYVENT =            require('ENERGYVENT.exe');


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
    
        //load terminals with outbound cargo
        if (Game.time % SD.autoload_interval == 0 && Memory.autoload_EN == true){
            let terminalLoadResult = false;
            console.log('<<-----AUTOLOAD SUMMARY-------');
            for (let i=0; i<SD.nexus_id.length; i++){
                //emergency bypass
                if (nexi[i] == null) continue;
                
                //check for vault/terminal existence
                let vault = nexi[i].room.storage;
                let term = nexi[i].room.terminal;
                if (!vault || !term) continue;
                
                //load the terminal if there is sufficient free space for cargo
                if (term.store.getFreeCapacity() >= SD.cargo_size){
                    let minType = Memory.mineral_type[i].mineralType;
                    let en_min_ratio = term.store.getUsedCapacity(RESOURCE_ENERGY) / term.store.getUsedCapacity(minType);
                    
                    //if terminal's energy-to-mineral ratio is insufficient, and vault's energy content is plentiful, then load energy
                    if (en_min_ratio < .5 && vault.store.getUsedCapacity(RESOURCE_ENERGY) >= SD.cargo_size + SD.vault_boundary){
                        require('TERMINALTRANSFER.exe').run(i,'energy',SD.cargo_size,'NA',true,true);
                        //console.log('LOADING ENERGY IN ROOM #' + i);
                        terminalLoadResult = true;
                    }
                    //if terminal's energy-to-mineral ratio is sufficient, and vault's mineral content is plentiful, then load minerals
                    else if (en_min_ratio >= .5 && vault.store.getUsedCapacity(minType) >= SD.cargo_size){
                        require('TERMINALTRANSFER.exe').run(i,minType,SD.cargo_size,'NA',true,true);
                        //console.log('LOADING [' + minType + '] IN ROOM #' + i);
                        terminalLoadResult = true;
                    }
                }
            }
            if (!terminalLoadResult) console.log('[NO TERMINALS LOADED]');
            console.log('---------------------------->>');
        }
        
        //export terminal contents
        if (Game.time % SD.autosell_interval == 0 && Memory.autosell_EN == true){
            let transactionResult = false;
            console.log('<<-----AUTOSELL SUMMARY-------');
            for (let i=0; i<SD.nexus_id.length; i++){
                //emergency bypass
                if (nexi[i] == null) continue;
                
                if (nexi[i].room.terminal != undefined){
                    if (nexi[i].room.terminal.store.getUsedCapacity(Memory.mineral_type[i].mineralType) > 0)
                        if (TRANSACTION.run(i) == OK) transactionResult = true;
                }
            }
            if (!transactionResult) console.log('[NO TRANSACTIONS]');
            console.log('---------------------------->>');
        }
        
        //export excess energy
        if (Game.time % SD.autosell_interval == 0){
            let ventResult = false;
            console.log('<<-----AUTOVENT SUMMARY-------');
            for (let i=0; i<SD.nexus_id.length; i++){
                if (Memory.autovent_EN[i] == true){
                    //emergency bypass
                    if (nexi[i] == null) continue;
                    
                    if (nexi[i].room.terminal != undefined){
                        if (nexi[i].room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                            if (ENERGYVENT.run(i) == OK) ventResult = true;
                    }
                }
            }
            if (!ventResult) console.log('[NO VENTING PERFORMED]');
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
        for (let i=0; i<SD.nexus_id.length; i++){
            let getPowerNex = Game.getObjectById(Memory.powernex_id[i]);
            if (getPowerNex != null){
                if (getPowerNex.store.getUsedCapacity(RESOURCE_POWER) > 0 && getPowerNex.store.getUsedCapacity(RESOURCE_ENERGY) >= 50)
                    getPowerNex.processPower();
            }
        }
        
        //produce cosmetics currency
        if (Game.cpu.bucket == 10000){
            Game.cpu.generatePixel();
            console.log("-------------------PIXEL GENERATED-------------------");
        }
    }
};