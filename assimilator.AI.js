//ASSIMILATOR: standard stationary miner
//black trail ("collector")

module.exports = {
    run: function(unit, src_id, canister_id){
        
        canister = Game.getObjectById(canister_id);
        
        //INPUTS: energy source
        src = Game.getObjectById(src_id);
        
        
        if (canister){
            //continually mine from a designated source while standing on a container...
            //ensure correct position
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister);
            //fetch: energy source
            else unit.harvest(src);
        }
    }
};