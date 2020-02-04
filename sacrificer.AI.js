//sacrificer: basic controller upgrader
//red trail

module.exports = {
    run: function(unit,ctrl_id){
        
        var obelisk = Game.getObjectById(ctrl_id);
        
        
        var sources = obelisk.room.find(FIND_SOURCES);
        
        
        //two-states...
        //if full energy while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.homebound = true;
        }
        
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }
        
        
        //behaviour execution...
        //feed the room's controller
        if (unit.memory.homebound){
            if (unit.upgradeController(obelisk) == ERR_NOT_IN_RANGE){
                unit.moveTo(obelisk, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        
        //or harvest
        else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
            unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
        }
    }
};