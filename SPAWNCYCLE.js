//function: controls all automatic unit spawns

var SD = require('SOFTDATA');


module.exports = {
    run: function(){
        
        var nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        var gateways = [];
        for (let i=0; i<SD.gateway_id.length; i++){
            gateways[i] = Game.getObjectById(SD.gateway_id[i]);
        }
    
    
        //for storing population count in each room
        var emergencyDrone_gang = [];   var sacrificer_gang = [];   var architect_gang = [];        var phaseArchitect_gang = [];   var probe_gang = [];                var assimilator_gang = [];
        var assimilator2_gang = [];     var drone_gang = [];        var energiser_gang = [];        var recalibrator_gang = [];     var orbitalAssimilator_gang = [];   var orbitalDrone_gang = [];
        var bloodhunter_gang = [];      var enforcer_gang = [];     var purifier_gang = [];         var acolyte_gang = [];          var acolyte2_gang = [];             var adherent_gang = [];
        var nullAdherent_gang = [];     var supplicant_gang = [];   var nullSupplicant_gang = [];   var ancientDrone_gang = [];     var ancientAssimilator_gang = [];   var visionary_gang = [];
        var specialist_gang = [];       var saviour_gang;           var emissary_gang = [];         var darktemplar_gang = [];      var hallucination_gang;             var hightemplar_gang;
        var zealot_gang;
    
    
        //execute the auto-spawn and unit AI assignment routines for each room
        for (let k=0; k<SD.roomcount; k++){
        
            //count unit population by role
            emergencyDrone_gang[k] =        _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.room == nexi[k].room);
            sacrificer_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.room == nexi[k].room);
            architect_gang[k] =             _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.room == nexi[k].room);
            phaseArchitect_gang[k] =        _.filter(Game.creeps, creep => creep.memory.role == 'phaseArchitect'        && creep.room == nexi[k].room);
            probe_gang[k] =                 _.filter(Game.creeps, creep => creep.memory.role == 'probe'                 && creep.room == nexi[k].room);
            assimilator_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'           && creep.room == nexi[k].room);
                assimilator2_gang[k] =      _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'          && creep.room == nexi[k].room);
            drone_gang[k] =                 _.filter(Game.creeps, creep => creep.memory.role == 'drone'                 && creep.room == nexi[k].room);
            energiser_gang[k] =             _.filter(Game.creeps, creep => creep.memory.role == 'energiser'             && creep.room == nexi[k].room);
            recalibrator_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'recalibrator'          && creep.memory.home == nexi[k].room.name);
            orbitalAssimilator_gang[k] =    _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator'    && creep.memory.home == nexi[k].room.name);
            orbitalDrone_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'orbitalDrone'          && creep.memory.home == nexi[k].room.name);
            bloodhunter_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'bloodhunter'           && creep.memory.home == nexi[k].room.name);
            enforcer_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'enforcer'              && creep.memory.home == nexi[k].room.name);
            purifier_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'purifier'              && creep.memory.home == nexi[k].room.name);
            acolyte_gang[k] =               _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'               && creep.room == nexi[k].room);
                acolyte2_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'              && creep.room == nexi[k].room);
            adherent_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'adherent'              && creep.room == nexi[k].room);
            nullAdherent_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'nullAdherent'          && creep.room == nexi[k].room);
            supplicant_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.room == nexi[k].room);
            nullSupplicant_gang[k] =        _.filter(Game.creeps, creep => creep.memory.role == 'nullSupplicant'        && creep.room == nexi[k].room);
            ancientDrone_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.room == nexi[k].room);
            ancientAssimilator_gang[k] =    _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.room == nexi[k].room);
            visionary_gang[k] =             _.filter(Game.creeps, creep => creep.memory.role == 'visionary');
            specialist_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
            saviour_gang =                  _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
            emissary_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'emissary');
            darktemplar_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'darktemplar');
            hallucination_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
            hightemplar_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'hightemplar');
            zealot_gang =                   _.filter(Game.creeps, creep => creep.memory.role == 'zealot');
        
        
            //determine if mineral mining is possible
            if (Memory.SPAWNCYCLE__extractor[k] == undefined || Game.time % 10 == 0){
                Memory.SPAWNCYCLE__extractor[k] = nexi[k].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_EXTRACTOR;
                    }
                });
            }
            if (Memory.SPAWNCYCLE__minerals[k] == undefined || Game.time % 10 == 0)
                Memory.SPAWNCYCLE__minerals[k] = nexi[k].room.find(FIND_MINERALS)[0];
            if (Memory.SPAWNCYCLE__extractor[k].length && Memory.SPAWNCYCLE__minerals[k].mineralAmount > 0){
                Memory.ancientDrone_MAX[k] = 1;
                Memory.ancientAssimilator_MAX[k] = 1;
            }
            else if (Memory.SPAWNCYCLE__extractor[k].length){
                Memory.ancientDrone_MAX[k] = -1;
                Memory.ancientAssimilator_MAX[k] = -1;
            }
            
            //for edrone spawn condition, calculate the room's drone/assimilator/acolyte prices
            var drone_price = 1;
            for (let i=0; i<SD.drone_body[k].length; i++){
                if (SD.drone_body[k][i] == CARRY || SD.drone_body[k][i] == MOVE)
                    drone_price += 50;
            }
            var assim_price = 0;
            for (let i=0; i<SD.assim_body[k].length; i++){
                if (SD.assim_body[k][i] == WORK)
                    assim_price += 100;
                else if (SD.drone_body[k][i] == MOVE)
                    assim_price += 50;
            }
            var acoly_price = 0;
            for (let i=0; i<SD.acoly_body[k].length; i++){
                if (SD.acoly_body[k][i] == WORK)
                    assim_price += 100;
                else if (SD.acoly_body[k][i] == CARRY || SD.drone_body[k][i] == MOVE)
                    acoly_price += 50;
            }
            
            //also for edrone spawn condition, count up total room energy within spawn structures, canisters, and the vault
            if (Memory.SPAWNCYCLE__local_canisters[k] == undefined || Game.time % 10 == 0){
                Memory.SPAWNCYCLE__local_canisters[k] = nexi[k].room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_CONTAINER;
                    }
                });
            }
            var canister_energy = 0;
            for (let i=0; i<Memory.SPAWNCYCLE__local_canisters[k].length; i++){
                canister_energy += Memory.SPAWNCYCLE__local_canisters[k][i].store.energy;
            }
            var vault_energy = 0;
            if (nexi[k].room.storage != undefined)
                vault_energy = nexi[k].room.storage.store.energy;
            var accessible_energy = nexi[k].room.energyAvailable + canister_energy + vault_energy;
            
            
        //spawning emergency units...
            //emergency drone: if drones go extinct, or if both assimilators and acolytes go extinct without leaving behind enough canister/vault energy for either
            if (((drone_gang[k].length == 0 && nexi[k].room.energyAvailable < drone_price) ||
            ((assimilator_gang[k].length == 0 && assimilator2_gang[k].length == 0 && acolyte_gang[k].length == 0 && acolyte2_gang[k].length == 0) &&
            (accessible_energy < assim_price[k] || accessible_energy < acoly_price[k])))
            && emergencyDrone_gang[k].length == 0){
                if (nexi[k].spawnCreep(SD.edrone_body, 'EmergencyDrone-' + Game.time % SD.time_offset, {memory: {role: 'emergencyDrone'}}) == OK){
                    console.log('Room #' + k + ': >>>EmergencyDrone-' + Game.time % SD.time_offset + ' spawning.<<<');
                    //Game.notify('Emergency drone deployed in room #' + k,0);
                }
            }
            //assimilator: shortbut-spawn these to accompany the emergency drone, if one is active
            else if (assimilator_gang[k].length < Memory.assimilator_MAX[k] && emergencyDrone_gang[k].length != 0){
                if (nexi[k].spawnCreep(SD.assim_body[k], 'Assimilator-' + Game.time % SD.time_offset, {memory: {role: 'assimilator'}}) == OK)
                    console.log('Room #' + k + ': Assimilator-' + Game.time % SD.time_offset + ' spawning.');
            }
        
        //spawning core units...
            //without drones, nothing else may spawn
            else if (drone_gang[k].length < Memory.drone_MAX[k]){
                if (nexi[k].spawnCreep(SD.drone_body[k], 'Drone-' + Game.time % SD.time_offset, {memory: {role: 'drone'}}) == OK)
                    console.log('Room #' + k + ': Drone-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without assimilators, there is no energy income
            else if (assimilator_gang[k].length < Memory.assimilator_MAX[k]){
                if (nexi[k].spawnCreep(SD.assim_body[k], 'Assimilator-' + Game.time % SD.time_offset, {memory: {role: 'assimilator'}}) == OK)
                    console.log('Room #' + k + ': Assimilator-' + Game.time % SD.time_offset + ' spawning.');
            }
            else if (assimilator2_gang[k].length < Memory.assimilator2_MAX[k]){
                if (nexi[k].spawnCreep(SD.assim_body[k], 'Assimilator_II-' + Game.time % SD.time_offset, {memory: {role: 'assimilator2'}}) == OK)
                    console.log('Room #' + k + ': Assimilator_II-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without energisers, the room is defenceless
            else if (energiser_gang[k].length < Memory.energiser_MAX[k]){
                if (nexi[k].spawnCreep(SD.energ_body[k], 'Energiser-' + Game.time % SD.time_offset, {memory: {role: 'energiser'}}) == OK)
                    console.log('Room #' + k + ': Energiser-' + Game.time % SD.time_offset + ' spawning.');
                else if (gateways[k] != undefined){
                    if (gateways[k].spawnCreep(SD.energ_body[k], 'Energiser-' + Game.time % SD.time_offset, {memory: {role: 'energiser'}}) == OK)
                        console.log('Room #' + k + ': Energiser-' + Game.time % SD.time_offset + ' spawning.');
                }
            }
            //without sacrificers, the room will level down
            else if (sacrificer_gang[k].length < Memory.sacrificer_MAX[k]){
                if (nexi[k].spawnCreep(SD.sacrif_body[k], 'Sacrificer-' + Game.time % SD.time_offset, {memory: {role: 'sacrificer'}}) == OK)
                    console.log('Room #' + k + ': Sacrificer-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without acolytes, links cannot transmit
            else if (acolyte_gang[k].length < Memory.acolyte_MAX[k]){
                if (nexi[k].spawnCreep(SD.acoly_body[k], 'Acolyte-' + Game.time % SD.time_offset, {memory: {role: 'acolyte'}}) == OK)
                    console.log('Room #' + k + ': Acolyte-' + Game.time % SD.time_offset + ' spawning.');
            }
            else if (acolyte2_gang[k].length < Memory.acolyte2_MAX[k]){
                if (nexi[k].spawnCreep(SD.acoly_body[k], 'Acolyte_II-' + Game.time % SD.time_offset, {memory: {role: 'acolyte2'}}) == OK)
                    console.log('Room #' + k + ': Acolyte_II-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without adherents, links cannot be unloaded
            else if (adherent_gang[k].length < Memory.adherent_MAX[k]){
                if (nexi[k].spawnCreep(SD.adher_body, 'Adherent-' + Game.time % SD.time_offset, {memory: {role: 'adherent'}}) == OK)
                    console.log('Room #' + k + ': Adherent-' + Game.time % SD.time_offset + ' spawning.');
            }
            else if (nullAdherent_gang[k].length < Memory.nullAdherent_MAX[k]){
                if (nexi[k].spawnCreep(SD.adher_body, 'NullAdherent-' + Game.time % SD.time_offset, {memory: {role: 'nullAdherent'}}) == OK)
                    console.log('Room #' + k + ': NullAdherent-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without supplicants, the room will level down (replaces sacrificers)
            else if (supplicant_gang[k].length < Memory.supplicant_MAX[k]){
                if (nexi[k].spawnCreep(SD.suppl_body[k], 'Supplicant-' + Game.time % SD.time_offset, {memory: {role: 'supplicant'}}) == OK)
                    console.log('Room #' + k + ': Supplicant-' + Game.time % SD.time_offset + ' spawning.');
            }
            else if (nullSupplicant_gang[k].length < Memory.nullSupplicant_MAX[k]){
                if (nexi[k].spawnCreep(SD.suppl_body[k], 'NullSupplicant-' + Game.time % SD.time_offset, {memory: {role: 'nullSupplicant'}}) == OK)
                    console.log('Room #' + k + ': NullSupplicant-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without probes, structures are not maintained
            else if (probe_gang[k].length < Memory.probe_MAX[k]){
                if (nexi[k].spawnCreep(SD.probe_body[k], 'Probe-' + Game.time % SD.time_offset, {memory: {role: 'probe'}}) == OK)
                    console.log('Room #' + k + ': Probe-' + Game.time % SD.time_offset + ' spawning.');
            }
        
        //spawning situational units...
            //orbital assimilators: if remote mining is viable
            else if (orbitalAssimilator_gang[k].length < Memory.orbitalAssimilator_MAX[k]){
                if (nexi[k].spawnCreep(SD.oassim_body[k], 'OrbitalAssimilator-' + Game.time % SD.time_offset, {memory: {role: 'orbitalAssimilator', home: nexi[k].room.name, in_place: false}}) == OK)
                    console.log('Room #' + k + ': OrbitalAssimilator-' + Game.time % SD.time_offset + ' spawning.');
            }
            
            //NOTE: beyond this point, recalibrators are first in line and must initially validate the existence of their remote controllers
            //this may happen immediately if there are units in the remote room already, but at worst, the check must wait for a unit to enter the empty room (spawning an oassim beforehand ensures this)
            //this wait must complete before any further-down checks in the remainder of the spawn algorithm may ensue
            //alternatively, the wait is bypassed if the current recalibrator headcount is sufficient in the first place
            else if (Game.getObjectById(SD.remotectrl_id[k]) != undefined || recalibrator_gang[k].length >= Memory.recalibrator_MAX[k]){
                
                var take_branch = false; //if the following try-catch 'branch' is not taken for whatever reason, assert this flag
                
                //recalibrators: if remote mining is viable
                //NOTE: this try-catch exists since the outside check can still pass / be stepped into without checking if the remote controller is defined
                //if the spawn succeeds, only this branch is taken; if it fails (either due to error or legally failing a check), the next branch is switched into like an 'else if'
                try{
                    //NOTE: 2 separate cases are checked; both cannot be checked together (cannot get .ticksToEnd if .reservation is undefined), but only one can succeed regardless
                    if (recalibrator_gang[k].length < Memory.recalibrator_MAX[k] && (Game.getObjectById(SD.remotectrl_id[k]).reservation == undefined)){
                        //only attempt to spawn when the recalibrator's lifetime contribution to timer surplus will not overflow past the 5000 cap
                        if (nexi[k].spawnCreep(SD.recal_body[k], 'Recalibrator-' + Game.time % SD.time_offset, {memory: {role: 'recalibrator', home: nexi[k].room.name, in_place: false}}) == OK)
                            console.log('Room #' + k + ': Recalibrator-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    else if (recalibrator_gang[k].length < Memory.recalibrator_MAX[k] && (Game.getObjectById(SD.remotectrl_id[k]).reservation.ticksToEnd < 5000 - (SD.claim_strength[k]-1)*600)){
                        //only attempt to spawn when the recalibrator's lifetime contribution to timer surplus will not overflow past the 5000 cap
                        if (nexi[k].spawnCreep(SD.recal_body[k], 'Recalibrator-' + Game.time % SD.time_offset, {memory: {role: 'recalibrator', home: nexi[k].room.name, in_place: false}}) == OK)
                        console.log('Room #' + k + ': Recalibrator-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    else take_branch = true;
                }
                catch{
                    take_branch = true;
                }
                
                if (take_branch){
                    //orbital drones: if remote mining is viable
                    if (orbitalDrone_gang[k].length < Memory.orbitalDrone_MAX[k]){
                        if (nexi[k].spawnCreep(SD.odrone_body[k], 'OrbitalDrone-' + Game.time % SD.time_offset, {memory: {role: 'orbitalDrone', home: nexi[k].room.name, in_place: false}}) == OK)
                            console.log('Room #' + k + ': OrbitalDrone-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //blood hunters: if remote mining is being disrupted by invaders
                    else if (bloodhunter_gang[k].length < Memory.bloodhunter_MAX[k]){
                        if (nexi[k].spawnCreep(SD.bloodh_body[k], 'Bloodhunter-' + Game.time % SD.time_offset, {memory: {role: 'bloodhunter', home: nexi[k].room.name}}) == OK)
                            console.log('Room #' + k + ': Bloodhunter-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //enforcers: if remote mining is being disrupted by invader cores
                    else if (enforcer_gang[k].length < Memory.enforcer_MAX[k]){
                        if (nexi[k].spawnCreep(SD.enforc_body[k], 'Enforcer-' + Game.time % SD.time_offset, {memory: {role: 'enforcer', home: nexi[k].room.name}}) == OK)
                            console.log('Room #' + k + ': Enforcer-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //purifiers: if an invader core's efforts must be undone
                    else if (purifier_gang[k].length < Memory.purifier_MAX[k]){
                        if (nexi[k].spawnCreep(SD.purif_body[k], 'Purifier-' + Game.time % SD.time_offset, {memory: {role: 'purifier', home: nexi[k].room.name}}) == OK)
                            console.log('Room #' + k + ': Purifier-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //ancient drones: if minerals are available to mine
                    else if (ancientDrone_gang[k].length < Memory.ancientDrone_MAX[k]){
                        if (nexi[k].spawnCreep(SD.androne_body, 'AncientDrone-' + Game.time % SD.time_offset, {memory: {role: 'ancientDrone'}}) == OK)
                            console.log('Room #' + k + ': AncientDrone-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //ancient assimilators: if minerals are available to mine
                    else if (ancientAssimilator_gang[k].length < Memory.ancientAssimilator_MAX[k]){
                        if (nexi[k].spawnCreep(SD.anassim_body, 'AncientAssimilator-' + Game.time % SD.time_offset, {memory: {role: 'ancientAssimilator'}}) == OK)
                            console.log('Room #' + k + ': AncientAssimilator-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //architects: if there are construction projects to finish
                    else if (architect_gang[k].length < Memory.architect_MAX[k]){
                        if (nexi[k].spawnCreep(SD.archit_body[k], 'Architect-' + Game.time % SD.time_offset, {memory: {role: 'architect'}}) == OK)
                            console.log('Room #' + k + ': Architect-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    else if (phaseArchitect_gang[k].length < Memory.phaseArchitect_MAX[k]){
                        if (nexi[k].spawnCreep(SD.phasarc_body[k], 'PhaseArchitect-' + Game.time % SD.time_offset, {memory: {role: 'phaseArchitect'}}) == OK)
                            console.log('Room #' + k + ': PhaseArchitect-' + Game.time % SD.time_offset + ' spawning.');
                    }
            
            //spawning fast-track units...
                    //visionary: used in claiming up new rooms
                    else if (visionary_gang[k].length < Memory.visionary_MAX[k]){
                        if (nexi[k].spawnCreep(SD.visio_body[k], 'Visionary-' + Game.time % SD.time_offset, {memory: {role: 'visionary', home: nexi[k].room.name, in_place: false}}) == OK)
                            console.log('Visionary-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //specialist: used in setting up new rooms (assists architects)
                    else if (specialist_gang[k].length < Memory.specialist_MAX[k]){
                        if (nexi[k].spawnCreep(SD.speci_body[k], 'Specialist-' + Game.time % SD.time_offset, {memory: {role: 'specialist', home: nexi[k].room.name, in_place: false}}) == OK)
                            console.log('Specialist-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //saviour: used in setting up new rooms (assists sacrificers)
                    else if (saviour_gang.length < Memory.saviour_MAX){
                        if (nexi[0].spawnCreep(SD.speci_body, 'Saviour-' + Game.time % SD.time_offset, {memory: {role: 'saviour'}}) == OK)
                            console.log('Saviour-' + Game.time % SD.time_offset + ' spawning.');
                    }
            
            //spawning military units...
                    //emissary: used situationally for scouting
                    else if (emissary_gang[k].length < Memory.emissary_MAX[k]){
                        if (nexi[k].spawnCreep(SD.emiss_body, 'Emissary-' + Game.time % SD.time_offset, {memory: {role: 'emissary', in_place: false}}) == OK)
                            console.log('Room #' + k + ': Emissary-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //dark templar: used during battle
                    else if (darktemplar_gang[k].length < Memory.darktemplar_MAX[k]){
                        if (nexi[k].spawnCreep(SD.dt_body[k], 'Darktemplar-' + Game.time % SD.time_offset, {memory: {role: 'darktemplar', home: nexi[k].room.name, in_place: false}}) == OK)
                            console.log('Room #' + k + ': Darktemplar-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //hallucination: used during battle
                    else if (hallucination_gang.length < Memory.hallucination_MAX){
                        if (nexi[0].spawnCreep(SD.halluc_body, 'Hallucination-' + Game.time % SD.time_offset, {memory: {role: 'hallucination'}}) == OK)
                            console.log('Hallucination-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //high templar: used during battle
                    else if (hightemplar_gang.length < Memory.hightemplar_MAX){
                        if (nexi[0].spawnCreep(SD.ht_body, 'Hightemplar-' + Game.time % SD.time_offset, {memory: {role: 'hightemplar'}}) == OK)
                            console.log('Hightemplar-' + Game.time % SD.time_offset + ' spawning.');
                    }
                    //zealot: used during battle
                    else if (zealot_gang.length < Memory.zealot_MAX){
                        if (nexi[0].spawnCreep(SD.zealot_body, 'Zealot-' + Game.time % SD.time_offset, {memory: {role: 'zealot', in_place: false}}) == OK)
                            console.log('Zealot-' + Game.time % SD.time_offset + ' spawning.');
                    }
                }
            }
        }
    }
};