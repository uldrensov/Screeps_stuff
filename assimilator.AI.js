//ASSIMILATOR: standard stationary miner
//black trail ("collector")

module.exports = {
    run: function(unit,src_id,canister_id){
        
        canister = Game.getObjectById(canister_id);
        
        
        //inputs: energy source
        src = Game.getObjectById(src_id);
        
        
        //continually mine from a designated source while standing on a container
        if (!unit.pos.isEqualTo(canister.pos)){
            //ensure correct position
            unit.moveTo(canister, {visualizePathStyle: {stroke: '#000000'}});
        }
        else{
            //fetch: energy source
            unit.harvest(src);
        }
    }
};