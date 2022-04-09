//executable script: attempts to buy or sell resources from a room's terminal
//optionally, can also be called automatically by ECONDRIVE.js
    //require('TRANSACTION.exe').run(0,'Z',true,0,false)
    //require('TRANSACTION.exe').run(0,'power',false,1000,false)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num, resource_type, dir, buy_amt, ignore_tolerance){
        
        //arg validation
        if (Game.getObjectById(SD.nexus_id[room_num]) == undefined)
            return 'TRANSACTION:: INVALID ROOM NUMBER';
        
        //general variable init and validation
        let GE = Game.getObjectById(SD.nexus_id[room_num]).room.terminal;

        if (GE == null)
            return 'TRANSACTION:: ROOM IS MISSING A TERMINAL';

        if (GE.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return 'TRANSACTION:: TERMINAL TRANSMISSION FUEL DEPLETED';

        let clientele;

        //init market (selling to players)
        if (dir){
            if (GE.store.getUsedCapacity(resource_type) == 0)
                return 'TRANSACTION:: TERMINAL MERCHANDISE DEPLETED';
        
            clientele = Game.market.getAllOrders({type: ORDER_BUY, resourceType: resource_type});
        }
        //init market (buying from players)
        else
            clientele = Game.market.getAllOrders({type: ORDER_SELL, resourceType: resource_type});

        if (!clientele.length)
            return 'TRANSACTION:: MARKET IS EMPTY...TRY AGAIN LATER';
        

        //calculate average street price
        let hist = Game.market.getHistory(resource_type);
        let streetPrice = 0;

        for (let i=0; i<hist.length; i++){
            streetPrice += hist[i].avgPrice;
        }
        streetPrice /= hist.length;
        

        //find the best offer (stay above minimum negotiable price, unless ignore_tolerance is true)
        let bestOffer = clientele[0];

        //selling to players: find highest price to sell to
        if (dir){
            for (let i=0; i<clientele.length; i++){
                if (clientele[i].price > bestOffer.price
                    &&
                    clientele[i].amount > 0){

                        bestOffer = clientele[i];
                    }
            }
            if (bestOffer.price < streetPrice * SD.sellPrice_tolerance
                &&
                !ignore_tolerance){

                return 'TRANSACTION:: NO SUITABLE TRADES REQUESTING [' + resource_type + '] AT SUFFICIENTLY HIGH PRICES...TRY AGAIN LATER';
            }
        }
        //buying from players: find lowest price to buy from
        else{
            for (let i=0; i<clientele.length; i++){
                if (clientele[i].price < bestOffer.price
                    &&
                    clientele[i].amount > 0){

                        bestOffer = clientele[i];
                    }
            }
            if (bestOffer.price > streetPrice * SD.buyPrice_tolerance
                &&
                !ignore_tolerance){

                return 'TRANSACTION:: NO SUITABLE TRADES OFFERING [' + resource_type + '] AT SUFFICIENTLY LOW PRICES...TRY AGAIN LATER';
            }
        }
        

        //calculate trade amount and energy tax
        let tradeAmount;

        //amount to sell: as much as possible
        if (dir)
            tradeAmount = bestOffer.amount < GE.store.getUsedCapacity(resource_type) ? bestOffer.amount : GE.store.getUsedCapacity(resource_type);
        //amount to buy: variable quantity
        else
            tradeAmount = buy_amt;

        let tax = Game.market.calcTransactionCost(tradeAmount, bestOffer.roomName, GE.room.name);


        //make the transaction
        let transaction = Game.market.deal(bestOffer.id, tradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY)
            return 'TRANSACTION:: INSUFFICIENT RESOURCES...OFFER REQUIRES ' + tradeAmount + ' [' + resource_type + '] AND ' + tax + ' TRANSMISSION ENERGY';

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

        //selling to players
        if (dir){
            console.log('TRANSACTION:: ROOM #' + room_num + ' SOLD ' + tradeAmount + ' [' + resource_type + '] FOR ' +
                bestOffer.price + ' EACH (' + (tradeAmount*bestOffer.price).toFixed(3) + ' CREDITS GAINED) ... TRANSMISSION TAX: ' +
                tax + ' (' + (100*tax/tradeAmount).toFixed(1) + '% tax rate)');

            Memory.creditGainToday += tradeAmount*bestOffer.price;
        }
        //buying from players
        else{
            console.log('TRANSACTION:: ROOM #' + room_num + ' BOUGHT ' + tradeAmount + ' [' + resource_type + '] FOR ' +
            bestOffer.price + ' EACH (' + (tradeAmount*bestOffer.price).toFixed(3) + ' CREDITS PAID) ... TRANSMISSION TAX: ' +
            tax + ' (' + (100*tax/tradeAmount).toFixed(1) + '% tax rate)');

            Memory.creditGainToday -= tradeAmount*bestOffer.price;
        }

        return OK;
    }
};