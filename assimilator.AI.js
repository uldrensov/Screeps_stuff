//ASSIMILATOR: dedicated max-efficiency mining unit
//white trail

module.exports = {
    run: function(unit,src,canister){
        
        //continually mine from a designated source while standing on a container
        if (!unit.pos.isEqualTo(canister.pos)){
            unit.moveTo(canister, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        else{
            unit.harvest(src);
        }
    }
};