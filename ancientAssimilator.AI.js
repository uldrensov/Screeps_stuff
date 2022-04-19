//ANCIENT ASSIMILATOR: mineral-mining variant of ASSIMILATOR
//black trail ("collector")

module.exports = {
    run: function(unit, canister_id, std_interval){
        
        let canister = Game.getObjectById(canister_id);
        
        
        if (canister){
            //periodically confirm a valid mineral source in the room
            if (Game.time % std_interval == 0){
                let mineral_src = unit.room.find(FIND_MINERALS);

                if (mineral_src.length)
                    unit.memory.mineral_src_ID = mineral_src[0].id;
            }
        
        
            //continually mine from a designated source while standing on a container
            if (Game.getObjectById(unit.memory.mineral_src_ID)){
                //ensure correct position
                if (!unit.pos.isEqualTo(canister.pos))
                    unit.moveTo(canister);

                //FETCH: mineral source
                else
                    unit.harvest(Game.getObjectById(unit.memory.mineral_src_ID));
            }
        }
    }
};