//ANCIENT ASSIMILATOR: mineral-mining variant of ASSIMILATOR
//black trail ("collector")

module.exports = {
    run: function(unit, canister_id){
        
        const canister = Game.getObjectById(canister_id);

        if (!canister){
            console.log('UNIT ERROR: ' + unit.name + ' REQUIRES A CANISTER');
            return;
        }
        
        
        //continually mine from a designated source while standing on a container
        if (Game.getObjectById(unit.memory.mineral_src_ID)){
            //ensure correct position
            if (!unit.pos.isEqualTo(canister.pos))
                unit.moveTo(canister);

            //FETCH: mineral source
            else{
                if (!unit.memory.mineral_src_ID)
                    unit.memory.mineral_src_ID = unit.room.find(FIND_MINERALS)[0].id;

                unit.harvest(Game.getObjectById(unit.memory.mineral_src_ID));
            }
        }
    }
};