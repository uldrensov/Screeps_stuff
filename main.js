//library inclusions
var SD =                    require('SOFTDATA');
var INIT =                  require('MEMORYINIT');

//AI script inclusions
var emergencyDrone =        require('emergencyDrone.AI');
var sacrificer =            require('sacrificer.AI');
var architect =             require('architect.AI');
var probe =                 require('probe.AI');
var assimilator =           require('assimilator.AI');
var drone =                 require('drone.AI');
var energiser =             require('energiser.AI');
var recalibrator =          require('recalibrator.AI');
var orbitalAssimilator =    require('orbitalAssimilator.AI');
var orbitalDrone =          require('orbitalDrone.AI');
var bloodhunter =           require('bloodhunter.AI');
var enforcer =              require('enforcer.AI');
var purifier =              require('purifier.AI');
var acolyte =               require('acolyte.AI');
var adherent =              require('adherent.AI');
var supplicant =            require('supplicant.AI');
var ancientDrone =          require('ancientDrone.AI');
var ancientAssimilator =    require('ancientAssimilator.AI');
var specialist =            require('specialist.AI');
var saviour =               require('saviour.AI');
var emissary =              require('emissary.AI');
var darktemplar =           require('darktemplar.AI');
var hallucination =         require('hallucination.AI');
var hightemplar =           require('hightemplar.AI');
var zealot =                require('zealot.AI');
var khaydarinmonolith =     require('khaydarinmonolith.AI');


module.exports.loop = function(){
    
    INIT.run();
    var nexi = [Game.getObjectById(SD.nexus_id[0]), Game.getObjectById(SD.nexus_id[1]), Game.getObjectById(SD.nexus_id[2])];
    
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    //remote mining security system
    for (let i=0; i<Memory.evac_timer.length; i++){
        //if anything is disturbing remote mining, disable remote worker spawns
        if (Memory.evac_timer[i] > 0 || Memory.core_sighting[i] == true){
            Memory.recalibrator_MAX[i] = -1;
            Memory.orbitalAssimilator_MAX[i] = -1;
            Memory.orbitalDrone_MAX[i] = -1;
            
            //if it's an invader, count down the timer and enable blood hunters
            if (Memory.evac_timer[i] > 0){
                Memory.evac_timer[i]--;
                Memory.bloodhunter_MAX[i] = 1;
            }
            
            //if it's a core, enable enforcers
            if (Memory.core_sighting[i] == true)
                Memory.enforcer_MAX[i] = 1;
        }
        //if neither is occurring, restore worker spawns and disable warrior spawns
        else{
            if (Memory.recalibrator_MAX[i] < 0) Memory.recalibrator_MAX[i] = 1;
            if (Memory.orbitalAssimilator_MAX[i] < 0) Memory.orbitalAssimilator_MAX[i] = 1;
            if (Memory.orbitalDrone_MAX[i] < 0) Memory.orbitalDrone_MAX[i] = 1;
            Memory.bloodhunter_MAX[i] = 0;
            Memory.enforcer_MAX[i] = 0;
        }
    }
    
    //email alerts for vault energy conservation
    for (let i=0; i<Memory.vaultAlert_EN.length; i++){
        //enable alert for a room when its vault rises past 15% of the minimum threshold
        if ((nexi[i].room.storage.store.energy > SD.vault_reserve_min * 1.15) && !Memory.vaultAlert_EN[i])
            Memory.vaultAlert_EN[i] = true;
        //disable further alerts from a room when it raises one
        else if (nexi[i].room.storage.store.energy < SD.vault_reserve_min && Memory.vaultAlert_EN[i]){
            console.log('------------------------------');
            console.log('Vault #' + i + ' has entered conservation mode.');
            console.log('------------------------------');
            Game.notify('Vault #' + i + ' has entered conservation mode.',0);
            Memory.vaultAlert_EN[i] = false;
        }
    }
    
    
    //for storing population count in each room
    var emergencyDrone_gang = [];   var sacrificer_gang = [];       var architect_gang = [];            var probe_gang = [];                var assimilator_gang = [];  var assimilator2_gang = [];
    var drone_gang = [];            var energiser_gang = [];        var recalibrator_gang = [];         var orbitalAssimilator_gang = [];   var orbitalDrone_gang = []; var bloodhunter_gang = [];
    var enforcer_gang = [];         var purifier_gang = [];         var acolyte_gang = [];              var acolyte2_gang = [];             var adherent_gang = [];     var adherent2_gang = [];
    var supplicant_gang = [];       var ancientDrone_gang = [];     var ancientAssimilator_gang = [];   var specialist_gang;                var saviour_gang;           var emissary_gang = [];
    var darktemplar_gang = [];      var hallucination_gang;         var hightemplar_gang;               var zealot_gang;
    
    
    //execute the auto-spawn and unit AI assignment routines for each room
    for (let k=0; k<nexi.length; k++){
        
        //count unit population by role
        emergencyDrone_gang[k] =        _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.room == nexi[k].room);
        sacrificer_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.room == nexi[k].room);
        architect_gang[k] =             _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.room == nexi[k].room);
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
        supplicant_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.room == nexi[k].room);
        ancientDrone_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.room == nexi[k].room);
        ancientAssimilator_gang[k] =    _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.room == nexi[k].room);
        specialist_gang =               _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
        saviour_gang =                  _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
        emissary_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'emissary');
        darktemplar_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'darktemplar');
        hallucination_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
        hightemplar_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'hightemplar');
        zealot_gang =                   _.filter(Game.creeps, creep => creep.memory.role == 'zealot');
        
        
        //determine if mineral mining is possible
        var extractor = nexi[k].room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_EXTRACTOR;
            }
        })
        var minerals = nexi[k].room.find(FIND_MINERALS)[0];
        if (extractor.length && minerals.mineralAmount > 0){
            Memory.ancientDrone_MAX[k] = 1;
            Memory.ancientAssimilator_MAX[k] = 1;
        }
        else{
            Memory.ancientDrone_MAX[k] = 0;
            Memory.ancientAssimilator_MAX[k] = 0;
        }
        
        
        //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
        if (drone_gang[k].length == 0 && emergencyDrone_gang[k].length == 0 &&
        nexi[k].room.energyAvailable < SD.drone_price[k]){
            if (nexi[k].spawnCreep(SD.edrone_body, 'EmergencyDrone-' + Game.time % SD.time_offset, {memory: {role: 'emergencyDrone'}}) == 0){
                console.log('Room #' + k + ': >>>EmergencyDrone-' + Game.time % SD.time_offset + ' spawning.<<<');
                Game.notify('Emergency drone deployed',0);
            }
        }
        
    //spawning core units...
        //without assimilators, there is no usable energy
        if (assimilator_gang[k].length < Memory.assimilator_MAX[k]){
            if (nexi[k].spawnCreep(SD.assim_body[k], 'Assimilator-' + Game.time % SD.time_offset, {memory: {role: 'assimilator'}}) == 0)
                console.log('Room #' + k + ': Assimilator-' + Game.time % SD.time_offset + ' spawning.');
        }
        else if (assimilator2_gang[k].length < Memory.assimilator2_MAX[k]){
            if (nexi[k].spawnCreep(SD.assim_body[k], 'Assimilator_II-' + Game.time % SD.time_offset, {memory: {role: 'assimilator2'}}) == 0)
                console.log('Room #' + k + ': Assimilator_II-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without drones, nothing else may spawn
        else if (drone_gang[k].length < Memory.drone_MAX[k]){
            if (nexi[k].spawnCreep(SD.drone_body[k], 'Drone-' + Game.time % SD.time_offset, {memory: {role: 'drone'}}) == 0)
                console.log('Room #' + k + ': Drone-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without energisers, the room is defenceless
        else if (energiser_gang[k].length < Memory.energiser_MAX[k]){
            if (nexi[k].spawnCreep(SD.energ_body[k], 'Energiser-' + Game.time % SD.time_offset, {memory: {role: 'energiser'}}) == 0)
                console.log('Room #' + k + ': Energiser-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without sacrificers, the room will level down
        else if (sacrificer_gang[k].length < Memory.sacrificer_MAX[k]){
            if (nexi[k].spawnCreep(SD.sacrif_body[k], 'Sacrificer-' + Game.time % SD.time_offset, {memory: {role: 'sacrificer'}}) == 0)
                console.log('Room #' + k + ': Sacrificer-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without acolytes, links cannot transmit
        else if (acolyte_gang[k].length < Memory.acolyte_MAX[k]){
            if (nexi[k].spawnCreep(SD.acoly_body[k], 'Acolyte-' + Game.time % SD.time_offset, {memory: {role: 'acolyte'}}) == 0)
                console.log('Room #' + k + ': Acolyte-' + Game.time % SD.time_offset + ' spawning.');
        }
        else if (acolyte2_gang[k].length < Memory.acolyte2_MAX[k]){
            if (nexi[k].spawnCreep(SD.acoly_body[k], 'Acolyte_II-' + Game.time % SD.time_offset, {memory: {role: 'acolyte2'}}) == 0)
                console.log('Room #' + k + ': Acolyte_II-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without adherents, links cannot be unloaded
        else if (adherent_gang[k].length < Memory.adherent_MAX[k]){
            if (nexi[k].spawnCreep(SD.adher_body, 'Adherent-' + Game.time % SD.time_offset, {memory: {role: 'adherent'}}) == 0)
                console.log('Room #' + k + ': Adherent-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without supplicants, the room will level down (replaces sacrificers)
        else if (supplicant_gang[k].length < Memory.supplicant_MAX[k]){
            if (nexi[k].spawnCreep(SD.suppl_body[k], 'Supplicant-' + Game.time % SD.time_offset, {memory: {role: 'supplicant'}}) == 0)
                console.log('Room #' + k + ': Supplicant-' + Game.time % SD.time_offset + ' spawning.');
        }
        //without probes, structures are not maintained
        else if (probe_gang[k].length < Memory.probe_MAX[k]){
            if (nexi[k].spawnCreep(SD.probe_body[k], 'Probe-' + Game.time % SD.time_offset, {memory: {role: 'probe'}}) == 0)
                console.log('Room #' + k + ': Probe-' + Game.time % SD.time_offset + ' spawning.');
        }
        
    //spawning situational units...
        //recalibrators: if remote mining is viable
        else if (recalibrator_gang[k].length < Memory.recalibrator_MAX[k]){
            if (nexi[k].spawnCreep(SD.recal_body, 'Recalibrator-' + Game.time % SD.time_offset, {memory: {role: 'recalibrator', home: nexi[k].room.name, in_place: false}}) == 0)
                console.log('Room #' + k + ': Recalibrator-' + Game.time % SD.time_offset + ' spawning.');
        }
        //orbital assimilators: if remote mining is viable
        else if (orbitalAssimilator_gang[k].length < Memory.orbitalAssimilator_MAX[k]){
            if (nexi[k].spawnCreep(SD.oassim_body[k], 'OrbitalAssimilator-' + Game.time % SD.time_offset, {memory: {role: 'orbitalAssimilator', home: nexi[k].room.name, in_place: false}}) == 0)
                console.log('Room #' + k + ': OrbitalAssimilator-' + Game.time % SD.time_offset + ' spawning.');
        }
        //orbital drones: if remote mining is viable
        else if (orbitalDrone_gang[k].length < Memory.orbitalDrone_MAX[k]){
            if (nexi[k].spawnCreep(SD.odrone_body[k], 'OrbitalDrone-' + Game.time % SD.time_offset, {memory: {role: 'orbitalDrone', home: nexi[k].room.name, in_place: false}}) == 0)
                console.log('Room #' + k + ': OrbitalDrone-' + Game.time % SD.time_offset + ' spawning.');
        }
        //blood hunters: if remote mining is being disrupted by invaders
        else if (bloodhunter_gang[k].length < Memory.bloodhunter_MAX[k]){
            if (nexi[k].spawnCreep(SD.bloodh_body[k], 'Bloodhunter-' + Game.time % SD.time_offset, {memory: {role: 'bloodhunter', home: nexi[k].room.name}}) == 0)
                console.log('Room #' + k + ': Bloodhunter-' + Game.time % SD.time_offset + ' spawning.');
        }
        //enforcers: if remote mining is being disrupted by invader cores
        else if (enforcer_gang[k].length < Memory.enforcer_MAX[k]){
            if (nexi[k].spawnCreep(SD.dt_body[k], 'Enforcer-' + Game.time % SD.time_offset, {memory: {role: 'enforcer', home: nexi[k].room.name}}) == 0)
                console.log('Room #' + k + ': Enforcer-' + Game.time % SD.time_offset + ' spawning.');
        }
        //purifiers: if an invader core's efforts must be undone
        else if (purifier_gang[k].length < Memory.purifier_MAX[k]){
            if (nexi[k].spawnCreep(SD.purif_body[k], 'Purifier-' + Game.time % SD.time_offset, {memory: {role: 'purifier', home: nexi[k].room.name}}) == 0)
                console.log('Room #' + k + ': Purifier-' + Game.time % SD.time_offset + ' spawning.');
        }
        //ancient drones: if minerals are available to mine
        else if (ancientDrone_gang[k].length < Memory.ancientDrone_MAX[k]){
            if (nexi[k].spawnCreep(SD.androne_body, 'AncientDrone-' + Game.time % SD.time_offset, {memory: {role: 'ancientDrone'}}) == 0)
                console.log('Room #' + k + ': AncientDrone-' + Game.time % SD.time_offset + ' spawning.');
        }
        //ancient assimilators: if minerals are available to mine
        else if (ancientAssimilator_gang[k].length < Memory.ancientAssimilator_MAX[k]){
            if (nexi[k].spawnCreep(SD.anassim_body, 'AncientAssimilator-' + Game.time % SD.time_offset, {memory: {role: 'ancientAssimilator'}}) == 0)
                console.log('Room #' + k + ': AncientAssimilator-' + Game.time % SD.time_offset + ' spawning.');
        }
        //architects: if there are construction projects to finish
        else if (architect_gang[k].length < Memory.architect_MAX[k]){
            if (nexi[k].spawnCreep(SD.archit_body[k], 'Architect-' + Game.time % SD.time_offset, {memory: {role: 'architect'}}) == 0)
                console.log('Room #' + k + ': Architect-' + Game.time % SD.time_offset + ' spawning.');
        }
        
    //spawning fast-track units...
        //specialist: used in setting up new rooms (assists architects)
        else if (specialist_gang.length < Memory.specialist_MAX){
            if (nexi[0].spawnCreep(SD.speci_body, 'Specialist-' + Game.time % SD.time_offset, {memory: {role: 'specialist'}}) == 0)
                console.log('Specialist-' + Game.time % SD.time_offset + ' spawning.');
        }
        //saviour: used in setting up new rooms (assists sacrificers)
        else if (saviour_gang.length < Memory.saviour_MAX){
            if (nexi[0].spawnCreep(SD.speci_body, 'Saviour-' + Game.time % SD.time_offset, {memory: {role: 'saviour'}}) == 0)
                console.log('Saviour-' + Game.time % SD.time_offset + ' spawning.');
        }
        
    //spawning military units...
        //emissary: used situationally for scouting
        else if (emissary_gang[k].length < Memory.emissary_MAX[k]){
            if (nexi[k].spawnCreep(SD.emiss_body, 'Emissary-' + Game.time % SD.time_offset, {memory: {role: 'emissary', in_place: false}}) == 0)
                console.log('Room #' + k + ': Emissary-' + Game.time % SD.time_offset + ' spawning.');
        }
        //dark templar: used during battle
        else if (darktemplar_gang[k].length < Memory.darktemplar_MAX[k]){
            if (nexi[k].spawnCreep(SD.dt_body[k], 'Darktemplar-' + Game.time % SD.time_offset, {memory: {role: 'darktemplar', in_place: false}}) == 0)
                console.log('Room #' + k + ': Darktemplar-' + Game.time % SD.time_offset + ' spawning.');
        }
        //hallucination: used during battle
        else if (hallucination_gang.length < Memory.hallucination_MAX){
            if (nexi[0].spawnCreep(SD.halluc_body, 'Hallucination-' + Game.time % SD.time_offset, {memory: {role: 'hallucination'}}) == 0)
                console.log('Hallucination-' + Game.time % SD.time_offset + ' spawning.');
        }
        //high templar: used during battle
        else if (hightemplar_gang.length < Memory.hightemplar_MAX){
            if (nexi[0].spawnCreep(SD.ht_body, 'Hightemplar-' + Game.time % SD.time_offset, {memory: {role: 'hightemplar'}}) == 0)
                console.log('Hightemplar-' + Game.time % SD.time_offset + ' spawning.');
        }
        //zealot: used during battle
        else if (zealot_gang.length < Memory.zealot_MAX){
            if (nexi[0].spawnCreep(SD.zealot_body, 'Zealot-' + Game.time % SD.time_offset, {memory: {role: 'zealot', in_place: false}}) == 0)
                console.log('Zealot-' + Game.time % SD.time_offset + ' spawning.');
        }
        
        
        //assign AI's to room-locked units
        for (var name in Game.creeps){
            var unit = Game.creeps[name];
            if (unit.room == nexi[k].room){
                switch (unit.memory.role){
                    case 'emergencyDrone':
                        emergencyDrone.run(unit, SD.nexus_id[k]);
                        break;
                    case 'assimilator':
                        assimilator.run(unit, SD.source1_id[k], SD.canister1_id[k]);
                        break;
                    case 'assimilator2':
                        assimilator.run(unit, SD.source2_id[k], SD.canister2_id[k]);
                        break;
                    case 'drone':
                        drone.run(unit, SD.nexus_id[k], SD.en_ignore_lim);
                        break;
                    case 'energiser':
                        energiser.run(unit, nexi[k]);
                        break;
                    case 'sacrificer':
                        sacrificer.run(unit, SD.controller_id[k], SD.en_ignore_lim);
                        break;
                    case 'acolyte':
                        acolyte.run(unit, SD.holy_source[k][0], SD.warpRX_id[k], SD.warpTX_id[k][0], SD.acoly_tile_id[k][0]);
                        break;
                    case 'acolyte2':
                        acolyte.run(unit, SD.holy_source[k][1], SD.warpRX_id[k], SD.warpTX_id[k][1], SD.acoly_tile_id[k][1]);
                        break;
                    case 'adherent':
                        adherent.run(unit, SD.nexus_id[k], SD.adher_tile_id[k], SD.warpRX_id[k]);
                        break;
                    case 'supplicant':
                        supplicant.run(unit, nexi[k], SD.vault_reserve_min);
                        break;
                    case 'probe':
                        probe.run(unit, nexi[k], SD.fixation_override, SD.en_ignore_lim, SD.vault_reserve_min);
                        break;
                    case 'ancientDrone':
                        ancientDrone.run(unit, SD.nexus_id[k], SD.mineralcanister_id[k]);
                        break;
                    case 'ancientAssimilator':
                        ancientAssimilator.run(unit, SD.mineralcanister_id[k]);
                        break;
                    case 'architect':
                        architect.run(unit, nexi[k], SD.vault_reserve_min);
                        break;
                }
            }
        }
        
        //assign AI's to towers
        for (let i=0; i<SD.tower_id[k].length; i++){
            khaydarinmonolith.run(SD.tower_id[k][i], SD.tower_reserve_ratio, SD.nexus_id);
        }
    }
    
    
    //assign AI's to free-range units
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        switch (unit.memory.role){
            case 'recalibrator':
                //determine homeroom to call AI script using appropriate args
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        recalibrator.run(unit, SD.reserveflag[i], SD.tower_id[i][0], i);
                        break;
                    }
                }
                break;
            case 'orbitalAssimilator':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        orbitalAssimilator.run(unit, SD.remotesource_id[i], SD.remoteflag[i], SD.remotecanister_id[i], SD.tower_id[i][0], i);
                        break;
                    }
                }
                break;
            case 'orbitalDrone':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        orbitalDrone.run(unit, SD.remotecanister_id[i], SD.remoteflag[i], SD.remotedrop_id[i], SD.en_ignore_lim, SD.tower_id[i][0], i);
                        break;
                    }
                }
                break;
            case 'bloodhunter':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        bloodhunter.run(unit, SD.remoteflag[i], i);
                        break;
                    }
                }
                break;
            case 'enforcer':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        enforcer.run(unit, SD.remoteflag[i], i);
                        break;
                    }
                }
                break;
            case 'purifier':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        purifier.run(unit, SD.remoteflag[i], i);
                        break;
                    }
                }
                break;
            case 'specialist':
                specialist.run(unit, '5bbcae809099fc012e6392ef');
                break;
            case 'saviour':
                saviour.run(unit, SD.nexus_id[0], SD.controller_id[2], SD.vault_reserve_min);
                break;
            case 'emissary':
                emissary.run(unit, Game.flags['Core3']);
                break;
            case 'darktemplar':
                //darktemplar.run(unit, Game.flags['']);
                break;
            case 'hallucination':
                //hallucination.run(unit, Game.flags[''], Game.flags['']);
                break;
            case 'hightemplar':
                //hightemplar.run(unit, Game.flags['']);
                break;
            case 'zealot':
                //zealot.run(unit, Game.flags[''], Game.flags['']);
                break;
        }
    }
}