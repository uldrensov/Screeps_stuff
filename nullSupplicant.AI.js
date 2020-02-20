//NULL SUPPLICANT: SUPPLICANT variant designed to mesh with NULL ADHERENT
//violet trail ("upgrader")

module.exports = {
    run: function(unit,nexus,warpRX0_id){
        
        //inputs: link
        var warpRX0 = Game.getObjectById(warpRX0_id);
        
        
        //two-states...
        //if full pockets while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.homebound = true;
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.homebound = false;

        
        //behaviour execution...
        //unload: controller
        if (unit.memory.homebound){
            if (unit.upgradeController(nexus.room.controller) == ERR_NOT_IN_RANGE)
                unit.moveTo(nexus.room.controller, {visualizePathStyle: {stroke: '#ff00ff'}});
        }
        //fetch: link
        else if (unit.withdraw(warpRX0, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            unit.moveTo(warpRX0, {visualizePathStyle: {stroke: '#ff00ff'}});
    }
};