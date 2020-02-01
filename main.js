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
var zealot = require('zealot.AI');
var specialist = require('specialist.AI');

//tower AI
var khaydarinmonolith = require('khaydarinmonolith.AI');

//reconfigurable structure variables
var nexus1 = Game.spawns['Spawn1'];
var source_n1_1 = Game.getObjectById('5bbcae989099fc012e639476');
var source_n1_2 = Game.getObjectById('5bbcae989099fc012e639475');
var canister_n1_1 = Game.getObjectById('5e30677977034e78c09bdc43');
//var canister_n1_2 = Game.getObjectById('5e30fe29a7eab0eb0b0e85ab');
var tower_n1_1 = '5e2f4a33e8af4a1c6459ccd8';
var tower_n1_2 = '5e346820d632bc24398489ab';
var warpprism_main = '5e34d2403561285c52aba5b2';
var warpprism_branch = '5e34d803221670187690e4d7';
var WP_main_tile = Game.getObjectById('5e2e78bdda1c845d8cb2df9c');
var WP_branch_tile = Game.getObjectById('5e354b518c0dfc0f7b8dc1d0');

//reconfigurable numbers
var time_offset = 100000;
var drone_price = 1050;
var reserve_minimum = 20000;

//memory init
//if (Memory.sacrificer_MAX == undefined){Memory.sacrificer_MAX = 3;}
if (Memory.architect_MAX == undefined){Memory.architect_MAX = 1;}
if (Memory.probe_MAX == undefined){Memory.probe_MAX = 3;}
if (Memory.drone_MAX == undefined){Memory.drone_MAX = 2;}
if (Memory.energiser_MAX == undefined){Memory.energiser_MAX = 1;}
if (Memory.supplicant_MAX == undefined){Memory.supplicant_MAX = 1;}
if (Memory.wall_threshold == undefined){Memory.wall_threshold = 50000;}
if (Memory.rampart_threshold == undefined){Memory.rampart_threshold = 50000;}


module.exports.loop = function(){
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    
    //auto-spawn algorithm...
    //count unit population by role
    var emergencyDrone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone');
    //var sacrificer_gang = _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer');
    var architect_gang = _.filter(Game.creeps, creep => creep.memory.role == 'architect');
    var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
    var assimilator_lone = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator');
    //var assimilator_lone2 = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2');
    var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
    var energiser_gang = _.filter(Game.creeps, creep => creep.memory.role == 'energiser');
    var acolyte_lone = _.filter(Game.creeps, creep => creep.memory.role == 'acolyte');
    var supplicant_gang = _.filter(Game.creeps, creep => creep.memory.role == 'supplicant');
    
    //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
    if (drone_gang.length == 0 && emergencyDrone_gang.length == 0 &&
    nexus1.room.energyAvailable < drone_price){
        //300 cost
        if (nexus1.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE],
        'EmergencyDrone-' + Game.time % time_offset, {memory: {role: 'emergencyDrone'}}) == 0){
            console.log('<<<EmergencyDrone-' + Game.time % time_offset + ' spawning.>>>');
            Game.notify('Emergency drone deployed',0);
        }
    }
    
    //prioritising each role in certain amts...
    //without assimilators, there is no usable energy
    if (assimilator_lone.length < 1){
        //550 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],
        'Assimilator-' + Game.time % time_offset, {memory: {role: 'assimilator'}}) == 0){
            console.log('Assimilator-' + Game.time % time_offset + ' spawning.');
        }
    }
    /*
    else if (assimilator_lone2.length < 1){
        //550 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],
        'AssimilatorBETA-' + Game.time % time_offset, {memory: {role: 'assimilator2'}}) == 0){
            console.log('AssimilatorBETA-' + Game.time % time_offset + ' spawning.');
        }
    }
    */
    //without drones, nothing else may spawn
    else if (drone_gang.length < Memory.drone_MAX){
        //1050 cost
        if (Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Drone-' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('Drone-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without energisers, the room is defenceless
    else if (energiser_gang.length < Memory.energiser_MAX){
        //750 cost
        if (Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Energiser-' + Game.time % time_offset, {memory: {role: 'energiser'}}) == 0){
            console.log('Energiser-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without sacrificers, the room will level down
    /*
    else if (sacrificer_gang.length < sacrificer_MAX){
        //1000 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Sacrificer-' + Game.time % time_offset, {memory: {role: 'sacrificer'}}) == 0){
            console.log('Sacrificer-' + Game.time % time_offset + ' spawning.');
        }
    }
    */
    //without acolytes, supplicants cannot work
    else if (acolyte_lone.length < 1){
        //900 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE],
        'Acolyte-' + Game.time % time_offset, {memory: {role: 'acolyte'}}) == 0){
            console.log('Acolyte-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without supplicants, the room will level down
    else if (supplicant_gang.length < Memory.supplicant_MAX){
        //1800 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        WORK,WORK,WORK,
        CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Supplicant-' + Game.time % time_offset, {memory: {role: 'supplicant'}}) == 0){
            console.log('Supplicant-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without probes, structures are not maintained
    else if (probe_gang.length < Memory.probe_MAX){
        //1200 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Probe-' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
            console.log('Probe-' + Game.time % time_offset + ' spawning.');
        }
    }
    //without architects, nothing new can be built
    else if (architect_gang.length < Memory.architect_MAX){
        //1800 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Architect-' + Game.time % time_offset, {memory: {role: 'architect'}}) == 0){
            console.log('Architect-' + Game.time % time_offset + ' spawning.');
        }
    }
    
    
    //assign AI's to each unit type...
    //main room
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        if (unit.memory.role == 'emergencyDrone'){
            emergencyDrone.run(unit, nexus1);
        }
        else if (unit.memory.role == 'assimilator'){
            assimilator.run(unit, source_n1_1, canister_n1_1);
        }
        /*
        else if (unit.memory.role == 'assimilator2'){
            assimilator.run(unit, source_n1_2, warpprism_branch);
        }
        */
        else if (unit.memory.role == 'drone'){
            drone.run(unit, nexus1);
        }
        else if (unit.memory.role == 'energiser'){
            energiser.run(unit, nexus1);
        }
        else if (unit.memory.role == 'acolyte'){
            acolyte.run(unit, source_n1_2, warpprism_main, warpprism_branch, WP_branch_tile);
        }
        else if (unit.memory.role == 'supplicant'){
            supplicant.run(unit, nexus1, warpprism_main, warpprism_branch, WP_main_tile);
        }
        else if (unit.memory.role == 'probe'){
            probe.run(unit, nexus1, Memory.wall_threshold);
        }
        else if (unit.memory.role == 'architect'){
            architect.run(unit, nexus1, reserve_minimum);
        }
        else if (unit.memory.role == 'specialist'){
            specialist.run(unit, nexus1);
        }
    }
    
    
    //assign AI's to each tower
    khaydarinmonolith.run(tower_n1_1,Memory.wall_threshold,Memory.rampart_threshold);
    khaydarinmonolith.run(tower_n1_2,Memory.wall_threshold,Memory.rampart_threshold);
}