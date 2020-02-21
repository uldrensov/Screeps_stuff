//ZEALOT: cross-room warrior that pairs with a HALLUCINATION
//red trail ("fighter")

module.exports = {
    run: function(unit, standby_flag, target_flag){
        
        //trek to the standby point once
        if (!unit.memory.in_place)
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff0000'}});
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.in_place = true;

        
        //locate a tank within the standby room, and follow it closely within the room
        if (unit.memory.in_place){
            //commit the tank unit's ID to memory (once) when both units are in the same room
            if (unit.memory.tank_id == undefined){
                var tank = _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
                if (tank.length){
                    if (tank[0].room == standby_flag.room)
                        unit.memory.tank_id = tank[0].id;
                }
            }
            //if the tank is found, and leaves the standby room, follow it into the foreign room
            else if (Game.getObjectById(unit.memory.tank_id).room == target_flag.room){
                //follow
                if (unit.room != target_flag.room)
                    unit.moveTo(target_flag, {visualizePathStyle: {stroke: '#ff0000'}});
                //once followed, attack a target
                else{
                    var att = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_EXTENSION;
                        }
                    });
                    if (unit.attack(att[0]) == ERR_NOT_IN_RANGE)
                        unit.moveTo(att[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
    }
};