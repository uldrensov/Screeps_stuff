//RETRIEVER DRONE: dedicated "cleanup" drone that collects dropped resources
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, ignore_lim){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //INPUTS: pickups<energy> (ample)
            if (unit.memory.scraps == undefined || Game.time % 10 == 0){
                unit.memory.scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                    filter: resource => {
                        return (resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim) ||
                        resource.resourceType != RESOURCE_ENERGY;
                    }
                });
            }
        
        
            //2-state fetch/unload FSM...
            //if carry amt reaches full while fetching, switch to unloading
            if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while unloading, switch to fetching
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;

        
            //behaviour execution...
            if (!unit.memory.fetching){
                //UNLOAD: vault<energy>
                if (unit.room.storage != undefined){
                    if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
                else return 'UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT';
            }
            else if (unit.memory.scraps.length){
                //fetch: pickups<energy> (fullest)
                var chosen_scrap = unit.memory.scraps[0];
                var getScrap;

                //find the most plentiful energy scrap
                for (let i=0; i<unit.memory.scraps.length; i++){
                    getScrap = Game.getObjectById(unit.memory.scraps[i].id);
                    if (getScrap == null) continue;
                    try{
                        if (getScrap.energy > Game.getObjectById(chosen_scrap.id).energy)
                            chosen_scrap = getScrap;
                    }
                    catch{
                        chosen_scrap = getScrap;
                    }
                }
                
                var getChosenScrap = Game.getObjectById(chosen_scrap.id);
                if (getChosenScrap != null){
                    if (unit.pickup(getChosenScrap) == ERR_NOT_IN_RANGE)
                        unit.moveTo(getChosenScrap);
                }
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus);
    }
};