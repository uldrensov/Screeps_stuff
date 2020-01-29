//QoL status report script
//execute by typing the following line into console:
    //require('statusreport').run(1)

module.exports = {
    run: function(room_num){
        
        //validate input argument
        if (room_num == 1){
            var nexus = Game.spawns['Spawn1'];
        }
        else{
            return 'INVALID ROOM NUMBER';
        }
        
        
        //census...
        //count unit population by role
        var emergencyDrone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone');
        var A_assimilator = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator1');
            var A_status = A_assimilator.length? 'ONLINE':'OFFLINE';
        var B_assimilator = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2');
            var B_status = B_assimilator.length? 'ONLINE':'OFFLINE';
        var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone');
        var housekeeper_gang = _.filter(Game.creeps, creep => creep.memory.role == 'housekeeper');
        var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe');
        var craftsman_gang = _.filter(Game.creeps, creep => creep.memory.role == 'craftsman');
        
        //determine underpopulation deadlock status
        var emergencyDrone_status = 'Emergency drones: ' + emergencyDrone_gang.length;
        if (emergencyDrone_gang.length > 0){
            emergencyDrone_status = drone_status + ' (ATTENTION)';
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
        
        
        //room state...
        //determine spawn energy capacity
        var energy_count = nexus.room.energyAvailable;
        
        //count structures below a certain HP thresholds
        var structs_25 = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .25
                && structure.structureType != STRUCTURE_WALL);
            }
        });
        var structs_50 = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .5
                && structure.structureType != STRUCTURE_WALL);
            }
        });
        var structs_75 = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax * .75
                && structure.structureType != STRUCTURE_WALL);
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
        console.log(emergencyDrone_status);
        console.log('A. Assimilator: ' + A_status);
        console.log('B. Assimilator: ' + B_status);
        console.log('Drones: ' + drone_gang.length);
        console.log('Housekeepers: ' + housekeeper_gang.length);
        console.log('Probes: ' + probe_gang.length);
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