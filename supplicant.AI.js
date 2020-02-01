//SUPPLICANT: dedicated high-efficiency controller upgrader
//red trail

module.exports = {
    run: function(unit,nexus,warp_main_ID,warp_branch_ID,road){

        //bug avoidance (pass ID, not object itself)
        var warp_main = Game.getObjectById(warp_main_ID);
        var warp_branch = Game.getObjectById(warp_branch_ID);

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