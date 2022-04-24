//library: contains read-only global variables designed to be manually reconfigurable on the fly

module.exports = {
    
    //numbers...
    //general-purpose time values
    time_offset:            100000,     //used for unit naming
    std_interval:           15,         //tick interval for CPU-heavy actions
    detection_interval:     5,          //tick interval for remote mining units' enemy detection check
    nukeCheck_interval:     10000,      //tick interval for nuke detection

    //construction thresholds
    wall_threshold:         500000,     //de facto "max hp" for walls
    rampart_threshold:      1500000,    //de facto "max hp" for ramparts
    construction_mode:      false,      //enabling this will stop towers from repairing structures; useful for situational energy conservation

    //economy automation values
    sellPrice_tolerance:    0.85,       //avoids selling resources below this percentage of the avg price
    buyPrice_tolerance:     1.10,       //avoids buying resources above this percentage of the avg price
    cargo_size:             100000,     //outbound "crate" size for trade terminal autoloading
    autoload_interval:      800,        //tick interval for automatic terminal loading (should exceed # of ticks required for a treasurer to finish an order)
    autosell_interval:      200,        //tick interval for automatic terminal sales (both resource sales and energy sales)

    //energy management
    tower_reserve_ratio:    0.5,        //towers will reserve this percentage of their energy for attacking
    vault_boundary:         100000,     //all units except (e)drones, energisers, and phase architects will avoid withdrawing from vaults containing less than this

    //unit role-specific values
    fixation_override:      0.25,       //probes will break fixation upon spotting an absolute % gap this wide
    canister_bias:          300,        //can force canister-fetching units to prefer one by default, until this wide of a disparity is detected
    en_ignore_lim:          100,        //drones/sacrificers/probes will ignore containers/pickups containing less energy than this
    cleanup_thresh:         2000,       //retriever drones arrive upon detecting this much uncollected energy on the ground, and stop at a quarter of this value
    


    //unit role priority order
    role_priority:         ['emergencyDrone',       'assimilator',      'assimilator2',         'drone',                'energiser',        'retrieverDrone',
                            'sacrificer',           'acolyte',          'acolyte2',             'adherent',             'nullAdherent',     'supplicant',
                            'nullSupplicant',       'probe',            'orbitalAssimilator',   'recalibrator',         'orbitalDrone',     'bloodhunter',
                            'enforcer',             'purifier',         'ancientDrone',         'ancientAssimilator',   'architect',        'phaseArchitect',
                            'visionary',            'specialist',       'saviour',              'emissary',             'darktemplar',      'hallucination',
                            'shieldbattery',        'zealot',           'treasurer'],

                            
    
    //important hardcoded object IDs...
    //controllers
    ctrl_id:                ['5bbcae989099fc012e639474',    '5bbcae819099fc012e639302', '5bbcae989099fc012e63947f',
                            '5bbcae809099fc012e6392f5',     '000000000000000000000000', '5bbcae369099fc012e638940',
                            '5bbcaea69099fc012e639605',     '5bbcae289099fc012e6387b9', '5bbcae0c9099fc012e6385be',],


    //spawners
    spawner_id:             [['5e2d15a9e152154167131760',   '5ea77d6ef821ec768995de0b', '5ea7bbacb80d8d894c640f28'],
                            ['5e5b6eabb5c443745759aa65',    '5ea4ff3b00950bc79df78600', '5ea4d1417316480d645e5896'],
                            ['5e466c796fffaf84254b19ed',    '5ea4f5011fb03a61e06049c6', '5e805b94b2bbc8e35e8fda32'],
                            ['5ea53129e72edb5e91141913',    '5ea4ff8c247bb0997354b396', '5e9509a6a5c89eb2af0a52cb'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000'],
                            ['5eabb37a93280a9fc1876024',    '5ed5ac727d101f14026a09f8', '5e90c0cd92ec7d74fd3827c3'],
                            ['5e8dd3d7091b31014a7522c4',    '5ea77b681dcfd3c31fc39d13', '5ed80f702ef36940af6cd8d6'],
                            ['6233d2a158b8e2395538037e',    '6233e231220bad8e531b0141', '6233df5658b8e24647380706'],
                            ['6233b63fcc72041c278123c9',    '6233bda65e25b40aab15fe1d', '62328960cc7204639e80cbb8']],


    //energy sources and storage
    source1_id:             ['5bbcae989099fc012e639476',    '5bbcae819099fc012e639303', '5bbcae989099fc012e63947e',
                            '5bbcae809099fc012e6392f4',     '000000000000000000000000', '5bbcae369099fc012e638942',
                            '5bbcaea69099fc012e639606',     '5bbcae289099fc012e6387ba', '5bbcae0c9099fc012e6385c0'],

    source2_id:             ['5bbcae989099fc012e639475',    '5bbcae819099fc012e639304', '5bbcae989099fc012e639480',
                            '5bbcae809099fc012e6392f6',     '000000000000000000000000', '5bbcae369099fc012e638941',
                            '5bbcaea69099fc012e639607',     '5bbcae289099fc012e6387bb', '5bbcae0c9099fc012e6385bf'],

    canister1_id:           ['5e30677977034e78c09bdc43',    '5e5b806d74988df745a4b854', '5e46d3baed5fa02c73c87173',
                            '5e5507eea3d520c61a772d62',     '000000000000000000000000', '61306b7b047f44199df9e4bb',
                            '5e8dc130586f870dab1ad8f0',     '6233ba082c1a961f8f1c5609', '6233c26471652c16166f3e9c'],    //for source1

    canister2_id:           ['5e354b518c0dfc0f7b8dc1d0',    '5e5c5f2b27cac98f038eed99', '5e466fb08bfc04c165b13edb',
                            '5e561baebcb7d67abec5f433',     '000000000000000000000000', '61306950cf7d7c11971d5810',
                            '5e8dc2604541e5ab90ab1bb3',     '6233b7be2213a13fc616a4e0', '6233c7cd5e25b47f7216013b'],    //for source2

    mineralcanister_id:     ['5e3ca0a32f38f39b095da816',    '5e5c909be1a1395885e81156', '5e4f6a0761106b557aa66abe',
                            '5e5b5b1c403d152c992428c4',     '000000000000000000000000', '613093f298a080471e5008dc',
                            '5e8f2204b9e23c1518b47557',     '623545e9a75d71823dc45a99', '6233dfbc689f74f5920da3b2'],


    //remote mining-related
    reserveflag:            [Game.flags['Core0'],           'NULL',                     Game.flags['Core2'],
                            Game.flags['Core3'],            'NULL',                     'NULL',
                            Game.flags['Core6'],            'NULL',                     Game.flags['Core8']],           //rally point for remote room reservation
    remoteflag:             [Game.flags['Terrazine'],       'NULL',                     Game.flags['Jorium'],
                            Game.flags['Protodermis'],      'NULL',                     'NULL',
                            Game.flags['Vespene'],          'NULL',                     Game.flags['Hydrazine']],       //rally point for remote mining

    remotectrl_id:          ['5bbcae809099fc012e6392ef',    '000000000000000000000000', '5bbcaea69099fc012e63960d',
                            '5bbcae809099fc012e6392f2',     '000000000000000000000000', '000000000000000000000000',
                            '5bbcae989099fc012e639478',     '000000000000000000000000', '5bbcadfd9099fc012e638433'],

    remotesource_id:        ['5bbcae809099fc012e6392ee',    '000000000000000000000000', '5bbcaea69099fc012e63960e',
                            '5bbcae809099fc012e6392f1',     '000000000000000000000000', '000000000000000000000000',
                            '5bbcae989099fc012e639479',     '000000000000000000000000', '5bbcadfd9099fc012e638432'],

    remotecanister_id:      ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000'],    //drop-mining containers (o.assimilator)


    //specific towers
    retreatTower_id:        ['5e76a9799b9279cd3b8d5c7d',    '5e5c992bb655c985f872fdd1', '5ea4d90bcdd80c534a3abc8e',
                            '5e6dedb3b2181dab6255bd37',     '5eacde6466154c86cb8dbf5a', '5e76c1bc7e17fe2a086ed2e0',
                            '5ed71c1163d51255eee5d760',     '5eafc6815ed8e62449836ce9', '623bfb3fc088bfb245421656'],    //remote mining team retreats towards this
                

    //RX and TX link-related
    warpRX_id:              ['5e34d2403561285c52aba5b2',    '5e5fde06e4c9ff32dfb1a4d1', '5e4a79f221466ebb4fcc858b',
                            '5e5b2064a981827aa51b60e7',     '000000000000000000000000', '5e964440cccec473624b299a',
                            '5e927256a01077492a319dcf',     '5e9e3355f6752e15d441a1b8', '623bf85358b8e26dd53a3195'],    //rx link (adherent)

    warpTX_id:              [['5e437e083561285674b0989c',   '5e34d803221670187690e4d7'],
                            ['5e601a514f07353e676e5376'],
                            ['5e4a844a035927629b09d4a3'],
                            ['5e6cad8c43e2d4d024ddfbb6',    '5e5b5c7d02d3761fb826bbec'],
                            ['000000000000000000000000'],
                            ['5e964bf152b012a966941064'],
                            ['000000000000000000000000',    '5e92789e45cd497f9ff85b44'],
                            ['000000000000000000000000',    '5e9e48317e29d56b7b6eca8a'],
                            ['5eb80e2ff96388fd8ad681dc']], //-->                                                        //tx link (acolyte)

    adher_tile_id:          ['5e2ec350d41b0bd406dfd71b',    '5e5dab190fb27e9efd036585', '5e4a7ac80f2d8f5302547cc6',
                            '5e55f3ea976d8d949fbe40ce',     '000000000000000000000000', '61306252353eb97acb79c953',
                            '5e926ffb3dfe155ca3cc501b',     '5e9e3113a8c647e32b811d14', '623bf5fe57f6fe80a5754360'],


    //labs
    reagent_id:             [['000000000000000000000000',   '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000']],

    reactant_id:            [['000000000000000000000000',   '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000'],
                            ['000000000000000000000000',    '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000', '000000000000000000000000',
                            '000000000000000000000000',     '000000000000000000000000']],
    


    //autosell-authorised products...
    sellable_products:      [[RESOURCE_ZYNTHIUM,            RESOURCE_GHODIUM_OXIDE],
                            [RESOURCE_OXYGEN,               RESOURCE_GHODIUM_OXIDE],
                            [RESOURCE_KEANIUM,              RESOURCE_GHODIUM_OXIDE],
                            [RESOURCE_CATALYST,             RESOURCE_GHODIUM_OXIDE],
                            [],
                            [RESOURCE_CATALYST,             RESOURCE_GHODIUM_OXIDE],
                            [RESOURCE_OXYGEN,               RESOURCE_GHODIUM_OXIDE],
                            [RESOURCE_LEMERGIUM,            RESOURCE_GHODIUM_OXIDE],
                            [RESOURCE_LEMERGIUM,            RESOURCE_GHODIUM_OXIDE]],
                            
    dumpsell_whitelist:     [RESOURCE_GHODIUM_OXIDE],



    //special usernames...
    allies:                 ['Hellbuck'],
    notif_blacklist:        ['Invader','Patch'],



    //misc...
    tag:                    'Welcome to my rice fields, MF!',
    
    

    //body parts by role...
    edrone_body:            [WORK, CARRY,CARRY, MOVE,MOVE],
                            //cost: 300

    assim_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE]],
                            //cost: 1300, 1100, 1100, 1300, 1100, 1100, 1100, 1100, 1100

    drone_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 1500, 1200, 1500, 1200, 1200, 1200, 1200, 1200, 1200

    energ_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 1500, 1500, 1500, 1500, 1500, 750, 750, 750, 750

    sacrif_body:            [[],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: NULL, 1200, 1200, 1800, 1800, 1200, 1200, 1200, 1200

    acoly_body:             [[WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [],
                            [],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            []],
                            //cost: 850, 1050, NULL, 1050, NULL, NULL, 850, 850

    adher_body:             [CARRY,CARRY,CARRY,CARRY, MOVE],
                            //cost: 250

    suppl_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2000, 2000, 2000, 1850, 2000, 1850, 1850, 1850, 2000

    probe_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2050, 1200, 1600, 1200, 1200, 1200, 1200, 1200, 1200

    oassim_body:            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 850

    recal_body:             [[CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE]],
                            //cost: 2600, 1950, 1950, 1300, 1300, 1300, 1300, 1300, 1300

    odrone_body:            [[CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE]],
                            //cost: 2400, 900, 2100, 1800, 1800, 1800, 1800, 1800, 1800

    bloodh_body:            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            //cost: 650

    enforc_body:            [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE]],
                            //cost: 780, 390, 390, 390, NULL

    purif_body:             [[CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE]],
                            //cost: 2050, 2050, 2050, 2050, 2050

    androne_body:           [CARRY,CARRY,CARRY,CARRY, MOVE, MOVE],
                            //cost: 300

    anassim_body:           [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1500

    archit_body:            [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2300, 1600, 3000, 2300, 1600, 1200, 1200, 1200, 1200

    phasarc_body:           [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 1800, 1300, 1300, 1300, 1300, 1200, 1200, 1200, 1200

    visio_body:             [CLAIM, MOVE,MOVE,MOVE,MOVE],
                            //cost: 800

    speci_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            []],
                            //cost: 2650, 1800, 1800, 1800, 1800, 1800, 1800, 1800, NULL
                
    emiss_body:             [MOVE],
                            //cost: 50

    dt_body:                [[MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK,
                                MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK],
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]],
                            //cost: 2990, 1690

    halluc_body:            [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1800

    ht_body:                [HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL, MOVE,MOVE,MOVE,MOVE],
                            //cost: 2150

    zealot_body:            [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1680

    dp_body:                [[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]],
                            //cost: 2230, 1690
                            //TODO: what was this supposed to be?

    treas_body:             [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            //cost: 550
};