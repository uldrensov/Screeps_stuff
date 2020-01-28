//unit AI's
var drone = require('drone.AI');
var housekeeper = require('housekeeper.AI');
var craftsman = require('craftsman.AI');
var probe = require('probe.AI');
var zealot = require('zealot.AI');

//tower AI's
var shieldbattery = require('shieldbattery.AI');

//refactorable structure variables
var nexus1 = Game.spawns['Spawn1'];
var shieldbattery1 = Game.getObjectById('5e2f4a33e8af4a1c6459ccd8');

//consts
var time_offset = 100000;


module.exports.loop = function(){
    
    //energy source depletion notification
    /*
    var mineral_field = Game.getObjectById('5bbcae989099fc012e639475');
    if (mineral_field.energy == 0){
        console.log('MINERAL FIELD DEPLETED...REGEN IN ' + mineral_field.ticksToRegeneration);
    }
    */
    
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
    var sentry_gang = _.filter(Game.creeps, creep => creep.memory.role == 'sentry');
    
    //top priority: spawn a cheap emergency drone if 0 drones are in play
    if (drone_gang.length == 0){
        //300 cost
        if (nexus1.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE],
        'emergencyDrone' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('---emergencyDrone' + Game.time % time_offset + ' spawning.---');
        }
    }
    
    //prioritising each role in certain amts...
    //without drones, nothing else may spawn
    if (drone_gang.length < 3){
        //800 cost
        if (nexus1.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        'Drone' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
            console.log('Drone' + Game.time % time_offset + ' spawning.');
        }
    }
    //without housekeepers, the room will level down
    else if (housekeeper_gang.length < 3){
        //800 cost
        if (nexus1.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        'Housekeeper' + Game.time % time_offset, {memory: {role: 'housekeeper'}}) == 0){
            console.log('Housekeeper' + Game.time % time_offset + ' spawning.');
        }
    }
    //without probes, towers and structures are not maintained
    else if (probe_gang.length < 1){
        //800 cost
        if (nexus1.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        'Probe' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
            console.log('Probe' + Game.time % time_offset + ' spawning.');
        }
    }
    //without craftsmen, nothing new can be built
    else if (craftsman_gang.length < 3){
        //800 cost
        if (nexus1.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        'Craftsman' + Game.time % time_offset, {memory: {role: 'craftsman'}}) == 0){
            console.log('Craftsman' + Game.time % time_offset + ' spawning.');
        }
    }
    
    //spawn extra housekeepers if all other priorities are satisfied
    else{
        //800 cost
        if (nexus1.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
        'goldenHousekeeper' + Game.time % time_offset, {memory: {role: 'housekeeper'}}) == 0){
            console.log('goldenHousekeeper' + Game.time % time_offset + ' spawning.');
        }
    }
    
    
    //assign AI's to each unit type...
    //main room
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        if (unit.memory.role == 'drone'){
            drone.run(unit,nexus1);
        }
        else if (unit.memory.role == 'housekeeper'){
            housekeeper.run(unit,nexus1);
        }
        else if (unit.memory.role == 'craftsman'){
            craftsman.run(unit,nexus1);
        }
        else if (unit.memory.role == 'probe'){
            probe.run(unit,nexus1);
        }
    }
    
    
    //assign AI's to each tower
    shieldbattery.run(shieldbattery1);
}