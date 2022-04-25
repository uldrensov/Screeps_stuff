//function: controls all automatic unit spawns

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(){
        
        const reserveDuration_max =     5000;
        const claimUnit_TTL =           600; //units with a CLAIM body part have significantly reduced TTL than usual


        let ctrl = [];
        for (let i=0; i<SD.ctrl_id.length; i++){
            ctrl[i] = Game.getObjectById(SD.ctrl_id[i]);
        }
        
        
        //for storing population count in each room
        let emergencyDrone_gang;    let assimilator_gang;           let assimilator2_gang;      let drone_gang;             let energiser_gang;
        let retrieverDrone_gang;    let sacrificer_gang;            let acolyte_gang;           let acolyte2_gang;          let adherent_gang;
        let nullAdherent_gang;      let supplicant_gang;            let nullSupplicant_gang;    let probe_gang;             let orbitalAssimilator_gang;
        let recalibrator_gang;      let orbitalDrone_gang;          let bloodhunter_gang;       let enforcer_gang;          let purifier_gang; 
        let ancientDrone_gang;      let ancientAssimilator_gang;    let architect_gang;         let phaseArchitect_gang;    let visionary_gang;
        let specialist_gang;        let saviour_gang;               let emissary_gang;          let darktemplar_gang;       let hallucination_gang;
        let shieldbattery_gang;     let zealot_gang;
    
    
        //execute the auto-spawn and unit AI assignment routines for each room
        for (let k=0; k<SD.ctrl_id.length; k++){
            //bypass: if controller fails to retrieve, skip the room
            if (!ctrl[k])
                continue;
        
            //count unit population by role
            emergencyDrone_gang =        _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.memory.home_index == k);
            assimilator_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'           && creep.memory.home_index == k);
                assimilator2_gang =      _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'          && creep.memory.home_index == k);
            drone_gang =                 _.filter(Game.creeps, creep => creep.memory.role == 'drone'                 && creep.memory.home_index == k);
            energiser_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'energiser'             && creep.memory.home_index == k);
            retrieverDrone_gang =        _.filter(Game.creeps, creep => creep.memory.role == 'retrieverDrone'        && creep.memory.home_index == k);
            sacrificer_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.memory.home_index == k);
            acolyte_gang =               _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'               && creep.memory.home_index == k);
                acolyte2_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'              && creep.memory.home_index == k);
            adherent_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'adherent'              && creep.memory.home_index == k);
            nullAdherent_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'nullAdherent'          && creep.memory.home_index == k);
            supplicant_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.memory.home_index == k);
            nullSupplicant_gang =        _.filter(Game.creeps, creep => creep.memory.role == 'nullSupplicant'        && creep.memory.home_index == k);
            probe_gang =                 _.filter(Game.creeps, creep => creep.memory.role == 'probe'                 && creep.memory.home_index == k);
            orbitalAssimilator_gang =    _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator'    && creep.memory.home_index == k);
            recalibrator_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'recalibrator'          && creep.memory.home_index == k);
            orbitalDrone_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'orbitalDrone'          && creep.memory.home_index == k);
            bloodhunter_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'bloodhunter'           && creep.memory.home_index == k);
            enforcer_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'enforcer'              && creep.memory.home_index == k);
            purifier_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'purifier'              && creep.memory.home_index == k);
            ancientDrone_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.memory.home_index == k);
            ancientAssimilator_gang =    _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.memory.home_index == k);
            architect_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.memory.home_index == k);
            phaseArchitect_gang =        _.filter(Game.creeps, creep => creep.memory.role == 'phaseArchitect'        && creep.memory.home_index == k);
            visionary_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'visionary');
            specialist_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
            saviour_gang =               _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
            emissary_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'emissary');
            darktemplar_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'darktemplar');
            hallucination_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
            shieldbattery_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'shieldbattery');
            zealot_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'zealot');


            //determine if mineral mining is possible (for ancient drone / assimilator spawns)
            if (!Game.getObjectById(Memory.extractor_id[k])){

                const extractor = ctrl[k].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_EXTRACTOR;
                    }
                });

                Memory.extractor_id[k] = extractor[0].id;
            }

            if (!Memory.mineral_type[k])
                Memory.mineral_type[k] = ctrl[k].room.find(FIND_MINERALS)[0];

            if (Memory.extractor_id[k]
                &&
                Game.getObjectById(Memory.mineral_type[k].id).mineralAmount > 0){

                Memory.ancientDrone_MAX[k] =            1;
                Memory.ancientAssimilator_MAX[k] =      1;
            }
            else if (Memory.extractor_id[k]){
                Memory.ancientDrone_MAX[k] =            -1;
                Memory.ancientAssimilator_MAX[k] =      -1;
            }
            


            //for edrone spawn logic, calculate the room's drone/assimilator/acolyte prices
            let drone_price = 0;
            for (let i=0; i<SD.drone_body[k].length; i++){
                if (SD.drone_body[k][i] == CARRY || SD.drone_body[k][i] == MOVE)
                    drone_price += 50;
            }

            let assim_price = 0;
            for (let i=0; i<SD.assim_body[k].length; i++){
                if (SD.assim_body[k][i] == WORK)
                    assim_price += 100;
                else if (SD.drone_body[k][i] == MOVE)
                    assim_price += 50;
            }

            let acoly_price = 0;
            for (let i=0; i<SD.acoly_body[k].length; i++){
                if (SD.acoly_body[k][i] == WORK)
                    assim_price += 100;
                else if (SD.acoly_body[k][i] == CARRY || SD.drone_body[k][i] == MOVE)
                    acoly_price += 50;
            }
            
            

            //for edrone spawn logic, count up total room energy within spawn structures, canisters, and the vault
            //fullest nexus energy...
            const local_nexi = ctrl[k].room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
            });

            let fullestNexus = local_nexi[0];
            for (let i=1; i<local_nexi.length; i++){
                if (Game.getObjectById(local_nexi[i].id).store.energy > fullestNexus.store.energy)
                    fullestNexus = Game.getObjectById(local_nexi[i].id);
            }


            //extension energy...
            const local_exts = ctrl[k].room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_EXTENSION;
                }
            });

            let extension_energy = 0;
            for (let i=0; i<local_exts.length; i++){
                extension_energy += Game.getObjectById(local_exts[i].id).store.energy;
            }


            //canister energy...
            const local_canisters = ctrl[k].room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });

            let canister_energy = 0;
            for (let i=0; i<local_canisters.length; i++){
                canister_energy += Game.getObjectById(local_canisters[i].id).store.energy;
            }


            //vault energy...
            let vault_energy = 0;
            if (ctrl[k].room.storage)
                vault_energy = ctrl[k].room.storage.store.energy;


            //totaled up...
            const droneAccessible_energy = fullestNexus.store.energy + extension_energy + canister_energy + vault_energy;
            


            //for recalibrator spawn condition, calculate that room's recalibrator's CLAIM "strength"
            let claim_strength = 0;
            for (let i=0; i<SD.recal_body[k].length; i++){
                if (SD.recal_body[k][i] == CLAIM)
                    claim_strength++;
            }
            

            //for retriever drone spawn, determine how much energy is dropped on the ground
            const scraps = ctrl[k].room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => {
                    return resource.resourceType == RESOURCE_ENERGY
                        &&
                        resource.amount > SD.en_ignore_lim;
                }
            });

            let total_dropped_energy = 0;
            for (let i=0; i<scraps.length; i++){
                total_dropped_energy += Game.getObjectById(scraps[i].id).amount;
            }

            if (total_dropped_energy > SD.cleanup_thresh)
                Memory.retrieverDrone_MAX[k] = 1;
            else if (total_dropped_energy < SD.cleanup_thresh/4)
                Memory.retrieverDrone_MAX[k] = -1;
            
            
            //determine a viable spawner
            let openNexus;

            for (let i=0; i<SD.spawner_id[k].length; i++){
                if (!Game.getObjectById(SD.spawner_id[k][i]))
                    continue;
                if (!Game.getObjectById(SD.spawner_id[k][i]).spawning){
                    openNexus = Game.getObjectById(SD.spawner_id[k][i]);
                    break;
                }
            }

            if (!openNexus)
                return; //if no available spawners, exit script

            let spawnResult;
            
            

            //spawning high-priority units...
            //emergency drone (condition 1 -- drone extinction): if this somehow happens, it is impossible to refuel extensions and spawners
            if ((emergencyDrone_gang.length == 0
                &&
                drone_gang.length == 0)
                &&
                openNexus.room.energyAvailable < drone_price){

                spawnResult = openNexus.spawnCreep(SD.edrone_body, 'EmergencyDrone[' + k + ']-' + Game.time % SD.time_offset,
                    {memory: {role: 'emergencyDrone', home_index: k}});
                    
                if (spawnResult == OK){
                    console.log('DRIVE_SPAWN:: >>>>>> EmergencyDrone[' + k + ']-' + Game.time % SD.time_offset + ' spawning. (DRONE EXTINCTION) <<<<<<');
                    Game.notify('DRIVE_SPAWN:: >>>>>> Emergency drone deployed in room #' + k + ' (DRONE EXTINCTION) <<<<<<');
                }
                else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                    console.log('DRIVE_SPAWN:: >>>>>> SPAWN FAILURE IN ' + openNexus.name + ' (E-DRONE): CODE ' + '[' + spawnResult + '] <<<<<<');
            }
            //emergency drone (condition 2 -- total starvation): if drones are alive, but somehow there is an extinction, this can only mean the room is starved
            //and if harvesters are among the extinct, then the room is /totally/ starved
            else if (emergencyDrone_gang.length == 0
                &&
                (assimilator_gang.length == 0 && assimilator2_gang.length == 0 && acolyte_gang.length == 0 && acolyte2_gang.length == 0)
                &&
                (droneAccessible_energy < assim_price[k]
                    ||
                droneAccessible_energy < acoly_price[k])){

                spawnResult = openNexus.spawnCreep(SD.edrone_body, 'EmergencyDrone[' + k + ']-' + Game.time % SD.time_offset,
                    {memory: {role: 'emergencyDrone', home_index: k}});
                    
                if (spawnResult == OK){
                    console.log('DRIVE_SPAWN:: >>>>>> EmergencyDrone[' + k + ']-' + Game.time % SD.time_offset + ' spawning. (TOTAL STARVATION) <<<<<<');
                    Game.notify('DRIVE_SPAWN:: >>>>>> Emergency drone deployed in room #' + k + ' (TOTAL STARVATION) <<<<<<');
                }
                else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                    console.log('DRIVE_SPAWN:: >>>>>> SPAWN FAILURE IN ' + openNexus.name + ' (E-DRONE): CODE ' + '[' + spawnResult + '] <<<<<<');
            }

            //assimilator: shortcut-spawn these to accompany the emergency drone, if one is active
            else if (emergencyDrone_gang.length != 0
                &&
                assimilator_gang.length < Memory.assimilator_MAX[k]){

                spawnResult = openNexus.spawnCreep(SD.assim_body[k], 'Assimilator[' + k + ']-' + Game.time % SD.time_offset,
                    {memory: {role: 'assimilator', home_index: k}});

                if (spawnResult == OK)
                    console.log('DRIVE_SPAWN:: Assimilator[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                    console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ASSIMILATOR): CODE ' + '[' + spawnResult + ']');
            }
        


            else{
                switch (true){
                    //spawning core units...

                    //without drones, extensions are starved, and virtually nothing else can spawn
                    case (drone_gang.length < Memory.drone_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.drone_body[k], 'Drone[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'drone', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Drone[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (DRONE): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without assimilators, there is no energy income
                    case (assimilator_gang.length < Memory.assimilator_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.assim_body[k], 'Assimilator[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'assimilator', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Assimilator[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ASSIMILATOR): CODE ' + '[' + spawnResult + ']');
                        break;
                    case (assimilator2_gang.length < Memory.assimilator2_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.assim_body[k], 'Assimilator_II[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'assimilator2', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Assimilator_II[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ASSIMILATOR 2): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without energisers, the room's defences are crippled
                    case (energiser_gang.length < Memory.energiser_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.energ_body[k], 'Energiser[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'energiser', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Energiser[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ENERGISER): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without retriever drones, dropped energy is wasted
                    case ((retrieverDrone_gang.length < Memory.retrieverDrone_MAX[k]) && openNexus.room.storage):
                        spawnResult = openNexus.spawnCreep(SD.drone_body[k], 'RetrieverDrone[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'retrieverDrone', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: RetrieverDrone[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (RETRIEVER DRONE): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without sacrificers, the room will level down
                    case (sacrificer_gang.length < Memory.sacrificer_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.sacrif_body[k], 'Sacrificer[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'sacrificer', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Sacrificer[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (SACRIFICER): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without acolytes, links cannot transmit
                    case (acolyte_gang.length < Memory.acolyte_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.acoly_body[k], 'Acolyte[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'acolyte', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Acolyte[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ACOLYTE): CODE ' + '[' + spawnResult + ']');
                        break;
                    case (acolyte2_gang.length < Memory.acolyte2_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.acoly_body[k], 'Acolyte_II[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'acolyte2', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Acolyte_II[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ACOLYTE 2): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without adherents, links cannot be unloaded
                    case (adherent_gang.length < Memory.adherent_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.adher_body, 'Adherent[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'adherent', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Adherent[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ADHERENT): CODE ' + '[' + spawnResult + ']');
                        break;
                    case (nullAdherent_gang.length < Memory.nullAdherent_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.adher_body, 'NullAdherent[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'nullAdherent', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: NullAdherent[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (NULL ADHERENT): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without supplicants, the room will level down (replaces sacrificers)
                    case (supplicant_gang.length < Memory.supplicant_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.suppl_body[k], 'Supplicant[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'supplicant', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Supplicant[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (SUPPLICANT): CODE ' + '[' + spawnResult + ']');
                        break;
                    case (nullSupplicant_gang.length < Memory.nullSupplicant_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.suppl_body[k], 'NullSupplicant[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'nullSupplicant', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: NullSupplicant[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (NULL SUPPLICANT): CODE ' + '[' + spawnResult + ']');
                        break;

                    //without probes, structures are not maintained
                    case (probe_gang.length < Memory.probe_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.probe_body[k], 'Probe[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'probe', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Probe[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (PROBE): CODE ' + '[' + spawnResult + ']');
                        break;
        


                    //spawning situational units...

                    //orbital assimilators: if remote mining is viable
                    case (orbitalAssimilator_gang.length < Memory.orbitalAssimilator_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.oassim_body, 'OrbitalAssimilator[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'orbitalAssimilator', rallied: false, home_index: k}});
                            
                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: OrbitalAssimilator[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ORBITAL ASSIMILATOR): CODE ' + '[' + spawnResult + ']');
                        break;
            
                    //recalibrators: if remote mining is viable
                    case (recalibrator_gang.length < Memory.recalibrator_MAX[k]):
                        //spawn criteria for recalibrator role requires visiblity of the remote mining room controller
                        //therefore, stall spawns for this role (and all other roles below) until the remote controller is visible (e.g. when an orbitalAssimilator occupies the remote room)
                        if (!Game.getObjectById(SD.remotectrl_id[k]))
                            break;
                        
                        //if reservation is neutral
                        else if (!Game.getObjectById(SD.remotectrl_id[k]).reservation){
                            spawnResult = openNexus.spawnCreep(SD.recal_body[k], 'Recalibrator[' + k + ']-' + Game.time % SD.time_offset,
                                {memory: {role: 'recalibrator', rallied: false, home_index: k}})

                            if (spawnResult == OK)
                                console.log('DRIVE_SPAWN:: Recalibrator[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                            else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                                console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (RECALIBRATOR): CODE ' + '[' + spawnResult + ']');
                        }

                        //if reservation is mine, and falls sufficiently low
                        else if (Game.getObjectById(SD.remotectrl_id[k]).reservation.username == ctrl[k].owner.username
                            &&
                            Game.getObjectById(SD.remotectrl_id[k]).reservation.ticksToEnd < (reserveDuration_max - (claim_strength-1)*claimUnit_TTL)){

                            spawnResult = openNexus.spawnCreep(SD.recal_body[k], 'Recalibrator[' + k + ']-' + Game.time % SD.time_offset,
                                {memory: {role: 'recalibrator', rallied: false, home_index: k}})

                            if (spawnResult == OK)
                                console.log('DRIVE_SPAWN:: Recalibrator[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                            else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                                console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (RECALIBRATOR): CODE ' + '[' + spawnResult + ']');
                        }

                        break;

                    //orbital drones: if remote mining is viable
                    case (orbitalDrone_gang.length < Memory.orbitalDrone_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.odrone_body[k], 'OrbitalDrone[' + k + ']-' + Game.time % SD.time_offset,
                                        {memory: {role: 'orbitalDrone', rallied: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: OrbitalDrone[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ORBITAL DRONE): CODE ' + '[' + spawnResult + ']');
                        break;

                    //blood hunters: if remote mining is being disrupted by invaders
                    case (bloodhunter_gang.length < Memory.bloodhunter_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.bloodh_body, 'Bloodhunter[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'bloodhunter', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Bloodhunter[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (BLOOD HUNTER): CODE ' + '[' + spawnResult + ']');
                        break;

                    //enforcers: if remote mining is being disrupted by invader cores
                    case (enforcer_gang.length < Memory.enforcer_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.enforc_body[k], 'Enforcer[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'enforcer', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Enforcer[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ENFORCER): CODE ' + '[' + spawnResult + ']');
                        break;

                    //purifiers: if an invader core's efforts must be undone
                    case (purifier_gang.length < Memory.purifier_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.purif_body[k], 'Purifier[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'purifier', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Purifier[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (PURIFIER): CODE ' + '[' + spawnResult + ']');
                        break;

                    //ancient drones: if minerals are available to mine
                    case (ancientDrone_gang.length < Memory.ancientDrone_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.androne_body, 'AncientDrone[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'ancientDrone', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: AncientDrone[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ANCIENT DRONE): CODE ' + '[' + spawnResult + ']');
                        break;

                    //ancient assimilators: if minerals are available to mine
                    case (ancientAssimilator_gang.length < Memory.ancientAssimilator_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.anassim_body, 'AncientAssimilator[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'ancientAssimilator', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: AncientAssimilator[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ANCIENT ASSIMILATOR): CODE ' + '[' + spawnResult + ']');
                        break;

                    //architects: if there are construction projects to finish
                    case (architect_gang.length < Memory.architect_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.archit_body[k], 'Architect[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'architect', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Architect[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ARCHITECT): CODE ' + '[' + spawnResult + ']');
                        break;
                    case (phaseArchitect_gang.length < Memory.phaseArchitect_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.phasarc_body[k], 'PhaseArchitect[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'phaseArchitect', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: PhaseArchitect[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (PHASE ARCHITECT): CODE ' + '[' + spawnResult + ']');
                        break;
            


                    //spawning fast-track (annexing new room) units...

                    //visionary: used in claiming up new rooms
                    case (visionary_gang.length < Memory.visionary_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.visio_body, 'Visionary[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'visionary', rallied: false, rallied2: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Visionary[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (VISIONARY): CODE ' + '[' + spawnResult + ']');
                        break;

                    //specialist: used in setting up new rooms (assists architects)
                    case (specialist_gang.length < Memory.specialist_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.speci_body[k], 'Specialist[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'specialist', rallied: false, rallied2: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Specialist[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (SPECIALIST): CODE ' + '[' + spawnResult + ']');
                        break;

                    //saviour: used in setting up new rooms (assists sacrificers)
                    case (saviour_gang.length < Memory.saviour_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.speci_body[k], 'Saviour[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'saviour', rallied: false, rallied2: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Saviour[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (SAVIOUR): CODE ' + '[' + spawnResult + ']');
                            break;
            


                    //spawning military units...

                    /*
                    //emissary: used situationally for scouting
                    case (emissary_gang.length < Memory.emissary_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.emiss_body, 'Emissary[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'emissary', rallied: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Emissary[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (EMISSARY): CODE ' + '[' + spawnResult + ']');
                        break;

                    //dark templar: used during battle
                    case (darktemplar_gang.length < Memory.darktemplar_MAX[k]):
                        spawnResult = openNexus.spawnCreep(SD.dt_body[k], 'Darktemplar[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'darktemplar', rallied: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Darktemplar[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (DARK TEMPLAR): CODE ' + '[' + spawnResult + ']');
                        break;

                    //hallucination: used during battle
                    case (hallucination_gang.length < Memory.hallucination_MAX):
                        spawnResult = openNexus.spawnCreep(SD.halluc_body, 'Hallucination[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'hallucination', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Hallucination[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (HALLUCINATION): CODE ' + '[' + spawnResult + ']');
                        break;

                    //shield battery: used during battle
                    case (shieldbattery_gang.length < Memory.shieldbattery_MAX):
                        spawnResult = openNexus.spawnCreep(SD.ht_body, 'Shieldbattery[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'shieldbattery', home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Shieldbattery[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (SHIELD BATTERY): CODE ' + '[' + spawnResult + ']');
                        break;

                    //zealot: used during battle
                    case (zealot_gang.length < Memory.zealot_MAX):
                        spawnResult = openNexus.spawnCreep(SD.zealot_body, 'Zealot[' + k + ']-' + Game.time % SD.time_offset,
                            {memory: {role: 'zealot', rallied: false, home_index: k}});

                        if (spawnResult == OK)
                            console.log('DRIVE_SPAWN:: Zealot[' + k + ']-' + Game.time % SD.time_offset + ' spawning.');
                        else if (spawnResult != ERR_BUSY && spawnResult != ERR_NOT_ENOUGH_ENERGY)
                            console.log('DRIVE_SPAWN:: SPAWN FAILURE IN ' + openNexus.name + ' (ZEALOT): CODE ' + '[' + spawnResult + ']');
                        break;
                    */
                }
            }
        }
    }
};