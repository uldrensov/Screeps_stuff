//function: automatically initialises and populates all necessary contents of global read/write memory

module.exports = {
    run: function(roomcount){
        
        //init (allocate) arrays for room-specific data...
        //unit population maxima
        if (Memory.assimilator_MAX == undefined)                Memory.assimilator_MAX =                   [];
            if (Memory.assimilator2_MAX == undefined)           Memory.assimilator2_MAX =                  [];
        if (Memory.drone_MAX == undefined)                      Memory.drone_MAX =                         [];
        if (Memory.energiser_MAX == undefined)                  Memory.energiser_MAX =                     [];
        if (Memory.retrieverDrone_MAX == undefined)             Memory.retrieverDrone_MAX =                [];            //do not modify manually
        if (Memory.sacrificer_MAX == undefined)                 Memory.sacrificer_MAX =                    [];
        if (Memory.acolyte_MAX == undefined)                    Memory.acolyte_MAX =                       [];
            if (Memory.acolyte2_MAX == undefined)               Memory.acolyte2_MAX =                      [];
        if (Memory.adherent_MAX == undefined)                   Memory.adherent_MAX =                      [];
        if (Memory.nullAdherent_MAX == undefined)               Memory.nullAdherent_MAX =                  [];
        if (Memory.supplicant_MAX == undefined)                 Memory.supplicant_MAX =                    [];
        if (Memory.nullSupplicant_MAX == undefined)             Memory.nullSupplicant_MAX =                [];
        if (Memory.probe_MAX == undefined)                      Memory.probe_MAX =                         [];            //do not modify manually
        if (Memory.orbitalAssimilator_MAX == undefined)         Memory.orbitalAssimilator_MAX =            [];
        if (Memory.recalibrator_MAX == undefined)               Memory.recalibrator_MAX =                  [];
        if (Memory.orbitalDrone_MAX == undefined)               Memory.orbitalDrone_MAX =                  [];
        if (Memory.bloodhunter_MAX == undefined)                Memory.bloodhunter_MAX =                   [];            //do not modify manually
        if (Memory.enforcer_MAX == undefined)                   Memory.enforcer_MAX =                      [];            //do not modify manually
        if (Memory.purifier_MAX == undefined)                   Memory.purifier_MAX =                      [];            //do not modify manually
        if (Memory.ancientDrone_MAX == undefined)               Memory.ancientDrone_MAX =                  [];            //do not modify manually
        if (Memory.ancientAssimilator_MAX == undefined)         Memory.ancientAssimilator_MAX =            [];            //do not modify manually
        if (Memory.architect_MAX == undefined)                  Memory.architect_MAX =                     [];
        if (Memory.phaseArchitect_MAX == undefined)             Memory.phaseArchitect_MAX =                [];
        if (Memory.visionary_MAX == undefined)                  Memory.visionary_MAX =                     [];
        if (Memory.specialist_MAX == undefined)                 Memory.specialist_MAX =                    [];
        if (Memory.saviour_MAX == undefined)                    Memory.saviour_MAX =                       [];
        if (Memory.emissary_MAX == undefined)                   Memory.emissary_MAX =                      [];            //role is currently unfinished/unimplemented
        if (Memory.darktemplar_MAX == undefined)                Memory.darktemplar_MAX =                   [];            //role is currently unfinished/unimplemented

        //towers
        if (Memory.turretsByRoom == undefined)                  Memory.turretsByRoom =                     [];            //do not modify manually
        if (Memory.turretCommand == undefined)                  Memory.turretCommand =                     [];            //do not modify manually
        if (Memory.turretTarget_id == undefined)                Memory.turretTarget_id =                   [];            //do not modify manually

        //vault
        if (Memory.vaultEnergy_levels == undefined)             Memory.vaultEnergy_levels =                [];            //do not modify manually
        if (Memory.vaultAlertLO_EN == undefined)                Memory.vaultAlertLO_EN =                   [];            //do not modify manually
        if (Memory.vaultAlertHI_EN == undefined)                Memory.vaultAlertHI_EN =                   [];            //do not modify manually

        //remote mining
        if (Memory.evac_timer == undefined)                     Memory.evac_timer =                        [];            //do not modify manually
        if (Memory.viable_prey == undefined)                    Memory.viable_prey =                       [];            //do not modify manually
        if (Memory.bloodhunter_casualty == undefined)           Memory.bloodhunter_casualty =              [];            //do not modify manually
        if (Memory.lastSeenEnemy_name == undefined)             Memory.lastSeenEnemy_name =                [];            //do not modify manually
        if (Memory.lastSeenEnemy_time == undefined)             Memory.lastSeenEnemy_time =                [];            //do not modify manuall
        if (Memory.lastSeenCore_time == undefined)              Memory.lastSeenCore_time =                 [];            //do not modify manually
        if (Memory.lastReserveLoss_time == undefined)           Memory.lastReserveLoss_time =              [];            //do not modify manually

        //economy automation
        if (Memory.autoload_EN == undefined)                    Memory.autoload_EN =                       [];
        if (Memory.autosell_EN == undefined)                    Memory.autosell_EN =                       [];
        if (Memory.autovent_EN == undefined)                    Memory.autovent_EN =                       [];

        //misc
        if (Memory.roomSpeed == undefined)                      Memory.roomSpeed =                         [];
        if (Memory.extractor_id == undefined)                   Memory.extractor_id =                      [];            //do not modify manually
        if (Memory.mineral_type == undefined)                   Memory.mineral_type =                      [];            //do not modify manually
        if (Memory.powernex_id == undefined)                    Memory.powernex_id =                       [];            //do not modify manually
        

        //init (populate) arrays with room-specific data...
        for (let i=0; i<roomcount; i++){
            if (Memory.assimilator_MAX[i] == undefined)         Memory.assimilator_MAX[i] =                0;
                if (Memory.assimilator2_MAX[i] == undefined)    Memory.assimilator2_MAX[i] =               0;
            if (Memory.drone_MAX[i] == undefined)               Memory.drone_MAX[i] =                      0;
            if (Memory.energiser_MAX[i] == undefined)           Memory.energiser_MAX[i] =                  0;
            if (Memory.retrieverDrone_MAX[i] == undefined)      Memory.retrieverDrone_MAX[i] =             -1;            //do not modify manually
            if (Memory.sacrificer_MAX[i] == undefined)          Memory.sacrificer_MAX[i] =                 0;
            if (Memory.acolyte_MAX[i] == undefined)             Memory.acolyte_MAX[i] =                    0;
                if (Memory.acolyte2_MAX[i] == undefined)        Memory.acolyte2_MAX[i] =                   0;
            if (Memory.adherent_MAX[i] == undefined)            Memory.adherent_MAX[i] =                   0;
            if (Memory.nullAdherent_MAX[i] == undefined)        Memory.nullAdherent_MAX[i] =               0;
            if (Memory.supplicant_MAX[i] == undefined)          Memory.supplicant_MAX[i] =                 0;
            if (Memory.nullSupplicant_MAX[i] == undefined)      Memory.nullSupplicant_MAX[i] =             0;
            if (Memory.probe_MAX[i] == undefined)               Memory.probe_MAX[i] =                      -1;            //do not modify manually
            if (Memory.orbitalAssimilator_MAX[i] == undefined)  Memory.orbitalAssimilator_MAX[i] =         0;
            if (Memory.recalibrator_MAX[i] == undefined)        Memory.recalibrator_MAX[i] =               0;
            if (Memory.orbitalDrone_MAX[i] == undefined)        Memory.orbitalDrone_MAX[i] =               0;
            if (Memory.bloodhunter_MAX[i] == undefined)         Memory.bloodhunter_MAX[i] =                -1;            //do not modify manually
            if (Memory.enforcer_MAX[i] == undefined)            Memory.enforcer_MAX[i] =                   -1;            //do not modify manually
            if (Memory.purifier_MAX[i] == undefined)            Memory.purifier_MAX[i] =                   -1;            //do not modify manually
            if (Memory.ancientDrone_MAX[i] == undefined)        Memory.ancientDrone_MAX[i] =               -1;            //do not modify manually
            if (Memory.ancientAssimilator_MAX[i] == undefined)  Memory.ancientAssimilator_MAX[i] =         -1;            //do not modify manually
            if (Memory.architect_MAX[i] == undefined)           Memory.architect_MAX[i] =                  0;
            if (Memory.phaseArchitect_MAX[i] == undefined)      Memory.phaseArchitect_MAX[i] =             0;
            if (Memory.visionary_MAX[i] == undefined)           Memory.visionary_MAX[i] =                  0;
            if (Memory.specialist_MAX[i] == undefined)          Memory.specialist_MAX[i] =                 0;
            if (Memory.saviour_MAX[i] == undefined)             Memory.saviour_MAX[i] =                    0;
            if (Memory.emissary_MAX[i] == undefined)            Memory.emissary_MAX[i] =                   0;             //role is currently unfinished/unimplemented
            if (Memory.darktemplar_MAX[i] == undefined)         Memory.darktemplar_MAX[i] =                0;             //role is currently unfinished/unimplemented
            
            if (Memory.turretCommand[i] == undefined)           Memory.turretCommand[i] =                  'IDLE';        //do not modify manually
            if (Memory.turretTarget_id[i] == undefined)         Memory.turretTarget_id[i] =                'NULL';        //do not modify manually
            
            if (Memory.vaultEnergy_levels[i] == undefined)      Memory.vaultEnergy_levels[i] =             0;             //do not modify manually
            if (Memory.vaultAlertLO_EN[i] == undefined)         Memory.vaultAlertLO_EN[i] =                false;         //do not modify manually
            if (Memory.vaultAlertHI_EN[i] == undefined)         Memory.vaultAlertHI_EN[i] =                false;         //do not modify manually
            
            if (Memory.evac_timer[i] == undefined)              Memory.evac_timer[i] =                     0;             //do not modify manually
            if (Memory.viable_prey[i] == undefined)             Memory.viable_prey[i] =                    false;         //do not modify manually
            if (Memory.bloodhunter_casualty[i] == undefined)    Memory.bloodhunter_casualty[i] =           false;         //do not modify manually
            if (Memory.lastSeenEnemy_name[i] == undefined)      Memory.lastSeenEnemy_name[i] =             'NULL';        //do not modify manually
            if (Memory.lastSeenEnemy_time[i] == undefined)      Memory.lastSeenEnemy_time[i] =             'NEVER';       //do not modify manually
            if (Memory.lastSeenCore_time[i] == undefined)       Memory.lastSeenCore_time[i] =              'NEVER';       //do not modify manually
            if (Memory.lastReserveLoss_time[i] == undefined)    Memory.lastReserveLoss_time[i] =           'NEVER';       //do not modify manually
            
            if (Memory.autoload_EN[i] == undefined)             Memory.autoload_EN[i] =                    false;
            if (Memory.autosell_EN[i] == undefined)             Memory.autosell_EN[i] =                    false;
            if (Memory.autovent_EN[i] == undefined)             Memory.autovent_EN[i] =                    false;

            if (Memory.roomSpeed[i] == undefined)               Memory.roomSpeed[i] =                      1;
        }
        

        //init (allocate + populate) global data...
        //unit name roster (sorted)
        if (Memory.unit_roster == undefined)                    Memory.unit_roster =                       [];            //do not modify manually

        //walls and ramparts
        if (Memory.wall_threshold == undefined)                 Memory.wall_threshold =                    50000;         //TODO: move to SET_SOFTDATA
        if (Memory.rampart_threshold == undefined)              Memory.rampart_threshold =                 100000;        //TODO: move to SET_SOFTDATA
        if (Memory.construction_mode == undefined)              Memory.construction_mode =                 false;         //TODO: make this per-room

        //economy monitoring
        if (Memory.creditGainToday == undefined)                Memory.creditGainToday =                   0;             //do not modify manually
        if (Memory.pixelGainToday == undefined)                 Memory.pixelGainToday =                    0;             //do not modify manually

        //performance monitoring
        if (Memory.recordTick == undefined)                     Memory.recordTick =                        false;         //do not modify manually
        if (Memory.dayStart_timestamp == undefined)             Memory.dayStart_timestamp =                Date.now();    //do not modify manually
        if (Memory.cpu_log == undefined)                        Memory.cpu_log =                           [];            //do not modify manually
        if (Memory.ticksLoggedToday == undefined)               Memory.ticksLoggedToday =                  0;             //do not modify manually

        //TBD
        if (Memory.hallucination_MAX == undefined)              Memory.hallucination_MAX =                 0;             //role is currently unfinished/unimplemented
        if (Memory.shieldbattery_MAX == undefined)              Memory.shieldbattery_MAX =                 0;             //role is currently unfinished/unimplemented
        if (Memory.zealot_MAX == undefined)                     Memory.zealot_MAX =                        0;             //role is currently unfinished/unimplemented
    }
};