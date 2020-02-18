//library containing all reconfigurable and server-specific variables

module.exports = {
    
    //numbers
    time_offset:            100000,
    fixation_override:      .25, //probes will break fixation upon spotting an absolute % gap this wide
    drone_price:            [1000,1000,600],
    en_ignore_lim:          150, //drones/sacrificers/probes will ignore containers/pickups containing less energy than this
    tower_reserve_ratio:    .5, //towers will reserve this percentage of their energy for attacking
    vault_reserve_min:      100000, //all units except (e)drones and energisers will avoid vaults containing less than this
    
    
    //object IDs
    nexus_id:               ['5e2d15a9e152154167131760', '5e3909b408abb42e9b310a46', '5e466c796fffaf84254b19ed'],
    controller_id:          ['5bbcae989099fc012e639474', '5bbcae989099fc012e639478', '5bbcae989099fc012e63947f'],

    source1_id:             ['5bbcae989099fc012e639476', '5bbcae989099fc012e639479', '5bbcae989099fc012e63947e'],
    source2_id:             ['5bbcae989099fc012e639475', 'NULL', '5bbcae989099fc012e639480'],
    canister1_id:           ['5e30677977034e78c09bdc43', '5e393db88c0dfcfcb18f05d2', '5e46d3baed5fa02c73c87173'], //corresponds to source1
    canister2_id:           ['5e354b518c0dfc0f7b8dc1d0', 'NULL', '5e466fb08bfc04c165b13edb'], //corresponds to source2
    mineralcanister_id:     ['5e3ca0a32f38f39b095da816', '5e49e41a8542f3df09eda72c'],

    reserveflag:            [Game.flags['Core1'], Game.flags['Core2'], Game.flags['Core3']], //rally point for remote room reservation
    remoteflag:             [Game.flags['Terrazine'], Game.flags['Vespene'], Game.flags['Jorium']], //rally point for remote mining
    remotesource_id:        ['5bbcae809099fc012e6392ee', '5bbcae989099fc012e63947b', '5bbcaea69099fc012e63960e'],
    remotecanister_id:      ['5e4761c7b1b0bd16bd38baf0', '5e4b8e89d4e9fb1bea4e27a1', '5e490bf22a3d564b0565c52d'], //drop-mining containers (o.assimilator)
    remotedrop_id:          ['5e323d61aa9957193cc8ec6c', '5e3ff330d9c0d0411296ffb0', '5e48c7a10359276c64092767'], //destination receptacles (o.drone)

    tower_id:               [['5e2f4a33e8af4a1c6459ccd8', '5e346820d632bc24398489ab'], ['5e3a68c9aa99575a56cba5da', '5e401cc59c6dc7073200b5b7'], ['5e473a110058163253b64554', '5e4a55092f9d26c57d90c465']],
                
    warpRX_id:              ['5e34d2403561285c52aba5b2', '5e437aa1ac1ec4151e946cb9', '5e4a79f221466ebb4fcc858b'], //receiver link (adherent)
    warpTX_id:              [['5e437e083561285674b0989c','5e34d803221670187690e4d7'], ['5e3ff330d9c0d0411296ffb0']], //transmitter link (acolyte)
    acoly_tile_id:          [['5e30677977034e78c09bdc43','5e354b518c0dfc0f7b8dc1d0'], ['5e393db88c0dfcfcb18f05d2']],
    adher_tile_id:          ['5e2ec350d41b0bd406dfd71b', '5e437ad0aa9957378eced59c', '5e4a7ac80f2d8f5302547cc6'],
    holy_source:            [['5bbcae989099fc012e639476','5bbcae989099fc012e639475'], ['5bbcae989099fc012e639479']], //acolyte's chosen source
    
    
    //body parts by role
    edrone_body:            [WORK, CARRY,CARRY, MOVE,MOVE],
                            //cost: 300
    assim_body:             [[WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, MOVE]],
                            //cost: 650, 650, 550
    drone_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE]],
                            //cost: 750, 750, 600
    energ_body:             [[CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE],
                            [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 750, 750, 750
    sacrif_body:            [[],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: NULL, 1200, 1200
    acoly_body:             [[WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            []],
                            //cost: 850, 1050, NULL
    adher_body:             [CARRY,CARRY,CARRY,CARRY, MOVE],
                            //cost: 250
    suppl_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY, MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 1650, 950, 1550
    probe_body:             [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2050, 1600, 1300
    recal_body:             [CLAIM, MOVE],
                            //cost: 650
    oassim_body:            [[WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK, CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 850, 850, 850
    odrone_body:            [[CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE,
                                CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE],
                            [CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE, CARRY,MOVE]],
                            //cost: 2100, 900, 1800
    bloodh_body:            [[ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, HEAL,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, HEAL,MOVE],
                            [ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, ATTACK,MOVE, HEAL,MOVE]],
                            //cost: 950, 950, 950
    purif_body:             [[CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM,CLAIM, MOVE,MOVE],
                            [CLAIM,CLAIM, MOVE]],
                            //cost: 2050, 2050, 1350
    androne_body:           [CARRY,CARRY,CARRY,CARRY, MOVE, MOVE],
                            //cost: 300
    anassim_body:           [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 1500
    archit_body:            [[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            [WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]],
                            //cost: 2300, 2050, 1200
    speci_body:             [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY, MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
                            //cost: 2300
                
    emiss_body:             [MOVE],
                            //cost: 50
    dt_body:                [[MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK, MOVE,ATTACK,
                                MOVE,ATTACK, MOVE,ATTACK],
                            [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK]],
                            //cost: 2210, 1690
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