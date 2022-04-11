//executable script: creates a compressed summary about every room's remote mining operations
    //require('STATUSREPORT_R.exe').run()
    
    var SD = require('SET_SOFTDATA');
    

    module.exports = {
        run: function(){
            
            let remote_exists;
            let danger_level;
            let bloodhunt_status;
            let enforc_active;
            let purif_active;

            let ticksago_enemy;
            let ticksago_core;
            let ticksago_resLost;
            
            
            //summary 1: room existence, danger level, summoned recovery units
            for (let i=0; i<SD.nexus_id.length; i++){
                remote_exists =     (Memory.orbitalAssimilator_MAX[i] != 0)     ? true          : false;
                danger_level =      (Memory.evac_timer[i] > 0)                  ? 'HIGH'        : 'LOW';
                bloodhunt_status =  (danger_level == 'LOW')                     ? 'DORMANT'     : (Memory.bloodhunter_casualty[i])           ? 'DEFEATED'   :
                                    (Memory.viable_prey[i])                     ? 'PROWLING'    : 'WITHHELD';
                enforc_active =     (danger_level == 'HIGH')                    ? 'RETREATING'  : (Memory.enforcer_MAX[i] > 0)               ? 'SIEGING'    : 'DORMANT';
                purif_active =      (danger_level == 'HIGH')                    ? 'RETREATING'  : (Memory.purifier_MAX[i] > 0)               ? 'SIEGING'    : 'DORMANT';
                
                if (remote_exists)
                    console.log('STATUSREPORT_R:: Site #' + i +
                        '|      DANGER: ' + danger_level + '       BLOOD HUNTER: ' + bloodhunt_status +
                        '       ENFORCER: ' + enforc_active + '       PURIFIER: ' + purif_active);
            }
            
            console.log('STATUSREPORT_R::');
            
            //summary 2: time passed since last incidents observed
            for (let j=0; j<SD.nexus_id.length; j++){
                remote_exists =     (Memory.orbitalAssimilator_MAX[j] != 0)     ? true          : false;
                ticksago_enemy =    isNaN(Memory.lastSeenEnemy_time[j])         ? '∞'           : (Game.time - Memory.lastSeenEnemy_time[j]);
                ticksago_core =     isNaN(Memory.lastSeenCore_time[j])          ? '∞'           : (Game.time - Memory.lastSeenCore_time[j]);
                ticksago_resLost =  isNaN(Memory.lastReserveLoss_time[j])       ? '∞'           : (Game.time - Memory.lastReserveLoss_time[j]);

                if (remote_exists)
                    console.log('STATUSREPORT_R:: Site #' + j + '|      LAST ENEMY SEEN: ' + Memory.lastSeenEnemy_name[j] + ', ' +
                        ticksago_enemy + ' ticks ago        LAST CORE SEEN: ' +
                        ticksago_core + ' ticks ago        LAST RESERVATION LOSS: ' + 
                        ticksago_resLost + ' ticks ago');
            }
            
    
            return 'STATUSREPORT_R:: ***** END *****';
        }
    };