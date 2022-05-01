//function: controls all "daily" actions, e.g. logging certain data points

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(){

        const milli =                           1000;   //milliseconds in a second
        const secondsIn24h =                    86400;
        const PDT =                             7;      //adjust UTC into PDT timezone
        const hoursInDay =                      24;
        const log_size =                        600;
        

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
                Memory.dayStart_timestamp =     Date.now();


                //update the "user-friendly" timestamp
                let d =                         new Date();
                let minute =                    d.getMinutes();
                let hour =                      d.getHours();
                
                //timezone adjustment
                //if UTC is past midnight but GMT-7 is not, adjust both date and hour
                if ((hour - PDT) < 0){
                    hour =                      (hour - PDT) + hoursInDay; //corrects negative val
                    d.setDate(d.getDate()-1);
                }
                //if UTC and GMT-7 are still on the same day, only adjust hour
                else
                    hour =                      hour - PDT;

                let day =                       d.getDate();
                let month =                     d.getMonth() + 1; //month is 0-indexed
                let year =                      d.getFullYear();

                let yesterday =                 Memory.converted_timestamp;
                Memory.converted_timestamp =    year + '/' + month.toString().padStart(2,'0') + '/' + day.toString().padStart(2,'0') + ' at ' +
                                                    hour.toString().padStart(2,'0') + ':' + minute.toString().padStart(2,'0');


                //clear the tick log, and reset the logging counter to 0
                Memory.cpu_log =                [];
                Memory.ticksLoggedToday =       0;


                //daily notification header
                Game.notify('DRIVE_DAILIES:: NOTIFICATION DIGEST: [' + yesterday + '] --> [' + Memory.converted_timestamp + ']');


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

                Memory.creditGainToday =        0;
                Memory.pixelGainToday =         0;
            }
        }
    }
};