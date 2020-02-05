//QoL status report script
//execute by typing the following line into console:
    //require('statusreport').run(0)

module.exports = {
    run: function(room_num){
        
        var nexi = [Game.spawns['Spawn1'], Game.spawns['Spawn2']];
        
        
        //arg validation
        switch (room_num){
            case 0:
                break;
            case 1:
                break;
            default:
                return 'INVALID ROOM NUMBER';
                break;
        }
        
        //memory validation
        if (Memory.wall_threshold == undefined || Memory.rampart_threshold == undefined ||
        Memory.architect_MAX == undefined || Memory.probe_MAX == undefined ||
        Memory.drone_MAX == undefined || Memory.energiser_MAX == undefined ||
        Memory.supplicant_MAX == undefined || Memory.fanatic_MAX == undefined ||
        Memory.specialist_MAX == undefined || Memory.saviour_MAX == undefined){
            return 'ERROR: main.js failed to initialise memory';
        }
        
        
        //census...
        //count unit population by role
        var emergencyDrone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone' &&
            creep.room == nexi[room_num].room);
        var assimilator_lone = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator' &&
            creep.room == nexi[room_num].room);
        /*
        var assimilator_lone2 = _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2' &&
            creep.room == nexi[room_num].room);
        */
        var drone_gang = _.filter(Game.creeps, creep => creep.memory.role == 'drone' &&
            creep.room == nexi[room_num].room);
        var energiser_gang = _.filter(Game.creeps, creep => creep.memory.role == 'energiser' &&
            creep.room == nexi[room_num].room);
        var sacrificer_gang = _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer' &&
            creep.room == nexi[room_num].room);
        var acolyte_lone = _.filter(Game.creeps, creep => creep.memory.role == 'acolyte' &&
            creep.room == nexi[room_num].room);
        var supplicant_gang = _.filter(Game.creeps, creep => creep.memory.role == 'supplicant' &&
            creep.room == nexi[room_num].room);
        var probe_gang = _.filter(Game.creeps, creep => creep.memory.role == 'probe' &&
            creep.room == nexi[room_num].room);
        var architect_gang = _.filter(Game.creeps, creep => creep.memory.role == 'architect' &&
            creep.room == nexi[room_num].room);
        var fanatic_gang = _.filter(Game.creeps, creep => creep.memory.role == 'fanatic' &&
            creep.room == nexi[room_num].room);
        var specialist_gang = _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
        var saviour_gang = _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
        
        //determine underpopulation deadlock status
        var emergencyDrone_status = 'Emergency drones: ' + emergencyDrone_gang.length;
        if (emergencyDrone_gang.length > 0){
            emergencyDrone_status = emergencyDrone_status + ' >>>ATTENTION<<<';
        }
        
        //determine time until next unit death
        var mortis = CREEP_LIFE_TIME;
        var shindeiru = 'null';
        for (var name in Game.creeps){
            if (Game.creeps[name].ticksToLive < mortis && Game.creeps[name].room == nexi[room_num].room){
                mortis = Game.creeps[name].ticksToLive;
                shindeiru = name;
            }
        }
        
        
        //room state...
        //determine extension capacity
        var ext_energy = nexi[room_num].room.energyAvailable
        - nexi[room_num].store.getUsedCapacity(RESOURCE_ENERGY);
        
        //determine total canister capacity
        var canisters = nexi[room_num].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        });
        if (canisters.length){
            var can_energy = 0;
            for (let i=0; i<canisters.length; i++){
                can_energy += canisters[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        
        //count worn structures
        var worn_structs = nexi[room_num].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART);
            }
        });
        
        //count worn walls
        var worn_walls = nexi[room_num].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < Memory.wall_threshold
                && structure.structureType == STRUCTURE_WALL);
            }
        });
        
        //determine structure status
        var weakest_struct;
        var weakstruct_perc;
        if (worn_structs.length){
            weakest_struct = worn_structs[0];
            for (let i=1; i<worn_structs.length; i++){
                if (worn_structs[i].hits / worn_structs[i].hitsMax
                < weakest_struct.hits / weakest_struct.hitsMax){
                    weakest_struct = worn_structs[i];
                }
            }
            weakstruct_perc = (weakest_struct.hits / weakest_struct.hitsMax) * 100;
            weakstruct_perc = weakstruct_perc.toFixed(3);
        }
        else{
            weakest_struct = 'STRUCTURES ARE PRISTINE';
            weakstruct_perc = 1;
        }
        
        //determine wall status
        var weakest_wall;
        var weakwall_perc;
        if (worn_walls.length){
            weakest_wall = worn_walls[0];
            for (let i=1; i<worn_walls.length; i++){
                if (worn_walls[i].hits / Memory.wall_threshold
                < weakest_wall.hits / Memory.wall_threshold){
                    weakest_wall = worn_walls[i];
                }
            }
            weakwall_perc = (weakest_wall.hits / Memory.wall_threshold) * 100;
            weakwall_perc = weakwall_perc.toFixed(3);
        }
        else{
            weakest_wall = 'WALLS ARE PRISTINE';
            weakwall_perc = 100;
        }
        
        
        //write report...
        console.log('*****STATUS REPORT*****');
        console.log(' ');
        
        //unit census
        console.log('<<<--Census-->>>');
        console.log(emergencyDrone_status);
        console.log('Assimilator: ' + assimilator_lone.length + '/1');
        //console.log('Assimilator 2: ' + assimilator_lone2.length + '/1');
        console.log('Drones: ' + drone_gang.length + '/' + Memory.drone_MAX[room_num]);
        console.log('Energisers: ' + energiser_gang.length + '/' + Memory.energiser_MAX[room_num]);
        console.log('Sacrificers: ' + sacrificer_gang.length + '/' + Memory.sacrificer_MAX[room_num]);
        console.log('Acolyte: ' + acolyte_lone.length + '/' + Memory.acolyte_MAX[room_num]);
        console.log('Supplicants: ' + supplicant_gang.length + '/' + Memory.supplicant_MAX[room_num]);
        console.log('Probes: ' + probe_gang.length + '/' + Memory.probe_MAX[room_num]);
        console.log('Architects: ' + architect_gang.length + '/' + Memory.architect_MAX[room_num]);
        console.log('Fanatics: ' + fanatic_gang.length + '/' + Memory.fanatic_MAX[room_num]);
        console.log('Specialists: ' + specialist_gang.length + '/' + Memory.specialist_MAX);
        console.log('Saviour: ' + saviour_gang.length + '/' + Memory.saviour_MAX);
        console.log('NEXT DEATH: ' + shindeiru + '; ' + mortis + ' ticks');
        console.log(' ');
        
        //state of the room
        console.log('<<<--Room status-->>>');
        console.log('Spawning energy: ' + ext_energy + ' reserve, '
        + nexi[room_num].store.getUsedCapacity(RESOURCE_ENERGY) + ' main');
        if (nexi[room_num].room.storage != undefined){
            console.log('Vault energy: ' + nexi[room_num].room.storage.store.getUsedCapacity(RESOURCE_ENERGY));
        }
        if (canisters.length){
            console.log('Canister energy: ' + can_energy);
        }
        console.log('Weakest structure: ' + weakstruct_perc + '% -> ' + weakest_struct);
        console.log('Weakest wall: ' + weakwall_perc + '% -> ' + weakest_wall);
        console.log(' ');
        
        return '*****END OF REPORT*****';
    }
};