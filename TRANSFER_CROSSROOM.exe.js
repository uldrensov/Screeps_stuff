//executable script: transfers goods across owned terminals
    //require('TRANSFER_CROSSROOM.exe').run(0,8,RESOURCE_ENERGY,100000)

var SD = require('SET_SOFTDATA');


module.exports = {
    run: function(src, dest, rsrc_type, amt){
        
        //room validation
        if (src < 0 || src >= SD.spawner_id.length)     return 'TRANSFER_CROSSROOM:: INVALID -SRC- ARGUMENT';
        if (dest < 0 || dest >= SD.spawner_id.length)   return 'TRANSFER_CROSSROOM:: INVALID -DEST- ARGUMENT';
        
        //resource type validation
        for (let i=0; i<RESOURCES_ALL.length; i++){
            if (rsrc_type == RESOURCES_ALL[i])          break;
            else if (i == RESOURCES_ALL.length-1)       return 'TRANSFER_CROSSROOM:: INVALID RESOURCE TYPE';
        }
        
        let nexi = [];
        for (let i=0; i<SD.spawner_id.length; i++){
            nexi[i] = Game.getObjectById(SD.spawner_id[i][0]);
        }
        
        //terminal validation
        if (!nexi[src].room.terminal)                   return 'TRANSFER_CROSSROOM:: NO TERMINAL PRESENT IN -SRC- ROOM';
        if (!nexi[dest].room.terminal)                  return 'TRANSFER_CROSSROOM:: NO TERMINAL PRESENT IN -DEST- ROOM';
        
        
        //execute
        let circResult = nexi[src].room.terminal.send(rsrc_type, amt, nexi[dest].room.name);

        //return confirmation of success, or failure error message
        switch (circResult){
            case 0:
                return 'TRANSFER_CROSSROOM:: ACTION SUCCESSFUL';
            case -6:
                return 'TRANSFER_CROSSROOM:: CANNOT AFFORD THIS ACTION';
            case -11:
                return 'TRANSFER_CROSSROOM:: TERMINAL COOLING DOWN...PLEASE WAIT BEFORE TRANSFERRING RESOURCES AGAIN'
            default:
                return 'TRANSFER_CROSSROOM:: OPERATION FAILED WITH TERMINAL ERROR CODE ' + circResult;
        }
    }
};