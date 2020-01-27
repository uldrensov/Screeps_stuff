//HOUSEKEEPER: harvest energy and feed the controller exclusively
//todo: currently hardcoded the controller (keep for now)

module.exports = {
    run: function(unit){
        //array of the room's energy sources
        var sources = unit.room.find(FIND_SOURCES);
        
        //temporary hardcode
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
        if (unit.memory.homebound){
            if (unit.upgradeController(ctrller) == ERR_NOT_IN_RANGE){
                unit.moveTo(ctrller, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        
        //or find and harvest from a source
        else{
            //console.log(unit.harvest(sources));
            if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};