//executable script: attempts to sell all (presumably excess) energy from a room's terminal
//optionally, can also be called automatically by ECONDRIVE.js
    //require('ENERGYVENT.exe').run(3)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (room_num < 0 || room_num >= SD.spawner_id.length)
            return 'ENERGYVENT:: INVALID ROOM NUMBER';
        
        //variable init and additional validation
        let GE = Game.getObjectById(SD.nexus_id[room_num]).room.terminal;

        if (GE == null)
            return 'ENERGYVENT:: ROOM IS MISSING A TERMINAL';

        if (GE.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return 'ENERGYVENT:: TERMINAL TRANSMISSION FUEL DEPLETED';

        let hist = Game.market.getHistory(RESOURCE_ENERGY);
        let clientele = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});

        if (!clientele.length)
            return 'ENERGYVENT:: MARKET IS EMPTY...TRY AGAIN LATER';
        
        
        //calculate average street price
        let streetPrice = 0;

        for (let i=0; i<hist.length; i++){
            streetPrice += hist[i].avgPrice;
        }
        streetPrice /= hist.length;
        
        //find the best offer within price range
        let bestOffer = clientele[0];

        for (let i=0; i<clientele.length; i++){
            if (clientele[i].price > bestOffer.price && clientele[i].amount > 0)
                bestOffer = clientele[i];
        }
        if (bestOffer.price < streetPrice * SD.sellPrice_tolerance)
            return 'ENERGYVENT:: NO SUITABLE OFFERS WITHIN DESIRED PRICE RANGE...TRY AGAIN LATER';
        

        //make the transaction (potentially downsizing the tentative trade amount based on predicted tax calculation)
        let tentativeTradeAmount = bestOffer.amount < GE.store.getUsedCapacity(RESOURCE_ENERGY) ? bestOffer.amount : GE.store.getUsedCapacity(RESOURCE_ENERGY);
        let tax = Game.market.calcTransactionCost(tentativeTradeAmount, bestOffer.roomName, GE.room.name);

        let finalTradeAmount = tentativeTradeAmount;

        if (tentativeTradeAmount+tax > GE.store.getUsedCapacity(RESOURCE_ENERGY))
            finalTradeAmount -= tax; //reduce the amount of energy to sell if projected tax cannot be afforded

        let transaction = Game.market.deal(bestOffer.id, finalTradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY)
            return 'ENERGYVENT:: ERROR: THIS SHOULD NOT OCCUR...';

        if (transaction == ERR_TIRED)
            return 'ENERGYVENT:: TERMINAL COOLING DOWN...PLEASE WAIT BEFORE SELLING AGAIN';

        if (transaction == ERR_INVALID_ARGS){
            console.log('ENERGYVENT:: BUGSPLAT: CANNOT EXECUTE TRADE DEAL...GENERATING ERROR CODE');
            console.log('ENERGYVENT:: ORIGINAL INTENDED TRADE AMT: ' + finalTradeAmount);
            transaction = Game.market.deal(bestOffer.id, 1, GE.room.name); //attempt a test transaction for debug purposes
        }
        
        if (transaction != OK)
            return 'ENERGYVENT:: OPERATION FAILED WITH MARKET ERROR CODE ' + transaction;
        

        //return confirmation of success
        console.log('ENERGYVENT:: *SOLD ' + finalTradeAmount + ' [' + 'energy' + '] FOR ' + bestOffer.price + ' EACH (+' + (finalTradeAmount*bestOffer.price).toFixed(3) + ' CREDITS)');
        console.log('ENERGYVENT:: TRANSMISSION TAX: ' + tax + ' (' + (100*tax/finalTradeAmount).toFixed(1) + '% rate)');
        console.log('ENERGYVENT:: TRANSACTION SUCCESSFUL (ROOM #' + room_num + ')');
        
        return OK;
    }
};