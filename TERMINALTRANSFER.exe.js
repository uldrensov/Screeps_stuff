//executable script: spawns a treasurer unit (if applicable), and writes a command into its memory
//optionally, can also be called automatically by DRIVE_ECON.js
    //require('TERMINALTRANSFER.exe').run(3,RESOURCE_ENERGY,100000,'TRM',true,true)
    //require('TERMINALTRANSFER.exe').run(0,RESOURCE_POWER,100,'PWR',true,true)
    //require('TERMINALTRANSFER.exe').run(7,RESOURCE_ENERGY,100000,'NUK',true,true)
    
var SD = require('SOFTDATA');


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
                    return 'TERMINALTRANSFER:: POWER SPAWN WITHDRAW ACTION NOT SUPPORTED';
                dest_toString = 'power nexus';
                break;

            case 'NUK':
                if (!dir)
                    return 'TERMINALTRANSFER:: NUKER WITHDRAW ACTION NOT SUPPORTED';
                if (o_type != RESOURCE_ENERGY && o_type != RESOURCE_GHODIUM)
                    return 'TERMINALTRANSFER:: NUKER ONLY SUPPORTS ENERGY AND GHODIUM INPUTS';
                dest_toString = 'nuker';
                break;

            case 'FAC':
                dest_toString = 'factory';
                break;

            default:
                    return 'TERMINALTRANSFER:: INVALID DESTINATION';
        }
        

        //determine if a treasurer already exists in the specified room (exhaustive search)
        let unit;
        let treasurer = false;

        for (let name in Game.creeps){
            unit = Game.creeps[name];

            if (unit.room == Game.getObjectById(SD.nexus_id[room_num]).room
                &&
                unit.memory.role == 'treasurer'){

                treasurer = unit;
                break;
            }
        }
        

        //if no treasurer currently exists...
        let openNexus = Game.getObjectById(SD.spawner_id[room_num][0]);

        if (!treasurer){
            //determine an unoccupied spawner for the treasurer
            for (let i=0; i<SD.spawner_id[room_num].length; i++){
                if (Game.getObjectById(SD.spawner_id[room_num][i]) == null)     continue; //error: if nexus fails to retrieve, skip the room

                if (Game.getObjectById(SD.spawner_id[room_num][i]).spawning == null){
                    openNexus = Game.getObjectById(SD.spawner_id[room_num][i]);
                    break;
                }
            
                //this only triggers if no unoccupied spawner is found
                if (i == SD.spawner_id[room_num].length - 1)
                    return 'TERMINALTRANSFER:: ALL SPAWNERS IN ROOM #' + room_num + ' ARE CURRENTLY OCCUPIED';
            }

            //spawn the treasurer and initialise a command
            let spawnResult = openNexus.spawnCreep(SD.treas_body, 'Treasurer[' + room_num + ']-' + Game.time % SD.time_offset,
                {memory: {role: 'treasurer', order_type: o_type, order_amt: o_amt, dir: dir, spec_dest: spec, task_progress: 0, autokill: autokill, home_index: room_num}});

            if (spawnResult == OK)
                console.log('TERMINALTRANSFER:: Treasurer[' + room_num + ']-' + Game.time % SD.time_offset + ' spawning.');
            else
                return 'TERMINALTRANSFER:: TREASURER SPAWN FAILED WITH NEXUS ERROR CODE ' + spawnResult;
        }
        
        //if a treasurer exists, simply rewrite its memory contents to issue a new command
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
        console.log('TERMINALTRANSFER:: ISSUING COMMAND: ROOM #' + room_num + ' ' + dir_toString + ' ' + o_amt + ' [' + o_type + '] ' + to_fro + ' ' + dest_toString);
        
        return OK;
    }
};