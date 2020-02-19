//NULL ADHERENT: reverse variant of ADHERENT
//white trail ("carrier")

module.exports = {
    run: function(unit,nexus_id,tile_id,warpRX_id){
        
        var nexus = Game.getObjectById(nexus_id);
        var tile = Game.getObjectById(tile_id);
        var warpRX = Game.getObjectById(warpRX_id);
        
        
        //ensure correct position
        if (!unit.pos.isEqualTo(tile.pos))
            unit.moveTo(tile, {visualizePathStyle: {stroke: '#ffffff'}});
        //remain there and work
        else{
            //fetch: link
            if (warpRX.store[RESOURCE_ENERGY] != 0){
                unit.withdraw(warpRX, RESOURCE_ENERGY);
            }
            //unload: vault
            if (unit.store[RESOURCE_ENERGY] != 0){
                unit.transfer(nexus.room.storage, RESOURCE_ENERGY)
            }
        }
    }
};