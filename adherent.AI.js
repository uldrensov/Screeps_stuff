//ADHERENT: stands on one tile and relays energy from link to vault
//white trail ("carrier")

module.exports = {
    run: function(unit, tile_id, warpRX_id){
        
        let tile = Game.getObjectById(tile_id);
        let warpRX = Game.getObjectById(warpRX_id);
        
        
        //ensure correct position
        if (!unit.pos.isEqualTo(tile.pos))
            unit.moveTo(tile);

        //remain there and work
        else{
            //FETCH: link
            if (unit.store.getFreeCapacity() > 0) //if unit is not fully loaded
                unit.withdraw(warpRX, RESOURCE_ENERGY);

            //UNLOAD: vault<energy>
            else //only when unit is fully loaded
                unit.transfer(unit.room.storage, RESOURCE_ENERGY)
        }
    }
};