let roleClaimer = {
   run: function(creep) {
        let theController = Game.getObjectById(creep.memory.controllerID);
        let reservedControllerIDs = ["5873bb7f11e3e4361b4d5f13"];
        if (theController == undefined || creep.room.name != theController.room.name) {
            if (creep.memory.controllerID == "5873bb7f11e3e4361b4d5f13") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.say("\u27A1W88N29", true);
                creep.travelTo(new RoomPosition(13, 32, "W88N29"));
            }
            else if (creep.memory.controllerID == "ffffffffffffffffffffffff") { // TODO: Assume any controller not in reservedControllerIDs can be reached by running the scout role until code for storing controller position in memory is implemented
                ROLES["scout"].run(creep);
            }
            else {
                creep.say("\uD83C\uDFF0?");
            }
        }
        else {
            let err = ERR_GCL_NOT_ENOUGH;
            // TODO: Add if case for when claimer has 5+ claim parts and controller.my == false to attack controller
            if (_.some(reservedControllerIDs, (cID) => (cID == creep.memory.controllerID)) == false) { // TODO: Get an array of controller.id from harvest rooms to check against here instead of hard coding the array
                err = creep.claimController(theController);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\uD83C\uDFF0", true);
                    creep.travelTo(theController);
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
                    creep.travelTo(theController);
                }
                else if (err == OK) {
                    creep.say("\uD83D\uDD12\uD83C\uDFF0", true);
                }
            }
            if (err != OK && err != ERR_NOT_IN_RANGE) {
                if (_.some(reservedControllerIDs, (cID) => (cID == creep.memory.controllerID)) == false) { // TODO: Get an array of controller.id from harvest rooms to check against here instead of hard coding the array
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
