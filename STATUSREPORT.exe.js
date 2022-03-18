//executable script: creates a report providing details about a particular room
    //require('STATUSREPORT.exe').run(0)

var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (room_num < 0 || room_num >= SD.spawner_id.length) return 'INVALID ROOM NUMBER';
        
        //memory validation
        if
        (Memory.wall_threshold ==               undefined || Memory.rampart_threshold ==            undefined || Memory.sacrificer_MAX[room_num] ==     undefined || Memory.architect_MAX[room_num] ==          undefined ||
        Memory.probe_MAX[room_num] ==           undefined || Memory.assimilator_MAX[room_num] ==    undefined || Memory.assimilator2_MAX[room_num] ==   undefined || Memory.drone_MAX[room_num] ==              undefined ||
        Memory.energiser_MAX[room_num] ==       undefined || Memory.retrieverDrone_MAX[room_num] == undefined || Memory.recalibrator_MAX[room_num] ==   undefined || Memory.orbitalAssimilator_MAX[room_num] == undefined ||
        Memory.orbitalDrone_MAX[room_num] ==    undefined || Memory.bloodhunter_MAX[room_num] ==    undefined || Memory.enforcer_MAX[room_num] ==       undefined || Memory.purifier_MAX[room_num] ==           undefined ||
        Memory.acolyte_MAX[room_num] ==         undefined || Memory.acolyte2_MAX[room_num] ==       undefined || Memory.adherent_MAX[room_num] ==       undefined || Memory.nullAdherent_MAX[room_num] ==       undefined ||
        Memory.supplicant_MAX[room_num] ==      undefined || Memory.nullSupplicant_MAX[room_num] == undefined || Memory.ancientDrone_MAX[room_num] ==   undefined || Memory.ancientAssimilator_MAX[room_num] == undefined ||
        Memory.specialist_MAX ==                undefined || Memory.saviour_MAX ==                  undefined || Memory.mineral_type[room_num] ==       undefined)
            return 'ERROR: Memory validation failed';
        
        
        var nexus = Game.getObjectById(SD.spawner_id[room_num][0]);
        
        
        //census...
        //count unit population by role
        var emergencyDrone_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.room == nexus.room);
        var drone_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'drone'                 && creep.room == nexus.room);
        var assimilator_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'           && creep.room == nexus.room);
        var assimilator2_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'          && creep.room == nexus.room);
        var energiser_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'energiser'             && creep.room == nexus.room);
        var retrieverDrone_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'retrieverDrone'        && creep.room == nexus.room);
        var sacrificer_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.room == nexus.room);
        var acolyte_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'               && creep.room == nexus.room);
        var acolyte2_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'              && creep.room == nexus.room);
        var adherent_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'adherent'              && creep.room == nexus.room);
        var nullAdherent_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'nullAdherent'          && creep.room == nexus.room);
        var supplicant_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.room == nexus.room);
        var nullSupplicant_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'nullSupplicant'        && creep.room == nexus.room);
        var probe_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'probe'                 && creep.room == nexus.room);
        var recalibrator_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'recalibrator'          && creep.memory.home == nexus.room.name);
        var orbitalAssimilator_gang =   _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator'    && creep.memory.home == nexus.room.name);
        var orbitalDrone_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'orbitalDrone'          && creep.memory.home == nexus.room.name);
        var bloodhunter_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'bloodhunter'           && creep.memory.home == nexus.room.name);
        var enforcer_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'enforcer'              && creep.memory.home == nexus.room.name);
        var purifier_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'purifier'              && creep.memory.home == nexus.room.name);
        var ancientDrone_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.room == nexus.room);
        var ancientAssimilator_gang =   _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.room == nexus.room);
        var architect_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.room == nexus.room);
        var specialist_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
        var saviour_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
        
        //determine time until next unit death
        var mortis = CREEP_LIFE_TIME; //init at max life value
        var shindeiru = 'NULL';
        for (var name in Game.creeps){
            if (Game.creeps[name].ticksToLive < mortis && (Game.creeps[name].room == nexus.room || Game.creeps[name].memory.home == nexus.room.name)){
                mortis = Game.creeps[name].ticksToLive;
                shindeiru = name;
            }
        }
        
        
        //room state...
        //determine total extension/container energy
        var ext_energy = nexus.room.energyAvailable - nexus.store.getUsedCapacity(RESOURCE_ENERGY);
        
        //determine total container energy
        var can_energy = 0;
        var canisters = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        });
        if (canisters.length){
            for (let i=0; i<canisters.length; i++){
                can_energy += canisters[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        
        //determine total dropped (pickup) energy
        var scrap_energy = 0;
        var scraps = nexus.room.find(FIND_DROPPED_RESOURCES, {
            filter: resource => {
                return resource.resourceType == RESOURCE_ENERGY;
            }
        });
        if (scraps.length){
            for (let i=0; i<scraps.length; i++){
                scrap_energy += scraps[i].amount;
            }
        }
        
        //determine controller levelup percentage
        var control_perc = ((nexus.room.controller.progress / nexus.room.controller.progressTotal) * 100).toFixed(3);
        
        //count worn structures and walls
        var worn_structs = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax
                && structure.structureType != STRUCTURE_WALL
                && structure.structureType != STRUCTURE_RAMPART);
            }
        });
        var worn_walls = nexus.room.find(FIND_STRUCTURES, {
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
            weakstruct_perc = ((weakest_struct.hits / weakest_struct.hitsMax) * 100).toFixed(3);
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
                if (worn_walls[i].hits / Memory.wall_threshold < weakest_wall.hits / Memory.wall_threshold)
                    weakest_wall = worn_walls[i];
            }
            weakwall_perc = ((weakest_wall.hits / Memory.wall_threshold) * 100).toFixed(3);
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
        if (emergencyDrone_gang.length)                                                             console.log('Emergency drone: ACTIVE');
        console.log('Drones: ' + drone_gang.length + '/' + Memory.drone_MAX[room_num]);
        if (Memory.assimilator_MAX[room_num] > 0)                                                   console.log('Assimilator[I]: ' + assimilator_gang.length + '/' + Memory.assimilator_MAX[room_num]);
        if (Memory.assimilator2_MAX[room_num] > 0)                                                  console.log('Assimilator[II]: ' + assimilator2_gang.length + '/' + Memory.assimilator2_MAX[room_num]);
        console.log('Energisers: ' + energiser_gang.length + '/' + Memory.energiser_MAX[room_num]);
        if (Memory.retrieverDrone_MAX[room_num] > 0)                                                console.log('Sacrificers: ' + retrieverDrone_gang.length + '/' + Memory.retrieverDrone_MAX[room_num]);
        if (Memory.sacrificer_MAX[room_num] > 0)                                                    console.log('Sacrificers: ' + sacrificer_gang.length + '/' + Memory.sacrificer_MAX[room_num]);
        if (Memory.acolyte_MAX[room_num] > 0)                                                       console.log('Acolyte[I]: ' + acolyte_gang.length + '/' + Memory.acolyte_MAX[room_num]);
        if (Memory.acolyte2_MAX[room_num] > 0)                                                      console.log('Acolyte[II]: ' + acolyte2_gang.length + '/' + Memory.acolyte2_MAX[room_num]);
        if (Memory.adherent_MAX[room_num] > 0)                                                      console.log('Adherent: ' + adherent_gang.length + '/' + Memory.adherent_MAX[room_num]);
        if (Memory.nullAdherent_MAX[room_num] > 0)                                                  console.log('Null adherent: ' + nullAdherent_gang.length + '/' + Memory.nullAdherent_MAX[room_num]);
        if (Memory.supplicant_MAX[room_num] > 0)                                                    console.log('Supplicants: ' + supplicant_gang.length + '/' + Memory.supplicant_MAX[room_num]);
        if (Memory.nullSupplicant_MAX[room_num] > 0)                                                console.log('Null supplicants: ' + nullSupplicant_gang.length + '/' + Memory.nullSupplicant_MAX[room_num]);
        if (Memory.probe_MAX[room_num] > 0 && probe_gang.length)                                    console.log('Probes: ' + probe_gang.length + '/' + Memory.probe_MAX[room_num]);
            else if (Memory.probe_MAX[room_num] > 0)                                                console.log('Probes: AWAITING');
            else if (Memory.probe_MAX[room_num] < 0 && probe_gang.length)                           console.log('Probes: STANDING');
            else if (Memory.probe_MAX[room_num] < 0)                                                console.log('Probes: DORMANT');
        if (Memory.recalibrator_MAX[room_num] > 0 && recalibrator_gang.length)                      console.log('Recalibrator: ACTIVE');
            else if (Memory.recalibrator_MAX[room_num] > 0)                                         console.log('Recalibrator: AWAITING');
            else if (Memory.recalibrator_MAX[room_num] < 0 && recalibrator_gang.length)             console.log('Recalibrator: STANDING');
            else if (Memory.recalibrator_MAX[room_num] < 0)                                         console.log('Recalibrator: WITHHELD');
        if (Memory.orbitalAssimilator_MAX[room_num] > 0)                                            console.log('Orbital assimilators: ' + orbitalAssimilator_gang.length + '/' + Memory.orbitalAssimilator_MAX[room_num]);
            else if (Memory.orbitalAssimilator_MAX[room_num] < 0 && orbitalAssimilator_gang.length) console.log('Orbital assimilators: ' + orbitalAssimilator_gang.length + ' (STANDING)');
            else if (Memory.orbitalAssimilator_MAX[room_num] < 0)                                   console.log('Orbital assimilators: DORMANT');
        if (Memory.orbitalDrone_MAX[room_num] > 0)                                                  console.log('Orbital drones: ' + orbitalDrone_gang.length + '/' + Memory.orbitalDrone_MAX[room_num]);
            else if (Memory.orbitalDrone_MAX[room_num] < 0 && orbitalDrone_gang.length)             console.log('Orbital drones: ' + orbitalDrone_gang.length + ' (STANDING)');
            else if (Memory.orbitalDrone_MAX[room_num] < 0)                                         console.log("Orbital drones: DORMANT");
        if (Memory.bloodhunter_MAX[room_num] > 0)                                                   console.log('Blood hunter: ' + bloodhunter_gang.length + '/' + Memory.bloodhunter_MAX[room_num]);
            else if (Memory.bloodhunter_MAX[room_num] < 0 && bloodhunter_gang.length)               console.log('Blood hunter: ' + bloodhunter_gang.length + ' (STANDING)');
            else if (Memory.bloodhunter_MAX[room_num] < 0)                                          console.log("Blood hunter: DORMANT");
        if (Memory.enforcer_MAX[room_num] > 0)                                                      console.log('Enforcer: ' + enforcer_gang.length + '/' + Memory.enforcer_MAX[room_num]);
            else if (Memory.enforcer_MAX[room_num] < 0 && enforcer_gang.length)                     console.log('Enforcer: ' + enforcer_gang.length + ' (STANDING)');
            else if (Memory.enforcer_MAX[room_num] < 0)                                             console.log("Enforcer: DORMANT");
        if (Memory.purifier_MAX[room_num] > 0)                                                      console.log('Purifier: ' + purifier_gang.length + '/' + Memory.purifier_MAX[room_num]);
        if (Memory.ancientDrone_MAX[room_num] > 0)                                                  console.log('Ancient drone: ' + ancientDrone_gang.length + '/' + Memory.ancientDrone_MAX[room_num]);
            else if (Memory.ancientDrone_MAX[room_num] < 0 && ancientDrone_gang.length)             console.log('Ancient drone: ' + ancientDrone_gang.length + ' (STANDING)');
            else if (Memory.ancientDrone_MAX[room_num] < 0)                                         console.log('Ancient drone: DORMANT');
        if (Memory.ancientAssimilator_MAX[room_num] > 0)                                            console.log('Ancient assimilator: ' + ancientAssimilator_gang.length + '/' + Memory.ancientAssimilator_MAX[room_num]);
            else if (Memory.ancientAssimilator_MAX[room_num] < 0 && ancientAssimilator_gang.length) console.log('Ancient assimilator: ' + ancientAssimilator_gang.length + ' (STANDING)');
            else if (Memory.ancientAssimilator_MAX[room_num] < 0)                                   console.log('Ancient assimilator: DORMANT');
        if (Memory.architect_MAX[room_num] > 0)                                                     console.log('Architects: ' + architect_gang.length + '/' + Memory.architect_MAX[room_num]);
        if (Memory.specialist_MAX > 0)                                                              console.log('Specialists: ' + specialist_gang.length + '/' + Memory.specialist_MAX);
        if (Memory.saviour_MAX > 0)                                                                 console.log('Saviours: ' + saviour_gang.length + '/' + Memory.saviour_MAX);
        console.log('NEXT DEATH: ' + shindeiru + '; ' + mortis + ' ticks');
        console.log(' ');
        
        //state of the room
        console.log('<<<--Room status-->>>');
        if (nexus.room.controller.level < 8)                                                        console.log('Controller EXP: ' + control_perc + '% -> ' + nexus.room.controller.progress + '/' + nexus.room.controller.progressTotal);
        else                                                                                        console.log('Controller EXP: MAX');
        console.log('Spawning energy: ' + ext_energy + ' extended, ' + nexus.store.getUsedCapacity(RESOURCE_ENERGY) + ' main');
        if (nexus.room.storage != undefined){                                                       console.log('Vault contents: ' + nexus.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) + ' [energy]; ' +
                                                                                                        nexus.room.storage.store.getUsedCapacity(Memory.mineral_type[room_num].mineralType) + ' [' + Memory.mineral_type[room_num].mineralType + ']');
                                                                                                    console.log('Vault space remaining: ' + nexus.room.storage.store.getFreeCapacity());}
        if (nexus.room.terminal != undefined)                                                       console.log('Terminal contents: ' + nexus.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) + ' [energy]; ' +
                                                                                                        nexus.room.terminal.store.getUsedCapacity(Memory.mineral_type[room_num].mineralType) + ' [' + Memory.mineral_type[room_num].mineralType + ']');
        if (canisters.length)                                                                       console.log('Total canister energy: ' + can_energy);
        console.log('Total dropped energy: ' + scrap_energy);
        console.log('Weakest structure: ' + weakstruct_perc + '% -> ' + weakest_struct);
        console.log('Weakest wall: ' + weakwall_perc + '% -> ' + weakest_wall);
        console.log(' ');
        
        return '*****END OF REPORT*****';
    }
};