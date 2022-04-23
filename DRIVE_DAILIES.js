//function: controls all "daily" actions, e.g. logging certain data points

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(){

        const log_size =        600;
        const secondsIn24h =    86400;
        

        //allow CPU logging on this tick, until the counter reaches 600 today
        Memory.recordTick = false;

        if (Memory.ticksLoggedToday < log_size){
            Memory.recordTick = true;
            Memory.ticksLoggedToday++;
        }

            
        //periodically check if a new day has passed
        if (Game.time % SD.std_interval == 0){
            //processes to run once per day...
            if (((Date.now() - Memory.dayStart_timestamp) / 1000)
                >
                secondsIn24h){

                //update the "meridian" timestamp once per day
                Memory.dayStart_timestamp = Date.now();


                //clear the tick log, and reset the logging counter to 0
                Memory.cpu_log =            [];
                Memory.ticksLoggedToday =   0;


                //notify about vault energy changes, and reset counters
                for (let i=0; i<SD.ctrl_id.length; i++){
                    //bypass: if controller fails to retrieve, skip the room
                    if (!Game.getObjectById(ctrl_id[i]))
                        continue;

                    if (Game.getObjectById(ctrl_id[i]).room.storage){
                        Game.notify('DRIVE_DAILIES:: Vault #' + i + ' energy: ' + vaultEnergy_levels[i] + ' (yesterday) -->> ' +
                            Game.getObjectById(ctrl_id[i]).room.storage.store.energy + ' (now) ... Δ = ' + 
                            Game.getObjectById(ctrl_id[i]).room.storage.store.energy - vaultEnergy_levels[i]);

                        Memory.vaultEnergy_levels[i] = Game.getObjectById(ctrl_id[i]).room.storage.store.energy;
                    }
                }
                

                //notify about credit/pixel revenue, and reset counters
                Game.notify('MAIN:: Gained ' + Memory.creditGainToday + ' credits today!');
                Game.notify('MAIN:: Gained ' + Memory.pixelGainToday + ' pixels today!');

                Memory.creditGainToday =    0;
                Memory.pixelGainToday =     0;
            }
        }
    }
};