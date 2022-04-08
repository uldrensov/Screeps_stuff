//function: automates economic functions (vault monitor, market transactions, power procession, pixel generation)

var SD =                    require('SOFTDATA');
var TERMINALTRANSFER =      require('TERMINALTRANSFER.exe');
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
                //Game.notify('ECONDRIVE:: Vault #' + i + ' SHORTAGE',0);
                //console.log('ECONDRIVE:: Vault #' + i + ' SHORTAGE');
                Memory.vaultAlertLO_EN[i] = false;
            }
        
            //HI...
            //enable (unlatch) the potential for HI alert when a room's vault is under the "ceiling" by 50% of the absolute threshold value
            if ((nexi[i].room.storage.store.getUsedCapacity() < nexi[i].room.storage.store.getCapacity() - (SD.vault_boundary * 1.5)) && !Memory.vaultAlertHI_EN[i])
                Memory.vaultAlertHI_EN[i] = true;
            //disable (latch) further alerts from a room when it raises one
            else if ((nexi[i].room.storage.store.getUsedCapacity() > nexi[i].room.storage.store.getCapacity() - SD.vault_boundary) && Memory.vaultAlertHI_EN[i]){
                //Game.notify('ECONDRIVE:: Vault #' + i + ' SURPLUS',0);
                //console.log('ECONDRIVE:: Vault #' + i + ' SURPLUS');
                Memory.vaultAlertHI_EN[i] = false;
            }
        }
    
        
        //load terminals with outbound cargo
        if (Game.time % SD.autoload_interval == 0){
            let resource_type;
            let printFlag = true; //helper var for printing the header only once, and the footer only if the header prints
            let autoload_return;

            let vault;
            let term;

            let en_min_ratio;


            for (let i=0; i<SD.nexus_id.length; i++){
                if (Memory.autoload_EN[i] == true){    
                    if (nexi[i] == null)                continue; //error: if nexus fails to retrieve, skip the room
                
                    //check for vault/terminal existence
                    vault = nexi[i].room.storage;
                    term = nexi[i].room.terminal;

                    if (!vault || !term)                continue;


                    //print header if at least one room's autoload is enabled
                    if (printFlag){
                        console.log('ECONDRIVE:: <<-----AUTOLOAD SUMMARY-------');
                        printFlag = false;
                    }
                
                    //load the terminal if there is sufficient free space for cargo
                    if (term.store.getFreeCapacity() >= SD.cargo_size){
                        resource_type = undefined;

                        //select a sellable resource that meets the cargo size
                        for (let x=0; x<SD.sellable_products[i].length; x++){
                            if (vault.store.getUsedCapacity(SD.sellable_products[i][x]) >= SD.cargo_size){
                                resource_type = SD.sellable_products[i][x];
                                break;
                            }
                        }
                        //do nothing for the current room if no suitable resource is found
                        if (resource_type == undefined) continue;


                        en_min_ratio = term.store.getUsedCapacity(RESOURCE_ENERGY) / term.store.getUsedCapacity(resource_type);
                    
                        //if terminal's energy-to-mineral ratio is insufficient, and vault has enough energy to *spare*, then load energy required for transaction
                        if (en_min_ratio < .5
                            &&
                            vault.store.getUsedCapacity(RESOURCE_ENERGY) >= SD.cargo_size + SD.vault_boundary){

                            autoload_return = TERMINALTRANSFER.run(i,'energy',SD.cargo_size,'TRM',true,true);

                            if (autoload_return != OK)
                                console.log('ECONDRIVE:: AUTOLOAD FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autoload_return + ']');
                        }
                        //if terminal's energy-to-mineral ratio is sufficient, then load minerals
                        else if (en_min_ratio >= .5){
                            autoload_return = TERMINALTRANSFER.run(i,resource_type,SD.cargo_size,'TRM',true,true);
                            
                            if (autoload_return != OK)
                                console.log('ECONDRIVE:: AUTOLOAD FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autoload_return + ']');
                        }
                    }
                }
            }

            //print footer only if the header printed
            if (!printFlag)
                console.log('ECONDRIVE:: ---------------------------->>');
        }
        
        
        //export terminal minerals
        if (Game.time % SD.autosell_interval == 0){
            let printFlag = true; //helper var for printing the header only once, and the footer only if the header prints
            let autosell_return;
            
            
            for (let i=0; i<SD.nexus_id.length; i++){
                if (Memory.autosell_EN[i] == true){
                    if (nexi[i] == null)                continue; //error: if nexus fails to retrieve, skip the room

                    //print header if at least one room's autosell is enabled
                    if (printFlag){
                        console.log('ECONDRIVE:: <<-----AUTOSELL SUMMARY-------');
                        printFlag = false;
                    }
                    
                    if (nexi[i].room.terminal != undefined){
                        autosell_return = undefined;
                        
                        //select a sellable resource (no specific priority order) and attempt to sell
                        for (let x=0; x<SD.sellable_products[i].length; x++){
                            if (nexi[i].room.terminal.store.getUsedCapacity(SD.sellable_products[i][x]) > 0){
                                autosell_return = TRANSACTION.run(i,SD.sellable_products[i][x],false);

                                //upon successful sell, move on to the next room
                                if (autosell_return == OK)
                                    break;
                            }
                        }

                        //if sellable resources exist, but all failed to sell, output the error of the very last attempt
                        if (autosell_return != undefined)
                            if (autosell_return != OK)
                                console.log('ECONDRIVE:: AUTOSELL FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autosell_return + ']');
                    }
                }
            }

            //print footer only if the header printed
            if (!printFlag)
                console.log('ECONDRIVE:: ---------------------------->>');
        }
        
        
        //export excess terminal energy
        if (Game.time % SD.autosell_interval == 0){
            let printFlag = true; //helper var for printing the header only once, and the footer only if the header prints
            let autovent_return;


            for (let i=0; i<SD.nexus_id.length; i++){
                if (Memory.autovent_EN[i] == true){
                    if (nexi[i] == null)            continue; //error: if nexus fails to retrieve, skip the room
                    
                    //print header if at least one autovent is enabled
                    if (printFlag){
                        console.log('ECONDRIVE:: <<-----AUTOVENT SUMMARY-------');
                        printFlag = false;
                    }

                    //vent attempt
                    if (nexi[i].room.terminal != undefined)
                        if (nexi[i].room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0){
                            autovent_return = ENERGYVENT.run(i);

                            if (autovent_return != OK)
                                console.log('ECONDRIVE:: AUTOVENT FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autovent_return + ']');
                        }
                }
            }

            //print footer only if the header printed
            if (!printFlag)
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
                if (getPowerNex.store.getUsedCapacity(RESOURCE_POWER) > 0
                    &&
                    getPowerNex.store.getUsedCapacity(RESOURCE_ENERGY) >= 50)

                    getPowerNex.processPower();
            }
            //if no powernex exists, search for one periodically
            else if (Game.time % SD.std_interval == 0){
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
            if (Game.cpu.generatePixel() == OK){
                Game.notify('ECONDRIVE:: PIXEL GENERATED');
                console.log('ECONDRIVE:: -------------------PIXEL GENERATED-------------------');
                Memory.pixelGainToday++;
            }
        }
    }
};