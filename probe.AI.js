//PROBE: harvest energy and repair decaying structures

module.exports = {
    run: function(unit){
        //array of the room's energy sources
        var sources = unit.room.find(FIND_SOURCES);
        
        //arrays of the room's structures below a certain HP thresholds...
        //under 25%
        var repairTargets25 = unit.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .25);
            }
        });
        //under 50%
        var repairTargets50 = unit.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .5);
            }
        });
        //under 75%
        var repairTargets75 = unit.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .75);
            }
        });
        //under 100%
        var repairTargets100 = unit.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax);
            }
        });
        
        
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
        //find and repair a suitable structure (ordered by priority)
        if (unit.memory.homebound){
            //below 25% (peril) 
            if (repairTargets25.length){
                unit.say('PERIL');
                if (unit.repair(repairTargets25[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(repairTargets25[0], {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            //below 50% (danger)
            else if (repairTargets50.length){
                unit.say('DANGER');
                if (unit.repair(repairTargets50[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(repairTargets50[0], {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            //below 75% (warning)
            else if (repairTargets75.length){
                unit.say('WARNING');
                if (unit.repair(repairTargets75[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(repairTargets75[0], {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            //below 100% (OK)
            else if (repairTargets100.length){
                unit.say('OK');
                if (unit.repair(repairTargets100[0]) == ERR_NOT_IN_RANGE){
                    unit.moveTo(repairTargets100[0], {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
        }
        
        //or find and harvest from a source
        else{
            if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#0000ff'}});
            }
        }
    }
};