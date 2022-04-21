//NULL ADHERENT: reverse variant of ADHERENT with TX capabilities
//white trail ("carrier")

module.exports = {
    run: function(unit, tile_id, warpTX0_id, warpRX0_id, reserve){
        
        let tile =      Game.getObjectById(tile_id);
        let warpTX0 =   Game.getObjectById(warpTX0_id);
        let warpRX0 =   Game.getObjectById(warpRX0_id);

        if (!tile)      return 'UNIT ERROR: ' + unit.name + ' REQUIRES A IDENTIFIABLE TILE';
        if (!warpTX0)   return 'UNIT ERROR: ' + unit.name + ' REQUIRES A TX LINK';
        if (!warpRX0)   return 'UNIT ERROR: ' + unit.name + ' REQUIRES A RX LINK';
        
        
        //ensure correct position
        if (!unit.pos.isEqualTo(tile.pos))
            unit.moveTo(tile);


        //remain there and work
        else{
            //transmit when the link reaches max capacity
            if (warpTX0.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
                warpTX0.transferEnergy(warpRX0, warpTX0.store[RESOURCE_ENERGY]);
            

            //FETCH: vault<energy> (respect limit)
            if (unit.store.getFreeCapacity() > 0 && (unit.room.storage.store.energy > reserve)) //if unit is not fully loaded
                unit.withdraw(unit.room.storage, RESOURCE_ENERGY);

            //UNLOAD: link
            else if (unit.store.getFreeCapacity() == 0) //only when unit is fully loaded
                unit.transfer(warpTX0, RESOURCE_ENERGY);
        }
    }
};