//QoL status report script
//execute by typing the following line into console:
    //require('statusreport').run(0)

module.exports = {
    run: function(room_num){
        
        var nexi = [Game.spawns['Spawn1'], Game.spawns['Spawn2'], Game.spawns['Spawn3']];
        
        
        //arg validation
        if (!(room_num >= 0 && room_num < nexi.length)){
            return 'INVALID ROOM NUMBER';
        }
        
        //memory validation
        if
        (Memory.wall_threshold ==           undefined || Memory.rampart_threshold ==            undefined || Memory.sacrificer_MAX[room_num] ==         undefined || Memory.architect_MAX[room_num] ==      undefined ||
        Memory.probe_MAX[room_num] ==       undefined || Memory.assimilator_MAX[room_num] ==    undefined || Memory.assimilator2_MAX[room_num] ==       undefined || Memory.drone_MAX[room_num] ==          undefined ||
        Memory.energiser_MAX[room_num] ==   undefined || Memory.recalibrator_MAX[room_num] ==   undefined || Memory.orbitalAssimilator_MAX[room_num] == undefined || Memory.orbitalDrone_MAX[room_num] ==   undefined ||
        Memory.bloodhunter_MAX[room_num] == undefined || Memory.acolyte_MAX[room_num] ==        undefined || Memory.acolyte2_MAX[room_num] ==           undefined || Memory.adherent_MAX[room_num] ==       undefined ||
        Memory.supplicant_MAX[room_num] ==  undefined || Memory.ancientDrone_MAX[room_num] ==   undefined || Memory.ancientAssimilator_MAX[room_num] == undefined || Memory.specialist_MAX ==               undefined ||
        Memory.saviour_MAX ==               undefined)
        {
            return 'ERROR: main.js failed to initialise memory';
        }
        
        
        //census...
        //count unit population by role
        var emergencyDrone_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.room == nexi[room_num].room);
        var assimilator_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'           && creep.room == nexi[room_num].room);
        var assimilator2_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'          && creep.room == nexi[room_num].room);
        var drone_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'drone'                 && creep.room == nexi[room_num].room);
        var energiser_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'energiser'             && creep.room == nexi[room_num].room);
        var sacrificer_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.room == nexi[room_num].room);
        var acolyte_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'               && creep.room == nexi[room_num].room);
        var acolyte2_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'              && creep.room == nexi[room_num].room);
        var adherent_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'adherent'              && creep.room == nexi[room_num].room);
        var supplicant_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.room == nexi[room_num].room);
        var probe_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'probe'                 && creep.room == nexi[room_num].room);
        var recalibrator_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'recalibrator'          && creep.memory.home == nexi[room_num].room.name);
        var orbitalAssimilator_gang =   _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator'    && creep.memory.home == nexi[room_num].room.name);
        var orbitalDrone_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'orbitalDrone'          && creep.memory.home == nexi[room_num].room.name);
        var bloodhunter_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'bloodhunter'           && creep.memory.home == nexi[room_num].room.name);
        var ancientDrone_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.room == nexi[room_num].room);
        var ancientAssimilator_gang =   _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.room == nexi[room_num].room);
        var architect_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.room == nexi[room_num].room);
        var specialist_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
        var saviour_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
        
        //special console output for emergency drones
        var emergencyDrone_status = 'Emergency drones: ' + emergencyDrone_gang.length;
        if (emergencyDrone_gang.length > 0){
            emergencyDrone_status = emergencyDrone_status + ' >>>ATTENTION<<<';
        }
        
        //determine time until next unit death
        var mortis = CREEP_LIFE_TIME;
        var shindeiru = 'NULL';
        for (var name in Game.creeps){
            if (Game.creeps[name].ticksToLive < mortis && Game.creeps[name].room == nexi[room_num].room){
                mortis = Game.creeps[name].ticksToLive;
                shindeiru = name;
            }
        }
        
        
        //room state...
        //determine total extension/container energy
        var ext_energy = nexi[room_num].room.energyAvailable
        - nexi[room_num].store.getUsedCapacity(RESOURCE_ENERGY);
        
        //determine total container energy
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
        
        //determine controller levelup percentage
        var control_perc = (nexi[room_num].room.controller.progress / nexi[room_num].room.controller.progressTotal) * 100;
        control_perc = control_perc.toFixed(3);
        
        //count worn structures and walls
        var worn_structs = nexi[room_num].room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART);
            }
        });
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
        if (Memory.assimilator_MAX[room_num] > 0){
            console.log('Assimilator[I]: ' + assimilator_gang.length + '/' + Memory.assimilator_MAX[room_num]);
        }
        if (Memory.assimilator2_MAX[room_num] > 0){
            console.log('Assimilator[II]: ' + assimilator2_gang.length + '/' + Memory.assimilator2_MAX[room_num]);
        }
        console.log('Drones: ' + drone_gang.length + '/' + Memory.drone_MAX[room_num]);
        console.log('Energisers: ' + energiser_gang.length + '/' + Memory.energiser_MAX[room_num]);
        if (Memory.sacrificer_MAX[room_num] > 0){
            console.log('Sacrificers: ' + sacrificer_gang.length + '/' + Memory.sacrificer_MAX[room_num]);
        }
        if (Memory.acolyte_MAX[room_num] > 0){
            console.log('Acolyte[I]: ' + acolyte_gang.length + '/' + Memory.acolyte_MAX[room_num]);
        }
        if (Memory.acolyte2_MAX[room_num] > 0){
            console.log('Acolyte[II]: ' + acolyte2_gang.length + '/' + Memory.acolyte2_MAX[room_num]);
        }
        if (Memory.adherent_MAX[room_num] > 0){
            console.log('Adherent: ' + adherent_gang.length + '/' + Memory.adherent_MAX[room_num]);
        }
        if (Memory.supplicant_MAX[room_num] > 0){
            console.log('Supplicants: ' + supplicant_gang.length + '/' + Memory.supplicant_MAX[room_num]);
        }
        console.log('Probes: ' + probe_gang.length + '/' + Memory.probe_MAX[room_num]);
        console.log('Recalibrators : ' + recalibrator_gang.length + '/' + Memory.recalibrator_MAX[room_num]);
        console.log('Orbital assimilators : ' + orbitalAssimilator_gang.length + '/' + Memory.orbitalAssimilator_MAX[room_num]);
        console.log('Orbital drones : ' + orbitalDrone_gang.length + '/' + Memory.orbitalDrone_MAX[room_num]);
        if (Memory.bloodhunter_MAX[room_num] > 0){
            console.log('Blood hunters: ' + bloodhunter_gang.length + '/' + Memory.bloodhunter_MAX[room_num]);
        }
        console.log('Ancient drone : ' + ancientDrone_gang.length + '/' + Memory.ancientDrone_MAX[room_num]);
        console.log('Ancient assimilator : ' + ancientAssimilator_gang.length + '/' + Memory.ancientAssimilator_MAX[room_num]);
        if (Memory.architect_MAX[room_num] > 0){
            console.log('Architects: ' + architect_gang.length + '/' + Memory.architect_MAX[room_num]);
        }
        if (Memory.specialist_MAX > 0){
            console.log('Specialists: ' + specialist_gang.length + '/' + Memory.specialist_MAX);
        }
        if (Memory.saviour_MAX > 0){
            console.log('Saviours: ' + saviour_gang.length + '/' + Memory.saviour_MAX);
        }
        console.log('NEXT DEATH: ' + shindeiru + '; ' + mortis + ' ticks');
        console.log(' ');
        
        //state of the room
        console.log('<<<--Room status-->>>');
        console.log('Controller EXP: ' + control_perc + '% -> ' + nexi[room_num].room.controller.progress + '/' + nexi[room_num].room.controller.progressTotal);
        console.log('Spawning energy: ' + ext_energy + ' extended, '
        + nexi[room_num].store.getUsedCapacity(RESOURCE_ENERGY) + ' main');
        if (nexi[room_num].room.storage != undefined){
            console.log('Vault energy: ' + nexi[room_num].room.storage.store.getUsedCapacity(RESOURCE_ENERGY));
        }
        if (canisters.length){
            console.log('Total canister energy: ' + can_energy);
        }
        console.log('Weakest structure: ' + weakstruct_perc + '% -> ' + weakest_struct);
        console.log('Weakest wall: ' + weakwall_perc + '% -> ' + weakest_wall);
        console.log(' ');
        
        return '*****END OF REPORT*****';
    }
};