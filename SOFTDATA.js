//library: contains all reconfigurable and server-specific variables

module.exports = {
    
    //numbers
    time_offset:            100000,
    fixation_override:      .25, //probes will break fixation upon spotting an absolute % gap this wide
    canister_bias:          500, //can force canister-fetching units to prefer one by default, until this wide of a disparity is detected
    drone_price:            [750,750,600,400],
    claim_strength:         [4,3,3],
    en_ignore_lim:          150, //drones/sacrificers/probes will ignore containers/pickups containing less energy than this
    tower_reserve_ratio:    .5, //towers will reserve this percentage of their energy for attacking
    vault_reserve_min:      100000, //all units except (e)drones and energisers will avoid vaults containing less than this
    
    
    //object IDs
    nexus_id:               ['5e2d15a9e152154167131760', '5e3909b408abb42e9b310a46', '5e466c796fffaf84254b19ed', '5e54f87a1db3d7858ff87a0b'],
    gateway_id:             ['5e4df021084d7dbe916b582f'],
    controller_id:          ['5bbcae989099fc012e639474', '5bbcae989099fc012e639478', '5bbcae989099fc012e63947f', '5bbcae809099fc012e6392f5'],

    source1_id:             ['5bbcae989099fc012e639476', '5bbcae989099fc012e639479', '5bbcae989099fc012e63947e', '5bbcae809099fc012e6392f4'],
    source2_id:             ['5bbcae989099fc012e639475', 'NULL', '5bbcae989099fc012e639480', '5bbcae809099fc012e6392f6'],
    canister1_id:           ['5e30677977034e78c09bdc43', '5e393db88c0dfcfcb18f05d2', '5e46d3baed5fa02c73c87173', '5e5507eea3d520c61a772d62'], //corresponds to source1
    canister2_id:           ['5e354b518c0dfc0f7b8dc1d0', 'NULL', '5e466fb08bfc04c165b13edb', '5e561baebcb7d67abec5f433'], //corresponds to source2
    mineralcanister_id:     ['5e3ca0a32f38f39b095da816', '5e49e41a8542f3df09eda72c', '5e4f6a0761106b557aa66abe'],

    reserveflag:            [Game.flags['Core1'], Game.flags['Core2'], Game.flags['Core3']], //rally point for remote room reservation
    remoteflag:             [Game.flags['Terrazine'], Game.flags['Vespene'], Game.flags['Jorium']], //rally point for remote mining
    remotectrl_id:          ['5bbcae809099fc012e6392ef', '5bbcae989099fc012e63947c', '5bbcaea69099fc012e63960d'],
    remotesource_id:        ['5bbcae809099fc012e6392ee', '5bbcae989099fc012e63947b', '5bbcaea69099fc012e63960e'],
    remotecanister_id:      ['5e4c68eb12701789c879b329', '5e4b8e89d4e9fb1bea4e27a1', '5e490bf22a3d564b0565c52d'], //drop-mining containers (o.assimilator)
    remotedrop_id:          ['5e323d61aa9957193cc8ec6c', '5e3ff330d9c0d0411296ffb0', '5e48c7a10359276c64092767'], //destination receptacles (o.drone)

    tower_id:               [['5e2f4a33e8af4a1c6459ccd8', '5e346820d632bc24398489ab', '5e549f64a3d520f54f770738'],
                            ['5e3a68c9aa99575a56cba5da', '5e401cc59c6dc7073200b5b7'],
                            ['5e473a110058163253b64554', '5e4a55092f9d26c57d90c465']],
                
    warpRX_id:              ['5e34d2403561285c52aba5b2', '5e437aa1ac1ec4151e946cb9', '5e4a79f221466ebb4fcc858b'], //receiver link (adherent)
    warpTX_id:              [['5e437e083561285674b0989c','5e34d803221670187690e4d7'],
                            ['5e3ff330d9c0d0411296ffb0'],
                            ['5e4a844a035927629b09d4a3']],
                            //transmitter link (acolyte)
    acoly_tile_id:          [['5e30677977034e78c09bdc43','5e354b518c0dfc0f7b8dc1d0'],
                            ['5e393db88c0dfcfcb18f05d2']],
    adher_tile_id:          ['5e2ec350d41b0bd406dfd71b', '5e437ad0aa9957378eced59c', '5e4a7ac80f2d8f5302547cc6'],
    holy_source:            [['5bbcae989099fc012e639476','5bbcae989099fc012e639475'],
                            ['5bbcae989099fc012e639479']],
                            //acolyte's chosen source
    
    
    //body parts by role
    edrone_body:            [WORK, CARRY,CARRY, MOVE,MOVE],
                            //cost: 300
    assim_body:             [[WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE]],
                            //cost: 650, 650, 550, 550
    drone_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE]],
                            //cost: 750, 750, 600, 400
    energ_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 750, 750, 750
    sacrif_body:            [[],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK, CARRY,CARRY, MOVE,MOVE,MOVE]],
                            //cost: NULL, 1200, 1200, 550
    acoly_body:             [[WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            []],
                            //cost: 850, 1050, NULL
    adher_body:             [CARRY,CARRY,CARRY,CARRY, MOVE],
                            //cost: 250
    suppl_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE]],
                            //cost: 1650, 950, 1700
    probe_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK, CARRY,CARRY, MOVE,MOVE]],
                            //cost: 2050, 1600, 1600, 400
    recal_body:             [[CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE]],
                            //cost: 2600, 1950, 1950
    oassim_body:            [[WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 850, 850, 850
    odrone_body:            [[CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE]],
                            //cost: 2400, 900, 2100
    bloodh_body:            [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE]],
                            //cost: 650, 650, 650
    enforc_body:            [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE]],
                            //cost: 780, 390, 390
    purif_body:             [[CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE]],
                            //cost: 2050, 2050, 2050
    androne_body:           [CARRY,CARRY,CARRY,CARRY, MOVE, MOVE],
                            //cost: 300
    anassim_body:           [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1500
    archit_body:            [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK, CARRY,CARRY, MOVE,MOVE,MOVE]],
                            //cost: 2300, 2050, 1800, 550
    visio_body:             [[CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE],
                            [CLAIM,MOVE]],
                            //cost: 3250, 650, 650
    speci_body:             [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 2300
    treas_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE]],
                            //cost: 1500, 550, 550
                
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