//executable script: attempts to sell all (presumably excess) energy from a room's terminal
//optionally, can also be called automatically by DRIVE_ECON.js
    //require('TRADE_ENERGY.exe').run(3)

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (room_num < 0 || room_num >= SD.ctrl_id.length)
            return 'TRADE_ENERGY:: INVALID ROOM NUMBER (ARG OUT-OF-BOUNDS)';
        if (!Game.getObjectById(SD.ctrl_id[room_num]))
            return 'TRADE_ENERGY:: INVALID ROOM NUMBER (FAILED TO GET CONTROLLER)';
        

        //variable init and additional validation
        let GE = Game.getObjectById(SD.ctrl_id[room_num][0]).room.terminal;

        if (!GE)
            return 'TRADE_ENERGY:: ROOM IS MISSING A TERMINAL';

        if (GE.store.getUsedCapacity(RESOURCE_ENERGY) == 0)
            return 'TRADE_ENERGY:: TERMINAL TRANSMISSION FUEL DEPLETED';



        //grab market data and perform pre-transaction calculations...
        let clientele = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});

        if (!clientele.length)
            return 'TRADE_ENERGY:: MARKET IS EMPTY...TRY AGAIN LATER';
        
        
        //calculate average street price
        let hist = Game.market.getHistory(RESOURCE_ENERGY);
        let streetPrice = 0;

        for (let i=0; i<hist.length; i++){
            streetPrice += hist[i].avgPrice;
        }
        streetPrice /= hist.length;
        

        //find the best offer within price range
        let bestOffer = clientele[0];

        for (let i=0; i<clientele.length; i++){
            if (clientele[i].price > bestOffer.price
                &&
                clientele[i].amount > 0){

                bestOffer = clientele[i];
            }
        }
        if (bestOffer.price < streetPrice * SD.sellPrice_tolerance)
            return 'TRADE_ENERGY:: NO SUITABLE OFFERS WITHIN DESIRED PRICE RANGE...TRY AGAIN LATER';
        

        //calculate trade amount and energy tax (potentially downsizing the tentative trade amount based on predicted tax calculation)
        let tentativeTradeAmount = Math.min(bestOffer.amount, GE.store.getUsedCapacity(RESOURCE_ENERGY));
        let tax = Game.market.calcTransactionCost(tentativeTradeAmount, bestOffer.roomName, GE.room.name);

        let finalTradeAmount = tentativeTradeAmount;

        if (tentativeTradeAmount+tax > GE.store.getUsedCapacity(RESOURCE_ENERGY))
            finalTradeAmount -= tax; //reduce the amount of energy to sell if projected tax cannot be afforded

            

        //make the transaction
        let transaction = Game.market.deal(bestOffer.id, finalTradeAmount, GE.room.name);
        
        if (transaction == ERR_NOT_ENOUGH_ENERGY)
            return 'TRADE_ENERGY:: ERROR: THIS SHOULD NOT OCCUR...';

        if (transaction == ERR_TIRED)
            return 'TRADE_ENERGY:: TERMINAL COOLING DOWN...PLEASE WAIT BEFORE SELLING AGAIN';

        if (transaction == ERR_INVALID_ARGS){
            console.log('TRADE_ENERGY:: BUGSPLAT: CANNOT EXECUTE TRADE DEAL...GENERATING ERROR CODE');
            console.log('TRADE_ENERGY:: ORIGINAL INTENDED TRADE AMT: ' + finalTradeAmount);
            transaction = Game.market.deal(bestOffer.id, 1, GE.room.name); //attempt a test transaction for debug purposes
        }
        
        if (transaction != OK)
            return 'TRADE_ENERGY:: OPERATION FAILED WITH MARKET ERROR CODE ' + transaction;
        

        //return confirmation of success
        console.log('TRADE_ENERGY:: *SOLD ' + finalTradeAmount + ' [' + 'energy' + '] FOR ' + bestOffer.price + ' EACH (+' + (finalTradeAmount*bestOffer.price).toFixed(3) + ' CREDITS)');
        console.log('TRADE_ENERGY:: ENERGY TAX: ' + tax + ' (' + (tax/finalTradeAmount).toFixed(3) + ' / unit)');
        console.log('TRADE_ENERGY:: TRANSACTION SUCCESSFUL (ROOM #' + room_num + ')');
        
        return OK;
    }
};