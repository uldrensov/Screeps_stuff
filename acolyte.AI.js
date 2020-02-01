//ACOLYTE: harvests energy and resupplies a nearby link
//red trail

module.exports = {
    run: function(unit,src,warp_main_ID,warp_branch_ID,canister){
        
        //bug avoidance (pass ID, not object itself)
        var warp_main = Game.getObjectById(warp_main_ID);
        var warp_branch = Game.getObjectById(warp_branch_ID);
        
        
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
        //resupply the link
        if (unit.memory.homebound){
            if (unit.transfer(warp_branch, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                unit.moveTo(warp_branch, {visualizePathStyle: {stroke: '#ff0000'}});
            }
        }
        
        //or harvest
        else if (unit.harvest(src) == ERR_NOT_IN_RANGE){
            unit.moveTo(canister, {visualizePathStyle: {stroke: '#ff0000'}});
        }
    }
};