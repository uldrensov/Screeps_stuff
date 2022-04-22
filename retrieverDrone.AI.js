//RETRIEVER DRONE: dedicated "cleanup" drone that collects dropped energy
//white trail ("carrier")

module.exports = {
    run: function(unit, ignore_lim, std_interval){
        
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;


    
        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //UNLOAD: vault<energy>
            if (unit.room.storage){
                if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            }
            else{
                console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT');
                return;
            }
        }
        

        //FSM execution (FETCHING):
        else{
            //FETCH: pickups<energy> (fullest)
            //find pickups
            if (!unit.memory.scraps || Game.time % std_interval == 0){
                unit.memory.scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                    filter: resource => {
                        return resource.resourceType == RESOURCE_ENERGY
                            &&
                            resource.amount > ignore_lim;
                    }
                });
            }

            //inspect any pickups found
            if (unit.memory.scraps.length){
                let chosen_scrap = Game.getObjectById(unit.memory.scraps[0].id);

                //determine the most plentiful pickup
                for (let i=1; i<unit.memory.scraps.length; i++){
                    //if memorised scrap no longer exists, skip it
                    if (!Game.getObjectById(unit.memory.scraps[i].id))
                        continue;

                    //if bad init, assign without comparing anything
                    if (!chosen_scrap)
                        chosen_scrap = Game.getObjectById(unit.memory.scraps[i].id);

                    if (Game.getObjectById(unit.memory.scraps[i].id).energy
                        >
                        chosen_scrap.energy){
                            
                        chosen_scrap = Game.getObjectById(unit.memory.scraps[i].id);
                    }
                }
                
                if (chosen_scrap)
                    if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE)
                        unit.moveTo(chosen_scrap);
            }
        }
    }
};