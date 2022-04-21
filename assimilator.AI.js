//ASSIMILATOR: standard stationary miner
//black trail ("collector")

module.exports = {
    run: function(unit, src_id, canister_id){
        
        src =       Game.getObjectById(src_id);
        canister =  Game.getObjectById(canister_id);
        
        
        //continually mine from a designated source while standing on a container
        if (canister){
            //ensure correct position
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister);
                
            //FETCH: source
            else
                unit.harvest(src);
        }
    }
};