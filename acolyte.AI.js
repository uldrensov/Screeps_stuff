//ACOLYTE: source-to-link dedicated miner and TXer
//black trail ("collector")

module.exports = {
    run: function(unit,src_id,warpRX_id,warpTX_id,canister_id){
        
        var warpRX = Game.getObjectById(warpRX_id);
        var canister = Game.getObjectById(canister_id);
        
        
        //inputs: energy source
        var src = Game.getObjectById(src_id);
        
        //outputs: link
        var warpTX = Game.getObjectById(warpTX_id);
        
        
        //two-states...
        //if full energy while outbound, come back
        if (!unit.memory.homebound && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.homebound = true;
        //if empty energy while inbound, go withdraw
        if (unit.memory.homebound && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.homebound = false;
        
        
        //behaviour execution...
        //transmit when the link reaches max capacity
        if (warpTX.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            warpTX.transferEnergy(warpRX, warpTX.store[RESOURCE_ENERGY]);
        
        //unload: link
        if (unit.memory.homebound){
            //attempt to deposit new payload; if RX is full, overflow-mine into the container
            if (unit.transfer(warpTX, RESOURCE_ENERGY) == ERR_FULL)
                unit.harvest(src);
        }
        //fetch: source
        else{
            //stand on the overflow container
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister, {visualizePathStyle: {stroke: '#000000'}});
            else unit.harvest(src);
        }
    }
};