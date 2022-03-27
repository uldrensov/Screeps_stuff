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
        
        let nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        
        for (let k=0; k<SD.nexus_id.length; k++){
            if (nexi[k] == null)    continue; //error: if nexus fails to retrieve, skip the room
            
            //room-locked units
            for (let name in Game.creeps){
                let unit = Game.creeps[name];
                
                if (unit.room == nexi[k].room){
                    switch (unit.memory.role){
                        case 'emergencyDrone':
                            emergencyDrone.run(unit, SD.nexus_id[k]);
                            break;
                        case 'drone': //slow unit
                            if (Game.time % Memory.roomSpeed[k] == 0)
                                drone.run(unit, SD.nexus_id[k], SD.en_ignore_lim, SD.std_interval);
                            break;
                        case 'assimilator':
                            assimilator.run(unit, SD.source1_id[k], SD.canister1_id[k]);
                            break;
                        case 'assimilator2':
                            assimilator.run(unit, SD.source2_id[k], SD.canister2_id[k]);
                            break;
                        case 'energiser':
                            energiser.run(unit, SD.std_interval);
                            break;
                        case 'retrieverDrone':
                            retrieverDrone.run(unit, SD.nexus_id[k], SD.en_ignore_lim);
                            break;
                        case 'sacrificer':
                            sacrificer.run(unit, SD.en_ignore_lim);
                            break;
                        case 'acolyte':
                            acolyte.run(unit, SD.source1_id[k], SD.warpRX_id[k], SD.warpTX_id[k][0], SD.canister1_id[k]);
                            break;
                        case 'acolyte2':
                            acolyte.run(unit, SD.source2_id[k], SD.warpRX_id[k], SD.warpTX_id[k][1], SD.canister2_id[k]);
                            break;
                        case 'adherent':
                            adherent.run(unit, SD.adher_tile_id[k], SD.warpRX_id[k]);
                            break;
                        case 'nullAdherent':
                            nullAdherent.run(unit, SD.adher_tile_id[k], SD.warpRX_id[k], SD.warpTX_id[k], SD.vault_boundary);
                            break;
                        case 'supplicant':
                            supplicant.run(unit, SD.vault_boundary);
                            break;
                        case 'nullSupplicant':
                            nullSupplicant.run(unit, SD.warpTX_id[k]);
                            break;
                        case 'probe':
                            probe.run(unit, SD.fixation_override, SD.en_ignore_lim, SD.vault_boundary);
                            break;
                        case 'ancientDrone': //very slow unit
                            if (Game.time % Memory.roomSpeed[k]*3 == 0)
                                ancientDrone.run(unit, SD.mineralcanister_id[k]);
                            break;
                        case 'ancientAssimilator': //very slow unit
                            if (Game.time % Memory.roomSpeed[k]*3 == 0)
                                ancientAssimilator.run(unit, SD.mineralcanister_id[k]);
                            break;
                        case 'architect': //slow unit
                            if (Game.time % Memory.roomSpeed[k] == 0)
                                architect.run(unit, nexi[k], SD.canister_bias, SD.vault_boundary);
                            break;
                        case 'phaseArchitect': //slow unit
                            if (Game.time % Memory.roomSpeed[k] == 0)
                                phaseArchitect.run(unit, nexi[k], SD.canister_bias, k);
                            break;
                        case 'treasurer': //slow unit
                            if (Game.time % Memory.roomSpeed[k] == 0)
                                treasurer.run(unit, SD.nexus_id[k], k);
                            break;
                    }
                }
            }
        }
    
        
        //cross-room units
        for (let name in Game.creeps){
            let unit = Game.creeps[name];
            
            switch (unit.memory.role){
                case 'recalibrator':
                    //determine homeroom to call AI script using appropriate args
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            recalibrator.run(unit, SD.nexus_id[i], SD.reserveflag[i], SD.tower_id[i], i);
                            break;
                        }
                    }
                    break;
                case 'orbitalAssimilator':
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            orbitalAssimilator.run(unit, SD.nexus_id[i], SD.remotesource_id[i], SD.remoteflag[i], SD.remotecanister_id[i], SD.tower_id[i], i);
                            break;
                        }
                    }
                    break;
                case 'orbitalDrone':
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            orbitalDrone.run(unit, SD.nexus_id[i], SD.remotecanister_id[i], SD.reserveflag[i], SD.en_ignore_lim, SD.tower_id[i], i);
                            break;
                        }
                    }
                    break;
                case 'bloodhunter':
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            bloodhunter.run(unit, SD.nexus_id[i], SD.remoteflag[i], i);
                            break;
                        }
                    }
                    break;
                case 'enforcer':
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            enforcer.run(unit, SD.nexus_id[i], SD.remoteflag[i], i);
                            break;
                        }
                    }
                    break;
                case 'purifier':
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            purifier.run(unit, SD.nexus_id[i], SD.remoteflag[i], i);
                            break;
                        }
                    }
                    break;
                case 'visionary':
                    for (let i=0; i<SD.nexus_id.length; i++){
                        if (unit.memory.home == nexi[i].room.name){
                            visionary.run(unit, Game.flags['GOGO'], i); //TODO: save flag name to SD or Memory instead of hardcoding
                            break;
                        }
                    }
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
                    for (let i=0; i<SD.nexus_id.length; i++){
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