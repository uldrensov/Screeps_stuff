//ACOLYTE: source-to-link dedicated miner and TXer
//black trail ("collector")

module.exports = {
    run: function(unit, src_id, warpRX_id, warpTX_id, canister_id){
        
        var warpRX = Game.getObjectById(warpRX_id);
        var canister = Game.getObjectById(canister_id);
        
        
        //INPUTS: energy source
        var src = Game.getObjectById(src_id);
        
        //OUTPUTS: link
        var warpTX = Game.getObjectById(warpTX_id);
        
        
        //2-state fetch/unload FSM...
        //if carry amt reaches full while fetching, switch to unloading
        if (unit.memory.fetching && unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while unloading, switch to fetching
        if (!unit.memory.fetching && unit.store[RESOURCE_ENERGY] == 0)
            unit.memory.fetching = true;
        
        
        //behaviour execution...
        //transmit when the link reaches max capacity
        if (warpTX.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            warpTX.transferEnergy(warpRX, warpTX.store[RESOURCE_ENERGY]);
        
        //UNLOAD: link
        if (!unit.memory.fetching){
            //attempt to deposit new payload; if RX is full, overflow-mine into the container
            if (unit.transfer(warpTX, RESOURCE_ENERGY) == ERR_FULL)
                unit.harvest(src);
        }
        //fetch: source
        else{
            //stand on the overflow container
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister);
            else unit.harvest(src);
        }
    }
};