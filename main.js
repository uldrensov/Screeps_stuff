//AI script objects
var emergencyDrone =        require('emergencyDrone.AI');
var sacrificer =            require('sacrificer.AI');
var architect =             require('architect.AI');
var probe =                 require('probe.AI');
var assimilator =           require('assimilator.AI');
var drone =                 require('drone.AI');
var energiser =             require('energiser.AI');
var recalibrator =          require('recalibrator.AI');
var orbitalAssimilator =    require('orbitalAssimilator.AI');
var orbitalDrone =          require('orbitalDrone.AI');
var bloodhunter =           require('bloodhunter.AI');
var acolyte =               require('acolyte.AI');
var adherent =              require('adherent.AI');
var supplicant =            require('supplicant.AI');
var ancientDrone =          require('ancientDrone.AI');
var ancientAssimilator =    require('ancientAssimilator.AI');
var specialist =            require('specialist.AI');
var saviour =               require('saviour.AI');
var emissary =              require('emissary.AI');
var darktemplar =           require('darktemplar.AI');
var hallucination =         require('hallucination.AI');
var hightemplar =           require('hightemplar.AI');
var zealot =                require('zealot.AI');
var khaydarinmonolith =     require('khaydarinmonolith.AI');


//reconfigurable numbers
var time_offset =           100000;
var fixation_override =     .25; //probes will break fixation upon spotting an absolute % gap this wide
var drone_price =           [1000,1000,600];
var en_ignore_lim =         150; //drones/sacrificers/probes will ignore containers/pickups containing less energy than this
var tower_reserve_ratio =   .5; //towers will reserve this percentage of their energy for attacking
var vault_reserve_min =     100000; //all units except (e)drones and energisers will avoid vaults containing less than this


//reconfigurable object IDs
var nexus_id =              ['5e2d15a9e152154167131760', '5e3909b408abb42e9b310a46', '5e466c796fffaf84254b19ed'];
var controller_id =         ['5bbcae989099fc012e639474', '5bbcae989099fc012e639478', '5bbcae989099fc012e63947f'];

var source1_id =            ['5bbcae989099fc012e639476', '5bbcae989099fc012e639479', '5bbcae989099fc012e63947e'];
var source2_id =            ['5bbcae989099fc012e639475', 'NULL', '5bbcae989099fc012e639480'];
var canister1_id =          ['5e30677977034e78c09bdc43', '5e393db88c0dfcfcb18f05d2', '5e46d3baed5fa02c73c87173']; //corresponds to source1
var canister2_id =          ['5e354b518c0dfc0f7b8dc1d0', 'NULL', '5e466fb08bfc04c165b13edb']; //corresponds to source2
var mineralcanister_id =    ['5e3ca0a32f38f39b095da816', '5e49e41a8542f3df09eda72c'];

var reserveflag =           [Game.flags['Core1'], Game.flags['Core2'], Game.flags['Core3']]; //rally point for remote room reservation
var remoteflag =            [Game.flags['Terrazine'], Game.flags['Vespene'], Game.flags['Jorium']]; //rally point for remote mining
var remotesource_id =       ['5bbcae809099fc012e6392ee', '5bbcae989099fc012e63947b', '5bbcaea69099fc012e63960e'];
var remotecanister_id =     ['5e4761c7b1b0bd16bd38baf0', '5e47269c4fd64a6b9be545d4', '5e490bf22a3d564b0565c52d']; //drop-mining containers (o.assimilator)
var remotedrop_id =         ['5e323d61aa9957193cc8ec6c', '5e3ff330d9c0d0411296ffb0', '5e48c7a10359276c64092767']; //destination receptacles (o.drone)

var tower_id =              [['5e2f4a33e8af4a1c6459ccd8', '5e346820d632bc24398489ab'], ['5e3a68c9aa99575a56cba5da', '5e401cc59c6dc7073200b5b7'], ['5e473a110058163253b64554', '5e4a55092f9d26c57d90c465']];
                
var warpRX_id =             ['5e34d2403561285c52aba5b2', '5e437aa1ac1ec4151e946cb9', '5e4a79f221466ebb4fcc858b']; //receiver link (adherent)
var warpTX_id =             [['5e437e083561285674b0989c','5e34d803221670187690e4d7'], ['5e3ff330d9c0d0411296ffb0']]; //transmitter link (acolyte)
var acoly_tile_id =         [['5e30677977034e78c09bdc43','5e354b518c0dfc0f7b8dc1d0'], ['5e393db88c0dfcfcb18f05d2']];
var adher_tile_id =         ['5e2ec350d41b0bd406dfd71b', '5e437ad0aa9957378eced59c', '5e4a7ac80f2d8f5302547cc6'];
var holy_source =           [['5bbcae989099fc012e639476','5bbcae989099fc012e639475'], ['5bbcae989099fc012e639479']]; //acolyte's chosen source


//reconfigurable role-based body types
var edrone_body =   [WORK, CARRY,CARRY, MOVE,MOVE];
                    //cost: 300
var assim_body =    [[WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK, MOVE]];
                    //cost: 650, 650, 550
var drone_body =    [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE]];
                    //cost: 750, 750, 600
var energ_body =    [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                    [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE]];
                    //cost: 750, 750, 750
var sacrif_body =   [[],
                    [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                    //cost: NULL, 1200, 1200
var acoly_body =    [[WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                    []];
                    //cost: 850, 1050, NULL
var adher_body =    [CARRY,CARRY,CARRY,CARRY, MOVE];
                    //cost: 250
var suppl_body =    [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY, MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                    //cost: 1650, 950, 1550
var probe_body =    [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                    //cost: 2050, 1600, 1300
var recal_body =    [CLAIM, MOVE];
                    //cost: 650
var oassim_body =   [[WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                    //cost: 850, 850, 850
var odrone_body =   [[CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                    [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                    [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE]];
                    //cost: 1800, 900, 1800
var bloodh_body =   [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, HEAL,MOVE],
                    [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, HEAL,MOVE],
                    [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, HEAL,MOVE]];
                    //cost: 950, 950, 950
var androne_body =  [CARRY,CARRY,CARRY,CARRY, MOVE, MOVE];
                    //cost: 300
var anassim_body =  [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    //cost: 1500
var archit_body =   [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                    [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]];
                    //cost: 2300, 2050, 1200
var speci_body =    [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    //cost: 2300
                
var emiss_body =    [MOVE];
                    //cost: 50
var dt_body =       [[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]];
                    //cost: 2210, 1690
var dp_body =       [[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]];
                    //cost: 2230, 1690
var halluc_body =   [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    //cost: 1800
var ht_body =       [HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL, MOVE,MOVE,MOVE,MOVE];
                    //cost: 2150
var zealot_body =   [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    //cost: 1680
                
                
//memory init
if (Memory.sacrificer_MAX == undefined){Memory.sacrificer_MAX =                 [1,0,0];}
if (Memory.architect_MAX == undefined){Memory.architect_MAX =                   [1,0,0];}
if (Memory.probe_MAX == undefined){Memory.probe_MAX =                           [1,0,0];}
if (Memory.assimilator_MAX == undefined){Memory.assimilator_MAX =               [0,0,0];}
    if (Memory.assimilator2_MAX == undefined){Memory.assimilator2_MAX =         [0,0,0];}
if (Memory.drone_MAX == undefined){Memory.drone_MAX =                           [2,0,0];}
if (Memory.energiser_MAX == undefined){Memory.energiser_MAX =                   [0,0,0];}
if (Memory.recalibrator_MAX == undefined){Memory.recalibrator_MAX =             [0,0,0];}
if (Memory.orbitalAssimilator_MAX == undefined){Memory.orbitalAssimilator_MAX = [0,0,0];}
if (Memory.orbitalDrone_MAX == undefined){Memory.orbitalDrone_MAX =             [0,0,0];}
if (Memory.bloodhunter_MAX == undefined){Memory.bloodhunter_MAX =               [0,0,0];}
if (Memory.acolyte_MAX == undefined){Memory.acolyte_MAX =                       [0,0,0];}
    if (Memory.acolyte2_MAX == undefined){Memory.acolyte2_MAX =                 [0,0,0];}
if (Memory.adherent_MAX == undefined){Memory.adherent_MAX =                     [0,0,0];}
if (Memory.supplicant_MAX == undefined){Memory.supplicant_MAX =                 [0,0,0];}
if (Memory.ancientDrone_MAX == undefined){Memory.ancientDrone_MAX =             [0,0,0];}
if (Memory.ancientAssimilator_MAX == undefined){Memory.ancientAssimilator_MAX = [0,0,0];}
if (Memory.specialist_MAX == undefined){Memory.specialist_MAX =                 0;}
if (Memory.saviour_MAX == undefined){Memory.saviour_MAX =                       0;}
if (Memory.emissary_MAX == undefined){Memory.emissary_MAX =                     [0,0,0];}
if (Memory.darktemplar_MAX == undefined){Memory.darktemplar_MAX =               [0,0,0];}
if (Memory.hallucination_MAX == undefined){Memory.hallucination_MAX =           0;}
if (Memory.hightemplar_MAX == undefined){Memory.hightemplar_MAX =               0;}
if (Memory.zealot_MAX == undefined){Memory.zealot_MAX =                         0;}
if (Memory.wall_threshold == undefined){Memory.wall_threshold =                 50000;}
if (Memory.rampart_threshold == undefined){Memory.rampart_threshold =           100000;}
if (Memory.construction_mode == undefined){Memory.construction_mode =           false;}
if (Memory.vaultAlert_EN == undefined){Memory.vaultAlert_EN =                   [false,false,false];}
if (Memory.evac_timer == undefined){Memory.evac_timer =                         [0,0,0];}


module.exports.loop = function(){
    
    var nexi = [Game.getObjectById(nexus_id[0]), Game.getObjectById(nexus_id[1]), Game.getObjectById(nexus_id[2])];
    
    //garbage collect the names of expired units
    for (var name in Memory.creeps){
        if (!Game.creeps[name]){
            delete Memory.creeps[name];
            console.log(name + ' has expired.');
        }
    }
    
    //evacuation countdown and blood hunter summon for remote miners
    for (let i=0; i<Memory.evac_timer.length; i++){
        if (Memory.evac_timer[i] > 0){
            Memory.evac_timer[i]--;
            Memory.bloodhunter_MAX[i] = 1;
        }
        else{
            Memory.bloodhunter_MAX[i] = 0;
        }
    }
    
    //email alerts for vault energy conservation
    for (let i=0; i<Memory.vaultAlert_EN.length; i++){
        //enable alert for a room when its vault rises past 15% of the minimum threshold
        if ((nexi[i].room.storage.store.energy > vault_reserve_min * 1.15) && !Memory.vaultAlert_EN[i]){
            Memory.vaultAlert_EN[i] = true;
        }
        //disable further alerts from a room when it raises one
        else if (nexi[i].room.storage.store.energy < vault_reserve_min && Memory.vaultAlert_EN[i]){
            console.log('------------------------------');
            console.log('Vault #' + i + ' has entered conservation mode.');
            console.log('------------------------------');
            Game.notify('Vault #' + i + ' has entered conservation mode.',0);
            Memory.vaultAlert_EN[i] = false;
        }
    }
    
    
    //for storing population count in each room
    var emergencyDrone_gang = [];       var sacrificer_gang = [];   var architect_gang = [];    var probe_gang = [];                var assimilator_gang = [];  var assimilator2_gang = [];
    var drone_gang = [];                var energiser_gang = [];    var recalibrator_gang = []; var orbitalAssimilator_gang = [];   var orbitalDrone_gang = []; var bloodhunter_gang = [];
    var acolyte_gang = [];              var acolyte2_gang = [];     var adherent_gang = [];     var adherent2_gang = [];            var supplicant_gang = [];   var ancientDrone_gang = [];
    var ancientAssimilator_gang = [];   var specialist_gang;        var saviour_gang;           var emissary_gang = [];             var darktemplar_gang = [];  var hallucination_gang;
    var hightemplar_gang;               var zealot_gang;
    
    
    //execute the auto-spawn and unit AI assignment routines for each room
    for (let k=0; k<nexi.length; k++){
        
        //count unit population by role
        emergencyDrone_gang[k] =        _.filter(Game.creeps, creep => creep.memory.role == 'emergencyDrone'        && creep.room == nexi[k].room);
        sacrificer_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'sacrificer'            && creep.room == nexi[k].room);
        architect_gang[k] =             _.filter(Game.creeps, creep => creep.memory.role == 'architect'             && creep.room == nexi[k].room);
        probe_gang[k] =                 _.filter(Game.creeps, creep => creep.memory.role == 'probe'                 && creep.room == nexi[k].room);
        assimilator_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'assimilator'           && creep.room == nexi[k].room);
            assimilator2_gang[k] =      _.filter(Game.creeps, creep => creep.memory.role == 'assimilator2'          && creep.room == nexi[k].room);
        drone_gang[k] =                 _.filter(Game.creeps, creep => creep.memory.role == 'drone'                 && creep.room == nexi[k].room);
        energiser_gang[k] =             _.filter(Game.creeps, creep => creep.memory.role == 'energiser'             && creep.room == nexi[k].room);
        recalibrator_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'recalibrator'          && creep.memory.home == nexi[k].room.name);
        orbitalAssimilator_gang[k] =    _.filter(Game.creeps, creep => creep.memory.role == 'orbitalAssimilator'    && creep.memory.home == nexi[k].room.name);
        orbitalDrone_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'orbitalDrone'          && creep.memory.home == nexi[k].room.name);
        bloodhunter_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'bloodhunter'           && creep.memory.home == nexi[k].room.name);
        acolyte_gang[k] =               _.filter(Game.creeps, creep => creep.memory.role == 'acolyte'               && creep.room == nexi[k].room);
            acolyte2_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'acolyte2'              && creep.room == nexi[k].room);
        adherent_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'adherent'              && creep.room == nexi[k].room);
        supplicant_gang[k] =            _.filter(Game.creeps, creep => creep.memory.role == 'supplicant'            && creep.room == nexi[k].room);
        ancientDrone_gang[k] =          _.filter(Game.creeps, creep => creep.memory.role == 'ancientDrone'          && creep.room == nexi[k].room);
        ancientAssimilator_gang[k] =    _.filter(Game.creeps, creep => creep.memory.role == 'ancientAssimilator'    && creep.room == nexi[k].room);
        specialist_gang =               _.filter(Game.creeps, creep => creep.memory.role == 'specialist');
        saviour_gang =                  _.filter(Game.creeps, creep => creep.memory.role == 'saviour');
        emissary_gang[k] =              _.filter(Game.creeps, creep => creep.memory.role == 'emissary');
        darktemplar_gang[k] =           _.filter(Game.creeps, creep => creep.memory.role == 'darktemplar');
        hallucination_gang =            _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
        hightemplar_gang =              _.filter(Game.creeps, creep => creep.memory.role == 'hightemplar');
        zealot_gang =                   _.filter(Game.creeps, creep => creep.memory.role == 'zealot');
        
        
        //determine if mineral mining is possible
        var extractor = nexi[k].room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_EXTRACTOR;
            }
        })
        var minerals = nexi[k].room.find(FIND_MINERALS)[0];
        if (extractor.length && minerals.mineralAmount > 0){
            Memory.ancientDrone_MAX[k] = 1;
            Memory.ancientAssimilator_MAX[k] = 1;
        }
        else{
            Memory.ancientDrone_MAX[k] = 0;
            Memory.ancientAssimilator_MAX[k] = 0;
        }
        
        
        //emergency drone: if there are no other drones, and costs are too high to spawn normal drones
        if (drone_gang[k].length == 0 && emergencyDrone_gang[k].length == 0 &&
        nexi[k].room.energyAvailable < drone_price[k]){
            if (nexi[k].spawnCreep(edrone_body, 'EmergencyDrone-' + Game.time % time_offset, {memory: {role: 'emergencyDrone'}}) == 0){
                console.log('Room #' + k + ': >>>EmergencyDrone-' + Game.time % time_offset + ' spawning.<<<');
                Game.notify('Emergency drone deployed',0);
            }
        }
        
    //spawning core units...
        //without assimilators, there is no usable energy
        if (assimilator_gang[k].length < Memory.assimilator_MAX[k]){
            if (nexi[k].spawnCreep(assim_body[k], 'Assimilator-' + Game.time % time_offset, {memory: {role: 'assimilator'}}) == 0){
                console.log('Room #' + k + ': Assimilator-' + Game.time % time_offset + ' spawning.');
            }
        }
        else if (assimilator2_gang[k].length < Memory.assimilator2_MAX[k]){
            if (nexi[k].spawnCreep(assim_body[k], 'Assimilator_II-' + Game.time % time_offset, {memory: {role: 'assimilator2'}}) == 0){
                console.log('Room #' + k + ': Assimilator_II-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without drones, nothing else may spawn
        else if (drone_gang[k].length < Memory.drone_MAX[k]){
            if (nexi[k].spawnCreep(drone_body[k], 'Drone-' + Game.time % time_offset, {memory: {role: 'drone'}}) == 0){
                console.log('Room #' + k + ': Drone-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without energisers, the room is defenceless
        else if (energiser_gang[k].length < Memory.energiser_MAX[k]){
            if (nexi[k].spawnCreep(energ_body[k], 'Energiser-' + Game.time % time_offset, {memory: {role: 'energiser'}}) == 0){
                console.log('Room #' + k + ': Energiser-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without sacrificers, the room will level down
        else if (sacrificer_gang[k].length < Memory.sacrificer_MAX[k]){
            if (nexi[k].spawnCreep(sacrif_body[k], 'Sacrificer-' + Game.time % time_offset, {memory: {role: 'sacrificer'}}) == 0){
                console.log('Room #' + k + ': Sacrificer-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without acolytes, links cannot transmit
        else if (acolyte_gang[k].length < Memory.acolyte_MAX[k]){
            if (nexi[k].spawnCreep(acoly_body[k], 'Acolyte-' + Game.time % time_offset, {memory: {role: 'acolyte'}}) == 0){
                console.log('Room #' + k + ': Acolyte-' + Game.time % time_offset + ' spawning.');
            }
        }
        else if (acolyte2_gang[k].length < Memory.acolyte2_MAX[k]){
            if (nexi[k].spawnCreep(acoly_body[k], 'Acolyte_II-' + Game.time % time_offset, {memory: {role: 'acolyte2'}}) == 0){
                console.log('Room #' + k + ': Acolyte_II-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without adherents, links cannot be unloaded
        else if (adherent_gang[k].length < Memory.adherent_MAX[k]){
            if (nexi[k].spawnCreep(adher_body, 'Adherent-' + Game.time % time_offset, {memory: {role: 'adherent'}}) == 0){
                console.log('Room #' + k + ': Adherent-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without supplicants, the room will level down (replaces sacrificers)
        else if (supplicant_gang[k].length < Memory.supplicant_MAX[k]){
            if (nexi[k].spawnCreep(suppl_body[k], 'Supplicant-' + Game.time % time_offset, {memory: {role: 'supplicant'}}) == 0){
                console.log('Room #' + k + ': Supplicant-' + Game.time % time_offset + ' spawning.');
            }
        }
        //without probes, structures are not maintained
        else if (probe_gang[k].length < Memory.probe_MAX[k]){
            if (nexi[k].spawnCreep(probe_body[k], 'Probe-' + Game.time % time_offset, {memory: {role: 'probe'}}) == 0){
                console.log('Room #' + k + ': Probe-' + Game.time % time_offset + ' spawning.');
            }
        }
        
    //spawning situational units...
        //recalibrators: if remote mining is viable
        else if (recalibrator_gang[k].length < Memory.recalibrator_MAX[k]){
            if (nexi[k].spawnCreep(recal_body, 'Recalibrator-' + Game.time % time_offset, {memory: {role: 'recalibrator', home: nexi[k].room.name, in_place: false}}) == 0){
                console.log('Room #' + k + ': Recalibrator-' + Game.time % time_offset + ' spawning.');
            }
        }
        //orbital assimilators: if remote mining is viable
        else if (orbitalAssimilator_gang[k].length < Memory.orbitalAssimilator_MAX[k]){
            if (nexi[k].spawnCreep(oassim_body[k], 'OrbitalAssimilator-' + Game.time % time_offset, {memory: {role: 'orbitalAssimilator', home: nexi[k].room.name, in_place: false}}) == 0){
                console.log('Room #' + k + ': OrbitalAssimilator-' + Game.time % time_offset + ' spawning.');
            }
        }
        //orbital drones: if remote mining is viable
        else if (orbitalDrone_gang[k].length < Memory.orbitalDrone_MAX[k]){
            if (nexi[k].spawnCreep(odrone_body[k], 'OrbitalDrone-' + Game.time % time_offset, {memory: {role: 'orbitalDrone', home: nexi[k].room.name, in_place: false}}) == 0){
                console.log('Room #' + k + ': OrbitalDrone-' + Game.time % time_offset + ' spawning.');
            }
        }
        //blood hunters: if remote mining is being disrupted
        else if (bloodhunter_gang[k].length < Memory.bloodhunter_MAX[k]){
            if (nexi[k].spawnCreep(bloodh_body[k], 'Bloodhunter-' + Game.time % time_offset, {memory: {role: 'bloodhunter', home: nexi[k].room.name}}) == 0){
                console.log('Room #' + k + ': Bloodhunter-' + Game.time % time_offset + ' spawning.');
            }
        }
        //ancient drones: if minerals are available to mine
        else if (ancientDrone_gang[k].length < Memory.ancientDrone_MAX[k]){
            if (nexi[k].spawnCreep(androne_body, 'AncientDrone-' + Game.time % time_offset, {memory: {role: 'ancientDrone'}}) == 0){
                console.log('Room #' + k + ': AncientDrone-' + Game.time % time_offset + ' spawning.');
            }
        }
        //ancient assimilators: if minerals are available to mine
        else if (ancientAssimilator_gang[k].length < Memory.ancientAssimilator_MAX[k]){
            if (nexi[k].spawnCreep(anassim_body, 'AncientAssimilator-' + Game.time % time_offset, {memory: {role: 'ancientAssimilator'}}) == 0){
                console.log('Room #' + k + ': AncientAssimilator-' + Game.time % time_offset + ' spawning.');
            }
        }
        //architects: if there are construction projects to finish
        else if (architect_gang[k].length < Memory.architect_MAX[k]){
            if (nexi[k].spawnCreep(archit_body[k], 'Architect-' + Game.time % time_offset, {memory: {role: 'architect'}}) == 0){
                console.log('Room #' + k + ': Architect-' + Game.time % time_offset + ' spawning.');
            }
        }
        
    //spawning fast-track units...
        //specialist: used in setting up new rooms (assists architects)
        else if (specialist_gang.length < Memory.specialist_MAX){
            if (nexi[0].spawnCreep(speci_body, 'Specialist-' + Game.time % time_offset, {memory: {role: 'specialist'}}) == 0){
                console.log('Specialist-' + Game.time % time_offset + ' spawning.');
            }
        }
        //saviour: used in setting up new rooms (assists sacrificers)
        else if (saviour_gang.length < Memory.saviour_MAX){
            if (nexi[0].spawnCreep(speci_body, 'Saviour-' + Game.time % time_offset, {memory: {role: 'saviour'}}) == 0){
                console.log('Saviour-' + Game.time % time_offset + ' spawning.');
            }
        }
        
    //spawning military units...
        //emissary: used situationally for scouting
        else if (emissary_gang[k].length < Memory.emissary_MAX[k]){
            if (nexi[k].spawnCreep(emiss_body, 'Emissary-' + Game.time % time_offset, {memory: {role: 'emissary', in_place: false}}) == 0){
                console.log('Room #' + k + ': Emissary-' + Game.time % time_offset + ' spawning.');
            }
        }
        //dark templar: used during battle
        else if (darktemplar_gang[k].length < Memory.darktemplar_MAX[k]){
            if (nexi[k].spawnCreep(dt_body[k], 'Darktemplar-' + Game.time % time_offset, {memory: {role: 'darktemplar', in_place: false}}) == 0){
                console.log('Room #' + k + ': Darktemplar-' + Game.time % time_offset + ' spawning.');
            }
        }
        //hallucination: used during battle
        else if (hallucination_gang.length < Memory.hallucination_MAX){
            if (nexi[0].spawnCreep(halluc_body, 'Hallucination-' + Game.time % time_offset, {memory: {role: 'hallucination'}}) == 0){
                console.log('Hallucination-' + Game.time % time_offset + ' spawning.');
            }
        }
        //high templar: used during battle
        else if (hightemplar_gang.length < Memory.hightemplar_MAX){
            if (nexi[0].spawnCreep(ht_body, 'Hightemplar-' + Game.time % time_offset, {memory: {role: 'hightemplar'}}) == 0){
                console.log('Hightemplar-' + Game.time % time_offset + ' spawning.');
            }
        }
        //zealot: used during battle
        else if (zealot_gang.length < Memory.zealot_MAX){
            if (nexi[0].spawnCreep(zealot_body, 'Zealot-' + Game.time % time_offset, {memory: {role: 'zealot', in_place: false}}) == 0){
                console.log('Zealot-' + Game.time % time_offset + ' spawning.');
            }
        }
        
        
        //assign AI's to room-locked units
        for (var name in Game.creeps){
            var unit = Game.creeps[name];
            if (unit.room == nexi[k].room){
                switch (unit.memory.role){
                    case 'emergencyDrone':
                        emergencyDrone.run(unit, nexus_id[k]);
                        break;
                    case 'assimilator':
                        assimilator.run(unit, source1_id[k], canister1_id[k]);
                        break;
                    case 'assimilator2':
                        assimilator.run(unit, source2_id[k], canister2_id[k]);
                        break;
                    case 'drone':
                        drone.run(unit, nexus_id[k], en_ignore_lim);
                        break;
                    case 'energiser':
                        energiser.run(unit, nexi[k]);
                        break;
                    case 'sacrificer':
                        sacrificer.run(unit, controller_id[k], en_ignore_lim);
                        break;
                    case 'acolyte':
                        acolyte.run(unit, holy_source[k][0], warpRX_id[k], warpTX_id[k][0], acoly_tile_id[k][0]);
                        break;
                    case 'acolyte2':
                        acolyte.run(unit, holy_source[k][1], warpRX_id[k], warpTX_id[k][1], acoly_tile_id[k][1]);
                        break;
                    case 'adherent':
                        adherent.run(unit, nexus_id[k], adher_tile_id[k], warpRX_id[k]);
                        break;
                    case 'supplicant':
                        supplicant.run(unit, nexi[k], vault_reserve_min);
                        break;
                    case 'probe':
                        probe.run(unit, nexi[k], fixation_override, en_ignore_lim, vault_reserve_min);
                        break;
                    case 'ancientDrone':
                        ancientDrone.run(unit, nexus_id[k], mineralcanister_id[k]);
                        break;
                    case 'ancientAssimilator':
                        ancientAssimilator.run(unit, mineralcanister_id[k]);
                        break;
                    case 'architect':
                        architect.run(unit, nexi[k], vault_reserve_min);
                        break;
                }
            }
        }
        
        //assign AI's to towers
        for (let i=0; i<tower_id[k].length; i++){
            khaydarinmonolith.run(tower_id[k][i], tower_reserve_ratio, nexus_id);
        }
    }
    
    
    //assign AI's to free-range units
    for (var name in Game.creeps){
        var unit = Game.creeps[name];
        switch (unit.memory.role){
            case 'recalibrator':
                //determine homeroom to call AI script using appropriate args
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        recalibrator.run(unit, reserveflag[i], tower_id[i][0], i);
                        break;
                    }
                }
                break;
            case 'orbitalAssimilator':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        orbitalAssimilator.run(unit, remotesource_id[i], remoteflag[i], remotecanister_id[i], tower_id[i][0], i);
                        break;
                    }
                }
                break;
            case 'orbitalDrone':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        orbitalDrone.run(unit, remotecanister_id[i], remoteflag[i], remotedrop_id[i], en_ignore_lim, tower_id[i][0], i);
                        break;
                    }
                }
                break;
            case 'bloodhunter':
                for (let i=0; i<nexi.length; i++){
                    if (unit.memory.home == nexi[i].room.name){
                        bloodhunter.run(unit, remoteflag[i], i);
                        break;
                    }
                }
                break;
            case 'specialist':
                specialist.run(unit, '5bbcaea69099fc012e63960d');
                break;
            case 'saviour':
                saviour.run(unit, nexus_id[0], controller_id[2], vault_reserve_min);
                break;
            case 'emissary':
                emissary.run(unit, Game.flags['Core3']);
                break;
            case 'darktemplar':
                //darktemplar.run(unit, Game.flags['']);
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