//EMERGENCY DRONE: withdraw/harvests energy and feeds spawning structures
//white trail

module.exports = {
    run: function(unit,nexus_id){
        
        var nexus = Game.getObjectById(nexus_id);
        
        //emergency drone's reduced "ignore limit"
        var lowbound = 50;
        
        
        //energy source(s)
        var sources = nexus.room.find(FIND_SOURCES);
        
        //sufficiently plentiful energy pickups
        var scraps = nexus.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return resource.amount > lowbound && resource.resourceType == RESOURCE_ENERGY;
            }
        });
        
        //non-empty tombstones
        var tombs = nexus.room.find(FIND_TOMBSTONES, {
            filter: RoomObject => {
                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //energy-deficient extensions
        var pylons = nexus.room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
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
        //find and feed the nearest suitable structure
        if (unit.memory.homebound){
            //prioritise extensions
            if (pylons.length){
                var nearest_pylon = unit.pos.findClosestByPath(pylons);
                if (unit.transfer(nearest_pylon, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nearest_pylon, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else{
                if (unit.transfer(nexus, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        //fetch energy: vault, containers, pickups, tombstones, sources
        else{
            if (nexus.room.storage != undefined && nexus.room.storage.store.energy > 0){
                if (unit.withdraw(nexus.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (canisters.length){
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
                //otherwise, only switch fixation if the previous one crosses beneath the (reduced) "ignore" criteria
                else if (Game.getObjectById(unit.memory.fixation).store[RESOURCE_ENERGY] < lowbound){
                    unit.memory.fixation = fullest_canister.id;
                }
                
                //finally, withdraw from the fixated target
                var canister_target = Game.getObjectById(unit.memory.fixation);
                if (unit.withdraw(canister_target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(canister_target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else if (tombs.length){
                //determine the fullest tomb in play
                var richest_tomb = tombs[0];
                for (let i=0; i<tombs.length; i++){
                    if (tombs[i].store.getUsedCapacity(RESOURCE_ENERGY) >
                        richest_tomb.store.getUsedCapacity(RESOURCE_ENERGY)){
                        richest_tomb = tombs[i];
                    }
                }
                //approach and withdraw
                if (unit.withdraw(richest_tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    unit.moveTo(richest_tomb, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            //TODO: pickups
            else if (unit.harvest(sources[0]) == ERR_NOT_IN_RANGE){
                unit.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};