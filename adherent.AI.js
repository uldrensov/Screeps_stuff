//ADHERENT: stands on one tile and relays energy from link to vault
//white trail

module.exports = {
    run: function(unit,nexus_id,tile_id,warpRX_id){
        
        var nexus = Game.getObjectById(nexus_id);
        var tile = Game.getObjectById(tile_id);
        var warpRX = Game.getObjectById(warpRX_id);
        
        
        //move the the designated tile
        if (!unit.pos.isEqualTo(tile.pos)){
            unit.moveTo(tile, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else{
            //fetch energy: link
            if (warpRX.store[RESOURCE_ENERGY] != 0){
                unit.withdraw(warpRX, RESOURCE_ENERGY);
            }
            //deposit: vault
            if (unit.store[RESOURCE_ENERGY] != 0){
                unit.transfer(nexus.room.storage, RESOURCE_ENERGY)
            }
        }
    }
};