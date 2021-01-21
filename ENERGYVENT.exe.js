//executable script: attempts to sell all (presumably excess) energy from a room's terminal
    //require('ENERGYVENT.exe').run(3)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (room_num < 0 || room_num >= SD.spawner_id.length) return 'INVALID ROOM NUMBER';
        
        //init
        var GE = Game.getObjectById(SD.nexus_id[room_num]).room.terminal;
        if (GE == null) return 'ERROR: ROOM DOES NOT CONTAIN A TERMINAL';
        if (GE.store.getUsedCapacity(RESOURCE_ENERGY) == 0) return 'ERROR: TERMINAL TRANSMISSION FUEL DEPLETED';
        var hist = Game.market.getHistory(RESOURCE_ENERGY);
        var clientele = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});
        if (!clientele.length) return 'MARKET IS EMPTY...TRY AGAIN LATER';
        
        
        //calculate average street price
        var streetPrice = 0;
        for (let i=0; i<hist.length; i++){
            streetPrice += hist[i].avgPrice;
        }
        streetPrice /= hist.length;
        
        //find the best offer within price range
        var bestOffer = clientele[0];
        for (let i=0; i<clientele.length; i++){
            if (clientele[i].price > bestOffer.price && clientele[i].amount > 0)
                bestOffer = clientele[i];
        }
        if (bestOffer.price < streetPrice * SD.price_tolerance) return 'NO SUITABLE OFFERS WITHIN DESIRED PRICE RANGE...TRY AGAIN LATER';
        
        //make a transaction (potentially downsizing the tentative trade amount based on predicted tax calculation)
        var tentativeTradeAmount = bestOffer.amount < GE.store.getUsedCapacity(RESOURCE_ENERGY) ? bestOffer.amount : GE.store.getUsedCapacity(RESOURCE_ENERGY);
        var tax = Game.market.calcTransactionCost(tentativeTradeAmount, bestOffer.roomName, GE.room.name);
        var finalTradeAmount = tentativeTradeAmount;
        if (tentativeTradeAmount+tax > GE.store.getUsedCapacity(RESOURCE_ENERGY))
            finalTradeAmount = tentativeTradeAmount-tax;
        var transaction = Game.market.deal(bestOffer.id, finalTradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY) return 'ERROR: THIS SHOULD NOT OCCUR...';
        if (transaction == ERR_TIRED) return 'COOLING DOWN...PLEASE WAIT';
        if (transaction == ERR_INVALID_ARGS){
            console.log('BUGSPLAT...');
            console.log(finalTradeAmount);
            transaction = Game.market.deal(bestOffer.id, 1, GE.room.name);
        }
        if (transaction != OK) return transaction;
        
        console.log('*SOLD ' + finalTradeAmount + ' [' + 'energy' + '] FOR ' + bestOffer.price + ' EACH (+' + (finalTradeAmount*bestOffer.price).toFixed(3) + ' CREDITS)');
        console.log('TRANSMISSION TAX: ' + tax + ' (' + (100*tax/finalTradeAmount).toFixed(1) + '% rate)');
        console.log('TRANSACTION SUCCESSFUL (ROOM #' + room_num + ')');
        return OK;
    }
};