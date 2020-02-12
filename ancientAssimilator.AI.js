//ANCIENT ASSIMILATOR: mineral-mining variant of ASSIMILATOR
//black trail

module.exports = {
    run: function(unit,canister_id){
        
        var canister = Game.getObjectById(canister_id);
        
        
        //mineral source
        var mineral_src = unit.room.find(FIND_MINERALS);
        
        
        //continually mine from a designated source while standing on a container
        if (!unit.pos.isEqualTo(canister.pos)){
            unit.moveTo(canister, {visualizePathStyle: {stroke: '#000000'}});
        }
        else{
            unit.harvest(mineral_src[0]);
        }
    }
};