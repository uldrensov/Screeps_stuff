//PHASE ARCHITECT: manually-summoned ARCHITECT variant with automatic self-termination protocols, designed for one-time tasks
//green trail ("builder")

module.exports = {
    run: function(unit, nexus_id, bias){
        
        const energyCanisters_max = 2;



        //proceed if there is no suicide order
        if (!unit.memory.killswitch){
            //OUTPUTS: construction hotspot
            let hotspot_scan = unit.room.find(FIND_CONSTRUCTION_SITES);
            
            
            //self-killswitch routine
            let hotspot;

            if (!hotspot_scan.length){
                console.log(unit.name + ':: PHASE CONSTRUCTION COMPLETE (ROOM #' + unit.memory.home_index + ')');

                Memory.phaseArchitect_MAX[unit.memory.home_index] = -1;
                unit.memory.killswitch = true;
            }
            else
                hotspot = unit.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
            

            //FETCH / UNLOAD FSM...
            //if carry amt reaches full while FETCHING, switch to UNLOADING
            if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
                unit.memory.fetching = false;
            //if carry amt depletes while UNLOADING, switch to FETCHING
            if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
                unit.memory.fetching = true;
                
                

            //FSM execution (UNLOADING):
            if (!unit.memory.fetching && hotspot){
                //UNLOAD: construction hotspot (nearest)
                if (unit.build(hotspot) == ERR_NOT_IN_RANGE)
                    unit.moveTo(hotspot);
            }

                    
            //FSM execution (FETCHING):
            else{
                //FETCH: vault (respect limit)
                if (unit.room.storage){
                    if (unit.withdraw(unit.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        unit.moveTo(unit.room.storage);
                }
                
                //FETCH: containers (fullest)
                else{
                    let canisters = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_CONTAINER
                                &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                        }
                    });

                    if (canisters.length){
                        let fullest_canister = canisters[0];

                        if (canisters.length == energyCanisters_max
                            &&
                            canisters[1].store.getUsedCapacity(RESOURCE_ENERGY)
                                >
                            canisters[0].store.getUsedCapacity(RESOURCE_ENERGY) + bias){

                            fullest_canister = canisters[1];
                        }
                        
                        if (unit.withdraw(fullest_canister, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                            unit.moveTo(fullest_canister);
                    }
                }
            }
        }
        
        
        //built-in economic killswitch
        else if (Game.getObjectById(nexus_id).recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(Game.getObjectById(nexus_id));
    }
};