//function: initialises global variables in memory

module.exports = {
    run: function(roomcount){
        
        //room-specifics...
        for (let i=0; i<roomcount; i++){
            if (Memory.sacrificer_MAX[i] == undefined){Memory.sacrificer_MAX[i] =                   0;}
            if (Memory.architect_MAX[i] == undefined){Memory.architect_MAX[i] =                     0;}
            if (Memory.phaseArchitect_MAX[i] == undefined){Memory.phaseArchitect_MAX[i] =           0;}
            if (Memory.probe_MAX[i] == undefined){Memory.probe_MAX[i] =                             0;}
            if (Memory.assimilator_MAX[i] == undefined){Memory.assimilator_MAX[i] =                 0;}
                if (Memory.assimilator2_MAX[i] == undefined){Memory.assimilator2_MAX[i] =           0;}
            if (Memory.drone_MAX[i] == undefined){Memory.drone_MAX[i] =                             0;}
            if (Memory.energiser_MAX[i] == undefined){Memory.energiser_MAX[i] =                     0;}
            if (Memory.recalibrator_MAX[i] == undefined){Memory.recalibrator_MAX[i] =               0;}
            if (Memory.orbitalAssimilator_MAX[i] == undefined){Memory.orbitalAssimilator_MAX[i] =   0;}
            if (Memory.orbitalDrone_MAX[i] == undefined){Memory.orbitalDrone_MAX[i] =               0;}
            if (Memory.bloodhunter_MAX[i] == undefined){Memory.bloodhunter_MAX[i] =                 0;}
            if (Memory.enforcer_MAX[i] == undefined){Memory.enforcer_MAX[i] =                       0;}
            if (Memory.purifier_MAX[i] == undefined){Memory.purifier_MAX[i] =                       0;}
            if (Memory.acolyte_MAX[i] == undefined){Memory.acolyte_MAX[i] =                         0;}
                if (Memory.acolyte2_MAX[i] == undefined){Memory.acolyte2_MAX[i] =                   0;}
            if (Memory.adherent_MAX[i] == undefined){Memory.adherent_MAX[i] =                       0;}
            if (Memory.nullAdherent_MAX[i] == undefined){Memory.nullAdherent_MAX[i] =               0;}
            if (Memory.supplicant_MAX[i] == undefined){Memory.supplicant_MAX[i] =                   0;}
            if (Memory.nullSupplicant_MAX[i] == undefined){Memory.nullSupplicant_MAX[i] =           0;}
            if (Memory.ancientDrone_MAX[i] == undefined){Memory.ancientDrone_MAX[i] =               0;}
            if (Memory.ancientAssimilator_MAX[i] == undefined){Memory.ancientAssimilator_MAX[i] =   0;}
            if (Memory.visionary_MAX[i] == undefined){Memory.visionary_MAX[i] =                     0;}
            if (Memory.specialist_MAX[i] == undefined){Memory.specialist_MAX[i] =                   0;}
            if (Memory.emissary_MAX[i] == undefined){Memory.emissary_MAX[i] =                       0;}
            if (Memory.darktemplar_MAX[i] == undefined){Memory.darktemplar_MAX[i] =                 0;}
            if (Memory.vaultAlert_EN[i] == undefined){Memory.vaultAlert_EN[i] =                     false;}
            if (Memory.evac_timer[i] == undefined){Memory.evac_timer[i] =                           0;}
            if (Memory.viable_prey[i] == undefined){Memory.viable_prey[i] =                         false;}
        }
        
        //globals...
        if (Memory.saviour_MAX == undefined){Memory.saviour_MAX =                                   0;}
        if (Memory.hallucination_MAX == undefined){Memory.hallucination_MAX =                       0;}
        if (Memory.hightemplar_MAX == undefined){Memory.hightemplar_MAX =                           0;}
        if (Memory.zealot_MAX == undefined){Memory.zealot_MAX =                                     0;}
        if (Memory.wall_threshold == undefined){Memory.wall_threshold =                             50000;}
        if (Memory.rampart_threshold == undefined){Memory.rampart_threshold =                       100000;}
        if (Memory.construction_mode == undefined){Memory.construction_mode =                       false;}
    }
};