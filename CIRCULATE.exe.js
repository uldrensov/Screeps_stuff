//executable script: transfers goods across owned terminals
    //require('CIRCULATE.exe').run(0,8,'energy',100000)

var SD = require('SOFTDATA');


module.exports = {
    run: function(src, dest, rsrc_type, amt){
        
        //room validation
        if (src < 0 || src >= SD.nexus_id.length) return 'ERROR: Invalid -src- argument';
        if (dest < 0 || dest >= SD.nexus_id.length) return 'ERROR: Invalid -dest- argument';
        
        //resource type validation
        for (let i=0; i<RESOURCES_ALL.length; i++){
            if (rsrc_type == RESOURCES_ALL[i]) break;
            else if (i == RESOURCES_ALL.length-1) return 'ERROR: Invalid resource type';
        }
        
        var nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        //terminal validation
        if (!nexi[src].room.terminal) return 'ERROR: No terminal present at -src-';
        if (!nexi[dest].room.terminal) return 'ERROR: No terminal present at -dest-';
        
        
        let circResult = nexi[src].room.terminal.send(rsrc_type, amt, nexi[dest].room.name);
        switch (circResult){
            case 0:
                return 'ACTION SUCCESSFUL';
            case -6:
                return 'ERROR: CANNOT AFFORD THIS ACTION';
            case -11:
                return 'COOLING DOWN...PLEASE WAIT'
            default:
                return circResult;
        }
    }
};