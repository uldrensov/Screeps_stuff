//executable script: spawns a treasurer unit (if applicable), and writes a command into its memory
    //require('TERMINALTRANSFER.exe').run(2,RESOURCE_ENERGY,10000,true)
    
var SD = require('SOFTDATA');


module.exports = {
    run: function(room_num, o_type, o_amt, dir){
        
        var nexus = Game.getObjectById(SD.nexus_id[room_num]);
        
        
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
            var spawn_result = nexus.spawnCreep(SD.treas_body[room_num], 'Treasurer-' + Game.time % SD.time_offset, {memory: {role: 'treasurer', order_type: o_type, order_amt: o_amt, dir: dir, task_progress: 0}});
            if (spawn_result == OK)
                console.log('Room #' + room_num + ': Treasurer-' + Game.time % SD.time_offset + ' spawning.');
            else return spawn_result;
        }
        //if one exists, rewrite its memory contents to issue a new command
        else{
            unit.memory.order_type = o_type;
            unit.memory.order_amt = o_amt;
            unit.memory.dir = dir;
            unit.memory.task_progress = 0;
        }
        
        var dir_toString = dir? 'loading':'unloading';
        return '--ISSUING COMMAND: ROOM #' + room_num + ' ' + dir_toString + ' ' + o_amt + ' [' + o_type + ']--';
    }
};