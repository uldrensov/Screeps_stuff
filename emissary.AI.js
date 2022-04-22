//EMISSARY: scouting unit that tramples foreign construction hotspots while on the march
//cyan trail ("support")
//TODO: this model is a prototype

module.exports = {
    run: function(unit, standby_1){
        
        //one-time single-flag rally FSM (modified to work with 'trampling' flag)
        if (!unit.memory.rallied && !unit.memory.trampling)
            unit.moveTo(standby_1, {visualizePathStyle: {stroke: '#00ffff'}});
        if (unit.pos.isEqualTo(standby_1.pos))
            unit.memory.rallied = true;

        
        //search for hostile contruction sites to trample, en route to the flag
        if (!unit.memory.rallied){
            const shrines = unit.pos.findClosestByRange(FIND_HOSTILE_CONSTRUCTION_SITES, {
                filter: RoomObject => {
                    return RoomObject.progress > 0;
                }
            });
            

            if (shrines){
                unit.memory.trampling = true;
                unit.moveTo(shrines, {visualizePathStyle: {stroke: '#00ffff'}});
            }
            else
                unit.memory.trampling = false;
        }
    }
};