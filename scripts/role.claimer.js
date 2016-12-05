var roleClaimer = {

    run: function(creep) {
        
        if (creep.room.name != "E68N44" && creep.memory.controllerID == "57ef9ee786f108ae6e6101b5") {
            creep.moveTo(new RoomPosition(25, 11, "E68N44"));
        }
        else {
            var theController = Game.getObjectById(creep.memory.controllerID);
            if (theController != undefined) {
                var err = ERR_GCL_NOT_ENOUGH;
                // TODO: Add if case for when claimer has 5+ claim parts and controller.my == false to attack controller
                if (creep.memory.controllerID != "57ef9ee786f108ae6e6101b5") {
                    err = creep.claimController(theController);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.moveTo(theController);
                    }
                }
                if (err == ERR_GCL_NOT_ENOUGH) {
                    err = creep.reserveController(theController);
                    if (creep.reserveController(theController) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(theController);
                    }
                }
                if (err != OK && err != ERR_NOT_IN_RANGE) {
                    creep.memory.controllerID = undefined;
                    console.log("Can't interact with controller in " + creep.room.name + ": " + err);
                }
            }
            else {
                creep.moveTo(Game.spawns["Spawn1"]);
            }
        }
    }
};

module.exports = roleClaimer;
