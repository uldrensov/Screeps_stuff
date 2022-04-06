//function: drives each unit based on their assigned AI role

var SD =                    require('SOFTDATA');

var emergencyDrone =        require('emergencyDrone.AI');
var sacrificer =            require('sacrificer.AI');
var architect =             require('architect.AI');
var phaseArchitect =        require('phaseArchitect.AI');
var probe =                 require('probe.AI');
var assimilator =           require('assimilator.AI');
var drone =                 require('drone.AI');
var energiser =             require('energiser.AI');
var retrieverDrone =        require('retrieverDrone.AI');
var recalibrator =          require('recalibrator.AI');
var orbitalAssimilator =    require('orbitalAssimilator.AI');
var orbitalDrone =          require('orbitalDrone.AI');
var bloodhunter =           require('bloodhunter.AI');
var enforcer =              require('enforcer.AI');
var purifier =              require('purifier.AI');
var acolyte =               require('acolyte.AI');
var adherent =              require('adherent.AI');
var nullAdherent =          require('nullAdherent.AI');
var supplicant =            require('supplicant.AI');
var nullSupplicant =        require('nullSupplicant.AI');
var ancientDrone =          require('ancientDrone.AI');
var ancientAssimilator =    require('ancientAssimilator.AI');
var visionary =             require('visionary.AI');
var specialist =            require('specialist.AI');
var saviour =               require('saviour.AI');
var treasurer =             require('treasurer.AI');
var emissary =              require('emissary.AI');
var darktemplar =           require('darktemplar.AI');
var hallucination =         require('hallucination.AI');
var hightemplar =           require('hightemplar.AI');
var zealot =                require('zealot.AI');


module.exports = {
    run: function(){

        for (let name in Game.creeps){
            let unit = Game.creeps[name];
            let j = unit.memory.home_index;
                
            switch (unit.memory.role){
                case 'emergencyDrone':
                    emergencyDrone.run(unit, SD.nexus_id[j]);
                    break;
                case 'drone': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        drone.run(unit, SD.nexus_id[j], SD.en_ignore_lim, SD.std_interval);
                    break;
                case 'assimilator':
                    assimilator.run(unit, SD.source1_id[j], SD.canister1_id[j]);
                    break;
                case 'assimilator2':
                    assimilator.run(unit, SD.source2_id[j], SD.canister2_id[j]);
                    break;
                case 'energiser':
                    energiser.run(unit, SD.std_interval);
                    break;
                case 'retrieverDrone':
                    retrieverDrone.run(unit, SD.nexus_id[j], SD.en_ignore_lim);
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
                case 'ancientDrone': //very slow unit
                    if (Game.time % Memory.roomSpeed[j]*3 == 0)
                        ancientDrone.run(unit, SD.mineralcanister_id[j]);
                    break;
                case 'ancientAssimilator': //very slow unit
                    if (Game.time % Memory.roomSpeed[j]*3 == 0)
                        ancientAssimilator.run(unit, SD.mineralcanister_id[j]);
                    break;
                case 'architect': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        architect.run(unit, SD.nexus_id[j], SD.canister_bias, SD.vault_boundary);
                    break;
                case 'phaseArchitect': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        phaseArchitect.run(unit, SD.nexus_id[j], SD.canister_bias);
                    break;
                case 'treasurer': //slow unit
                    if (Game.time % Memory.roomSpeed[j] == 0)
                        treasurer.run(unit, SD.nexus_id[j]);
                    break;
                case 'recalibrator':
                    recalibrator.run(unit, SD.nexus_id[j], SD.reserveflag[j], SD.tower_id[j]);
                    break;
                case 'orbitalAssimilator':
                    orbitalAssimilator.run(unit, SD.nexus_id[j], SD.remotesource_id[j], SD.remoteflag[j], SD.remotecanister_id[j], SD.tower_id[j]);
                    break;
                case 'orbitalDrone':
                    orbitalDrone.run(unit, SD.nexus_id[j], SD.remotecanister_id[j], SD.reserveflag[j], SD.en_ignore_lim, SD.tower_id[j]);
                    break;
                case 'bloodhunter':
                    bloodhunter.run(unit, SD.nexus_id[j], SD.remoteflag[j]);
                    break;
                case 'enforcer':
                    enforcer.run(unit, SD.nexus_id[j], SD.remoteflag[j], SD.tower_id[j]);
                    break;
                case 'purifier':
                    purifier.run(unit, SD.nexus_id[j], SD.remoteflag[j], SD.tower_id[j]);
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
                    //darktemplar.run(unit, SD.nexus_id[j], Game.flags['Terrans']);
                    break;
                case 'hallucination':
                    //hallucination.run(unit, Game.flags[''], Game.flags['']);
                    break;
                case 'hightemplar':
                    //hightemplar.run(unit, Game.flags['']);
                    break;
                case 'zealot':
                    //zealot.run(unit, Game.flags[''], Game.flags['']);
                    break;
                default:
                    console.log("UNITDRIVE:: " + unit.name + " HAS INVALID ROLE");
            }
        }
    }
};