//SPECIALIST: cross-room fast-track self-fuelling construction unit
//green trail ("builder")

module.exports = {
    run: function(unit, standby_flag, standby_flag2){
        
        //one-time double-flag rally FSM...
        //first checkpoint
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.rallied = true;
        if (!unit.memory.rallied){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }
        
        //second checkpoint
        if (unit.pos.isEqualTo(standby_flag2.pos))
            unit.memory.rallied2 = true;
        if (!unit.memory.rallied2){
            unit.moveTo(standby_flag2, {visualizePathStyle: {stroke: '#00ff00'}});
            return;
        }



        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;
                
                

        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //UNLOAD: construction hotspots (nearest)
            const hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if (hotspot)
                if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                    unit.moveTo(hotspot);
        }
            

        //FSM execution (FETCHING):
        else{
            //FETCH: pickups (fullest)
            const scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => {
                    return resource.resourceType == RESOURCE_ENERGY;
                }
            });

            if (scraps.length){
                let chosen_scrap = scraps[0];

                //determine the most plentiful pickup
                for (let i=1; i<scraps.length; i++){
                    if (scraps[i].energy > chosen_scrap.energy)
                        chosen_scrap = scraps[i];
                }

                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE)
                    unit.moveTo(chosen_scrap);
            }


            //FETCH: ruins (random)
            else{
                const remains = unit.room.find(FIND_RUINS, {
                    filter: RoomObject => {
                        return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                if (remains.length){
                    if (unit.withdraw(remains[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(remains[0]);
                }


                //FETCH: sources (random)
                else{
                    if (!unit.memory.src_ID)
                        unit.memory.src_ID = unit.room.find(FIND_SOURCES)[0].id;

                    if (unit.harvest(Game.getObjectById(unit.memory.src_ID)) == ERR_NOT_IN_RANGE)
                        unit.moveTo(Game.getObjectById(unit.memory.src_ID));
                }
            }
        }
    }
};