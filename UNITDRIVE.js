//function: drives each unit based on their assigned AI role

var SD = require('SOFTDATA');

var emergencyDrone =        require('emergencyDrone.AI');
var sacrificer =            require('sacrificer.AI');
var architect =             require('architect.AI');
var phaseArchitect =        require('phaseArchitect.AI');
var probe =                 require('probe.AI');
var assimilator =           require('assimilator.AI');
var drone =                 require('drone.AI');
var energiser =             require('energiser.AI');
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
var khaydarinmonolith =     require('khaydarinmonolith.AI');


module.exports = {
    run: function(){
        
        var nexi = [Game.getObjectById(SD.nexus_id[0]), Game.getObjectById(SD.nexus_id[1]), Game.getObjectById(SD.nexus_id[2]), Game.getObjectById(SD.nexus_id[3])];
        
        
        for (let k=0; k<nexi.length; k++){
        
            //room-locked units
            for (var name in Game.creeps){
                var unit = Game.creeps[name];
                if (unit.room == nexi[k].room){
                    switch (unit.memory.role){
                        case 'emergencyDrone':
                            emergencyDrone.run(unit, SD.nexus_id[k]);
                            break;
                        case 'drone':
                            drone.run(unit, SD.nexus_id[k], SD.en_ignore_lim);
                            break;
                        case 'assimilator':
                            assimilator.run(unit, SD.source1_id[k], SD.canister1_id[k]);
                            break;
                        case 'assimilator2':
                            assimilator.run(unit, SD.source2_id[k], SD.canister2_id[k]);
                            break;
                        case 'energiser':
                            energiser.run(unit);
                            break;
                        case 'sacrificer':
                            sacrificer.run(unit, SD.controller_id[k], SD.en_ignore_lim);
                            break;
                        case 'acolyte':
                            acolyte.run(unit, SD.holy_source[k][0], SD.warpRX_id[k], SD.warpTX_id[k][0], SD.acoly_tile_id[k][0]);
                            break;
                        case 'acolyte2':
                            acolyte.run(unit, SD.holy_source[k][1], SD.warpRX_id[k], SD.warpTX_id[k][1], SD.acoly_tile_id[k][1]);
                            break;
                        case 'adherent':
                            adherent.run(unit, SD.adher_tile_id[k], SD.warpRX_id[k]);
                            break;
                        case 'nullAdherent':
                            nullAdherent.run(unit, SD.adher_tile_id[k], SD.warpRX_id[k], SD.warpTX_id[k]);
                            break;
                        case 'supplicant':
                            supplicant.run(unit, SD.vault_reserve_min);
                            break;
                        case 'nullSupplicant':
                            nullSupplicant.run(unit, SD.warpTX_id[k]);
                            break;
                        case 'probe':
                            probe.run(unit, nexi[k], SD.fixation_override, SD.en_ignore_lim, SD.vault_reserve_min);
                            break;
                        case 'ancientDrone':
                            ancientDrone.run(unit, SD.mineralcanister_id[k]);
                            break;
                        case 'ancientAssimilator':
                            ancientAssimilator.run(unit, SD.mineralcanister_id[k]);
                            break;
                        case 'architect':
                            architect.run(unit, nexi[k], SD.canister_bias, SD.vault_reserve_min);
                            break;
                        case 'phaseArchitect':
                            phaseArchitect.run(unit, nexi[k], SD.canister_bias, SD.vault_reserve_min, k);
                            break;
                        case 'treasurer':
                            treasurer.run(unit, SD.nexus_id[k], k);
                            break;
                    }
                }
            }
            
            //towers
            var local_towers = nexi[k].room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_TOWER;
                }
            });
            for (let i=0; i<local_towers.length; i++){
                khaydarinmonolith.run(local_towers[i].id, SD.tower_reserve_ratio, k);
            }
        }
    
    
        //cross-room units
        for (var name in Game.creeps){
            var unit = Game.creeps[name];
            switch (unit.memory.role){
                case 'recalibrator':
                    //determine homeroom to call AI script using appropriate args
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            recalibrator.run(unit, SD.nexus_id[i], SD.reserveflag[i], SD.tower_id[i][0], i);
                            break;
                        }
                    }
                    break;
                case 'orbitalAssimilator':
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            orbitalAssimilator.run(unit, SD.nexus_id[i], SD.remotesource_id[i], SD.remoteflag[i], SD.remotecanister_id[i], SD.tower_id[i][0], i);
                            break;
                        }
                    }
                    break;
                case 'orbitalDrone':
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            orbitalDrone.run(unit, SD.nexus_id[i], SD.remotecanister_id[i], SD.remoteflag[i], SD.remotedrop_id[i], SD.en_ignore_lim, SD.tower_id[i][0], i);
                            break;
                        }
                    }
                    break;
                case 'bloodhunter':
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            bloodhunter.run(unit, SD.nexus_id[i], SD.remoteflag[i], i);
                            break;
                        }
                    }
                    break;
                case 'enforcer':
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            enforcer.run(unit, SD.nexus_id[i], SD.remoteflag[i], i);
                            break;
                        }
                    }
                    break;
                case 'purifier':
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            purifier.run(unit, SD.nexus_id[i], SD.remoteflag[i], i);
                            break;
                        }
                    }
                    break;
                case 'visionary':
                    visionary.run(unit, Game.flags['Terrans']);
                    break;
                case 'specialist':
                    specialist.run(unit, Game.flags['Terrans']);
                    break;
                case 'saviour':
                    saviour.run(unit, SD.nexus_id[0], SD.controller_id[2], SD.vault_reserve_min);
                    break;
                case 'emissary':
                    //emissary.run(unit, Game.flags['']);
                    break;
                case 'darktemplar':
                    for (let i=0; i<nexi.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            darktemplar.run(unit, SD.nexus_id[i], Game.flags['Terrans']);
                            break;
                        }
                    }
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
            }
        }
    }
};