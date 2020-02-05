//SPECIALIST: cross-room fast-track construction unit
//green trail

module.exports = {
    run: function(unit,SRCnexus_id,DESTctrl_id,reserve){
        
        var home = Game.getObjectById(SRCnexus_id).room;
        var away = Game.getObjectById(DESTctrl_id).room;
        
        
        //construction hotspots
        var hotspots = away.find(FIND_CONSTRUCTION_SITES);
        
        
        //two-states...
        //if full energy after withdrawing, go build
        if (!unit.memory.venturing && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.venturing = true;
        }
        
        //if empty energy after building, come withdraw
        if (unit.memory.venturing && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.venturing = false;
        }
        
        
        //behaviour execution...
        //travel and feed the nearest hotspot
        if (unit.memory.venturing){
            //leave the home room
            if (unit.room != away){
                unit.moveTo(away.controller, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            //build at a hotspot
            else if (unit.build(hotspots[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(hotspots[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
        
        //or return and withdraw from the vault (if energy can be spared)
        else if (home.storage.store.energy > reserve){
            if (unit.room != home){
                unit.moveTo(home.controller, {visualizePathStyle: {stroke: '#00ff00'}});
            }
            else if (unit.withdraw(home.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                unit.moveTo(home.storage, {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }
    }
};