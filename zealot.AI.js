//ZEALOT: cross-room mobile all-out melee unit that pairs with a tank (hallucination)
//cyan trail

module.exports = {
    run: function(unit,standby_flag,target_flag){
        
        if (unit.memory.in_place == undefined){
            unit.memory.in_place = false;
        }
        
        
        //trek to the standby point once
        if (!unit.memory.in_place){
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#00ffff'}});
        }
        if (unit.pos.isEqualTo(standby_flag.pos)){
            unit.memory.in_place = true;
        }
        
        
        //locate a tank within the standby room, and follow it closely within the room
        if (unit.memory.in_place){
            //commit the tank unit's ID to memory (once) when both units are in the same room
            if (unit.memory.tank_id == undefined){
                var tank = _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
                if (tank.length){
                    if (tank[0].room == standby_flag.room){
                        unit.memory.tank_id = tank[0].id;
                    }
                }
            }
            
            //if the tank is found, and leaves the standby room, follow it into the foreign room
            else if (Game.getObjectById(unit.memory.tank_id).room == target_flag.room){
                //follow
                if (unit.room != target_flag.room){
                    unit.moveTo(target_flag, {visualizePathStyle: {stroke: '#00ffff'}});
                }
                //once followed, attack a target
                else{
                    var att = unit.room.find(FIND_STRUCTURES, {
                        filter: structure => {
                            return structure.structureType == STRUCTURE_EXTENSION;
                        }
                    });
                    if (unit.attack(att[0]) == ERR_NOT_IN_RANGE){
                        unit.moveTo(att[0], {visualizePathStyle: {stroke: '#00ffff'}});
                    }
                }
            }
        }
    }
};