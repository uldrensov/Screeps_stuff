//function: drives each unit based on their assigned AI role

var SD =                    require('SET_SOFTDATA');

var emergencyDrone =        require('emergencyDrone.AI');
var assimilator =           require('assimilator.AI');
var drone =                 require('drone.AI');
var energiser =             require('energiser.AI');
var retrieverDrone =        require('retrieverDrone.AI');
var sacrificer =            require('sacrificer.AI');
var acolyte =               require('acolyte.AI');
var adherent =              require('adherent.AI');
var nullAdherent =          require('nullAdherent.AI');
var supplicant =            require('supplicant.AI');
var nullSupplicant =        require('nullSupplicant.AI');
var probe =                 require('probe.AI');
var orbitalAssimilator =    require('orbitalAssimilator.AI');
var recalibrator =          require('recalibrator.AI');
var orbitalDrone =          require('orbitalDrone.AI');
var bloodhunter =           require('bloodhunter.AI');
var enforcer =              require('enforcer.AI');
var purifier =              require('purifier.AI');
var ancientDrone =          require('ancientDrone.AI');
var ancientAssimilator =    require('ancientAssimilator.AI');
var architect =             require('architect.AI');
var phaseArchitect =        require('phaseArchitect.AI');
var visionary =             require('visionary.AI');
var specialist =            require('specialist.AI');
var saviour =               require('saviour.AI');
var emissary =              require('emissary.AI');
var darktemplar =           require('darktemplar.AI');
var hallucination =         require('hallucination.AI');
var shieldbattery =         require('shieldbattery.AI');
var zealot =                require('zealot.AI');
var treasurer =             require('treasurer.AI');


module.exports = {
    run: function(){

        //role-specific slowdown factors
        const big_unit =    2; //big units are 2x as effective per tick, but work at 0.5x speed
        const very_slow =   3; //used for units that are in no rush to complete their task


        //periodically update a custom-sorted roster of all units on the field
        if (Game.time % SD.std_interval == 0){
            //alphabetise a roster of all living units
            let roster = [];
            for (let name in Game.creeps){
                roster.push(name);
            }
            roster.sort();


            //custom-sort the roster based on role priority
            let sortedRoster = [];
            let roleFound;

            for (let x=0; x<SD.role_priority.length; x++){
                roleFound = false;

                for (let y=0; y<roster.length; y++){
                    //build the sorted roster by appending desired roles in order
                    if (Game.creeps[roster[y]].memory.role == SD.role_priority[x]){
                        sortedRoster.push(roster[y]);
                        roleFound = true;
                    }

                    //if this happens, the loop has already passed all units of the desired role
                    else if (roleFound)
                        break;
                }
            }

            //save roster results to memory
            Memory.unit_roster = sortedRoster;
        }


        //TICK LOG BREAKPOINT 3
        if (Memory.recordTick){
            if (Memory.cpu_log[3] == undefined)
                Memory.cpu_log[3] = [];
            Memory.cpu_log[3][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
        }


        //helper var used for CPU/tick diagnosis
        let prev_unit = Game.creeps[Memory.unit_roster[0]];
        

        //run each unit's AI script, based on roster order
        for (let i=0; i<Memory.unit_roster.length; i++){
            let unit = Game.creeps[Memory.unit_roster[i]];

            //bypass: if unit fails to retrieve, skip it
            if (!unit)
                continue;

            let j = unit.memory.home_index;
                

            switch (unit.memory.role){
                case 'emergencyDrone':
                    emergencyDrone.run(unit, SD.spawner_id[j][0]);
                    break;
                case 'assimilator': //big
                    if (Game.time % big_unit == 0)
                        assimilator.run(unit, SD.source1_id[j], SD.canister1_id[j]);
                    break;
                case 'assimilator2': //big
                    if (Game.time % big_unit == 0)
                        assimilator.run(unit, SD.source2_id[j], SD.canister2_id[j]);
                    break;
                case 'drone': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        drone.run(unit, SD.en_ignore_lim);

                    //TICK LOG BREAKPOINT 4
                    if (prev_unit){
                        if (Memory.recordTick
                            &&
                            unit.memory.role != prev_unit.memory.role){
                        
                            if (Memory.cpu_log[4] == undefined)
                                Memory.cpu_log[4] = [];
                            Memory.cpu_log[4][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
                        }
                    }
                    break;
                case 'energiser':
                    energiser.run(unit, SD.std_interval);

                    //TICK LOG BREAKPOINT 5
                    if (prev_unit){
                        if (Memory.recordTick
                            &&
                            unit.memory.role != prev_unit.memory.role){

                            if (Memory.cpu_log[5] == undefined)
                                Memory.cpu_log[5] = [];
                            Memory.cpu_log[5][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
                        }
                    }
                    break;
                case 'retrieverDrone':
                    retrieverDrone.run(unit, SD.en_ignore_lim, SD.std_interval);
                    break;
                case 'sacrificer':
                    sacrificer.run(unit, SD.en_ignore_lim);
                    break;
                case 'acolyte':
                    acolyte.run(unit, SD.source1_id[j], SD.warpRX_id[j], SD.warpTX_id[j][0], SD.canister1_id[j]);
                    break;
                case 'acolyte2':
                    acolyte.run(unit, SD.source2_id[j], SD.warpRX_id[j], SD.warpTX_id[j][1], SD.canister2_id[j]);
                    break;
                case 'adherent':
                    adherent.run(unit, SD.adher_tile_id[j], SD.warpRX_id[j]);
                    break;
                case 'nullAdherent':
                    nullAdherent.run(unit, SD.adher_tile_id[j], SD.warpRX_id[j], SD.warpTX_id[j], SD.vault_boundary);
                    break;
                case 'supplicant':
                    supplicant.run(unit, SD.vault_boundary);
                    break;
                case 'nullSupplicant':
                    nullSupplicant.run(unit, SD.warpTX_id[j]);
                    break;
                case 'probe':
                    probe.run(unit, SD.fixation_override, SD.en_ignore_lim, SD.vault_boundary);
                    break;
                case 'orbitalAssimilator':
                    orbitalAssimilator.run(unit, SD.spawner_id[j][0], SD.remotesource_id[j], SD.remoteflag[j], SD.remotecanister_id[j], SD.tower_id[j]);
    
                    //TICK LOG BREAKPOINT 6
                    if (prev_unit){
                        if (Memory.recordTick
                            &&
                            unit.memory.role != prev_unit.memory.role){
                            
                            if (Memory.cpu_log[6] == undefined)
                                Memory.cpu_log[6] = [];
                            Memory.cpu_log[6][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
                        }
                    }
                    break;
                case 'recalibrator':
                    recalibrator.run(unit, SD.spawner_id[j][0], SD.reserveflag[j], SD.tower_id[j]);
                    break;
                case 'orbitalDrone':
                    orbitalDrone.run(unit, SD.spawner_id[j][0], SD.remotecanister_id[j], SD.remoteflag[j], SD.en_ignore_lim, SD.tower_id[j]);
    
                    //TICK LOG BREAKPOINT 7
                    if (prev_unit){
                        if (Memory.recordTick
                            &&
                            unit.memory.role != prev_unit.memory.role){
        
                            if (Memory.cpu_log[7] == undefined)
                                Memory.cpu_log[7] = [];
                            Memory.cpu_log[7][Memory.ticksLoggedToday-1] = Game.cpu.getUsed();
                        }
                    }
                    break;
                case 'bloodhunter':
                    bloodhunter.run(unit, SD.spawner_id[j][0], SD.remoteflag[j]);
                    break;
                case 'enforcer':
                    enforcer.run(unit, SD.spawner_id[j][0], SD.remoteflag[j], SD.tower_id[j]);
                    break;
                case 'purifier':
                    purifier.run(unit, SD.spawner_id[j][0], SD.remoteflag[j], SD.tower_id[j]);
                    break;
                case 'ancientDrone': //very slow unit
                    if (Game.time % Memory.roomSpeed[j]*very_slow == 0)
                        ancientDrone.run(unit, SD.mineralcanister_id[j]);
                    break;
                case 'ancientAssimilator': //very slow unit
                    if (Game.time % Memory.roomSpeed[j]*very_slow == 0)
                        ancientAssimilator.run(unit, SD.mineralcanister_id[j]);
                    break;
                case 'architect': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        architect.run(unit, SD.canister_bias, SD.vault_boundary, SD.std_interval);
                    break;
                case 'phaseArchitect': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        phaseArchitect.run(unit, SD.spawner_id[j][0], SD.canister_bias);
                    break;
                case 'visionary':
                    visionary.run(unit, Game.flags['GOGO']); //TODO: save flag name to SD or Memory instead of hardcoding
                    break;
                case 'specialist':
                    specialist.run(unit, Game.flags['GOGO'], Game.flags['GOGO2']); //TODO: see above
                    break;
                case 'saviour':
                    saviour.run(unit, Game.flags['GOGO'], Game.flags['GOGO2']); //TODO: see above
                    break;
                case 'emissary':
                    //emissary.run(unit, Game.flags['']);
                    break;
                case 'darktemplar':
                    //darktemplar.run(unit, Game.flags['Terrans']);
                    break;
                case 'hallucination':
                    //hallucination.run(unit, Game.flags[''], Game.flags['']);
                    break;
                case 'shieldbattery':
                    //shieldbattery.run(unit, Game.flags['']);
                    break;
                case 'zealot':
                    //zealot.run(unit, Game.flags[''], Game.flags['']);
                    break;
                case 'treasurer': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        treasurer.run(unit, SD.spawner_id[j][0]);
                    break;
                default:
                    console.log("UNITDRIVE:: " + unit.name + " HAS INVALID ROLE");
            }


            prev_unit = unit;
        }
    }
};