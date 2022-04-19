//SHIELD BATTERY: standard cross-room healer
//cyan trail ("support")
//TODO: this model is a prototype

module.exports = {
    run: function(unit, waypoint){
        
        let patients = _.filter(Game.creeps, creep => creep.memory.role == 'hallucination');
        
        
        //navigate to a predetermined waypoint
        if (!unit.pos.isEqualTo(waypoint.pos))
            unit.moveTo(waypoint, {visualizePathStyle: {stroke: '#00ffff'}});
        //heal targets whenever possible
        else
            unit.heal(patients[0]);
    }
};