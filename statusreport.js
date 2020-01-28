//QoL status report script
//execute by typing the following line into console:
    //require('statusreport').run(1)

module.exports = {
    run: function(room_num){
        
        try{
            if (room_num == 1){
                var nexus = Game.spawns['Spawn1'];
            }
            else{
                return 'INVALID ROOM NUMBER';
            }
        }
        catch{
            return 'INVALID ARGUMENT';
        }
        
        
        //count unit population by role
        var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
        var housekeeper_gang = _.filter(Game.creeps, creep => creep.memory.role == 'housekeeper');
        var craftsman_gang = _.filter(Game.creeps, creep => creep.memory.role == 'craftsman');
        var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
        var energy_count = nexus.room.energyAvailable;
        
        //determine underpopulation deadlock status
        var drone_status = 'Drones:' + drone_gang.length;
        if (drone_gang.length == 0){
            drone_status = drone_status + ' (EMERGENCY)';
        }
        
        //determine time until next unit death
        var mortis = CREEP_LIFE_TIME;
        var shindeiru = 'null';
        for (var name in Game.creeps){
            if (Game.creeps[name].ticksToLive < mortis){
                mortis = Game.creeps[name].ticksToLive;
                shindeiru = name;
            }
        }
        
        
        //count structures below a certain HP thresholds...
        //under 25%
        var structs_25 = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .25);
            }
        });
        //under 50%
        var structs_50 = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .5);
            }
        });
        //under 75%
        var structs_75 = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .75);
            }
        });
        
        //determine structural integrity status
        var struct_status = 'OK';
        if (structs_25.length){
            struct_status = 'PERIL';
        }
        else if (structs_50.length){
            struct_status = 'DANGER';
        }
        else if (structs_75.length){
            struct_status = 'WARNING';
        }
        
        
        //write report...
        console.log('*****STATUS REPORT*****');
        console.log(' ');
        
        //unit census
        console.log('(--Census--)');
        console.log(drone_status);
        console.log('Housekeepers: ' + housekeeper_gang.length);
        console.log('Probes:' + probe_gang.length);
        console.log('Craftsmen: ' + craftsman_gang.length);
        console.log('NEXT DEATH: ' + shindeiru + '; ' + mortis + ' ticks');
        console.log(' ');
        
        //state of the room
        console.log('(--Room status--)');
        console.log('Spawning power: ' + energy_count);
        console.log('Structure status: ' + struct_status);
        console.log(' ');
        
        return '*****END OF REPORT*****';
    }
};