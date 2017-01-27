var roleScout = require("role.scout");

var roleClaimer = {
   run: function(creep) {
        let theController = Game.getObjectById(creep.memory.controllerID);
        if (theController == undefined || creep.room.name != theController.room.name) {
            if (creep.memory.controllerID == "ffffffffffffffffffffffff") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.say("\u27A1W53N32", true);
                creep.moveTo(new RoomPosition(25, 25, "W53N32"));
            }
            else if (creep.memory.controllerID == "57ef9c9986f108ae6e60c810") {
                roleScout.run(creep);
            }
            else {
                creep.say("\uD83C\uDFF0?");
            }
        }
        else {
            let err = ERR_GCL_NOT_ENOUGH;
            // TODO: Add if case for when claimer has 5+ claim parts and controller.my == false to attack controller
            if (creep.memory.controllerID != "ffffffffffffffffffffffff") { // TODO: Get an array of controller.id from harvest rooms to check against here
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
                if (creep.memory.controllerID != "ffffffffffffffffffffffff") { // TODO: Get an array of controller.id from harvest rooms to check against here
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
