//KHAYDARIN MONOLITH: <tower> attack enemies at any range

module.exports = {
    run: function(tower){
        //locate the closest enemy and attack
        var enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy){
            tower.attack(enemy);
        }
    }
};