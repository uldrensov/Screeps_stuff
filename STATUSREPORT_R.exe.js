//executable script: creates a compressed summary about every room's remote mining operations
    //require('STATUSREPORT_R.exe').run()
    
    var SD = require('SOFTDATA');
    

    module.exports = {
        run: function(){
            
            let remote_exists;
            let danger_level;
            let bloodhunt_status;
            let enforc_active;
            let purif_active;
            
            
            //summary 1: room existence, danger level, summoned recovery units
            for (let i=0; i<SD.nexus_id.length; i++){
                nexus = Game.getObjectById(SD.nexus_id[i]);
                
                if (!nexus)         continue; //error: if nexus fails to retrieve, skip the room
                
                remote_exists =     (Memory.orbitalAssimilator_MAX[i] != 0)     ? true          : false;
                danger_level =      (Memory.evac_timer[i] > 0)                  ? 'HIGH'        : 'LOW';
                bloodhunt_status =  (danger_level == 'LOW')                     ? 'DORMANT'     : (Memory.bloodhunter_casualty[i] == true)   ? 'DEFEATED'   : 'PROWLING';
                enforc_active =     (danger_level == 'HIGH')                    ? 'RETREATING'  : (Memory.enforcer_MAX[i] > 0)               ? 'SIEGING'    : 'DORMANT';
                purif_active =      (danger_level == 'HIGH')                    ? 'RETREATING'  : (Memory.purifier_MAX[i] > 0)               ? 'SIEGING'    : 'DORMANT';
                
                if (remote_exists)
                    console.log('STATUSREPORT_R:: Site #' + i + '|      DANGER: ' + danger_level + '       BLOOD HUNTER: ' + bloodhunt_status +
                        '       ENFORCER: ' + enforc_active + '       PURIFIER: ' + purif_active);
            }
            
            console.log('STATUSREPORT_R::');
            
            //summary 2:
            for (let j=0; j<SD.nexus_id.length; j++){
                nexus = Game.getObjectById(SD.nexus_id[j]);
                
                if (!nexus)         continue; //error: if nexus fails to retrieve, skip the room

                remote_exists =     (Memory.orbitalAssimilator_MAX[j] != 0)     ? true          : false;

                if (remote_exists)
                    console.log('STATUSREPORT_R:: Site #' + j + '|      LAST ENEMY SEEN: ' + Memory.lastSeenEnemy_name[j] + ', ' +
                        (Game.time - Memory.lastSeenEnemy_time[j]) + ' ticks ago        LAST CORE SEEN: ' +
                        (Game.time - Memory.lastSeenCore_time[j]) + ' ticks ago        LAST RESERVATION LOSS: ' + 
                        (Game.time - Memory.lastReserveLoss_time[j]) + ' ticks ago');
            }
            
    
            return 'STATUSREPORT_R:: *****END OF REPORT*****';
        }
    };