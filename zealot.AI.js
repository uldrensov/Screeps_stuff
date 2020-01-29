//ZEALOT: ruthless melee unit

module.exports = {
    run: function(unit,nexus){
        
        var target = Game.getObjectById('');
        if (unit.attack(target) == ERR_NOT_IN_RANGE){
            unit.moveTo(target, {visualizePathStyle: {stroke: '#ffff00'}});
        }
    }
};