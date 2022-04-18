//SPECIALIST: cross-room fast-track self-fuelling construction unit
//green trail ("builder")

module.exports = {
    run: function(unit, standby_flag, standby_flag2){
        
        //travelling...
        //trek to the first checkpoint
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
        
            
        //input: source (non-empty), pickups, ruins (non-empty)
        let src = unit.pos.findClosestByPath(FIND_SOURCES, {
            filter: RoomObject => {
                return RoomObject.energy > 0;
            }
        });
        let scraps = unit.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return resource.resourceType == RESOURCE_ENERGY;
            }
        });
        let remains = unit.room.find(FIND_RUINS, {
            filter: RoomObject => {
                return RoomObject.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        
        //output: construction hotspot
        let hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        
        
        //2-state FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;
                
                
        //behaviour execution...
        if (!unit.memory.fetching && hotspot)
            //UNLOAD: construction hotspot
            if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                unit.moveTo(hotspot);
            
        else{
            //fetch: pickups (fullest)
            if (scraps.length){
                //
                let chosen_scrap = scraps[0];
                for (let i=0; i<scraps.length; i++){
                    if (scraps[i].energy > chosen_scrap.energy)
                        chosen_scrap = scraps[i];
                }
                if (unit.pickup(chosen_scrap) == ERR_NOT_IN_RANGE)
                    unit.moveTo(chosen_scrap);
            }
            //fetch: ruins
            else if (remains.length)
                if (unit.withdraw(remains[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    unit.moveTo(remains[0]);
            
            //fetch: source (manual override)
            else if (unit.memory.force_src != undefined)
                if (unit.harvest(Game.getObjectById(unit.memory.force_src)) == ERR_NOT_IN_RANGE)
                    unit.moveTo(Game.getObjectById(unit.memory.force_src));
            
            //fetch: source
            else if (unit.harvest(src) == ERR_NOT_IN_RANGE)
                unit.moveTo(src);
        }
    }
};