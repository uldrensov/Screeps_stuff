//executable script: attempts to sell minerals from a room's terminal
    //require('TRANSACTION.exe').run(0)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (Memory.mineral_type[room_num] == undefined)
            return 'INVALID ROOM NUMBER';
        
        //init
        var GE = Game.getObjectById(SD.nexus_id[room_num]).room.terminal;
        if (GE == null) return 'ERROR: ROOM DOES NOT CONTAIN A TERMINAL';
        var minType = Memory.mineral_type[room_num].mineralType;
        if (GE.store.getUsedCapacity() == 0) return 'ERROR: TERMINAL IS EMPTY';
        if (GE.store.getUsedCapacity(RESOURCE_ENERGY) == 0) return 'ERROR: TERMINAL TRANSMISSION FUEL DEPLETED';
        if (GE.store.getUsedCapacity(minType) == 0) return 'ERROR: TERMINAL MERCHANDISE DEPLETED';
        var hist = Game.market.getHistory(minType);
        var clientele = Game.market.getAllOrders({type: ORDER_BUY, resourceType: minType});
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
        
        //make the transaction
        var tradeAmount = bestOffer.amount < GE.store.getUsedCapacity(minType) ? bestOffer.amount : GE.store.getUsedCapacity(minType);
        var tax = Game.market.calcTransactionCost(tradeAmount, bestOffer.roomName, GE.room.name);
        var transaction = Game.market.deal(bestOffer.id, tradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY) return 'INSUFFICIENT RESOURCES...OFFER REQUIRES ' + tradeAmount + ' [' + minType + '] AND ' + tax + ' TRANSMISSION ENERGY';
        if (transaction == ERR_TIRED) return 'COOLING DOWN...PLEASE WAIT';
        if (transaction == ERR_INVALID_ARGS){
            console.log('BUGSPLAT...');
            console.log(tradeAmount);
            transaction = Game.market.deal(bestOffer.id, 1, GE.room.name);
        }
        if (transaction != OK) return transaction;
        
        console.log('*SOLD ' + tradeAmount + ' [' + minType + '] FOR ' + bestOffer.price + ' EACH (+' + (tradeAmount*bestOffer.price).toFixed(3) + ' CREDITS)');
        console.log('TRANSMISSION TAX: ' + tax + ' (' + (100*tax/tradeAmount).toFixed(1) + '% rate)');
        console.log('TRANSACTION SUCCESSFUL (ROOM #' + room_num + ')');
        return OK;
    }
};