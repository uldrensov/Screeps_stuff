//initialises global variables in memory

module.exports = {
    run: function(){
        
        if (Memory.sacrificer_MAX == undefined){Memory.sacrificer_MAX =                 [1,0,0];}
        if (Memory.architect_MAX == undefined){Memory.architect_MAX =                   [1,0,0];}
        if (Memory.probe_MAX == undefined){Memory.probe_MAX =                           [1,0,0];}
        if (Memory.assimilator_MAX == undefined){Memory.assimilator_MAX =               [0,0,0];}
            if (Memory.assimilator2_MAX == undefined){Memory.assimilator2_MAX =         [0,0,0];}
        if (Memory.drone_MAX == undefined){Memory.drone_MAX =                           [2,0,0];}
        if (Memory.energiser_MAX == undefined){Memory.energiser_MAX =                   [0,0,0];}
        if (Memory.recalibrator_MAX == undefined){Memory.recalibrator_MAX =             [0,0,0];}
        if (Memory.orbitalAssimilator_MAX == undefined){Memory.orbitalAssimilator_MAX = [0,0,0];}
        if (Memory.orbitalDrone_MAX == undefined){Memory.orbitalDrone_MAX =             [0,0,0];}
        if (Memory.bloodhunter_MAX == undefined){Memory.bloodhunter_MAX =               [0,0,0];}
        if (Memory.enforcer_MAX == undefined){Memory.enforcer_MAX =                     [0,0,0];}
        if (Memory.purifier_MAX == undefined){Memory.purifier_MAX =                     [0,0,0];}
        if (Memory.acolyte_MAX == undefined){Memory.acolyte_MAX =                       [0,0,0];}
            if (Memory.acolyte2_MAX == undefined){Memory.acolyte2_MAX =                 [0,0,0];}
        if (Memory.adherent_MAX == undefined){Memory.adherent_MAX =                     [0,0,0];}
        if (Memory.supplicant_MAX == undefined){Memory.supplicant_MAX =                 [0,0,0];}
        if (Memory.ancientDrone_MAX == undefined){Memory.ancientDrone_MAX =             [0,0,0];}
        if (Memory.ancientAssimilator_MAX == undefined){Memory.ancientAssimilator_MAX = [0,0,0];}
        if (Memory.specialist_MAX == undefined){Memory.specialist_MAX =                 0;}
        if (Memory.saviour_MAX == undefined){Memory.saviour_MAX =                       0;}
        if (Memory.emissary_MAX == undefined){Memory.emissary_MAX =                     [0,0,0];}
        if (Memory.darktemplar_MAX == undefined){Memory.darktemplar_MAX =               [0,0,0];}
        if (Memory.hallucination_MAX == undefined){Memory.hallucination_MAX =           0;}
        if (Memory.hightemplar_MAX == undefined){Memory.hightemplar_MAX =               0;}
        if (Memory.zealot_MAX == undefined){Memory.zealot_MAX =                         0;}
        if (Memory.wall_threshold == undefined){Memory.wall_threshold =                 50000;}
        if (Memory.rampart_threshold == undefined){Memory.rampart_threshold =           100000;}
        if (Memory.construction_mode == undefined){Memory.construction_mode =           false;}
        if (Memory.vaultAlert_EN == undefined){Memory.vaultAlert_EN =                   [false,false,false];}
        if (Memory.evac_timer == undefined){Memory.evac_timer =                         [0,0,0];}
        if (Memory.core_sighting == undefined){Memory.core_sighting =                   [false,false,false];}
    }
};