//HOUSEKEEPER: harvest energy and feed the controller exclusively

module.exports = {
    run: function(unit){
        //array containing the room's energy sources
        var sources = unit.room.find(FIND_SOURCES);
        
        //room's controller (hardcode via ID if needed)
        var ctrller = Game.getObjectById('5bbcae989099fc012e639474');


        //two-states...
        //if full energy while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            unit.memory.homebound = true;
        }
        
        //if empty energy while inbound, go harvest
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0){
            unit.memory.homebound = false;
        }


        //behaviour execution...
        //feed the room's controller
        if(unit.memory.homebound){
            if (unit.upgradeController(ctrller) == ERR_NOT_IN_RANGE){
                unit.moveTo(ctrller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        
        //or find and harvest from a source
        else{
            if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};