//executable script: attempts to sell minerals from a room's terminal
//optionally, can also be called automatically by ECONDRIVE.js
    //require('TRANSACTION.exe').run(0)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (Memory.mineral_type[room_num] == undefined)
            return 'TRANSACTION:: INVALID ROOM NUMBER';
        
        //variable init and additional validation
        let GE = Game.getObjectById(SD.nexus_id[room_num]).room.terminal;

        if (GE == null)
            return 'TRANSACTION:: ROOM IS MISSING A TERMINAL';

        if (GE.store.getUsedCapacity() == 0)
            return 'TRANSACTION:: TERMINAL IS EMPTY';

        if (GE.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return 'TRANSACTION:: TERMINAL TRANSMISSION FUEL DEPLETED';

        let minType = Memory.mineral_type[room_num].mineralType;

        if (GE.store.getUsedCapacity(minType) == 0)
            return 'TRANSACTION:: TERMINAL MERCHANDISE DEPLETED';

        let hist = Game.market.getHistory(minType);
        let clientele = Game.market.getAllOrders({type: ORDER_BUY, resourceType: minType});

        if (!clientele.length)
            return 'TRANSACTION:: MARKET IS EMPTY...TRY AGAIN LATER';
        
        
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
        if (bestOffer.price < streetPrice * SD.price_tolerance)
            return 'TRANSACTION:: NO SUITABLE OFFERS WITHIN DESIRED PRICE RANGE...TRY AGAIN LATER';
        

        //make the transaction
        let tradeAmount = bestOffer.amount < GE.store.getUsedCapacity(minType) ? bestOffer.amount : GE.store.getUsedCapacity(minType);
        let tax = Game.market.calcTransactionCost(tradeAmount, bestOffer.roomName, GE.room.name);
        let transaction = Game.market.deal(bestOffer.id, tradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY)
            return 'TRANSACTION:: INSUFFICIENT RESOURCES...OFFER REQUIRES ' + tradeAmount + ' [' + minType + '] AND ' + tax + ' TRANSMISSION ENERGY';

        if (transaction == ERR_TIRED)
            return 'TRANSACTION:: TERMINAL COOLING DOWN...PLEASE WAIT BEFORE SELLING AGAIN';
            
        if (transaction == ERR_INVALID_ARGS){
            console.log('TRANSACTION:: BUGSPLAT: CANNOT EXECUTE TRADE DEAL...GENERATING ERROR CODE');
            console.log('TRANSACTION:: ORIGINAL INTENDED TRADE AMT: ' + tradeAmount);
            transaction = Game.market.deal(bestOffer.id, 1, GE.room.name); //attempt a test transaction for debug purposes
        }
        
        if (transaction != OK)
            return 'TRANSACTION:: OPERATION FAILED WITH MARKET ERROR CODE ' + transaction;
        

        //return confirmation of success
        console.log('TRANSACTION:: *SOLD ' + tradeAmount + ' [' + minType + '] FOR ' + bestOffer.price + ' EACH (' + (tradeAmount*bestOffer.price).toFixed(3) + ' CREDITS GAINED)');
        console.log('TRANSACTION:: TRANSMISSION TAX: ' + tax + ' (' + (100*tax/tradeAmount).toFixed(1) + '% rate)');
        console.log('TRANSACTION:: TRANSACTION SUCCESSFUL (ROOM #' + room_num + ')');
        return OK;
    }
};