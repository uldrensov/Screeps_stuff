//ADHERENT: stands on one tile and relays energy from link to vault
//white trail ("carrier")

module.exports = {
    run: function(unit, tile_id, warpRX_id){
        
        const tile =      Game.getObjectById(tile_id);
        const warpRX =    Game.getObjectById(warpRX_id);

        if (!tile){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES AN IDENTIFIABLE TILE');
            return;
        }
        if (!warpRX){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A RX LINK');
            return;
        }
        if (!unit.room.storage){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A HOME VAULT');
            return;
        }
        
        
        //ensure correct position
        if (!unit.pos.isEqualTo(tile.pos))
            unit.moveTo(tile);

        //remain there and work
        else{
            //FETCH: RX link
            if (unit.store.getFreeCapacity() > 0) //if unit is not fully loaded
                unit.withdraw(warpRX, RESOURCE_ENERGY);

            //UNLOAD: vault
            //only when unit is fully loaded
            else{
                unit.transfer(unit.room.storage, RESOURCE_ENERGY)

                //record vaultbound energy unloads to global memory
                if (!Memory.energyGainsToday[unit.memory.home_index])
                    Memory.energyGainsToday[unit.memory.home_index] = [];

                if (!Memory.energyGainsToday[unit.memory.home_index][0])
                    Memory.energyGainsToday[unit.memory.home_index][0] = 0;

                Memory.energyGainsToday[unit.memory.home_index][0] +=
                    Math.min(unit.store[RESOURCE_ENERGY], unit.room.storage.store.getFreeCapacity());
            }
        }
    }
};