//RETRIEVER DRONE: dedicated "cleanup" drone that collects dropped energy
//white trail ("carrier")

module.exports = {
    run: function(unit, ignore_lim, std_interval){
        
        //INPUTS: pickups<energy> (ample)
        if (!unit.memory.scraps || Game.time % std_interval == 0){
            unit.memory.scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => {
                    return resource.resourceType == RESOURCE_ENERGY
                        &&
                        resource.amount > ignore_lim;
                }
            });
        }
    
    
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;

    
        //behaviour execution...
        if (!unit.memory.fetching){
            //UNLOAD: vault<energy>
            if (unit.room.storage)
                if (unit.transfer(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(unit.room.storage);
            else
                return 'UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT';
        }
        
        else if (unit.memory.scraps.length){
            //FETCH: pickups<energy> (fullest)
            let chosen_scrap = unit.memory.scraps[0];

            //determine the most plentiful pickup
            for (let i=1; i<unit.memory.scraps.length; i++){
                if (!Game.getObjectById(unit.memory.scraps[i].id))
                    continue;

                try{
                    if (Game.getObjectById(unit.memory.scraps[i].id).energy
                        >
                        Game.getObjectById(chosen_scrap.id).energy){
                            
                        chosen_scrap = Game.getObjectById(unit.memory.scraps[i].id);
                    }
                }
                catch{
                    chosen_scrap = Game.getObjectById(unit.memory.scraps[i].id);
                }
            }
            
            if (Game.getObjectById(chosen_scrap.id))
                if (unit.pickup(Game.getObjectById(chosen_scrap.id)) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(chosen_scrap.id));
        }
    }
};