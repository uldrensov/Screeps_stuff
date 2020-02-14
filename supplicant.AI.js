//SUPPLICANT: dedicated semi-stationary controller upgrader
//violet trail

module.exports = {
    run: function(unit,nexus,reserve){
        
        //two-states...
        //if full pockets while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.homebound = true;
        }
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        //unload: controller
        if (unit.memory.homebound){
            if (unit.upgradeController(nexus.room.controller) == ERR_NOT_IN_RANGE){
                unit.moveTo(nexus.room.controller, {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
        
        //fetch: vault
        else if (nexus.room.storage.store.energy > reserve){
            if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
        
    }
};