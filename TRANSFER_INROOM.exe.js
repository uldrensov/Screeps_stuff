//executable script: spawns a treasurer unit (if applicable), and writes a command into its memory
//optionally, can also be called automatically by DRIVE_ECON.js
    //require('TRANSFER_INROOM.exe').run(3, RESOURCE_ENERGY, 100000, 'TRM', true, true)
    //require('TRANSFER_INROOM.exe').run(0, RESOURCE_POWER, 100, 'PWR', true, true)
    //require('TRANSFER_INROOM.exe').run(7, RESOURCE_ENERGY, 100000, 'NUK', true, true)
    
var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(room_num, o_type, o_amt, spec, dir, autokill){
        
        //validation
        let dest_toString;

        switch (spec){
            case 'TRM':
                dest_toString = 'terminal';
                break;

            case 'PWR':
                if (!dir)
                    return 'TRANSFER_INROOM:: POWER SPAWN WITHDRAW ACTION NOT SUPPORTED';
                dest_toString = 'power nexus';
                break;

            case 'NUK':
                if (!dir)
                    return 'TRANSFER_INROOM:: NUKER WITHDRAW ACTION NOT SUPPORTED';
                if (o_type != RESOURCE_ENERGY && o_type != RESOURCE_GHODIUM)
                    return 'TRANSFER_INROOM:: NUKER ONLY SUPPORTS ENERGY AND GHODIUM INPUTS';
                dest_toString = 'nuker';
                break;

            case 'FAC':
                dest_toString = 'factory';
                break;

            default:
                    return 'TRANSFER_INROOM:: INVALID DESTINATION';
        }
        

        //determine if a treasurer already exists in the specified room (exhaustive search)
        let unit;
        let treasurer;

        for (let name in Game.creeps){
            unit = Game.creeps[name];

            if (unit.room == Game.getObjectById(SD.ctrl_id[room_num]).room
                &&
                unit.memory.role == 'treasurer'){

                treasurer = unit;
                break;
            }
        }
        

        let local_nexi = Game.getObjectById(SD.ctrl_id[room_num]).room.find(FIND_STRUCTURES, {
            filter: structure => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });

        //if no treasurer currently exists, spawn a new one to execute the command
        if (!treasurer && local_nexi.length){
            //determine an unoccupied nexus for the treasurer
            let openNexus;

            for (let i=0; i<local_nexi.length; i++){
                //find a nexus that isn't currently trying to spawn something
                if (!local_nexi[i].spawning){
                    openNexus = local_nexi[i]
                    break;
                }
            }

            //if no available nexus, exit script
            if (!openNexus)
                return 'TRANSFER_INROOM:: ALL SPAWNERS IN ROOM #' + room_num + ' ARE CURRENTLY OCCUPIED';


            //spawn the treasurer and initialise a command
            let spawnResult = openNexus.spawnCreep(SD.treas_body, 'Treasurer[' + room_num + ']-' + Game.time % SD.name_interval,
                {memory: {role: 'treasurer', order_type: o_type, order_amt: o_amt, dir: dir, spec_dest: spec, task_progress: 0, autokill: autokill, home_index: room_num}});

            if (spawnResult == OK)
                console.log('TRANSFER_INROOM:: Treasurer[' + room_num + ']-' + Game.time % SD.name_interval + ' spawning.'); //emulate a spawn message, as seen in DRIVE_SPAWN.js
            else
                return 'TRANSFER_INROOM:: TREASURER SPAWN FAILED WITH NEXUS ERROR CODE ' + spawnResult;
        }
        
        //if a treasurer exists, simply rewrite its memory contents to issue the new command
        else{
            unit.memory.order_type =    o_type;
            unit.memory.order_amt =     o_amt;
            unit.memory.dir =           dir;
            unit.memory.spec_dest =     spec;
            unit.memory.task_progress = 0;
            unit.memory.autokill =      autokill;
        }
        

        //return confirmation of success
        let dir_toString = dir ? 'loading' : 'unloading';
        let to_fro = dir ? 'to' : 'from';
        console.log('TRANSFER_INROOM:: ISSUING COMMAND: ROOM #' + room_num + ' ' + dir_toString + ' ' + o_amt + ' [' + o_type + '] ' + to_fro + ' ' + dest_toString);
        
        return OK;
    }
};