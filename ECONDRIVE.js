//function: automates economic functions (vault monitor, market transactions, power procession, pixel generation)

var SD =                    require('SOFTDATA');
var TRANSACTION =           require('TRANSACTION.exe');
var ENERGYVENT =            require('ENERGYVENT.exe');


module.exports = {
    run: function(){
        
        let nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        
        //email alerts for vault status
        for (let i=0; i<SD.nexus_id.length; i++){
            //bypasses
            if (nexi[i] == null)                    continue; //error: if nexus fails to retrieve, skip the room
            if (nexi[i].room.storage == undefined)  continue; //error: if the vault is missing, skip the room
        
            //LO...
            //enable (unlatch) the potential for LO alert when a room's vault energy is over the "floor" by 50% of the absolute threshold value
            if ((nexi[i].room.storage.store.energy > SD.vault_boundary * 1.5) && !Memory.vaultAlertLO_EN[i])
                Memory.vaultAlertLO_EN[i] = true;
            //disable (latch) further alerts from a room when it raises one
            else if ((nexi[i].room.storage.store.energy < SD.vault_boundary) && Memory.vaultAlertLO_EN[i]){
                //console.log('ECONDRIVE:: <<------------------------------');
                //console.log('ECONDRIVE:: Vault #' + i + ' SHORTAGE');
                //console.log('ECONDRIVE:: ------------------------------>>');
                //Game.notify('ECONDRIVE:: Vault #' + i + ' SHORTAGE',0);
                Memory.vaultAlertLO_EN[i] = false;
            }
        
            //HI...
            //enable (unlatch) the potential for HI alert when a room's vault is under the "ceiling" by 50% of the absolute threshold value
            if ((nexi[i].room.storage.store.getUsedCapacity() < nexi[i].room.storage.store.getCapacity() - (SD.vault_boundary * 1.5)) && !Memory.vaultAlertHI_EN[i])
                Memory.vaultAlertHI_EN[i] = true;
            //disable (latch) further alerts from a room when it raises one
            else if ((nexi[i].room.storage.store.getUsedCapacity() > nexi[i].room.storage.store.getCapacity() - SD.vault_boundary) && Memory.vaultAlertHI_EN[i]){
                //console.log('ECONDRIVE:: <<------------------------------');
                //console.log('ECONDRIVE:: Vault #' + i + ' SURPLUS');
                //console.log('ECONDRIVE:: ------------------------------>>');
                //Game.notify('ECONDRIVE:: Vault #' + i + ' SURPLUS',0);
                Memory.vaultAlertHI_EN[i] = false;
            }
        }
    

        //load terminals with outbound cargo
        if (Game.time % SD.autoload_interval == 0 && SD.autoload_EN == true){
            let resource_type;
            let terminalLoadResult = false;
            console.log('ECONDRIVE:: <<-----AUTOLOAD SUMMARY-------');

            for (let i=0; i<SD.nexus_id.length; i++){
                if (nexi[i] == null)                continue; //error: if nexus fails to retrieve, skip the room
                
                //check for vault/terminal existence
                let vault = nexi[i].room.storage;
                let term = nexi[i].room.terminal;

                if (!vault || !term)                continue;
                
                //load the terminal if there is sufficient free space for cargo
                if (term.store.getFreeCapacity() >= SD.cargo_size){
                    //select a sellable resource that meets the cargo size
                    for (let x=0; x<SD.sellable_products[i].length; x++){
                        if (vault.store.getUsedCapacity(SD.sellable_products[i][x]) > SD.cargo_size){
                            resource_type = SD.sellable_products[i][x];
                            break;
                        }
                    }
                    //do nothing for the current room if no suitable resource is found
                    if (resource_type == undefined) continue;

                    let en_min_ratio = term.store.getUsedCapacity(RESOURCE_ENERGY) / term.store.getUsedCapacity(resource_type);
                    
                    //if terminal's energy-to-mineral ratio is insufficient, and vault has enough energy to *spare*, then load energy required for transaction
                    if (en_min_ratio < .5 && vault.store.getUsedCapacity(RESOURCE_ENERGY) >= SD.cargo_size + SD.vault_boundary){
                        require('TERMINALTRANSFER.exe').run(i,'energy',SD.cargo_size,'NA',true,true);
                        //console.log('ECONDRIVE:: AUTOLOADING ENERGY IN ROOM #' + i);
                        terminalLoadResult = true;
                    }
                    //if terminal's energy-to-mineral ratio is sufficient, then load minerals
                    else if (en_min_ratio >= .5){
                        require('TERMINALTRANSFER.exe').run(i,resource_type,SD.cargo_size,'NA',true,true);
                        //console.log('ECONDRIVE:: AUTOLOADING [' + resource_type + '] IN ROOM #' + i);
                        terminalLoadResult = true;
                    }
                }
            }
            if (!terminalLoadResult)
                console.log('ECONDRIVE:: [NO TERMINALS LOADED]');

            console.log('ECONDRIVE:: ---------------------------->>');
        }
        

        //export terminal contents
        if (Game.time % SD.autosell_interval == 0 && SD.autosell_EN == true){
            let resource_type;
            let transactionResult = false;
            console.log('ECONDRIVE:: <<-----AUTOSELL SUMMARY-------');

            for (let i=0; i<SD.nexus_id.length; i++){
                if (nexi[i] == null)                continue; //error: if nexus fails to retrieve, skip the room
                
                if (nexi[i].room.terminal != undefined){
                    //select a sellable resource
                    for (let x=0; x<SD.sellable_products[i].length; x++){
                        if (nexi[i].room.terminal.store.getUsedCapacity(SD.sellable_products[i][x]) > 0){
                            resource_type = SD.sellable_products[i][x];
                            break;
                        }
                    }
                    
                    if (resource_type != undefined)
                        if (TRANSACTION.run(i,resource_type) == OK)
                            transactionResult = true;
                }
            }
            if (!transactionResult)
                console.log('ECONDRIVE:: [NO TRANSACTIONS]');

            console.log('ECONDRIVE:: ---------------------------->>');
        }
        

        //export excess energy
        if (Game.time % SD.autosell_interval == 0){
            let ventResult = false;
            console.log('ECONDRIVE:: <<-----AUTOVENT SUMMARY-------');

            for (let i=0; i<SD.nexus_id.length; i++){
                if (Memory.autovent_EN[i] == true){
                    if (nexi[i] == null)            continue; //error: if nexus fails to retrieve, skip the room
                    
                    if (nexi[i].room.terminal != undefined){
                        if (nexi[i].room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
                            if (ENERGYVENT.run(i) == OK)
                                ventResult = true;
                    }
                }
            }
            if (!ventResult)
                console.log('ECONDRIVE:: [NO VENTING PERFORMED]');

            console.log('ECONDRIVE:: ---------------------------->>');
        }
        

        //process power
        let getPowerNex;
        for (let i=0; i<SD.nexus_id.length; i++){
            if (nexi[i] == null)                    continue; //error: if nexus fails to retrieve, skip the room

            //ignore rooms under level requirement for power nexus
            if (nexi[i].room.controller.level < 8)  continue;

            getPowerNex = Game.getObjectById(Memory.powernex_id[i]);
            
            //if powernex exists, proceed
            if (getPowerNex != null){
                if (getPowerNex.store.getUsedCapacity(RESOURCE_POWER) > 0 && getPowerNex.store.getUsedCapacity(RESOURCE_ENERGY) >= 50)
                    getPowerNex.processPower();
            }
            //if no powernex exists, search for one periodically
            else if(Game.time % SD.std_interval == 0){
                let powernex = nexi[i].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_POWER_SPAWN;
                    }
                });
                Memory.powernex_id[i] = powernex.length ? powernex[0].id : 'NULL';
            }
        }
        
        
        //produce cosmetics currency
        if (Game.cpu.bucket == 10000){
            Game.cpu.generatePixel();
            console.log('ECONDRIVE:: -------------------PIXEL GENERATED-------------------');
        }
    }
};