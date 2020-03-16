//executable script: attempts to sell minerals from a room's terminal
    //require('TRANSACTION.exe').run(0)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (Memory.SPAWNCYCLE__minerals[room_num] == undefined)
            return 'INVALID ROOM NUMBER';
        
        //init
        var GE = Game.getObjectById(SD.nexus_id[room_num]).room.terminal;
        if (GE == null) return 'ERROR: ROOM DOES NOT CONTAIN A TERMINAL';
        var minType = Memory.SPAWNCYCLE__minerals[room_num].mineralType;
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
            if (clientele[i].price > bestOffer.price)
                bestOffer = clientele[i];
        }
        if (bestOffer.price < streetPrice * .95) return 'NO SUITABLE OFFERS WITHIN DESIRED PRICE RANGE...TRY AGAIN LATER';
        
        //make the transaction
        var tradeAmount = bestOffer.amount < GE.store.getUsedCapacity(minType) ? bestOffer.amount : GE.store.getUsedCapacity(minType);
        var tax = Game.market.calcTransactionCost(tradeAmount, bestOffer.roomName, GE.room.name);
        var transaction = Game.market.deal(bestOffer.id, tradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY) return 'INSUFFICIENT RESOURCES...OFFER REQUIRES ' + tradeAmount + ' OF ' + minType + ' AND ' + tax + ' TRANSMISSION ENERGY';
        if (transaction != OK) return transaction;
        
        console.log('SOLD ' + tradeAmount + ' OF ' + minType + ' FOR ' + bestOffer.price + ' EACH');
        console.log('TRANSMISSION TAX: ' + tax);
        return 'TRANSACTION SUCCESSFUL (ROOM #' + room_num + ')';
    }
};