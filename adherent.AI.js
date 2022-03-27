//ADHERENT: stands on one tile and relays energy from link to vault
//white trail ("carrier")

module.exports = {
    run: function(unit, tile_id, warpRX_id){
        
        var tile = Game.getObjectById(tile_id);
        
        
        //INPUTS: link
        var warpRX = Game.getObjectById(warpRX_id);
        
        
        //ensure correct position
        if (!unit.pos.isEqualTo(tile.pos))
            unit.moveTo(tile);
        //remain there and work
        else{
            //fetch: link
            if (unit.store.getFreeCapacity(RESOURCE_ENERGY) != 0) //if unit is not fully loaded
                unit.withdraw(warpRX, RESOURCE_ENERGY);
            //UNLOAD: vault
            else if (unit.store.getFreeCapacity(RESOURCE_ENERGY) == 0) //only when unit is fully loaded
                unit.transfer(unit.room.storage, RESOURCE_ENERGY)
        }
    }
};