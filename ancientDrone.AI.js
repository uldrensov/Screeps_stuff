//ANCIENT DRONE: mineral-carrying variant of DRONE
//white trail

module.exports = {
    run: function(unit,nexus_id,canister_id){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        //inputs: container
        var canister = Game.getObjectById(canister_id);
        
        
        //init: determine type of mineral present
        if (unit.memory.mineral_type == undefined && canister.store.getUsedCapacity() != 0){
            for (let i=1; i<RESOURCES_ALL.length; i++){
                if (canister.store.getUsedCapacity(RESOURCES_ALL[i]) != 0){
                    unit.memory.mineral_type = RESOURCES_ALL[i];
                    break;
                }
            }
        }
        

        //properly initialised
        if (unit.memory.mineral_type != undefined){
            
            //two states...
            //if full pockets while outbound, come back
            if (!unit.memory.homebound && unit.store.getFreeCapacity() == 0){
                unit.memory.homebound = true;
            }
            //if empty energy while inbound, go withdraw
            if (unit.memory.homebound && unit.store[unit.memory.mineral_type] == 0){
                unit.memory.homebound = false;
            }
            
            
            //behaviour execution...
            //unload: vault
            if (unit.memory.homebound){
                if (unit.transfer(nexus.room.storage, unit.memory.mineral_type) == ERR_NOT_IN_RANGE){
                    unit.moveTo(nexus.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            //fetch: container
            else{
                if (unit.withdraw(canister, unit.memory.mineral_type) == ERR_NOT_IN_RANGE){
                unit.moveTo(canister, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        
        //not yet initialised
        else{
            unit.say('NOT INIT');
        }
    }
};