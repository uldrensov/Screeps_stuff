//HALLUCINATION: standard cross-room tank
//cyan trail ("support")
//TODO: this model is a prototype

module.exports = {
    run: function(unit, waypoint, healpoint){
        
        //two-states...
        //if heavily damaged, come back
        if (!unit.memory.retreating && unit.hits < unit.hitsMax * .2)
            unit.memory.retreating = true;
        //once restored to full, return to battle
        if (unit.memory.retreating && unit.hits == unit.hitsMax)
            unit.memory.retreating = false;

        
        //behaviour execution...
        //retreat from the foreign room to receive healing
        if (unit.memory.retreating)
            unit.moveTo(healpoint, {visualizePathStyle: {stroke: '#00ffff'}});
        //return to the foreign room until sufficiently injured again
        else
            unit.moveTo(waypoint, {visualizePathStyle: {stroke: '#00ffff'}});
    }
};