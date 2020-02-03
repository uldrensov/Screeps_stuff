//unit AI's
var emergencyDrone = require('emergencyDrone.AI');
//var sacrificer = require('sacrificer.AI');
var architect = require('architect.AI');
var probe = require('probe.AI');
var assimilator = require('assimilator.AI');
var drone = require('drone.AI');
var energiser = require('energiser.AI');
var acolyte = require('acolyte.AI');
var supplicant = require('supplicant.AI');
var fanatic = require('fanatic.AI');
var recalibrator = require('recalibrator.AI');
var zealot = require('zealot.AI');

//tower AI
var khaydarinmonolith = require('khaydarinmonolith.AI');

//reconfigurable structure IDs
var nexus_id = ['5e2d15a9e152154167131760'];
var source1_id = ['5bbcae989099fc012e639476'];
var source2_id = ['5bbcae989099fc012e639475'];
var canister1_id = ['5e30677977034e78c09bdc43'];
//var canister2_id = [];
var tower_n1_1_id = '5e2f4a33e8af4a1c6459ccd8';
var tower_n1_2_id = '5e346820d632bc24398489ab';
var warpprism_main_id = '5e34d2403561285c52aba5b2';
var warpprism_branch_id = '5e34d803221670187690e4d7';
var WP_main_tile = Game.getObjectById('5e2e78bdda1c845d8cb2df9c');
var WP_branch_tile = Game.getObjectById('5e354b518c0dfc0f7b8dc1d0');

//reconfigurable numbers
var time_offset = 100000;
var fixation_override_threshold = .25; //probes will break fixation upon spotting a % gap this wide
var drone_price = [1450];
var drone_pickup_min = 200;
var drone_ignore_lim = 210; //drones will ignore containers containing less than this
var tower_reserve_ratio = .5;
var vault_reserve_min = 50000;

//memory init
//if (Memory.sacrificer_MAX == undefined){Memory.sacrificer_MAX = 3;}
if (Memory.architect_MAX == undefined){Memory.architect_MAX = [1];}
if (Memory.probe_MAX == undefined){Memory.probe_MAX = [3];}
if (Memory.drone_MAX == undefined){Memory.drone_MAX = [2];}
if (Memory.energiser_MAX == undefined){Memory.energiser_MAX = [1];}
if (Memory.supplicant_MAX == undefined){Memory.supplicant_MAX = [1];}
if (Memory.fanatic_MAX == undefined){Memory.fanatic_MAX = [1];}
if (Memory.wall_threshold == undefined){Memory.wall_threshold = 50000;}
if (Memory.rampart_threshold == undefined){Memory.rampart_threshold = 100000;}


module.exports.loop = function(){
    
    var nexi = [Game.getObjectById(nexus_id[0])];
    
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    
    //auto-spawn algorithm...
    var emergencyDrone_gang = []; var sacrificer_gang = []; var architect_gang = []; var probe_gang = [];
    var assimilator_lone = []; var assimilator_lone2 = []; var drone_gang = []; var energiser_gang = [];
    var acolyte_lone = []; var supplicant_gang = []; var fanatic_gang = [];
    
    //count unit population by role
    emergencyDrone_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone');
    //sacrificer_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer');
    architect_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'architect');
    probe_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
    assimilator_lone[0] = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator');
    //assimilator_lone2[0] = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2');
    drone_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
    energiser_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'energiser');
    acolyte_lone[0] = _.filter(Game.creeps, creep => creep.memory.role == 'acolyte');
    supplicant_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'supplicant');
    fanatic_gang[0] = _.filter(Game.creeps, creep => creep.memory.role == 'fanatic');
    
    //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
    if (drone_gang[0].length == 0 && emergencyDrone_gang.length == 0 &&
    nexi[0].room.energyAvailable < drone_price[0]){
        //300 cost
        if (nexi[0].spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE],
        'EmergencyDrone-' + Game.time % time_offset, {memory: {role: 'emergencyDrone'}}) == 0){
            console.log('<<<EmergencyDrone-' + Game.time % time_offset + ' spawning.>>>');
            Game.notify('Emergency drone deployed',0);
        }
    }
    
    //prioritising each role in certain amts...
    //without assimilators, there is no usable energy
    if (assimilator_lone[0].length < 1){
        //550 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],
        'Assimilator-' + Game.time % time_offset, {memory: {role: 'assimilator'}}) == 0){
            console.log('Assimilator-' + Game.time % time_offset + ' spawning.');
        }
    }
    /*
    else if (assimilator_lone2.length < 1){
        //550 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],
        'AssimilatorBETA-' + Game.time % time_offset, {memory: {role: 'assimilator2'}}) == 0){
            console.log('AssimilatorBETA-' + Game.time % time_offset + ' spawning.');
        }
    }
    */
    //without drones, nothing else may spawn
    else if (drone_gang[0].length < Memory.drone_MAX[0]){
        //1450 cost
        if (nexi[0].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Drone-' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('Drone-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without energisers, the room is defenceless
    else if (energiser_gang[0].length < Memory.energiser_MAX[0]){
        //750 cost
        if (nexi[0].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Energiser-' + Game.time % time_offset, {memory: {role: 'energiser'}}) == 0){
            console.log('Energiser-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without sacrificers, the room will level down
    /*
    else if (sacrificer_gang[0].length < sacrificer_MAX){
        //1000 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Sacrificer-' + Game.time % time_offset, {memory: {role: 'sacrificer'}}) == 0){
            console.log('Sacrificer-' + Game.time % time_offset + ' spawning.');
        }
    }
    */
    //without acolytes, supplicants cannot work
    else if (acolyte_lone[0].length < 1){
        //900 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE],
        'Acolyte-' + Game.time % time_offset, {memory: {role: 'acolyte'}}) == 0){
            console.log('Acolyte-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without supplicants, the room will level down
    else if (supplicant_gang[0].length < Memory.supplicant_MAX[0]){
        //1800 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        WORK,WORK,WORK,
        CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Supplicant-' + Game.time % time_offset, {memory: {role: 'supplicant'}}) == 0){
            console.log('Supplicant-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without probes, structures are not maintained
    else if (probe_gang[0].length < Memory.probe_MAX[0]){
        //1400 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Probe-' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
            console.log('Probe-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without architects, nothing new can be built
    else if (architect_gang[0].length < Memory.architect_MAX[0]){
        //1800 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Architect-' + Game.time % time_offset, {memory: {role: 'architect'}}) == 0){
            console.log('Architect-' + Game.time % time_offset + ' spawning.');
        }
    }
    
    //fanatic: use this wisely
    else if (fanatic_gang[0].length < Memory.fanatic_MAX[0]){
        //1800 cost
        if (nexi[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Fanatic-' + Game.time % time_offset, {memory: {role: 'fanatic'}}) == 0){
            console.log('Fanatic-' + Game.time % time_offset + ' spawning.');
        }
    }
    
    
    //assign AI's to each unit type
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        if (unit.room == nexi[0].room){
            switch (unit.memory.role){
                case 'emergencyDrone':
                    emergencyDrone.run(unit, nexus_id[0]);
                    break;
                case 'assimilator':
                    assimilator.run(unit, source1_id[0], canister1_id[0]);
                    break;
                /*
                case 'assimilator2':
                    assimilator.run(unit, source1_id[0], canister2_id[0]);
                    break;
                */
                case 'drone':
                    drone.run(unit, nexus_id[0], drone_pickup_min, drone_ignore_lim);
                    break;
                case 'energiser':
                    energiser.run(unit, nexi[0]);
                    break;
                case 'acolyte':
                    acolyte.run(unit, source2_id[0], warpprism_main_id, warpprism_branch_id, WP_branch_tile);
                    break;
                case 'supplicant':
                    supplicant.run(unit, nexi[0], warpprism_main_id, warpprism_branch_id, WP_main_tile);
                    break;
                case 'probe':
                    probe.run(unit, nexi[0], Memory.wall_threshold, Memory.rampart_threshold,
                    fixation_override_threshold);
                    break;
                case 'architect':
                    architect.run(unit, nexi[0], vault_reserve_min);
                    break;
                case 'fanatic':
                    fanatic.run(unit, nexi[0], vault_reserve_min);
                    break;
                case 'recalibrator':
                    recalibrator.run(unit, nexus_id[0], '5bbcae989099fc012e639478',  Game.flags['exit']);
                    break;
                default:
                    console.log('Warning: invalid role "' + unit.memory.role + '"');
                    break;
            }
        }
    }
    
    //assign AI's to each tower
    khaydarinmonolith.run(tower_n1_1_id, Memory.wall_threshold, Memory.rampart_threshold, tower_reserve_ratio);
    khaydarinmonolith.run(tower_n1_2_id, Memory.wall_threshold, Memory.rampart_threshold, tower_reserve_ratio);
}