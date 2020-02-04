//SAVIOUR: cross-room controller upgrader
//red trail

module.exports = {
    run: function(unit,SRCnexus_id,DESTctrl_id,reserve){
        
        var home = Game.getObjectById(SRCnexus_id).room;
        var away = Game.getObjectById(DESTctrl_id).room;
        
        
        //two-states...
        //if full energy after withdrawing, go upgrade
        if (!unit.memory.venturing && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.venturing = true;
        }
        
        //if empty energy after upgrading, come withdraw
        if (unit.memory.venturing && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.venturing = false;
        }
        
        
        //behaviour execution...
        //travel and feed the foreign controller
        if (unit.memory.venturing){
            //leave the home room
            if (unit.room != away){
                unit.moveTo(away.controller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            //feed
            else if (unit.upgradeController(away.controller)){
                unit.moveTo(away.controller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        
        //or return and withdraw from the vault (if energy can be spared)
        else if (home.storage.store.energy > reserve){
            if (unit.room != home){
                unit.moveTo(home.controller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            else if (unit.withdraw(home.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                unit.moveTo(home.storage, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};