//function: controls all "daily" actions, e.g. logging certain data points

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(){

        const milli =                   1000;   //milliseconds in a second
        const secondsIn24h =            86400;
        const secondsInHour =           3600;
        const decimalToClock_minutes =  60;     //converts decimals (fractional, per 100) to minutes (whole, per 60)
        const PDT =                     7;      //adjust UTC into PDT timezone
        const hoursInDay =              24;
        const log_size =                600;
        

        //allow CPU logging on this tick, until the counter reaches 600 today
        Memory.recordTick = false;

        if (Memory.ticksLoggedToday < log_size){
            Memory.recordTick = true;
            Memory.ticksLoggedToday++;
        }

            
        //periodically check if a new day has passed
        if (Game.time % SD.std_interval == 0){
            //processes to run once per day...
            if (((Date.now() - Memory.dayStart_timestamp) / milli)
                >
                secondsIn24h){

                //update the "day start" timestamp every 24h
                Memory.dayStart_timestamp = Date.now();

                //update the "user-friendly" timestamp
                let secondsSince_epoch =                Date.now()          / milli;                    //seconds since the Unix epoch, AKA 00:00 UTC, 01 Jan 1970
                let secondsSince_0000 =                 secondsSince_epoch  % secondsIn24h;             //seconds since 00:00 UTC, today
                let t_raw =                             secondsSince_0000   / secondsInHour;            //hours since 00:00 UTC, in decimal form
                let t_hours =                           Math.floor(t_raw);                              //hour component of t_raw, unadjusted
                let t_mins =                            (t_raw - t_hours)   * decimalToClock_minutes;   //minute component of t_raw
                if ((t_hours - PDT) < 0)    t_hours =   hoursInDay          + (t_hours - PDT);          //hour component of t_raw, adjusted for GMT-7 (negative val corrected)
                else                        t_hours =   t_hours             - PDT;                      //hour component of t_raw, adjusted for GMT-7 (no correction needed)

                Memory.converted_timestamp =            t_hours.toString().padStart(2,'0') + ':' + Math.floor(t_mins).toString().padStart(2,'0');


                //clear the tick log, and reset the logging counter to 0
                Memory.cpu_log =            [];
                Memory.ticksLoggedToday =   0;


                //notify about vault energy changes, and reset counters
                for (let i=0; i<SD.ctrl_id.length; i++){
                    //bypass: if controller fails to retrieve, skip the room
                    if (!Game.getObjectById(SD.ctrl_id[i]))
                        continue;

                    if (Game.getObjectById(SD.ctrl_id[i]).room.storage){
                        Game.notify('DRIVE_DAILIES:: Vault #' + i + ' energy: ' + Memory.vaultEnergy_levels[i] + ' (yesterday) -->> ' +
                            Game.getObjectById(SD.ctrl_id[i]).room.storage.store.energy + ' (now) ... Δ = ' + 
                            Game.getObjectById(SD.ctrl_id[i]).room.storage.store.energy - Memory.vaultEnergy_levels[i]);

                        Memory.vaultEnergy_levels[i] = Game.getObjectById(SD.ctrl_id[i]).room.storage.store.energy;
                    }
                }
                

                //notify about credit/pixel revenue, and reset counters
                Game.notify('DRIVE_DAILIES:: Gained ' + Memory.creditGainToday + ' credits today!');
                Game.notify('DRIVE_DAILIES:: Gained ' + Memory.pixelGainToday + ' pixels today!');

                Memory.creditGainToday =    0;
                Memory.pixelGainToday =     0;
            }
        }
    }
};