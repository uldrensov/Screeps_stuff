//function: automatically initialises and populates all necessary contents of global read/write memory

module.exports = {
    run: function(roomcount){
        
        //allocate arrays for room-specific data...
        //unit population maxima
        if (Memory.sacrificer_MAX == undefined)                 Memory.sacrificer_MAX =                    [];
        if (Memory.architect_MAX == undefined)                  Memory.architect_MAX =                     [];
        if (Memory.phaseArchitect_MAX == undefined)             Memory.phaseArchitect_MAX =                [];
        if (Memory.probe_MAX == undefined)                      Memory.probe_MAX =                         [];
        if (Memory.assimilator_MAX == undefined)                Memory.assimilator_MAX =                   [];
            if (Memory.assimilator2_MAX == undefined)           Memory.assimilator2_MAX =                  [];
        if (Memory.drone_MAX == undefined)                      Memory.drone_MAX =                         [];
        if (Memory.energiser_MAX == undefined)                  Memory.energiser_MAX =                     [];
        if (Memory.retrieverDrone_MAX == undefined)             Memory.retrieverDrone_MAX =                [];
        if (Memory.recalibrator_MAX == undefined)               Memory.recalibrator_MAX =                  [];
        if (Memory.orbitalAssimilator_MAX == undefined)         Memory.orbitalAssimilator_MAX =            [];
        if (Memory.orbitalDrone_MAX == undefined)               Memory.orbitalDrone_MAX =                  [];
        if (Memory.bloodhunter_MAX == undefined)                Memory.bloodhunter_MAX =                   [];
        if (Memory.enforcer_MAX == undefined)                   Memory.enforcer_MAX =                      [];
        if (Memory.purifier_MAX == undefined)                   Memory.purifier_MAX =                      [];
        if (Memory.acolyte_MAX == undefined)                    Memory.acolyte_MAX =                       [];
            if (Memory.acolyte2_MAX == undefined)               Memory.acolyte2_MAX =                      [];
        if (Memory.adherent_MAX == undefined)                   Memory.adherent_MAX =                      [];
        if (Memory.nullAdherent_MAX == undefined)               Memory.nullAdherent_MAX =                  [];
        if (Memory.supplicant_MAX == undefined)                 Memory.supplicant_MAX =                    [];
        if (Memory.nullSupplicant_MAX == undefined)             Memory.nullSupplicant_MAX =                [];
        if (Memory.ancientDrone_MAX == undefined)               Memory.ancientDrone_MAX =                  [];
        if (Memory.ancientAssimilator_MAX == undefined)         Memory.ancientAssimilator_MAX =            [];
        if (Memory.visionary_MAX == undefined)                  Memory.visionary_MAX =                     [];
        if (Memory.specialist_MAX == undefined)                 Memory.specialist_MAX =                    [];
        if (Memory.saviour_MAX == undefined)                    Memory.saviour_MAX =                       [];
        if (Memory.emissary_MAX == undefined)                   Memory.emissary_MAX =                      [];
        if (Memory.darktemplar_MAX == undefined)                Memory.darktemplar_MAX =                   [];

        //towers
        if (Memory.turretsByRoom == undefined)                  Memory.turretsByRoom =                     [];            //do not modify manually
        if (Memory.turretCommand == undefined)                  Memory.turretCommand =                     [];            //do not modify manually
        if (Memory.turretTarget_id == undefined)                Memory.turretTarget_id =                   [];            //do not modify manually

        //vault
        if (Memory.vaultAlertLO_EN == undefined)                Memory.vaultAlertLO_EN =                   [];            //do not modify manually
        if (Memory.vaultAlertHI_EN == undefined)                Memory.vaultAlertHI_EN =                   [];            //do not modify manually

        //remote mining
        if (Memory.evac_timer == undefined)                     Memory.evac_timer =                        [];            //do not modify manually
        if (Memory.viable_prey == undefined)                    Memory.viable_prey =                       [];            //do not modify manually
        if (Memory.bloodhunter_casualty == undefined)           Memory.bloodhunter_casualty =              [];            //do not modify manually

        //misc
        if (Memory.mineral_type == undefined)                   Memory.mineral_type =                      [];            //do not modify manually
        if (Memory.roomSpeed == undefined)                      Memory.roomSpeed =                         [];            //TODO: move to SOFTDATA
        if (Memory.powernex_id == undefined)                    Memory.powernex_id =                       [];            //do not modify manually
        if (Memory.autovent_EN == undefined)                    Memory.autovent_EN =                       [];            //TODO: move to SOFTDATA
        

        //init (populate) room-specific data...
        for (let i=0; i<roomcount; i++){
            if (Memory.sacrificer_MAX[i] == undefined)          Memory.sacrificer_MAX[i] =                 0;
            if (Memory.architect_MAX[i] == undefined)           Memory.architect_MAX[i] =                  0;
            if (Memory.phaseArchitect_MAX[i] == undefined)      Memory.phaseArchitect_MAX[i] =             0;
            if (Memory.probe_MAX[i] == undefined)               Memory.probe_MAX[i] =                      0;
            if (Memory.assimilator_MAX[i] == undefined)         Memory.assimilator_MAX[i] =                0;
                if (Memory.assimilator2_MAX[i] == undefined)    Memory.assimilator2_MAX[i] =               0;
            if (Memory.drone_MAX[i] == undefined)               Memory.drone_MAX[i] =                      0;
            if (Memory.energiser_MAX[i] == undefined)           Memory.energiser_MAX[i] =                  0;
            if (Memory.retrieverDrone_MAX[i] == undefined)      Memory.retrieverDrone_MAX[i] =             0;
            if (Memory.recalibrator_MAX[i] == undefined)        Memory.recalibrator_MAX[i] =               0;
            if (Memory.orbitalAssimilator_MAX[i] == undefined)  Memory.orbitalAssimilator_MAX[i] =         0;
            if (Memory.orbitalDrone_MAX[i] == undefined)        Memory.orbitalDrone_MAX[i] =               0;
            if (Memory.bloodhunter_MAX[i] == undefined)         Memory.bloodhunter_MAX[i] =                0;
            if (Memory.enforcer_MAX[i] == undefined)            Memory.enforcer_MAX[i] =                   0;
            if (Memory.purifier_MAX[i] == undefined)            Memory.purifier_MAX[i] =                   0;
            if (Memory.acolyte_MAX[i] == undefined)             Memory.acolyte_MAX[i] =                    0;
                if (Memory.acolyte2_MAX[i] == undefined)        Memory.acolyte2_MAX[i] =                   0;
            if (Memory.adherent_MAX[i] == undefined)            Memory.adherent_MAX[i] =                   0;
            if (Memory.nullAdherent_MAX[i] == undefined)        Memory.nullAdherent_MAX[i] =               0;
            if (Memory.supplicant_MAX[i] == undefined)          Memory.supplicant_MAX[i] =                 0;
            if (Memory.nullSupplicant_MAX[i] == undefined)      Memory.nullSupplicant_MAX[i] =             0;
            if (Memory.ancientDrone_MAX[i] == undefined)        Memory.ancientDrone_MAX[i] =               0;
            if (Memory.ancientAssimilator_MAX[i] == undefined)  Memory.ancientAssimilator_MAX[i] =         0;
            if (Memory.visionary_MAX[i] == undefined)           Memory.visionary_MAX[i] =                  0;
            if (Memory.specialist_MAX[i] == undefined)          Memory.specialist_MAX[i] =                 0;
            if (Memory.saviour_MAX[i] == undefined)             Memory.saviour_MAX[i] =                    0;
            if (Memory.emissary_MAX[i] == undefined)            Memory.emissary_MAX[i] =                   0;
            if (Memory.darktemplar_MAX[i] == undefined)         Memory.darktemplar_MAX[i] =                0;
            
            if (Memory.turretCommand[i] == undefined)           Memory.turretCommand[i] =                  'IDLE';        //do not modify manually
            if (Memory.turretTarget_id[i] == undefined)         Memory.turretTarget_id[i] =                'NULL';        //do not modify manually
            
            if (Memory.vaultAlertLO_EN[i] == undefined)         Memory.vaultAlertLO_EN[i] =                false;         //do not modify manually
            if (Memory.vaultAlertHI_EN[i] == undefined)         Memory.vaultAlertHI_EN[i] =                false;         //do not modify manually
            
            if (Memory.evac_timer[i] == undefined)              Memory.evac_timer[i] =                     0;             //do not modify manually
            if (Memory.viable_prey[i] == undefined)             Memory.viable_prey[i] =                    false;         //do not modify manually
            if (Memory.bloodhunter_casualty[i] == undefined)   Memory.bloodhunter_casualty[i] =            false;         //do not modify manually
            
            if (Memory.roomSpeed[i] == undefined)               Memory.roomSpeed[i] =                      1;             //TODO: move to SOFTDATA
            if (Memory.autovent_EN[i] == undefined)             Memory.autovent_EN[i] =                    false;         //TODO: move to SOFTDATA
        }
        

        //init global data...
        if (Memory.hallucination_MAX == undefined)              Memory.hallucination_MAX =                 0;             //this unit role is currently unimplemented
        if (Memory.hightemplar_MAX == undefined)                Memory.hightemplar_MAX =                   0;             //this unit role is currently unimplemented
        if (Memory.zealot_MAX == undefined)                     Memory.zealot_MAX =                        0;             //this unit role is currently unimplemented
        if (Memory.wall_threshold == undefined)                 Memory.wall_threshold =                    50000;         //TODO: move to SOFTDATA
        if (Memory.rampart_threshold == undefined)              Memory.rampart_threshold =                 100000;        //TODO: move to SOFTDATA
        if (Memory.construction_mode == undefined)              Memory.construction_mode =                 false;         //TODO: move to SOFTDATA
    }
};