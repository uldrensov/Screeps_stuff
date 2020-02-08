//AI script objects
var emergencyDrone = require('emergencyDrone.AI');
var sacrificer = require('sacrificer.AI');
var architect = require('architect.AI');
var probe = require('probe.AI');
var assimilator = require('assimilator.AI');
var drone = require('drone.AI');
var energiser = require('energiser.AI');
var orbitalAssimilator = require('orbitalAssimilator.AI');
var acolyte = require('acolyte.AI');
var supplicant = require('supplicant.AI');
var fanatic = require('fanatic.AI');
var ancientAssimilator = require('ancientAssimilator.AI');
var recalibrator = require('recalibrator.AI');
var specialist = require('specialist.AI');
var saviour = require('saviour.AI');
var hallucination = require('hallucination.AI');
var hightemplar = require('hightemplar.AI');
var zealot = require('zealot.AI');
var khaydarinmonolith = require('khaydarinmonolith.AI');


//reconfigurable structure IDs
var nexus_id = ['5e2d15a9e152154167131760', '5e3909b408abb42e9b310a46'];
var controller_id = ['5bbcae989099fc012e639474', '5bbcae989099fc012e639478'];
var source1_id = ['5bbcae989099fc012e639476', '5bbcae989099fc012e639479'];
var source2_id = ['5bbcae989099fc012e639475'];
var canister1_id = ['5e30677977034e78c09bdc43', '5e393db88c0dfcfcb18f05d2'];
//var canister2_id = [];
var mineralcanister_id = ['5e3ca0a32f38f39b095da816'];
var remotesource_id = ['NULL', '5bbcae989099fc012e63947b'];
var remoteflag = ['NULL', Game.flags['Vespene']];
var remotedrop_id = ['5e323d61aa9957193cc8ec6c', '5e393db88c0dfcfcb18f05d2']; //dropoff storages for remote mining
var towers_nex1_id = ['5e2f4a33e8af4a1c6459ccd8', '5e346820d632bc24398489ab'];
var towers_nex2_id = ['5e3a68c9aa99575a56cba5da'];
var warpprism_main_id = '5e34d2403561285c52aba5b2';
var warpprism_branch_id = '5e34d803221670187690e4d7';
var WP_main_tile = Game.getObjectById('5e2e78bdda1c845d8cb2df9c');
var WP_branch_tile = Game.getObjectById('5e354b518c0dfc0f7b8dc1d0');

//reconfigurable role-based body types
var edrone_body = [WORK, CARRY,CARRY, MOVE,MOVE];
                //cost: 300
var assim_body = [[WORK,WORK,WORK,WORK,WORK, MOVE],
                [WORK,WORK,WORK,WORK,WORK, MOVE]];
                //cost: 550, 550
var drone_body = [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                //cost: 1600, 1300
var energ_body = [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE]];
                //cost: 750, 450
var sacrif_body = [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                //cost: 1200
var acoly_body = [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY, MOVE,MOVE,MOVE,MOVE];
                //cost: 900
var suppl_body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                CARRY, MOVE,MOVE,MOVE,MOVE,MOVE];
                //cost: 2300
var probe_body = [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                //cost: 1900, 1200
var oassim_body = [[],
                [WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                //cost: TBD, 1250
var anassim_body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE];
                //cost: 
var archit_body = [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                //cost: 2300, 1200
var fanat_body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                //cost: 2300
var speci_body = [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                //cost: 2300
var halluc_body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                //cost: 1800
var ht_body = [HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL, MOVE,MOVE,MOVE,MOVE];
                //cost: 2150
var zealot_body = [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                //cost: 1680

//reconfigurable numbers
var time_offset = 100000;
var fixation_override_threshold = .25; //probes will break fixation upon spotting an absolute % gap this wide
var drone_price = [1600,1300];
var drone_pickup_min = 200;
var canister_ignore_lim = 210; //drones will ignore containers containing less than this
var tower_reserve_ratio = .5;
var vault_reserve_min = 20000; //(e)drones and energisers have permission to bypass this


//memory init
if (Memory.sacrificer_MAX == undefined){Memory.sacrificer_MAX = [0,3];}
if (Memory.architect_MAX == undefined){Memory.architect_MAX = [0,1];}
if (Memory.probe_MAX == undefined){Memory.probe_MAX = [2,2];}
if (Memory.drone_MAX == undefined){Memory.drone_MAX = [2,2];}
if (Memory.energiser_MAX == undefined){Memory.energiser_MAX = [1,1];}
if (Memory.orbitalAssimilator_MAX == undefined){Memory.orbitalAssimilator_MAX = [0,0];}
if (Memory.acolyte_MAX == undefined){Memory.acolyte_MAX = [1,0];}
if (Memory.supplicant_MAX == undefined){Memory.supplicant_MAX = [1,0];}
if (Memory.fanatic_MAX == undefined){Memory.fanatic_MAX = [0,0];}
if (Memory.ancientAssimilator_MAX == undefined){Memory.ancientAssimilator_MAX = [1,0];}
if (Memory.specialist_MAX == undefined){Memory.specialist_MAX = 2;}
if (Memory.saviour_MAX == undefined){Memory.saviour_MAX = 1;}
if (Memory.hallucination_MAX == undefined){Memory.hallucination_MAX = 0;}
if (Memory.hightemplar_MAX == undefined){Memory.hightemplar_MAX = 0;}
if (Memory.zealot_MAX == undefined){Memory.zealot_MAX = 0;}
if (Memory.wall_threshold == undefined){Memory.wall_threshold = 50000;}
if (Memory.rampart_threshold == undefined){Memory.rampart_threshold = 100000;}


module.exports.loop = function(){
    
    var nexi = [Game.getObjectById(nexus_id[0]), Game.getObjectById(nexus_id[1])];
    
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    
    //for storing population count in each room
    var emergencyDrone_gang = []; var sacrificer_gang = []; var architect_gang = []; var probe_gang = [];
    var assimilator_lone = []; var assimilator_lone2 = []; var drone_gang = []; var energiser_gang = [];
    var orbitalAssimilator_gang = []; var acolyte_lone = []; var supplicant_gang = []; var fanatic_gang = [];
    var ancientAssimilator_gang = []; var specialist_gang; var saviour_gang; var hallucination_gang;
    var hightemplar_gang; var zealot_gang;
    
    
    //execute the auto-spawn and unit AI assignment routines for each room
    for (let k=0; k<nexi.length; k++){
        
        //count unit population by role
        emergencyDrone_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone' && creep.room == nexi[k].room);
        sacrificer_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer' && creep.room == nexi[k].room);
        architect_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'architect' && creep.room == nexi[k].room);
        probe_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'probe' && creep.room == nexi[k].room);
        assimilator_lone[k] = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator' && creep.room == nexi[k].room);
        //assimilator_lone2[k] = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2' && creep.room == nexi[k].room);
        drone_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'drone' && creep.room == nexi[k].room);
        energiser_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'energiser' && creep.room == nexi[k].room);
        orbitalAssimilator_gang = _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator');
        acolyte_lone[k] = _.filter(Game.creeps, creep => creep.memory.role == 'acolyte' && creep.room == nexi[k].room);
        supplicant_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'supplicant' && creep.room == nexi[k].room);
        fanatic_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'fanatic' && creep.room == nexi[k].room);
        ancientAssimilator_gang[k] = _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'
            && creep.room == nexi[k].room);
        specialist_gang = _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
        saviour_gang = _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
        hallucination_gang = _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
        hightemplar_gang = _.filter(Game.creeps, creep => creep.memory.role == 'hightemplar');
        zealot_gang = _.filter(Game.creeps, creep => creep.memory.role == 'zealot');
        
        
        //priorities and amounts...
        //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
        if (drone_gang[k].length == 0 && emergencyDrone_gang[k].length == 0 &&
        nexi[k].room.energyAvailable < drone_price[k]){
            if (nexi[k].spawnCreep(edrone_body,
            'EmergencyDrone-' + Game.time % time_offset, {memory: {role: 'emergencyDrone'}}) == 0){
                console.log('Room #' + k + ': >>>EmergencyDrone-' + Game.time % time_offset + ' spawning.<<<');
                Game.notify('Emergency drone deployed',0);
            }
        }
        
        //without assimilators, there is no usable energy
        if (assimilator_lone[k].length < 1){
            if (nexi[k].spawnCreep(assim_body[k],
            'Assimilator-' + Game.time % time_offset, {memory: {role: 'assimilator'}}) == 0){
                console.log('Room #' + k + ': Assimilator-' + Game.time % time_offset + ' spawning.');
            }
        }
        /*
        else if (assimilator_lone2[k].length < 1){
            if (nexi[k].spawnCreep(assim_body[k],
            'AssimilatorBETA-' + Game.time % time_offset, {memory: {role: 'assimilator2'}}) == 0){
                console.log('Room #' + k + ': AssimilatorBETA-' + Game.time % time_offset + ' spawning.');
            }
        }
        */
        //without drones, nothing else may spawn
        else if (drone_gang[k].length < Memory.drone_MAX[k]){
            if (nexi[k].spawnCreep(drone_body[k],
            'Drone-' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
                console.log('Room #' + k + ': Drone-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without energisers, the room is defenceless
        else if (energiser_gang[k].length < Memory.energiser_MAX[k]){
            if (nexi[k].spawnCreep(energ_body[k],
            'Energiser-' + Game.time % time_offset, {memory: {role: 'energiser'}}) == 0){
                console.log('Room #' + k + ': Energiser-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without sacrificers, the room will level down
        else if (sacrificer_gang[k].length < Memory.sacrificer_MAX[k]){
            if (nexi[k].spawnCreep(sacrif_body,
            'Sacrificer-' + Game.time % time_offset, {memory: {role: 'sacrificer'}}) == 0){
                console.log('Room #' + k + ': Sacrificer-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without acolytes, supplicants cannot work
        else if (acolyte_lone[k].length < Memory.acolyte_MAX[k]){
            if (nexi[k].spawnCreep(acoly_body,
            'Acolyte-' + Game.time % time_offset, {memory: {role: 'acolyte'}}) == 0){
                console.log('Room #' + k + ': Acolyte-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without supplicants, the room will level down
        else if (supplicant_gang[k].length < Memory.supplicant_MAX[k]){
            if (nexi[k].spawnCreep(suppl_body,
            'Supplicant-' + Game.time % time_offset, {memory: {role: 'supplicant'}}) == 0){
                console.log('Room #' + k + ': Supplicant-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without probes, structures are not maintained
        else if (probe_gang[k].length < Memory.probe_MAX[k]){
            if (nexi[k].spawnCreep(probe_body[k],
            'Probe-' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
                console.log('Room #' + k + ': Probe-' + Game.time % time_offset + ' spawning.');
            }
        }
        
        //orbital assimilators: spawned if remote mining is viable
        else if (orbitalAssimilator_gang.length < Memory.orbitalAssimilator_MAX[k]){
            if (nexi[1].spawnCreep(oassim_body[1],
            'OrbitalAssimilator-' + Game.time % time_offset, {memory: {role: 'orbitalAssimilator'}}) == 0){
                console.log('Room #' + k + ': OrbitalAssimilator-' + Game.time % time_offset + ' spawning.');
            }
        }
        //ancient assimilators: spawned if an extractor is present
        else if (ancientAssimilator_gang[k].length < Memory.ancientAssimilator_MAX[k]){
            if (nexi[k].spawnCreep(anassim_body,
            'AncientAssimilator-' + Game.time % time_offset, {memory: {role: 'ancientAssimilator'}}) == 0){
                console.log('Room #' + k + ': AncientAssimilator-' + Game.time % time_offset + ' spawning.');
            }
        }
        //architects: spawned if there are construction projects to finish
        else if (architect_gang[k].length < Memory.architect_MAX[k]){
            if (nexi[k].spawnCreep(archit_body[k],
            'Architect-' + Game.time % time_offset, {memory: {role: 'architect'}}) == 0){
                console.log('Room #' + k + ': Architect-' + Game.time % time_offset + ' spawning.');
            }
        }
    
        //fanatic: use this wisely
        else if (fanatic_gang[k].length < Memory.fanatic_MAX[k]){
            if (nexi[k].spawnCreep(fanat_body,
            'Fanatic-' + Game.time % time_offset, {memory: {role: 'fanatic'}}) == 0){
                console.log('Room #' + k + ': Fanatic-' + Game.time % time_offset + ' spawning.');
            }
        }
    
        //specialist: only used in setting up new rooms
        else if (specialist_gang.length < Memory.specialist_MAX){
            if (nexi[0].spawnCreep(speci_body,
            'Specialist-' + Game.time % time_offset, {memory: {role: 'specialist'}}) == 0){
                console.log('Specialist-' + Game.time % time_offset + ' spawning.');
            }
        }
        //saviour: only used in setting up new rooms
        else if (saviour_gang.length < Memory.saviour_MAX){
            if (nexi[0].spawnCreep(speci_body,
            'Saviour-' + Game.time % time_offset, {memory: {role: 'saviour'}}) == 0){
                console.log('Saviour-' + Game.time % time_offset + ' spawning.');
            }
        }
        
        //hallucination: only used during coordinated military efforts
        else if (hallucination_gang.length < Memory.hallucination_MAX){
            if (nexi[0].spawnCreep(halluc_body,
            'Hallucination-' + Game.time % time_offset, {memory: {role: 'hallucination'}}) == 0){
                console.log('Hallucination-' + Game.time % time_offset + ' spawning.');
            }
        }
        //high templar: only used during coordinated military efforts
        else if (hightemplar_gang.length < Memory.hightemplar_MAX){
            if (nexi[0].spawnCreep(ht_body,
            'Hightemplar-' + Game.time % time_offset, {memory: {role: 'hightemplar'}}) == 0){
                console.log('Hightemplar-' + Game.time % time_offset + ' spawning.');
            }
        }
        //zealot: only used during coordinated military efforts
        else if (zealot_gang.length < Memory.zealot_MAX){
            if (nexi[0].spawnCreep(zealot_body,
            'Zealot-' + Game.time % time_offset, {memory: {role: 'zealot'}}) == 0){
                console.log('Zealot-' + Game.time % time_offset + ' spawning.');
            }
        }
        
        
        //assign AI's to room-locked units (in each room)
        for (var name in Game.creeps){
            var unit = Game.creeps[name];
            if (unit.room == nexi[k].room){
                switch (unit.memory.role){
                    case 'emergencyDrone':
                        emergencyDrone.run(unit, nexus_id[k]);
                        break;
                    case 'assimilator':
                        assimilator.run(unit, source1_id[k], canister1_id[k]);
                        break;
                    case 'assimilator2':
                        //assimilator.run(unit, source1_id[0], canister2_id[0]);
                        break;
                    case 'drone':
                        drone.run(unit, nexus_id[k], drone_pickup_min, canister_ignore_lim);
                        break;
                    case 'energiser':
                        energiser.run(unit, nexi[k]);
                        break;
                    case 'sacrificer':
                        sacrificer.run(unit, controller_id[k], canister_ignore_lim);
                        break;
                    case 'acolyte':
                        acolyte.run(unit, source2_id[0], warpprism_main_id, warpprism_branch_id, WP_branch_tile);
                        break;
                    case 'supplicant':
                        supplicant.run(unit, nexi[k], warpprism_main_id, warpprism_branch_id, WP_main_tile);
                        break;
                    case 'probe':
                        probe.run(unit, nexi[k], Memory.wall_threshold, Memory.rampart_threshold,
                        fixation_override_threshold, canister_ignore_lim, vault_reserve_min);
                        break;
                    case 'ancientAssimilator':
                        ancientAssimilator.run(unit, mineralcanister_id[k]);
                        break;
                    case 'architect':
                        architect.run(unit, nexi[k], vault_reserve_min);
                        break;
                    case 'fanatic':
                        fanatic.run(unit, nexi[k], vault_reserve_min);
                        break;
                }
            }
        }
    }
    
    
    //assign AI's to free-range units
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        switch (unit.memory.role){
            case 'orbitalAssimilator':
                //determine homeroom
                for (let i=0; i<nexi.length; i++){
                    //console.log(unit.memory.home);
                    if (unit.memory.home == nexi[i].room){
                        orbitalAssimilator.run(unit, remotesource_id[i], remoteflag[i], remotedrop_id[i]);
                        break;
                    }
                }
                break;
            case 'recalibrator':
                //recalibrator.run(unit, nexus_id[0], '5bbcae989099fc012e639478',  Game.flags['exit']);
                break;
            case 'specialist':
                specialist.run(unit, nexus_id[0], controller_id[1], vault_reserve_min);
                break;
            case 'saviour':
                saviour.run(unit, nexus_id[0], controller_id[1], vault_reserve_min);
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
    
    //assign AI's to towers
    khaydarinmonolith.run(towers_nex1_id[0], Memory.wall_threshold, Memory.rampart_threshold, tower_reserve_ratio, nexus_id);
    khaydarinmonolith.run(towers_nex1_id[1], Memory.wall_threshold, Memory.rampart_threshold, tower_reserve_ratio, nexus_id);
    khaydarinmonolith.run(towers_nex2_id[0], Memory.wall_threshold, Memory.rampart_threshold, tower_reserve_ratio, nexus_id);
}