var drone = require('drone.AI');
var housekeeper = require('housekeeper.AI');
var craftsman = require('craftsman.AI');
var probe = require('probe.AI');
var zealot = require('zealot.AI');

var time_offset = 100000;

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
    var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
    var housekeeper_gang = _.filter(Game.creeps, creep => creep.memory.role == 'housekeeper');
    var craftsman_gang = _.filter(Game.creeps, creep => creep.memory.role == 'craftsman');
    var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
    
    //top priority: spawn a cheap emergency drone if 0 drones are in play
    if (drone_gang.length == 0){
        //300 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,MOVE],
        'emergencyDrone' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('---emergencyDrone' + Game.time % time_offset + ' spawning.---');
        }
    }
    
    //prioritising certain each role in certain amts
    if (drone_gang.length < 3){
        //500 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        'Drone' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('Drone' + Game.time % time_offset + ' spawning.');
        }
    }
    else if (housekeeper_gang.length < 3){
        //400 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        'Housekeeper' + Game.time % time_offset, {memory: {role: 'housekeeper'}}) == 0){
            console.log('Housekeeper' + Game.time % time_offset + ' spawning.');
        }
    }
    else if (probe_gang.length < 1){
        //400 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE],
        'Probe' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
            console.log('Probe' + Game.time % time_offset + ' spawning.');
        }
    }
    else if (craftsman_gang.length < 3){
        //500 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE],
        'Craftsman' + Game.time % time_offset, {memory: {role: 'craftsman'}}) == 0){
            console.log('Craftsman' + Game.time % time_offset + ' spawning.');
        }
    }
    
    //all priorities satisfied
    else{
        //550 cost
        if (Game.spawns['Spawn1'].spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],
        'excessCraftsman' + Game.time % time_offset, {memory: {role: 'craftsman'}}) == 0){
            console.log('excessCraftsman' + Game.time % time_offset + ' spawning.');
        }
    }
    
    
    //assign AI's to each unit type
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        if (unit.memory.role == 'drone'){
            drone.run(unit);
        }
        else if (unit.memory.role == 'housekeeper'){
            housekeeper.run(unit);
        }
        else if (unit.memory.role == 'craftsman'){
            craftsman.run(unit);
        }
        else if (unit.memory.role == 'probe'){
            probe.run(unit);
        }
        else if (unit.memory.role == 'zealot'){
            zealot.run(unit);
        }
    }
}