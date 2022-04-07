//executable script: creates a summary about the current day's average CPU usage per tick, recorded at various breakpoints
    //require('STATUSREPORT_T.exe').run()

    module.exports = {
        run: function(){
            
            let breakpoint_avgs = [];
            let counter;

            //for each breakpoint, count up the tick log entries and calculate the average at that breakpoint
            for (let i=0; i<Memory.cpu_log.length; i++){
                counter = 0;

                for (let j=0; j<Memory.ticksLoggedToday; j++){
                    counter += Memory.cpu_log[i][j];
                }

                breakpoint_avgs[i] = counter / Memory.ticksLoggedToday;
            }

            //print results
            for (let k=0; k<breakpoint_avgs.length; k++){
                console.log('STATUSREPORT_T:: BREAKPOINT ' + k + ': ' + breakpoint_avgs[k].toFixed(1) + ' CPU averaged');
            }


            return 'STATUSREPORT_T:: ***** END *****';
        }
    };