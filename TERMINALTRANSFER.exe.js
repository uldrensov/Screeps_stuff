//executable script: spawns a treasurer unit (if applicable), and writes a command into its memory
    //require('TERMINALTRANSFER.exe').run(2,RESOURCE_ENERGY,100000,true,true)
    
var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num, o_type, o_amt, dir, autokill){
        
        var nexus = Game.getObjectById(SD.nexus_id[room_num]);
        var gateway = Game.getObjectById(SD.gateway_id[room_num]);
        
        
        //determine if a treasurer already exists in the specified room
        var treasurer = false;
        for (var name in Game.creeps){
            var unit = Game.creeps[name];
            if (unit.room == nexus.room && unit.memory.role == 'treasurer'){
                treasurer = unit;
                break;
            }
        }
                    
        //if one doesn't exist, spawn one and issue order parameters at spawn
        if (!treasurer){
            var spawnResult = nexus.spawnCreep(SD.treas_body, 'Treasurer-' + Game.time % SD.time_offset, {memory: {role: 'treasurer', order_type: o_type, order_amt: o_amt, dir: dir, task_progress: 0, autokill: autokill}});
            if (spawnResult == OK)
                console.log('Room #' + room_num + ': Treasurer-' + Game.time % SD.time_offset + ' spawning.');
            else if (spawnResult == ERR_BUSY && gateway != undefined){
                var spawnResult2 = gateway.spawnCreep(SD.treas_body, 'Treasurer-' + Game.time % SD.time_offset, {memory: {role: 'treasurer', order_type: o_type, order_amt: o_amt, dir: dir, task_progress: 0, autokill: autokill}});
                if (spawnResult2 == OK)
                    console.log('Room #' + room_num + ': Treasurer-' + Game.time % SD.time_offset + ' spawning.');
                else return 'GATEWAY ERROR: ' + spawnResult2;
            }
            else return 'NEXUS ERROR: ' + spawnResult;
        }
        //if one exists, rewrite its memory contents to issue a new command
        else{
            unit.memory.order_type = o_type;
            unit.memory.order_amt = o_amt;
            unit.memory.dir = dir;
            unit.memory.task_progress = 0;
            unit.memory.autokill = autokill;
        }
        
        var dir_toString = dir? 'loading':'unloading';
        return '--ISSUING COMMAND: ROOM #' + room_num + ' ' + dir_toString + ' ' + o_amt + ' [' + o_type + ']--';
    }
};