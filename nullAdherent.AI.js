//NULL ADHERENT: reverse variant of ADHERENT with TX capabilities
//white trail ("carrier")

module.exports = {
    run: function(unit, tile_id, warpTX0_id, warpRX0_id, reserve){
        
        var tile = Game.getObjectById(tile_id);
        var warpRX0 = Game.getObjectById(warpRX0_id);
        
        
        //outputs: link
        var warpTX0 = Game.getObjectById(warpTX0_id);
        
        
        //ensure correct position
        if (!unit.pos.isEqualTo(tile.pos))
            unit.moveTo(tile, {visualizePathStyle: {stroke: '#ffffff'}});
        //remain there and work
        else{
            //transmit when the link reaches max capacity
            if (warpTX0.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                warpTX0.transferEnergy(warpRX0, warpTX0.store[RESOURCE_ENERGY]);
                
            //fetch: vault (respect limit)
            if (unit.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && unit.room.storage.store.energy > reserve) //if unit is not fully loaded
                unit.withdraw(unit.room.storage, RESOURCE_ENERGY);
            //unload: link
            else if (unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0) //only when unit is fully loaded
                unit.transfer(warpTX0, RESOURCE_ENERGY);
        }
    }
};