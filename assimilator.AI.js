//ASSIMILATOR: standard stationary miner
//black trail ("collector")

module.exports = {
    run: function(unit, src_id, canister_id){
        
        const src =       Game.getObjectById(src_id);
        const canister =  Game.getObjectById(canister_id);

        if (!src){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A SOURCE');
            return;
        }
        if (!canister){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A CANISTER');
            return;
        }
        
        
        //continually mine from a designated source while standing on a container
        //ensure correct position
        if (!unit.pos.isEqualTo(canister.pos))
            unit.moveTo(canister);
            
        //FETCH: source
        else
            unit.harvest(src);
    }
};