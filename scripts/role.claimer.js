var roleScout = require("role.scout");

var roleClaimer = {
   run: function(creep) {
        var theController = Game.getObjectById(creep.memory.controllerID);
        if (theController == undefined || creep.room.name != theController.room.name) {
            if (creep.memory.controllerID == "57ef9ee786f108ae6e6101b5") {
                creep.say("\u27A1E68N44", true);
                creep.moveTo(new RoomPosition(25, 11, "E68N44"));
            }
            else {
                creep.say("\uD83C\uDFF0?");
            }
        }
        else {
            var err = ERR_GCL_NOT_ENOUGH;
            // TODO: Add if case for when claimer has 5+ claim parts and controller.my == false to attack controller
            if (creep.memory.controllerID != "57ef9ee786f108ae6e6101b5") {
                err = creep.claimController(theController);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\uD83C\uDFF0", true);
                    creep.moveTo(theController);
                }
                else if (err == OK) {
                    creep.say("\uD83D\uDDDD\uD83C\uDFF0", true);
                    console.log("Claimed controller in " + creep.room.name);
                    Game.notify("Claimed controller in " + creep.room.name);
                }
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                err = creep.reserveController(theController);
                if (creep.reserveController(theController) == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\uD83C\uDFF0", true);
                    creep.moveTo(theController);
                }
                else if (err == OK) {
                    creep.say("\uD83D\uDD12\uD83C\uDFF0", true);
                }
            }
            if (err != OK && err != ERR_NOT_IN_RANGE) {
                if (creep.memory.controllerID != "57ef9ee786f108ae6e6101b5") {
                    Memory.rooms[creep.memory.roomID].creepMins.claimer = 0;
                }
                creep.memory.controllerID = undefined;
                creep.say("\uD83C\uDFF0?");
                console.log("Can't interact with controller in " + creep.room.name + ": " + err);
            }
        }
    }
};

module.exports = roleClaimer;
