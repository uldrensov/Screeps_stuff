//executable script: creates a detailed report providing details about a particular room
    //require('STATUSREPORT.exe').run(0)

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(room_num){
        
        //arg validation
        if (room_num < 0 || room_num >= SD.spawner_id.length)
            return 'STATUSREPORT:: INVALID ROOM NUMBER';
        

        //memory validation
        if
            (Memory.wall_threshold ==               undefined || Memory.rampart_threshold ==                undefined || Memory.mineral_type[room_num] ==           undefined ||
            Memory.assimilator_MAX[room_num] ==     undefined || Memory.assimilator2_MAX[room_num] ==       undefined || Memory.drone_MAX[room_num] ==              undefined ||
            Memory.energiser_MAX[room_num] ==       undefined || Memory.retrieverDrone_MAX[room_num] ==     undefined || Memory.sacrificer_MAX[room_num] ==         undefined ||
            Memory.acolyte_MAX[room_num] ==         undefined || Memory.acolyte2_MAX[room_num] ==           undefined || Memory.adherent_MAX[room_num] ==           undefined ||
            Memory.nullAdherent_MAX[room_num] ==    undefined || Memory.supplicant_MAX[room_num] ==         undefined || Memory.nullSupplicant_MAX[room_num] ==     undefined ||
            Memory.probe_MAX[room_num] ==           undefined || Memory.orbitalAssimilator_MAX[room_num] == undefined || Memory.recalibrator_MAX[room_num] ==       undefined ||
            Memory.orbitalDrone_MAX[room_num] ==    undefined || Memory.bloodhunter_MAX[room_num] ==        undefined || Memory.enforcer_MAX[room_num] ==           undefined ||
            Memory.purifier_MAX[room_num] ==        undefined || Memory.ancientDrone_MAX[room_num] ==       undefined || Memory.ancientAssimilator_MAX[room_num] == undefined ||
            Memory.architect_MAX[room_num] ==       undefined || Memory.phaseArchitect_MAX[room_num] ==     undefined || Memory.specialist_MAX ==                   undefined ||
            Memory.saviour_MAX ==                   undefined){

            return 'STATUSREPORT:: MEMORY VALIDATION FAILED';
        }
        
        

        let nexus = Game.getObjectById(SD.spawner_id[room_num][0]);
        
        

        //census...
        //count unit population by role
        let emergencyDrone_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.memory.home_index == room_num);
        let assimilator_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'           && creep.memory.home_index == room_num);
        let assimilator2_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'          && creep.memory.home_index == room_num);
        let drone_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'drone'                 && creep.memory.home_index == room_num);
        let energiser_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'energiser'             && creep.memory.home_index == room_num);
        let retrieverDrone_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'retrieverDrone'        && creep.memory.home_index == room_num);
        let sacrificer_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.memory.home_index == room_num);
        let acolyte_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'               && creep.memory.home_index == room_num);
        let acolyte2_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'              && creep.memory.home_index == room_num);
        let adherent_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'adherent'              && creep.memory.home_index == room_num);
        let nullAdherent_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'nullAdherent'          && creep.memory.home_index == room_num);
        let supplicant_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.memory.home_index == room_num);
        let nullSupplicant_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'nullSupplicant'        && creep.memory.home_index == room_num);
        let probe_gang =                _.filter(Game.creeps, creep => creep.memory.role == 'probe'                 && creep.memory.home_index == room_num);
        let orbitalAssimilator_gang =   _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator'    && creep.memory.home_index == room_num);
        let recalibrator_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'recalibrator'          && creep.memory.home_index == room_num);
        let orbitalDrone_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'orbitalDrone'          && creep.memory.home_index == room_num);
        let bloodhunter_gang =          _.filter(Game.creeps, creep => creep.memory.role == 'bloodhunter'           && creep.memory.home_index == room_num);
        let enforcer_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'enforcer'              && creep.memory.home_index == room_num);
        let purifier_gang =             _.filter(Game.creeps, creep => creep.memory.role == 'purifier'              && creep.memory.home_index == room_num);
        let ancientDrone_gang =         _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.memory.home_index == room_num);
        let ancientAssimilator_gang =   _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.memory.home_index == room_num);
        let architect_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.memory.home_index == room_num);
        let phaseArchitect_gang =       _.filter(Game.creeps, creep => creep.memory.role == 'phaseArchitect'        && creep.memory.home_index == room_num);
        let specialist_gang =           _.filter(Game.creeps, creep => creep.memory.role == 'specialist'            && creep.memory.home_index == room_num);
        let saviour_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'saviour'               && creep.memory.home_index == room_num);
        let treasurer_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'treasurer'             && creep.memory.home_index == room_num);
        


        //determine time until next unit death in the room
        let nextdeath_timeleft = CREEP_LIFE_TIME; //init at max time-to-live
        let nextdeath_unit = 'NULL';

        for (let name in Game.creeps){
            if ((Game.creeps[name].ticksToLive < nextdeath_timeleft)
                &&
                (Game.creeps[name].memory.home_index == room_num)){

                nextdeath_timeleft = Game.creeps[name].ticksToLive;
                nextdeath_unit = name;
            }
        }
        

        
        //room state...
        //determine total nexi energy
        let nexi_energy = 0;
        let Nexi = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });
        if (Nexi.length){
            for (let i=0; i<Nexi.length; i++){
                nexi_energy += Nexi[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }

        //determine total extension energy
        let ext_energy = 0;
        let extensions = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        });
        if (extensions.length){
            for (let i=0; i<extensions.length; i++){
                ext_energy += extensions[i].store.getUsedCapacity(RESOURCE_ENERGY);
            }
        }
        
        //determine total container energy
        let can_energy = 0;
        let canisters = nexus.room.find(FIND_STRUCTURES, {
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
        let scrap_energy = 0;
        let scraps = nexus.room.find(FIND_DROPPED_RESOURCES, {
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
        let control_perc = ((nexus.room.controller.progress / nexus.room.controller.progressTotal) * 100).toFixed(3);
        


        //count worn structures and walls (but not ramparts)
        let worn_structs = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < structure.hitsMax
                    &&
                    structure.structureType != STRUCTURE_WALL
                    &&
                    structure.structureType != STRUCTURE_RAMPART);
            }
        });

        let worn_walls = nexus.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.hits < Memory.wall_threshold
                    &&
                    structure.structureType == STRUCTURE_WALL);
            }
        });
        

        //determine which structure is weakest
        let weakest_struct = 'STRUCTURES ARE PRISTINE';
        let weakstruct_perc = 100;

        if (worn_structs.length){
            weakest_struct = worn_structs[0];

            for (let i=1; i<worn_structs.length; i++){
                if ((worn_structs[i].hits / worn_structs[i].hitsMax) < (weakest_struct.hits / weakest_struct.hitsMax))
                    weakest_struct = worn_structs[i];
            }
            weakstruct_perc = ((weakest_struct.hits / weakest_struct.hitsMax) * 100).toFixed(3);
        }
        

        //determine which wall is weakest
        let weakest_wall = 'WALLS ARE PRISTINE';
        let weakwall_perc = 100;

        if (worn_walls.length){
            weakest_wall = worn_walls[0];

            for (let i=1; i<worn_walls.length; i++){
                if (worn_walls[i].hits / Memory.wall_threshold < weakest_wall.hits / Memory.wall_threshold)
                    weakest_wall = worn_walls[i];
            }
            weakwall_perc = ((weakest_wall.hits / Memory.wall_threshold) * 100).toFixed(3);
        }
        
        

        //write report...
        //unit census report
        console.log('STATUSREPORT:: Emergency drone: '          + emergencyDrone_gang.length);
        console.log('STATUSREPORT:: Assimilator[I]: '           + assimilator_gang.length           + '/'   + Memory.assimilator_MAX[room_num]);
        console.log('STATUSREPORT:: Assimilator[II]: '          + assimilator2_gang.length          + '/'   + Memory.assimilator2_MAX[room_num]);
        console.log('STATUSREPORT:: Drones: '                   + drone_gang.length                 + '/'   + Memory.drone_MAX[room_num]);
        console.log('STATUSREPORT:: Energisers: '               + energiser_gang.length             + '/'   + Memory.energiser_MAX[room_num]);
        console.log('STATUSREPORT:: Retriever drone: '          + retrieverDrone_gang.length        + '/'   + Memory.retrieverDrone_MAX[room_num]);
        console.log('STATUSREPORT:: Sacrificers: '              + sacrificer_gang.length            + '/'   + Memory.sacrificer_MAX[room_num]);
        console.log('STATUSREPORT:: Acolyte[I]: '               + acolyte_gang.length               + '/'   + Memory.acolyte_MAX[room_num]);
        console.log('STATUSREPORT:: Acolyte[II]: '              + acolyte2_gang.length              + '/'   + Memory.acolyte2_MAX[room_num]);
        console.log('STATUSREPORT:: Adherent: '                 + adherent_gang.length              + '/'   + Memory.adherent_MAX[room_num]);
        console.log('STATUSREPORT:: Null adherent: '            + nullAdherent_gang.length          + '/'   + Memory.nullAdherent_MAX[room_num]);
        console.log('STATUSREPORT:: Supplicants: '              + supplicant_gang.length            + '/'   + Memory.supplicant_MAX[room_num]);
        console.log('STATUSREPORT:: Null supplicants: '         + nullSupplicant_gang.length        + '/'   + Memory.nullSupplicant_MAX[room_num]);
        console.log('STATUSREPORT:: Probes: '                   + probe_gang.length                 + '/'   + Memory.probe_MAX[room_num]);
        console.log('STATUSREPORT:: Orbital assimilator: '      + orbitalAssimilator_gang.length    + '/'   + Memory.orbitalAssimilator_MAX[room_num]);
        console.log('STATUSREPORT:: Recalibrator: '             + recalibrator_gang.length          + '/'   + Memory.recalibrator_MAX[room_num]);
        console.log('STATUSREPORT:: Orbital drone: '            + orbitalDrone_gang.length          + '/'   + Memory.orbitalDrone_MAX[room_num]);
        console.log('STATUSREPORT:: Blood hunter: '             + bloodhunter_gang.length           + '/'   + Memory.bloodhunter_MAX[room_num]);
        console.log('STATUSREPORT:: Enforcer: '                 + enforcer_gang.length              + '/'   + Memory.enforcer_MAX[room_num]);
        console.log('STATUSREPORT:: Purifier: '                 + purifier_gang.length              + '/'   + Memory.purifier_MAX[room_num]);
        console.log('STATUSREPORT:: Ancient drone: '            + ancientDrone_gang.length          + '/'   + Memory.ancientDrone_MAX[room_num]);
        console.log('STATUSREPORT:: Ancient assimilator: '      + ancientAssimilator_gang.length    + '/'   + Memory.ancientAssimilator_MAX[room_num]);
        console.log('STATUSREPORT:: Architects: '               + architect_gang.length             + '/'   + Memory.architect_MAX[room_num]);
        console.log('STATUSREPORT:: Phase architects: '         + phaseArchitect_gang.length        + '/'   + Memory.phaseArchitect_MAX[room_num]);
        console.log('STATUSREPORT:: Specialists: '              + specialist_gang.length            + '/'   + Memory.specialist_MAX[room_num]);
        console.log('STATUSREPORT:: Saviours: '                 + saviour_gang.length               + '/'   + Memory.saviour_MAX[room_num]);
        console.log('STATUSREPORT:: Treasurer: '                + treasurer_gang.length);
        console.log('STATUSREPORT:: NEXT DEATH: '               + nextdeath_unit                    + '; '  + nextdeath_timeleft + ' ticks');
        console.log('STATUSREPORT::');
        

        //state of the room report
        if (nexus.room.controller.level < 8)                console.log('STATUSREPORT:: Controller EXP: ' + control_perc + '% -> ' + nexus.room.controller.progress + '/' + nexus.room.controller.progressTotal);
        else                                                console.log('STATUSREPORT:: Controller EXP: MAX');

                                                            console.log('STATUSREPORT:: Spawning energy: ' + ext_energy + ' extended, ' + nexi_energy + ' nexi');

        if (nexus.room.storage != undefined)                console.log('STATUSREPORT:: Vault contents: ' + nexus.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy; ' +
                                                                nexus.room.storage.store.getUsedCapacity(Memory.mineral_type[room_num].mineralType) + ' ' + Memory.mineral_type[room_num].mineralType + '; ' +
                                                                (nexus.room.storage.store.getUsedCapacity() -
                                                                (nexus.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) + nexus.room.storage.store.getUsedCapacity(Memory.mineral_type[room_num].mineralType))) + ' misc.');

                                                            console.log('STATUSREPORT:: Vault space remaining: ' + nexus.room.storage.store.getFreeCapacity());

        if (nexus.room.terminal != undefined)               console.log('STATUSREPORT:: Terminal contents: ' + nexus.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) + ' energy; ' +
                                                                nexus.room.terminal.store.getUsedCapacity(Memory.mineral_type[room_num].mineralType) + ' ' + Memory.mineral_type[room_num].mineralType + '; ' +
                                                                (nexus.room.terminal.store.getUsedCapacity() -
                                                                (nexus.room.terminal.store.getUsedCapacity(RESOURCE_ENERGY) + nexus.room.terminal.store.getUsedCapacity(Memory.mineral_type[room_num].mineralType))) + ' misc.');

        if (canisters.length)                               console.log('STATUSREPORT:: Total canister energy: '    + can_energy);
                                                            console.log('STATUSREPORT:: Total dropped energy: '     + scrap_energy);
                                                            console.log('STATUSREPORT:: Weakest structure: '        + weakstruct_perc   + '% -> ' + weakest_struct);
                                                            console.log('STATUSREPORT:: Weakest wall: '             + weakwall_perc     + '% -> ' + weakest_wall);
        


        return 'STATUSREPORT:: ***** END *****';
    }
};