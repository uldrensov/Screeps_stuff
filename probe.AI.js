//PROBE: withdraws energy and repairs lightly damaged structures
//blue trail

module.exports = {
    run: function(unit,nexus,threshold){
        
        //energy source(s) [only used early game]
        var sources = nexus.room.find(FIND_SOURCES);
        
        /*
        //lightly decaying structures
        var repairTargets = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.hits < structure.hitsMax
                && structure.hits < structure.hitsMax * .75
                && structure.structureType != STRUCTURE_WALL) ||
                (structure.hits < structure.hitsMax
                && structure.hits < threshold * .75
                && structure.structureType == STRUCTURE_WALL));
            }
        });
        */
        
        var repairTargets = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax
                && structure.hits > structure.hitsMax * .5);
            }
        });
        
        //
        var weakest_struct;
        //var weakstruct_perc;
        if (repairTargets.length){
            weakest_struct = repairTargets[0];
            for (var i=1; i<repairTargets.length; i++){
                if (repairTargets[i].hits / repairTargets[i].hitsMax
                < weakest_struct.hits / weakest_struct.hitsMax){
                    weakest_struct = repairTargets[i];
                }
            }
            //weakstruct_perc = (weakest_struct.hits / weakest_struct.hitsMax) * 100;
            //weakstruct_perc = weakstruct_perc.toFixed(3);
        }
        
        
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
        //find and repair a structure
        if (unit.memory.homebound){
            if (weakest_struct != undefined){
                if (unit.repair(weakest_struct) == ERR_NOT_IN_RANGE){
                    unit.moveTo(weakest_struct, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
        }
        
        //or withdraw from the vault / fullest canister
        else{
            if (nexus.room.storage != undefined){
                if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
            else if (canisters.length){
                var fullest_canister = canisters[0];
                if (canisters.length == 2 &&
                canisters[1].store.getUsedCapacity(RESOURCE_ENERGY) >
                canisters[0].store.getUsedCapacity(RESOURCE_ENERGY)){
                    fullest_canister = canisters[1];
                }
                
                if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(fullest_canister, {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }
        }
    }
};