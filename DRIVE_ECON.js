//function: automates economic functions (vault monitor, market transactions, power procession, pixel generation)

var SD =                    require('SET_SOFTDATA');
var TRANSFER_INROOM =       require('TRANSFER_INROOM.exe');
var TRADE_RESOURCE =        require('TRADE_RESOURCE.exe');
var TRADE_ENERGY =          require('TRADE_ENERGY.exe');


module.exports = {
    run: function(){

        const ctrlLvl_max =             8;
        const threshApproach_factor =   1.5;
        const powerProcess_cost =       50;
        
        
        let ctrl = [];
        for (let i=0; i<SD.ctrl_id.length; i++){
            ctrl[i] = Game.getObjectById(SD.ctrl_id[i]);
        }
        
        
        //alerts for vault status
        for (let i=0; i<SD.ctrl_id.length; i++){
            //bypasses
            if (!ctrl[i])                               continue; //bypass: if controller fails to retrieve, skip the room
            if (!ctrl[i].room.storage)                  continue; //bypass: if the vault is missing, skip the room
        
            //LO...
            //enable (unlatch) the potential for LO alert when a room's vault energy is over the "floor" by 50% of the absolute threshold value
            if ((ctrl[i].room.storage.store.energy > SD.vault_boundary * threshApproach_factor)
                &&
                !Memory.vaultAlertLO_EN[i]){

                Memory.vaultAlertLO_EN[i] = true;
            }
            //disable (latch) further alerts from a room when it raises one
            else if ((ctrl[i].room.storage.store.energy < SD.vault_boundary)
                &&
                Memory.vaultAlertLO_EN[i]){
                    
                //console.log('DRIVE_ECON:: Vault #' + i + ' SHORTAGE');
                Memory.vaultAlertLO_EN[i] = false;
            }
        
            //HI...
            //enable (unlatch) the potential for HI alert when a room's vault is under the "ceiling" by 50% of the absolute threshold value
            if ((ctrl[i].room.storage.store.getUsedCapacity()
                    <
                (ctrl[i].room.storage.store.getCapacity() - (SD.vault_boundary * threshApproach_factor)))
                &&
                !Memory.vaultAlertHI_EN[i]){

                Memory.vaultAlertHI_EN[i] = true;
            }
            //disable (latch) further alerts from a room when it raises one
            else if ((ctrl[i].room.storage.store.getUsedCapacity()
                    >
                (ctrl[i].room.storage.store.getCapacity() - SD.vault_boundary))
                &&
                Memory.vaultAlertHI_EN[i]){

                //console.log('DRIVE_ECON:: Vault #' + i + ' SURPLUS');
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


            for (let i=0; i<SD.ctrl_id.length; i++){
                if (Memory.autoload_EN[i]){  
                    //bypass: if controller fails to retrieve, skip the room  
                    if (!ctrl[i])                       continue;
                
                    //check for vault/terminal existence
                    vault = ctrl[i].room.storage;
                    term = ctrl[i].room.terminal;

                    if (!vault || !term)                continue;


                    //print header if at least one room's autoload is enabled
                    if (printFlag){
                        console.log('DRIVE_ECON:: <<-----AUTOLOAD SUMMARY-------');
                        printFlag = false;
                    }
                
                    //load the terminal if there is sufficient free space for cargo
                    if (term.store.getFreeCapacity() >= SD.cargo_size){
                        resource_type = null;

                        //select a sellable resource that meets the cargo size
                        for (let x=0; x<SD.sellable_products[i].length; x++){
                            if (vault.store.getUsedCapacity(SD.sellable_products[i][x]) >= SD.cargo_size){
                                resource_type = SD.sellable_products[i][x];
                                break;
                            }
                        }
                        //do nothing for the current room if no suitable resource is found
                        if (!resource_type)
                            continue;


                        en_min_ratio = term.store.getUsedCapacity(RESOURCE_ENERGY) / term.store.getUsedCapacity(resource_type);
                    
                        //if terminal's energy-to-mineral ratio is insufficient, and vault has enough energy to *spare*, then load energy required for transaction
                        if (en_min_ratio < .5
                            &&
                            vault.store.getUsedCapacity(RESOURCE_ENERGY) >= SD.cargo_size + SD.vault_boundary){

                            autoload_return = TRANSFER_INROOM.run(i,RESOURCE_ENERGY,SD.cargo_size,'TRM',true,true);

                            if (autoload_return != OK)
                                console.log('DRIVE_ECON:: AUTOLOAD FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autoload_return + ']');
                        }
                        //if terminal's energy-to-mineral ratio is sufficient, then load minerals
                        else if (en_min_ratio >= .5){
                            autoload_return = TRANSFER_INROOM.run(i,resource_type,SD.cargo_size,'TRM',true,true);
                            
                            if (autoload_return != OK)
                                console.log('DRIVE_ECON:: AUTOLOAD FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autoload_return + ']');
                        }
                    }
                }
            }

            //print footer only if the header printed
            if (!printFlag)
                console.log('DRIVE_ECON:: ---------------------------->>');
        }
        
        
        //export terminal minerals
        if (Game.time % SD.autosell_interval == 0){
            let printFlag = true; //helper var for printing the header only once, and the footer only if the header prints
            let autosell_return;
            
            
            for (let i=0; i<SD.ctrl_id.length; i++){
                if (Memory.autosell_EN[i]){
                    //bypass: if controller fails to retrieve, skip the room
                    if (!ctrl[i])
                        continue;

                    //print header if at least one room's autosell is enabled
                    if (printFlag){
                        console.log('DRIVE_ECON:: <<-----AUTOSELL SUMMARY-------');
                        printFlag = false;
                    }
                    
                    if (ctrl[i].room.terminal){
                        autosell_return = null;
                        
                        //select a sellable resource (no specific priority order) and attempt to sell
                        for (let x=0; x<SD.sellable_products[i].length; x++){
                            if (ctrl[i].room.terminal.store.getUsedCapacity(SD.sellable_products[i][x]) > 0){
                                autosell_return = TRADE_RESOURCE.run(i,SD.sellable_products[i][x],true,0,false);

                                //if price tolerance is not met, check if the resource is whitelisted for tolerance ignore, and re-attempt trade if so
                                if (autosell_return == 'ERR_PRICETOL'){
                                    for (let z=0; z<SD.dumpsell_whitelist.length; z++){
                                        if (SD.sellable_products[i][x] == SD.dumpsell_whitelist[z]){
                                            autosell_return = TRADE_RESOURCE.run(i,SD.sellable_products[i][x],true,0,true);
                                            break;
                                        }
                                    }
                                }

                                //upon successful sell, move on to the next room
                                if (autosell_return == OK)
                                    break;
                            }
                        }

                        //if sellable resources exist, but all failed to sell, output the error of the very last attempt
                        if (autosell_return)
                            if (autosell_return != OK)
                                console.log('DRIVE_ECON:: AUTOSELL FAILED IN ROOM #' + i + ' WITH LAST ERROR RESPONSE [' + autosell_return + ']');
                    }
                }
            }

            //print footer only if the header printed
            if (!printFlag)
                console.log('DRIVE_ECON:: ---------------------------->>');
        }
        
        
        //export excess terminal energy
        if (Game.time % SD.autosell_interval == 0){
            let printFlag = true; //helper var for printing the header only once, and the footer only if the header prints
            let autovent_return;


            for (let i=0; i<SD.ctrl_id.length; i++){
                if (Memory.autovent_EN[i]){
                    //bypass: if controller fails to retrieve, skip the room
                    if (!ctrl[i])
                        continue;
                    
                    //print header if at least one autovent is enabled
                    if (printFlag){
                        console.log('DRIVE_ECON:: <<-----AUTOVENT SUMMARY-------');
                        printFlag = false;
                    }

                    //vent attempt
                    if (ctrl[i].room.terminal)
                        if (ctrl[i].room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 0){
                            autovent_return = TRADE_ENERGY.run(i);

                            if (autovent_return != OK)
                                console.log('DRIVE_ECON:: AUTOVENT FAILED IN ROOM #' + i + ' WITH ERROR RESPONSE [' + autovent_return + ']');
                        }
                }
            }

            //print footer only if the header printed
            if (!printFlag)
                console.log('DRIVE_ECON:: ---------------------------->>');
        }
        

        //process power
        for (let i=0; i<SD.ctrl_id.length; i++){
            if (!ctrl[i])                           continue; //bypass: if controller fails to retrieve, skip the room

            //ignore rooms under level requirement for power nexus
            if (ctrl[i].level < ctrlLvl_max)        continue;


            //if powernex exists, process power
            if (Game.getObjectById(Memory.powernex_id[i])){
                if (Game.getObjectById(Memory.powernex_id[i]).store.getUsedCapacity(RESOURCE_POWER) > 0
                    &&
                    Game.getObjectById(Memory.powernex_id[i]).store.getUsedCapacity(RESOURCE_ENERGY) >= powerProcess_cost){

                    Game.getObjectById(Memory.powernex_id[i]).processPower();
                }
            }

            //if no powernex exists, search for one periodically
            else if (Game.time % SD.std_interval == 0){
                let powernex = ctrl[i].room.find(FIND_STRUCTURES, {
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
                console.log('DRIVE_ECON:: PIXEL GENERATED');
                Memory.pixelGainToday++;
            }
        }
    }
};