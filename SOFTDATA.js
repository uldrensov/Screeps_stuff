//library: contains all reconfigurable and server-specific variables

module.exports = {
    
    //numbers
    roomcount:              5,
    time_offset:            100000,
    fixation_override:      .25, //probes will break fixation upon spotting an absolute % gap this wide
    canister_bias:          300, //can force canister-fetching units to prefer one by default, until this wide of a disparity is detected
    en_ignore_lim:          100, //drones/sacrificers/probes will ignore containers/pickups containing less energy than this
    tower_reserve_ratio:    .5, //towers will reserve this percentage of their energy for attacking
    vault_reserve_min:      100000, //all units except (e)drones and energisers will avoid vaults containing less than this
    
    
    //object IDs
    nexus_id:               ['5e2d15a9e152154167131760', '5e5b6eabb5c443745759aa65', '5e466c796fffaf84254b19ed', '5e54f87a1db3d7858ff87a0b', '5e6350bb6270f3464c31ca11'],
    gateway_id:             ['5e4df021084d7dbe916b582f', 'NULL', '5e5c5789da4b319e561048c5', 'NULL'],
    controller_id:          ['5bbcae989099fc012e639474', '5bbcae819099fc012e639302', '5bbcae989099fc012e63947f', '5bbcae809099fc012e6392f5', '5bbcae809099fc012e6392fb'],

    source1_id:             ['5bbcae989099fc012e639476', '5bbcae819099fc012e639303', '5bbcae989099fc012e63947e', '5bbcae809099fc012e6392f4', '5bbcae809099fc012e6392fc'],
    source2_id:             ['5bbcae989099fc012e639475', '5bbcae819099fc012e639304', '5bbcae989099fc012e639480', '5bbcae809099fc012e6392f6', '5bbcae809099fc012e6392fd'],
    canister1_id:           ['5e30677977034e78c09bdc43', '5e5b806d74988df745a4b854', '5e46d3baed5fa02c73c87173', '5e5507eea3d520c61a772d62', '5e633eec0fb27ea4b9057705'], //corresponds to source1
    canister2_id:           ['5e354b518c0dfc0f7b8dc1d0', '5e5c5f2b27cac98f038eed99', '5e466fb08bfc04c165b13edb', '5e561baebcb7d67abec5f433', '5e634359c5abbb02df5ba123'], //corresponds to source2
    mineralcanister_id:     ['5e3ca0a32f38f39b095da816', '5e5c909be1a1395885e81156', '5e4f6a0761106b557aa66abe', '5e5b5b1c403d152c992428c4', '5e6399727e402f275b8831ee'],

    reserveflag:            [Game.flags['Core1'], Game.flags['Core2'], Game.flags['Core3'], Game.flags['Core4']], //rally point for remote room reservation
    remoteflag:             [Game.flags['Terrazine'], Game.flags['Vespene'], Game.flags['Jorium'], Game.flags['Protodermis']], //rally point for remote mining
    remotectrl_id:          ['5bbcae809099fc012e6392ef', 'NULL', '5bbcaea69099fc012e63960d', '5bbcae809099fc012e6392f2'],
    remotesource_id:        ['5bbcae809099fc012e6392ee', 'NULL', '5bbcaea69099fc012e63960e', '5bbcae809099fc012e6392f1'],
    remotecanister_id:      ['5e6586c57abdad3e01ad88f7', 'NULL', '5e490bf22a3d564b0565c52d', '5e65cace7abdad46d3ada2fc'], //drop-mining containers (o.assimilator)
    remotedrop_id:          ['5e323d61aa9957193cc8ec6c', 'NULL', '5e48c7a10359276c64092767', '5e579f8095b8912c485a874f'], //destination receptacles (o.drone)

    tower_id:               ['5e2f4a33e8af4a1c6459ccd8', '5e5c992bb655c985f872fdd1', '5e473a110058163253b64554', '5e57663e6fced9baca5d9db2', '5e6870951e5e3b20f7b8c5e5'],
                
    warpRX_id:              ['5e34d2403561285c52aba5b2', '5e5fde06e4c9ff32dfb1a4d1', '5e4a79f221466ebb4fcc858b', '5e5b2064a981827aa51b60e7', '5e686d03c5ef3b7a6e6f21b7'], //receiver link (adherent)
    warpTX_id:              [['5e437e083561285674b0989c','5e34d803221670187690e4d7'],
                            ['5e601a514f07353e676e5376'],
                            ['5e4a844a035927629b09d4a3'],
                            ['5e6cad8c43e2d4d024ddfbb6', '5e5b5c7d02d3761fb826bbec'],
                            ['5e687dae79654f271243ddc4']], //transmitter link (acolyte)
    adher_tile_id:          ['5e2ec350d41b0bd406dfd71b', '5e5dab190fb27e9efd036585', '5e4a7ac80f2d8f5302547cc6', '5e55f3ea976d8d949fbe40ce', '5e686ad59a55357c46e65029'],
    
    
    //body parts by role
    edrone_body:            [WORK, CARRY,CARRY, MOVE,MOVE],
                            //cost: 300
    drone_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE]],
                            //cost: 1500, 600, 1500, 1200, 450
    assim_body:             [[WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE]],
                            //cost: 650, 550, 550, 650, 550
    energ_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 750, 750, 750, 750, 750
    sacrif_body:            [[],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: NULL, 1200, 1200, 1800, 1800
    acoly_body:             [[WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            []],
                            //cost: 850, 1050, NULL, 1050, NULL
    adher_body:             [CARRY,CARRY,CARRY,CARRY, MOVE],
                            //cost: 250
    suppl_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2150, 2150, 2150, 1950, 2150
    probe_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2050, 1200, 1600, 1200, 1200
    recal_body:             [[CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE],
                            [CLAIM,MOVE, CLAIM,MOVE],
                            []],
                            //cost: 2600, 1950, 1950, 1300, NULL
    oassim_body:            [[WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            []],
                            //cost: 850, 850, 850, 850, NULL
    odrone_body:            [[CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            []],
                            //cost: 2400, 900, 2100, 1800, NULL
    bloodh_body:            [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            []],
                            //cost: 650, 650, 650, 650, NULL
    enforc_body:            [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE],
                            []],
                            //cost: 780, 390, 390, 390, NULL
    purif_body:             [[CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            []],
                            //cost: 2050, 2050, 2050, 2050, NULL
    androne_body:           [CARRY,CARRY,CARRY,CARRY, MOVE, MOVE],
                            //cost: 300
    anassim_body:           [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1500
    archit_body:            [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2300, 1600, 3000, 2300, 1600
    phasarc_body:           [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 1800, 1300, 1300, 1300, 1300
    visio_body:             [[CLAIM,MOVE],
                            [CLAIM,MOVE],
                            [CLAIM,MOVE],
                            [],
                            []],
                            //cost: 3250, 650, 650, NULL, NULL
    speci_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,
                                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            []],
                            //cost: 2650, 1800, NULL, 1800, NULL
    treas_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE]],
                            //cost: 1500, 550, 550, 550, 550
                
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