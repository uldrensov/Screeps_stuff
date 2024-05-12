//executable script: creates a compressed summary about the current day's gross energy income per room
    //require('STATUSREPORT_G.exe').run(0)

    module.exports = {
        run: function(emailFlag){
            
            //for each breakpoint, count up the tick log entries and calculate the average at that breakpoint
            for (let i=0; i<Memory.energyGainsToday.length; i++){
                if (!Memory.energyGainsToday[i]){
                    console.log("STATUSREPORT_G:: Vault #" + i + ": NO DATA");

                    if (emailFlag)
                        Game.notify("STATUSREPORT_G:: Vault #" + i + ": NO DATA");
                }

                else{
                    let orbital_income_msg = Memory.energyGainsToday[i][1] ? "(+ " + Memory.energyGainsToday[i][1] + " REMOTE) " : "";
                    console.log("STATUSREPORT_G:: Vault #" + i + ": " + Memory.energyGainsToday[i][0] + " LOCAL " + orbital_income_msg + "energy harvested today.");

                    if (emailFlag)
                        Game.notify("STATUSREPORT_G:: Vault #" + i + ": " + Memory.energyGainsToday[i][0] + " LOCAL " + orbital_income_msg + "energy harvested today.");
                }
            }
    
            return 'STATUSREPORT_G:: ***** END *****';
        }
    };