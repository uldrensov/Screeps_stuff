//ACOLYTE: harvests energy (atop a collecting container) and resupplies a nearby link
//red trail

module.exports = {
    run: function(unit,src_id,warp_main_id,warp_branch_id,canister){
        
        var src = Game.getObjectById(src_id);
        var warp_main = Game.getObjectById(warp_main_id);
        var warp_branch = Game.getObjectById(warp_branch_id);
        
        
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
            //if the link is full, overflow-mine into the container
            else if (unit.transfer(warp_branch, RESOURCE_ENERGY) == ERR_FULL){
                unit.harvest(src);
            }
        }
        //harvest from the overflow container's position
        else{
            if (!unit.pos.isEqualTo(canister.pos)){
                unit.moveTo(canister, {visualizePathStyle: {stroke: '#ff0000'}});
            }
            else {
                unit.harvest(src);
            }
        }
    }
};