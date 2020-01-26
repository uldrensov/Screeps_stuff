var drone = require('drone.AI');
var housekeeper = require('housekeeper.AI');
var craftsman = require('craftsman.AI');

module.exports.loop = function(){
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' unit lifetime has expired.');
        }
    }
    
    
    //auto-replenish certain amounts of each unit
    var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
    var housekeeper_gang = _.filter(Game.creeps, creep => creep.memory.role == 'housekeeper');
    var craftsman_gang = _.filter(Game.creeps, creep => creep.memory.role == 'craftsman');
    
    //prioritising types...
    if (housekeeper_gang.length < 2){
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'Housekeeper' + Game.time, {memory: {role: 'housekeeper'}});
    }
    if (drone_gang.length < 3){
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'Drone' + Game.time, {memory: {role: 'drone'}});
    }
    if (craftsman_gang.length < 3){
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], 'Craftsman' + Game.time, {memory: {role: 'craftsman'}});
    }
    
    
    //assign AI's to each unit type
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        if (unit.memory.role == 'drone'){
            drone.run(unit);
        }
        else if(unit.memory.role == 'housekeeper'){
            housekeeper.run(unit);
        }
        else if(unit.memory.role == 'craftsman'){
            craftsman.run(unit);
        }
    }
}