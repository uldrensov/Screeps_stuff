//SUPPLICANT: dedicated semi-stationary controller upgrader
//red trail

module.exports = {
    run: function(unit,nexus,warp_main_id,warp_branch_id,road){

        var warp_main = Game.getObjectById(warp_main_id);
        var warp_branch = Game.getObjectById(warp_branch_id);


        //continually feed the controller while standing near and drawing from a link
        if (!unit.pos.isEqualTo(road.pos)){
            unit.moveTo(road, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        else{
            //request a warp if there is no more usable energy
            if (unit.store[RESOURCE_ENERGY] == 0 && warp_main.store[RESOURCE_ENERGY] == 0){
                warp_branch.transferEnergy(warp_main, warp_branch.store[RESOURCE_ENERGY]);
            }
            
            //withdraw and upgrade in one move
            unit.withdraw(warp_main, RESOURCE_ENERGY);
            unit.upgradeController(nexus.room.controller);
        }
    }
};