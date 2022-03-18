//executable script: creates a compressed summary about every room's vault/terminal contents
    //require('STATUSREPORT_E.exe').run()
    
var SD = require('SOFTDATA');
    

module.exports = {
    run: function(){
        
        var nexus;
        var vault;
        var term;
        var mineral;
        
        for (let i=0; i<SD.nexus_id.length; i++){
            
            nexus = Game.getObjectById(SD.nexus_id[i]);
            
            //emergency bypass
            if (!nexus) continue;
            
            vault = nexus.room.storage;
            mineral = Memory.mineral_type[i].mineralType;
            
            if (vault)
                console.log('Vault #' + i + ': ' + vault.store.getUsedCapacity() + '-> ' +  vault.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy, ' + vault.store.getUsedCapacity(mineral) + ' ' + mineral);
        }
        
        console.log();
        
        for (let j=0; j<SD.nexus_id.length; j++){
            
            nexus = Game.getObjectById(SD.nexus_id[j]);
            
            //emergency bypass
            if (!nexus) continue;
            
            term = nexus.room.terminal;
            mineral = Memory.mineral_type[j].mineralType;
            
            if (term)
                console.log('Terminal #' + j + ': ' + term.store.getUsedCapacity() + '-> ' +  term.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy, ' + term.store.getUsedCapacity(mineral) + ' ' + mineral);
        }
        
        return '*****END OF REPORT*****';
    }
};