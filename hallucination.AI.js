//HALLUCINATION: standard cross-room tank
//cyan trail ("support")
//TODO: this model is a prototype

module.exports = {
    run: function(unit, waypoint, healpoint){

        const lowHP_threshold = 0.25;

        
        //combat behaviour FSM...
        //if heavily damaged, retreat
        if (!unit.memory.retreating && (unit.hits < unit.hitsMax * lowHP_threshold))
            unit.memory.retreating = true;
        //once restored to full, return to battle
        if (unit.memory.retreating && (unit.hits == unit.hitsMax))
            unit.memory.retreating = false;

        
        //FSM execution (RETREATING)
        if (unit.memory.retreating)
            unit.moveTo(healpoint, {visualizePathStyle: {stroke: '#00ffff'}});
        //FSM execution (ADVANCING)
        else
            unit.moveTo(waypoint, {visualizePathStyle: {stroke: '#00ffff'}});
    }
};