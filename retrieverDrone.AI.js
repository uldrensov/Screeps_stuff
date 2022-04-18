//RETRIEVER DRONE: dedicated "cleanup" drone that collects dropped energy
//white trail ("carrier")

module.exports = {
    run: function(unit, nexus_id, ignore_lim, std_interval){
        
        let nexus = Game.getObjectById(nexus_id);
        
        
        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //INPUTS: pickups<energy> (ample)
            if (unit.memory.scraps == undefined || Game.time % std_interval == 0){
                unit.memory.scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                    filter: resource => {
                        return resource.resourceType == RESOURCE_ENERGY && resource.amount > ignore_lim;
                    }
                });
            }
        
        
            //2-state FETCH / UNLOAD FSM...
            //if carry amt reaches full while FETCHING, switch to UNLOADING
            if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while UNLOADING, switch to FETCHING
            if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
                unit.memory.fetching = true;

        
            //behaviour execution...
            if (!unit.memory.fetching){
                //UNLOAD: vault<energy>
                if (unit.room.storage != undefined)
                    if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                else
                    return 'UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT';
            }
            else if (unit.memory.scraps.length){
                //fetch: pickups<energy> (fullest)
                let chosen_scrap = unit.memory.scraps[0];
                let getScrap;

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
                
                let getChosenScrap = Game.getObjectById(chosen_scrap.id);

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