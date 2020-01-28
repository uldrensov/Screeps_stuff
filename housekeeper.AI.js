//HOUSEKEEPER: harvest energy and feed the controller
//red trail

module.exports = {
    run: function(unit,nexus){
        //energy source(s)
        var sources = unit.room.find(FIND_SOURCES);
        
        //controller
        var obelisk = nexus.room.controller;


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
            if (unit.upgradeController(obelisk) == ERR_NOT_IN_RANGE){
                unit.moveTo(obelisk, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        
        //or harvest
        else{
            //console.log(unit.harvest(sources));
            if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
    }
};