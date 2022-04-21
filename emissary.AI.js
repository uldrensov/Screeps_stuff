//EMISSARY: simple scout
//cyan trail ("support")
//TODO: this model is a prototype

module.exports = {
    run: function(unit, standby_1){
        
        //one-time single-flag rally FSM
        if (!unit.memory.rallied)
            unit.moveTo(standby_1, {visualizePathStyle: {stroke: '#00ffff'}});
        if (unit.pos.isEqualTo(standby_1.pos))
            unit.memory.rallied = true;

        
        if (unit.memory.rallied){
            //trample all hostile construction sites
            let shrines = unit.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, {
                filter: RoomObject => {
                    return RoomObject.progress > 0;
                }
            });
            
            if (shrines)
                unit.moveTo(shrines, {visualizePathStyle: {stroke: '#00ffff'}});
            //return to flag when there are no more sites to trample
            //else unit.memory.rallied = false;
        }
    }
};