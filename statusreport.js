//QoL status report script
//execute by typing the following line into console:
    //require('statusreport').run()

module.exports = {
    run: function(){
        //count unit population by role
        var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
        var housekeeper_gang = _.filter(Game.creeps, creep => creep.memory.role == 'housekeeper');
        var craftsman_gang = _.filter(Game.creeps, creep => creep.memory.role == 'craftsman');
        var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
        var energy_count = Game.spawns['Spawn1'].room.energyAvailable;
        
        var drone_status = 'Drones:' + drone_gang.length;
        if (drone_gang.length == 0){
            drone_status = drone_status + ' (EMERGENCY)';
        }
        
        console.log(drone_status);
        console.log('Housekeepers:' + housekeeper_gang.length);
        console.log('Craftsmen:' + craftsman_gang.length);
        console.log('Probes:' + probe_gang.length);
        console.log('Stored energy:' + energy_count);
        
        return 'END OF STATUS REPORT';
    }
};