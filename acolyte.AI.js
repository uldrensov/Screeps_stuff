//ACOLYTE: source-to-link dedicated miner and TXer
//black trail ("collector")

module.exports = {
    run: function(unit, src_id, warpRX_id, warpTX_id, canister_id){
        
        const src =       Game.getObjectById(src_id);
        const warpRX =    Game.getObjectById(warpRX_id);
        const warpTX =    Game.getObjectById(warpTX_id);
        const canister =  Game.getObjectById(canister_id);

        if (!src){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A SOURCE');
            return;
        }
        if (!warpRX){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A RX LINK');
            return;
        }
        if (!warpTX){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A TX LINK');
            return;
        }
        if (!canister){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A CANISTER');
            return;
        }


        //transmit when the TX link reaches max capacity
        if (warpTX.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
            warpTX.transferEnergy(warpRX, warpTX.store[RESOURCE_ENERGY]);
        
        
        //FETCH / UNLOAD FSM...
        //if carry amt reaches full while FETCHING, switch to UNLOADING
        if (unit.memory.fetching && unit.store.getFreeCapacity() == 0)
            unit.memory.fetching = false;
        //if carry amt depletes while UNLOADING, switch to FETCHING
        if (!unit.memory.fetching && unit.store.getUsedCapacity() == 0)
            unit.memory.fetching = true;
        

        //FSM execution (UNLOADING):
        if (!unit.memory.fetching){
            //attempt to deposit new payload; if RX is full, mine into the overflow container
            if (unit.transfer(warpTX, RESOURCE_ENERGY) == ERR_FULL)
                unit.harvest(src);
        }
        
        //FSM execution (FETCHING):
        else{
            //stand on the overflow container
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister);
            else
                unit.harvest(src);
        }
    }
};