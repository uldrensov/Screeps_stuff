//DARK TEMPLAR: cross-room aggressive warrior designed to punish defenseless rooms
//red trail ("fighter")
//TODO: this model is a prototype

module.exports = {
    run: function(unit, standby_flag){
        
        //one-time single-flag rally FSM
        if (!unit.memory.rallied)
            unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff0000'}});
        if (unit.pos.isEqualTo(standby_flag.pos))
            unit.memory.rallied = true;
            
            
        //destroy everything in the room
        if (unit.memory.rallied){
            //acquire all possible targets
            const hatchery = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_SPAWN;
                }
            });
            const creeptumor = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_EXTENSION;
                }
            });
            const spinecrawler = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                filter: structure => {
                    return structure.structureType == STRUCTURE_TOWER;
                }
            });
            const abomination = unit.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        

            //select target
            let lockon;
            
            if (spinecrawler)       lockon = spinecrawler;
            else if (creeptumor)    lockon = creeptumor;
            else if (hatchery)      lockon = hatchery;
            else if (abomination)   lockon = abomination;
            else                    lockon = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES); //any remaining structures
        

            //attack target
            if (lockon){
                if (unit.attack(lockon) == ERR_NOT_IN_RANGE)
                    unit.moveTo(lockon, {visualizePathStyle: {stroke: '#ff0000'}});

                else if (unit.attack(lockon) == ERR_NO_BODYPART) //safe mode
                    unit.moveTo(Game.flags['Vespene'], {visualizePathStyle: {stroke: '#ff0000'}}); //TODO: why is this specific flag used?
            }
        }
    }
};