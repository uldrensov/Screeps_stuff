//ASSIMILATOR: dedicated stationary max-efficiency mining unit
//white trail

module.exports = {
    run: function(unit,src_id,canister_id){
        
        src = Game.getObjectById(src_id);
        canister = Game.getObjectById(canister_id);
        
        
        //continually mine from a designated source while standing on a container
        if (!unit.pos.isEqualTo(canister.pos)){
            unit.moveTo(canister, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else{
            unit.harvest(src);
        }
    }
};