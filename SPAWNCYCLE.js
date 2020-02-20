//function: controls all automatic unit spawns

var SD = require('SOFTDATA');


module.exports = {
    run: function(){
        
        var nexi = [Game.getObjectById(SD.nexus_id[0]), Game.getObjectById(SD.nexus_id[1]), Game.getObjectById(SD.nexus_id[2])];
    
    
        //for storing population count in each room
        var emergencyDrone_gang = [];   var sacrificer_gang = [];       var architect_gang = [];        var probe_gang = [];                var assimilator_gang = [];  var assimilator2_gang = [];
        var drone_gang = [];            var energiser_gang = [];        var recalibrator_gang = [];     var orbitalAssimilator_gang = [];   var orbitalDrone_gang = []; var bloodhunter_gang = [];
        var enforcer_gang = [];         var purifier_gang = [];         var acolyte_gang = [];          var acolyte2_gang = [];             var adherent_gang = [];     var nullAdherent_gang = [];
        var supplicant_gang = [];       var nullSupplicant_gang = [];   var ancientDrone_gang = [];     var ancientAssimilator_gang = [];   var specialist_gang;        var saviour_gang;
        var emissary_gang = [];         var darktemplar_gang = [];      var hallucination_gang;         var hightemplar_gang;               var zealot_gang;
    
    
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
            nullAdherent_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'nullAdherent'          && creep.room == nexi[k].room);
            supplicant_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.room == nexi[k].room);
            nullSupplicant_gang[k] =        _.filter(Game.creeps, creep => creep.memory.role == 'nullSupplicant'        && creep.room == nexi[k].room);
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
            
            
        //spawning emergency units...
            //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
            if (drone_gang[k].length == 0 && emergencyDrone_gang[k].length == 0 &&
            nexi[k].room.energyAvailable < SD.drone_price[k]){
                if (nexi[k].spawnCreep(SD.edrone_body, 'EmergencyDrone-' + Game.time % SD.time_offset, {memory: {role: 'emergencyDrone'}}) == 0){
                    console.log('Room #' + k + ': >>>EmergencyDrone-' + Game.time % SD.time_offset + ' spawning.<<<');
                    Game.notify('Emergency drone deployed in room #' + k,0);
                }
            }
        
        //spawning core units...
            //without assimilators, there is no usable energy
            else if (assimilator_gang[k].length < Memory.assimilator_MAX[k]){
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
            else if (nullAdherent_gang[k].length < Memory.nullAdherent_MAX[k]){
                if (nexi[k].spawnCreep(SD.adher_body, 'NullAdherent-' + Game.time % SD.time_offset, {memory: {role: 'nullAdherent'}}) == 0)
                    console.log('Room #' + k + ': NullAdherent-' + Game.time % SD.time_offset + ' spawning.');
            }
            //without supplicants, the room will level down (replaces sacrificers)
            else if (supplicant_gang[k].length < Memory.supplicant_MAX[k]){
                if (nexi[k].spawnCreep(SD.suppl_body[k], 'Supplicant-' + Game.time % SD.time_offset, {memory: {role: 'supplicant'}}) == 0)
                    console.log('Room #' + k + ': Supplicant-' + Game.time % SD.time_offset + ' spawning.');
            }
            else if (nullSupplicant_gang[k].length < Memory.nullSupplicant_MAX[k]){
                if (nexi[k].spawnCreep(SD.suppl_body[k], 'NullSupplicant-' + Game.time % SD.time_offset, {memory: {role: 'nullSupplicant'}}) == 0)
                    console.log('Room #' + k + ': NullSupplicant-' + Game.time % SD.time_offset + ' spawning.');
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
        }
    }
};