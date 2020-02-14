//sacrificer: basic controller upgrader that withdraws from containers, or harvests from sources
//violet trail

module.exports = {
    run: function(unit,ctrl_id,ignore_lim){
        
        var obelisk = Game.getObjectById(ctrl_id);
        
        
        //inputs: energy sources, containers (ample)
        var sources = obelisk.room.find(FIND_SOURCES);
        var canisters = obelisk.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > ignore_lim;
            }
        });
        
        
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
        //unload: controller
        if (unit.memory.homebound){
            if (unit.upgradeController(obelisk) == ERR_NOT_IN_RANGE){
                unit.moveTo(obelisk, {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
        else{
            //fetch: containers (fullest; fixation)
            if (canisters.length){
                //determine the fullest container in play
                var fullest_canister = canisters[0];
                for (let i=0; i<canisters.length; i++){
                    if (canisters[i].store.getUsedCapacity(RESOURCE_ENERGY) >
                    fullest_canister.store.getUsedCapacity(RESOURCE_ENERGY)){
                        fullest_canister = canisters[i];
                    }
                }
                
                //if there is no current target container, "fixate" on the fullest one
                if (unit.memory.fixation == undefined){
                    unit.memory.fixation = fullest_canister.id;
                }
                //otherwise, only switch fixation if the previous one crosses beneath the "ignore" criteria
                else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < ignore_lim){
                    unit.memory.fixation = fullest_canister.id;
                }
                
                //finally, withdraw from the fixated target
                var canister_target = Game.getObjectById(unit.memory.fixation);
                if (unit.withdraw(canister_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(canister_target, {visualizePathStyle: {stroke: '#ff00ff'}});
                }
            }
            //fetch: sources
            else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff00ff'}});
            }
        }
    }
};