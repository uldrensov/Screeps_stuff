//executable script: spawns a treasurer unit (if applicable), and writes a command into its memory
    //require('TERMINALTRANSFER.exe').run(3,'energy',100000,'NA',true,true)
    //require('TERMINALTRANSFER.exe').run(0,RESOURCE_POWER,100,'P',true,true)
    //require('TERMINALTRANSFER.exe').run(7,'energy',50000,'NUK',true,true)
    
var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num, o_type, o_amt, spec, dir, autokill){
        
        //validation
        let dest_toString;
        switch (spec){
            case 'NA':
                dest_toString = 'terminal';
                break;
            case 'P':
                if (!dir) return 'ERROR: POWER SPAWN WITHDRAW ACTION NOT SUPPORTED';
                dest_toString = 'power nexus';
                break;
            case 'NUK':
                if (!dir) return 'ERROR: NUKER WITHDRAW ACTION NOT SUPPORTED';
                if (o_type != RESOURCE_ENERGY && o_type != RESOURCE_GHODIUM) return 'ERROR: NUKER ONLY SUPPORTS ENERGY AND GHODIUM';
                dest_toString = 'nuker';
                break;
            default:
                return 'INVALID DESTINATION';
        }
        
        
        //determine a viable spawner
        let openNexus = Game.getObjectById(SD.spawner_id[room_num][0]);
        for (let i=0; i<SD.spawner_id[room_num].length; i++){
            if (Game.getObjectById(SD.spawner_id[room_num][i]) == null) continue; //emergency bypass
            if (Game.getObjectById(SD.spawner_id[room_num][i]).spawning == null){
                openNexus = Game.getObjectById(SD.spawner_id[room_num][i]);
                break;
            }
        }
        
        
        //determine if a treasurer already exists in the specified room
        let treasurer = false;
        for (let name in Game.creeps){
            var unit = Game.creeps[name];
            if (unit.room == openNexus.room && unit.memory.role == 'treasurer'){
                treasurer = unit;
                break;
            }
        }
                    
        //if one doesn't exist, spawn one and issue order parameters at spawn
        if (!treasurer){
            let spawnResult = openNexus.spawnCreep(SD.treas_body, 'Treasurer-' + Game.time % SD.time_offset, {memory: {role: 'treasurer', order_type:o_type, order_amt:o_amt, dir:dir, spec_dest:spec, task_progress:0, autokill:autokill}});
            if (spawnResult == OK)
                console.log('Room #' + room_num + ': Treasurer-' + Game.time % SD.time_offset + ' spawning.');
            else return 'NEXUS ERROR: ' + spawnResult;
        }
        //if one exists, rewrite its memory contents to issue a new command
        else{
            unit.memory.order_type = o_type;
            unit.memory.order_amt = o_amt;
            unit.memory.dir = dir;
            unit.memory.spec_dest = spec;
            unit.memory.task_progress = 0;
            unit.memory.autokill = autokill;
        }
        
        let dir_toString = dir? 'loading':'unloading';
        let to_fro = dir? 'to':'from';
        return '--ISSUING COMMAND: ROOM #' + room_num + ' ' + dir_toString + ' ' + o_amt + ' [' + o_type + '] ' + to_fro + ' ' + dest_toString;
    }
};