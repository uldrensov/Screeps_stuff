//executable script: creates a compressed summary about every room's vault/terminal contents
    //require('STATUSREPORT_E.exe').run()
    
var SD = require('SET_SOFTDATA');
    

module.exports = {
    run: function(){
        
        let ctrl;
        let vault;
        let term;
        let mineral;
        
        
        //vault summary
        for (let i=0; i<SD.ctrl_id.length; i++){
            ctrl = Game.getObjectById(SD.ctrl_id[i]);
            
            if (!ctrl)      continue; //bypass: if controller fails to retrieve, skip the room
            
            vault = ctrl.room.storage;
            mineral = Memory.mineral_type[i].mineralType;
            
            if (vault)
                console.log('STATUSREPORT_E:: Vault #' + i + ': ' + vault.store.getUsedCapacity() + '-> ' +  vault.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy, ' +
                    vault.store.getUsedCapacity(mineral) + ' ' + mineral + ', ' +
                    (vault.store.getUsedCapacity() - (vault.store.getUsedCapacity(RESOURCE_ENERGY) + vault.store.getUsedCapacity(mineral))) + ' misc.');
        }
        
        console.log('STATUSREPORT_E::');
        
        //terminal summary
        for (let j=0; j<SD.ctrl_id.length; j++){
            ctrl = Game.getObjectById(SD.ctrl_id[j]);
            
            if (!ctrl)      continue; //bypass: if controller fails to retrieve, skip the room
            
            term = ctrl.room.terminal;
            mineral = Memory.mineral_type[j].mineralType;
            
            if (term)
                console.log('STATUSREPORT_E:: Terminal #' + j + ': ' + term.store.getUsedCapacity() + '-> ' +  term.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy, ' +
                    term.store.getUsedCapacity(mineral) + ' ' + mineral + ', ' +
                    (term.store.getUsedCapacity() - (term.store.getUsedCapacity(RESOURCE_ENERGY) + term.store.getUsedCapacity(mineral))) + ' misc.');
        }
        

        return 'STATUSREPORT_E:: ***** END *****';
    }
};