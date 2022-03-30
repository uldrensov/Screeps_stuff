//DARK TEMPLAR: cross-room aggressive warrior designed to punish defenseless rooms
//red trail ("fighter")

module.exports = {
    run: function(unit, nexus_id, standby_flag){
        
        var nexus = Game.getObjectById(nexus_id);
        
        
        if (!unit.memory.killswitch){
            //rally to the flag location first
            if (!unit.memory.rallied)
                unit.moveTo(standby_flag, {visualizePathStyle: {stroke: '#ff0000'}});
            if (unit.pos.isEqualTo(standby_flag.pos))
                unit.memory.rallied = true;
                
                
            //destroy everything in sight
            if (unit.memory.rallied){
                //acquire targets
                var hatchery = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_SPAWN;
                    }
                });
                var creeptumor = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_EXTENSION;
                    }
                });
                var spinecrawler = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType == STRUCTURE_TOWER;
                    }
                });
                var abomination = unit.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            
                //select and attack target
                var lockon;
                if (spinecrawler) lockon = spinecrawler;
                else if (creeptumor) lockon = creeptumor;
                else if (hatchery) lockon = hatchery;
                else if (abomination) lockon = abomination;
                else lockon = unit.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES); //any remaining structures
            
                if (lockon){
                    if (unit.attack(lockon) == ERR_NOT_IN_RANGE)
                        unit.moveTo(lockon, {visualizePathStyle: {stroke: '#ff0000'}});
                    else if (unit.attack(lockon) == ERR_NO_BODYPART) //safe mode
                        unit.moveTo(Game.flags['Vespene'], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        //built-in economic killswitch
        else if (nexus.recycleCreep(unit) == ERR_NOT_IN_RANGE)
            unit.moveTo(nexus, {visualizePathStyle: {stroke: '#ff0000'}});
    }
};