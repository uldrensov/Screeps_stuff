//library: contains all reconfigurable and server-specific variables

module.exports = {
    
    //numbers
    roomcount:              9,
    time_offset:            100000, //used for unit naming
    fixation_override:      .25,    //probes will break fixation upon spotting an absolute % gap this wide
    canister_bias:          300,    //can force canister-fetching units to prefer one by default, until this wide of a disparity is detected
    en_ignore_lim:          100,    //drones/sacrificers/probes will ignore containers/pickups containing less energy than this
    cleanup_thresh:         2000,   //retriever drones arrive upon detecting this much uncollected energy on the ground, and stop at a quarter of this value
    tower_reserve_ratio:    .5,     //towers will reserve this percentage of their energy for attacking
    vault_boundary:         100000, //all units except (e)drones, energisers, and phase architects will avoid vaults containing less than this
    std_interval:           15,     //tick interval for CPU-heavy actions
    autosell_interval:      500,    //tick interval for automatic terminal exports
    autoload_interval:      2500,   //tick interval for automatic terminal loading (should be well over 2000; e.g. unit TTL)
    price_tolerance:        .95,    //autosell minerals no cheaper than a minimum percentage of the avg price
    cargo_size:             100000, //outbound "crate" size for trade terminal autoloading
    
    
    //important object IDs
    nexus_id:               ['5e2d15a9e152154167131760', '5e5b6eabb5c443745759aa65', '5e466c796fffaf84254b19ed', '5ea53129e72edb5e91141913', '5e6350bb6270f3464c31ca11', '5e90c0cd92ec7d74fd3827c3', '5e8dd3d7091b31014a7522c4',
                            '5e98a3db9380fa0e2c29de45', '5eb185e5dcb707b974d36545'],
    spawner_id:             [['5e2d15a9e152154167131760', '5ea77d6ef821ec768995de0b', '5ea7bbacb80d8d894c640f28'],
                            ['5e5b6eabb5c443745759aa65', '5ea4ff3b00950bc79df78600', '5ea4d1417316480d645e5896'],
                            ['5e466c796fffaf84254b19ed', '5ea4f5011fb03a61e06049c6', '5e805b94b2bbc8e35e8fda32'],
                            ['5ea53129e72edb5e91141913', '5ea4ff8c247bb0997354b396', '5e9509a6a5c89eb2af0a52cb'],
                            ['5e6350bb6270f3464c31ca11', '5e79f323a0252257ea1548cc', '5ead3d1fb38b7db6ee2bd4b5'],
                            ['5e90c0cd92ec7d74fd3827c3', '5eabb37a93280a9fc1876024', '5ed5ac727d101f14026a09f8'],
                            ['5e8dd3d7091b31014a7522c4', '5ea77b681dcfd3c31fc39d13', '5ed80f702ef36940af6cd8d6'],
                            ['5e98a3db9380fa0e2c29de45', '5eb07120d16bc27e7999c068', '5ed8bb292e9a2885791c1512'],
                            ['5eb185e5dcb707b974d36545', '5ece0f6e40e96ffde9f7e7e0', '5ef9731afa0da07a6980654a']],

    source1_id:             ['5bbcae989099fc012e639476', '5bbcae819099fc012e639303', '5bbcae989099fc012e63947e', '5bbcae809099fc012e6392f4', '5bbcae809099fc012e6392fc', '5bbcae369099fc012e638941', '5bbcaea69099fc012e639606',
                            '5bbcae289099fc012e6387ba', '5bbcae0c9099fc012e6385c0'],
    source2_id:             ['5bbcae989099fc012e639475', '5bbcae819099fc012e639304', '5bbcae989099fc012e639480', '5bbcae809099fc012e6392f6', '5bbcae809099fc012e6392fd', '5bbcae369099fc012e638942', '5bbcaea69099fc012e639607',
                            '5bbcae289099fc012e6387bb', '5bbcae0c9099fc012e6385bf'],
    canister1_id:           ['5e30677977034e78c09bdc43', '5e5b806d74988df745a4b854', '5e46d3baed5fa02c73c87173', '5e5507eea3d520c61a772d62', '5e633eec0fb27ea4b9057705', '5e90ce9c6569f3b8646c2dd9', '5e8dc130586f870dab1ad8f0',
                            '5e98ac5e9d7869251e6946d0', '5eb15b8b46cbb52b99c08826'], //for source1
    canister2_id:           ['5e354b518c0dfc0f7b8dc1d0', '5e5c5f2b27cac98f038eed99', '5e466fb08bfc04c165b13edb', '5e561baebcb7d67abec5f433', '5e634359c5abbb02df5ba123', '5e90bdbad7f6fb31a430407d', '5e8dc2604541e5ab90ab1bb3',
                            '5e98b45b2bcf55a3e58155fb', '5eb15d07d50f1551bbeed90b'], //for source2
    mineralcanister_id:     ['5e3ca0a32f38f39b095da816', '5e5c909be1a1395885e81156', '5e4f6a0761106b557aa66abe', '5e5b5b1c403d152c992428c4', '5e6399727e402f275b8831ee', '5e91036af08f70e2828a45b2', '5e8f2204b9e23c1518b47557',
                            '5e98be7fc417b45c3149ef5d', '5eb292387f36033a77b14cf8'],

    reserveflag:            [Game.flags['Core1'], 'NULL', Game.flags['Core3'], Game.flags['Core4'], Game.flags['Core5']], //rally point for remote room reservation
    remoteflag:             [Game.flags['Terrazine'], 'NULL', Game.flags['Jorium'], Game.flags['Protodermis'], Game.flags['Vespene']], //rally point for remote mining
    remotectrl_id:          ['5bbcae809099fc012e6392ef', 'NULL', '5bbcaea69099fc012e63960d', '5bbcae809099fc012e6392f2', '5bbcae809099fc012e6392f8'],
    remotesource_id:        ['5bbcae809099fc012e6392ee', 'NULL', '5bbcaea69099fc012e63960e', '5bbcae809099fc012e6392f1', '5bbcae809099fc012e6392f9'],
    remotecanister_id:      ['5e6586c57abdad3e01ad88f7', 'NULL', '5e490bf22a3d564b0565c52d', '5e716359fa9ac914fed34e30', '5e7014edbb478ab96f6ca1e4'], //drop-mining containers (o.assimilator)

    tower_id:               ['5e76a9799b9279cd3b8d5c7d', '5e5c992bb655c985f872fdd1', '5ea4d90bcdd80c534a3abc8e', '5e6dedb3b2181dab6255bd37', '5eacde6466154c86cb8dbf5a', '5e76c1bc7e17fe2a086ed2e0'], //remote mining team retreats towards this
                
    warpRX_id:              ['5e34d2403561285c52aba5b2', '5e5fde06e4c9ff32dfb1a4d1', '5e4a79f221466ebb4fcc858b', '5e5b2064a981827aa51b60e7', '5e686d03c5ef3b7a6e6f21b7', '5e964440cccec473624b299a', '5e927256a01077492a319dcf',
                            '5e9e3355f6752e15d441a1b8', '5eb898877270c26532be96c3'], //rx link (adherent)
    warpTX_id:              [['5e437e083561285674b0989c','5e34d803221670187690e4d7'],
                            ['5e601a514f07353e676e5376'],
                            ['5e4a844a035927629b09d4a3'],
                            ['5e6cad8c43e2d4d024ddfbb6', '5e5b5c7d02d3761fb826bbec'],
                            ['5e687dae79654f271243ddc4'],
                            ['5e964bf152b012a966941064'],
                            ['NULL', '5e92789e45cd497f9ff85b44'],
                            ['NULL', '5e9e48317e29d56b7b6eca8a'],
                            ['5eb80e2ff96388fd8ad681dc']], //tx link (acolyte)
    adher_tile_id:          ['5e2ec350d41b0bd406dfd71b', '5e5dab190fb27e9efd036585', '5e4a7ac80f2d8f5302547cc6', '5e55f3ea976d8d949fbe40ce', '5e686ad59a55357c46e65029', '5e96417857cc2c376dc3c22f', '5e926ffb3dfe155ca3cc501b',
                            '5e9e3113a8c647e32b811d14', '5eb7daf4a7d7c88810f4afc6'],
    
    
    //special usernames
    allies:                 ['Hellbuck'],
    notif_blacklist:        ['Invader','Patch'],
    
    
    //body parts by role
    edrone_body:            [WORK, CARRY,CARRY, MOVE,MOVE],
                            //cost: 300
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
    assim_body:             [[WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE]],
                            //cost: 650, 550, 550, 650, 550, 550, 550, 550, 550
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
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
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
    recal_body:             [[CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            [],
                            [],
                            [],
                            []],
                            //cost: 2600, 1950, 1950, 1300, 1300, NULL, NULL, NULL, NULL
    oassim_body:            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 850
    odrone_body:            [[CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE]],
                            //cost: 2400, 900, 2100, 1800, 1800
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
    treas_body:             [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            //cost: 550
                
    emiss_body:             [MOVE],
                            //cost: 50
    dt_body:                [[MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK,
                                MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK],
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]],
                            //cost: 2990, 1690
    dp_body:                [[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]],
                            //cost: 2230, 1690
    halluc_body:            [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1800
    ht_body:                [HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL, MOVE,MOVE,MOVE,MOVE],
                            //cost: 2150
    zealot_body:            [ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1680
};