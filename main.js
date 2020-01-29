//unit AI's
var emergencyDrone = require('emergencyDrone.AI');
var housekeeper = require('housekeeper.AI');
var craftsman = require('craftsman.AI');
var probe = require('probe.AI');
var assimilator = require('assimilator.AI');
var drone = require('drone.AI');
var zealot = require('zealot.AI');
var specialist = require('specialist.AI');

//tower AI's
var shieldbattery = require('shieldbattery.AI');
var khaydarin = require('khaydarinmonolith.AI');

//reconfigurable structure variables
var nexus1 = Game.spawns['Spawn1'];
var source_n1_1 = Game.getObjectById('5bbcae989099fc012e639476');
var source_n1_2 = Game.getObjectById('5bbcae989099fc012e639475');
var canister_n1_1 = Game.getObjectById('5e30677977034e78c09bdc43');
var canister_n1_2 = Game.getObjectById('5e30fe29a7eab0eb0b0e85ab');
var tower_n1_1 = Game.getObjectById('5e2f4a33e8af4a1c6459ccd8');

//reconfigurable numbers
var time_offset = 100000;
var drone_price = 700;
var wall_threshold = 50000;


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
    var housekeeper_gang = _.filter(Game.creeps, creep => creep.memory.role == 'housekeeper');
    var craftsman_gang = _.filter(Game.creeps, creep => creep.memory.role == 'craftsman');
    var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
    var A_assimilator = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator1');
    var B_assimilator = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2');
    var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
    
    //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
    if (drone_gang.length == 0 && emergencyDrone_gang.length == 0 &&
    nexus1.room.energyAvailable < drone_price){
        //300 cost
        if (nexus1.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE],
        'emergencyDrone' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('---emergencyDrone' + Game.time % time_offset + ' spawning.---');
        }
    }
    
    //prioritising each role in certain amts...
    //without assimilators, there is no usable energy
    if (A_assimilator.length < 1){
        //550 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],
        'alphaAssimilator' + Game.time % time_offset, {memory: {role: 'assimilator1'}}) == 0){
            console.log('alphaAssimilator' + Game.time % time_offset + ' spawning.');
        }
    }
    if (B_assimilator.length < 1){
        //550 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE],
        'betaAssimilator' + Game.time % time_offset, {memory: {role: 'assimilator2'}}) == 0){
            console.log('betaAssimilator' + Game.time % time_offset + ' spawning.');
        }
    }
    //without drones, nothing else may spawn
    if (drone_gang.length < 2){
        //700 cost
        if (Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Drone' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('Drone' + Game.time % time_offset + ' spawning.');
        }
    }
    //without housekeepers, the room will level down
    else if (housekeeper_gang.length < 5){
        //1100 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Housekeeper' + Game.time % time_offset, {memory: {role: 'housekeeper'}}) == 0){
            console.log('Housekeeper' + Game.time % time_offset + ' spawning.');
        }
    }
    //without probes, towers and structures are not maintained
    else if (probe_gang.length < 3){
        //1000 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE],
        'Probe' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
            console.log('Probe' + Game.time % time_offset + ' spawning.');
        }
    }
    //without craftsmen, nothing new can be built
    else if (craftsman_gang.length < 0){
        //1100 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,WORK,WORK,
        CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
        'Craftsman' + Game.time % time_offset, {memory: {role: 'craftsman'}}) == 0){
            console.log('Craftsman' + Game.time % time_offset + ' spawning.');
        }
    }
    
    
    //assign AI's to each unit type...
    //main room
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        if (unit.memory.role == 'emergencyDrone'){
            emergencyDrone.run(unit,nexus1);
        }
        else if (unit.memory.role == 'assimilator1'){
            assimilator.run(unit,source_n1_1,canister_n1_1);
        }
        else if (unit.memory.role == 'assimilator2'){
            assimilator.run(unit,source_n1_2,canister_n1_2);
        }
        else if (unit.memory.role == 'drone'){
            drone.run(unit,nexus1);
        }
        else if (unit.memory.role == 'housekeeper'){
            housekeeper.run(unit,nexus1);
        }
        else if (unit.memory.role == 'probe'){
            probe.run(unit,nexus1);
        }
        else if (unit.memory.role == 'craftsman'){
            craftsman.run(unit,nexus1);
        }
        else if (unit.memory.role == 'specialist'){
            specialist.run(unit,nexus1);
        }
    }
    
    
    //assign AI's to each tower
    shieldbattery.run(tower_n1_1,wall_threshold);
    //khaydarin.run(tower_n1_1);
}