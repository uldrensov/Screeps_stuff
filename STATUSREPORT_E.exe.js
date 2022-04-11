//executable script: creates a compressed summary about every room's vault/terminal contents
    //require('STATUSREPORT_E.exe').run()
    
var SD = require('SET_SOFTDATA');
    

module.exports = {
    run: function(){
        
        let nexus;
        let vault;
        let term;
        let mineral;
        
        
        //vault summary
        for (let i=0; i<SD.nexus_id.length; i++){
            nexus = Game.getObjectById(SD.nexus_id[i]);
            
            if (!nexus)     continue; //error: if nexus fails to retrieve, skip the room
            
            vault = nexus.room.storage;
            mineral = Memory.mineral_type[i].mineralType;
            
            if (vault)
                console.log('STATUSREPORT_E:: Vault #' + i + ': ' + vault.store.getUsedCapacity() + '-> ' +  vault.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy, ' +
                    vault.store.getUsedCapacity(mineral) + ' ' + mineral + ', ' +
                    (vault.store.getUsedCapacity() - (vault.store.getUsedCapacity(RESOURCE_ENERGY) + vault.store.getUsedCapacity(mineral))) + ' misc.');
        }
        
        console.log('STATUSREPORT_E::');
        
        //terminal summary
        for (let j=0; j<SD.nexus_id.length; j++){
            nexus = Game.getObjectById(SD.nexus_id[j]);
            
            if (!nexus)     continue; //error: if nexus fails to retrieve, skip the room
            
            term = nexus.room.terminal;
            mineral = Memory.mineral_type[j].mineralType;
            
            if (term)
                console.log('STATUSREPORT_E:: Terminal #' + j + ': ' + term.store.getUsedCapacity() + '-> ' +  term.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy, ' +
                    term.store.getUsedCapacity(mineral) + ' ' + mineral + ', ' +
                    (term.store.getUsedCapacity() - (term.store.getUsedCapacity(RESOURCE_ENERGY) + term.store.getUsedCapacity(mineral))) + ' misc.');
        }
        

        return 'STATUSREPORT_E:: ***** END *****';
    }
};