//ANCIENT ASSIMILATOR: mineral-mining variant of ASSIMILATOR
//black trail ("collector")

module.exports = {
    run: function(unit, canister_id){
        
        var canister = Game.getObjectById(canister_id);
        
        
        if (canister != null){
            //inputs: mineral source
            var mineral_src = unit.room.find(FIND_MINERALS);
        
        
            //continually mine from a designated source while standing on a container...
            //ensure correct position
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister);
            //fetch: mineral source
            else unit.harvest(mineral_src[0]);
        }
    }
};