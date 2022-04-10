//executable script: transfers goods across owned terminals
    //require('CIRCULATE.exe').run(0,8,RESOURCE_ENERGY,100000)

var SD = require('SOFTDATA');


module.exports = {
    run: function(src, dest, rsrc_type, amt){
        
        //room validation
        if (src < 0 || src >= SD.nexus_id.length)   return 'CIRCULATE:: INVALID -SRC- ARGUMENT';
        if (dest < 0 || dest >= SD.nexus_id.length) return 'CIRCULATE:: INVALID -DEST- ARGUMENT';
        
        //resource type validation
        for (let i=0; i<RESOURCES_ALL.length; i++){
            if (rsrc_type == RESOURCES_ALL[i])      break;
            else if (i == RESOURCES_ALL.length-1)   return 'CIRCULATE:: INVALID RESOURCE TYPE';
        }
        
        let nexi = [];
        for (let i=0; i<SD.nexus_id.length; i++){
            nexi[i] = Game.getObjectById(SD.nexus_id[i]);
        }
        
        //terminal validation
        if (!nexi[src].room.terminal)               return 'CIRCULATE:: NO TERMINAL PRESENT IN -SRC- ROOM';
        if (!nexi[dest].room.terminal)              return 'CIRCULATE:: NO TERMINAL PRESENT IN -DEST- ROOM';
        
        
        //execute
        let circResult = nexi[src].room.terminal.send(rsrc_type, amt, nexi[dest].room.name);

        //return confirmation of success, or failure error message
        switch (circResult){
            case 0:
                return 'CIRCULATE:: ACTION SUCCESSFUL';
            case -6:
                return 'CIRCULATE:: CANNOT AFFORD THIS ACTION';
            case -11:
                return 'CIRCULATE:: TERMINAL COOLING DOWN...PLEASE WAIT BEFORE TRANSFERRING RESOURCES AGAIN'
            default:
                return 'CIRCULATE:: OPERATION FAILED WITH TERMINAL ERROR CODE ' + circResult;
        }
    }
};