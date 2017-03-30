let roleClaimer = {
   run: function(creep) {
        let theController = Game.getObjectById(creep.memory.controllerID);
        let reservedControllerIDs = [
            "5873bb7f11e3e4361b4d5f13"
            , "5873bbab11e3e4361b4d6401"
            , "5873bbe111e3e4361b4d6ac5"
            , "5873bb9411e3e4361b4d6139"
        ]; // TODO: Get an array of controller.id from harvest rooms to check against here instead of hard coding the array
        let canAttack = (_.countBy(creep.body, "type")[CLAIM] || 0) >= 5;
        if (theController == undefined || creep.room.name != theController.room.name) {
            let controllerMem = Memory.controllers[creep.memory.controllerID];
            if (controllerMem != undefined) {
                if ((_.get(Memory.controllers, [creep.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" || _.get(Memory.controllers, [creep.memory.controllerID, "reservation", "owner"], "dragoonreas") != "dragoonreas") && canAttack == false) { // TODO: Add additional checks to make sure we're not accidently attacking an ally
                    creep.memory.role = "recyclable"; // recycle this creep so we can spawn another with more parts
                }
                else {
                    creep.say(ICONS["moveTo"] + controllerMem.pos.roomName, true);
                    creep.travelTo(_.create(RoomPosition.prototype, controllerMem.pos));
                }
            }
            else if (creep.memory.controllerID == "5873bb7f11e3e4361b4d5f13") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.say(ICONS["moveTo"] + "W88N29", true);
                creep.travelTo(new RoomPosition(13, 32, "W88N29"));
            }
            else if (creep.memory.controllerID == "5873bbab11e3e4361b4d6401") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.say(ICONS["moveTo"] + "W86N28", true);
                creep.travelTo(new RoomPosition(31, 12, "W86N28"));
            }
            else if (creep.memory.controllerID == "5873bbe111e3e4361b4d6ac5") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.say(ICONS["moveTo"] + "W84N23", true);
                creep.travelTo(new RoomPosition(23, 22, "W84N23"));
            }
            else if (creep.memory.controllerID == "5873bb9411e3e4361b4d6139") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.say(ICONS["moveTo"] + "W87N39", true);
                creep.travelTo(new RoomPosition(24, 40, "W87N39"));
            }
            else if (creep.memory.controllerID == "5873bbaa11e3e4361b4d63cd") {
                creep.say(ICONS["moveTo"] + "W86N39", true);
                creep.travelTo(new RoomPosition(19, 19, "W86N39"));
            }
            else if (creep.memory.controllerID == "5873bbc711e3e4361b4d6732") {
                creep.say(ICONS["moveTo"] + "W85N38", true);
                creep.travelTo(new RoomPosition(43, 37, "W85N38"));
            }
            else if (creep.memory.controllerID == "5873bbaa11e3e4361b4d63c3") {
                creep.say(ICONS["moveTo"] + "W86N43", true);
                creep.travelTo(new RoomPosition(30, 17, "W86N43"));
            }
            else {
                creep.say(ICONS[STRUCTURE_CONTROLLER] + "?", true);
                creep.memory.role = "recyclable"; // recycle this creep since it can't seem to do anything
            }
        }
        else {
            let err = ERR_GCL_NOT_ENOUGH;
            if (_.get(Memory.controllers, [creep.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" || _.get(Memory.controllers, [creep.memory.controllerID, "reservation", "owner"], "dragoonreas") != "dragoonreas") { // TODO: Add additional checks to make sure we're not accidently attacking an ally
                if (canAttack == false) {
                    err == ERR_NO_BODYPART;
                }
                else {
                    err = creep.attackController(theController);
                }
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTROLLER], true);
                    creep.travelTo(theController);
                }
                else if (err == ERR_NO_BODYPART) {
                    creep.memory.role = "recyclable"; // recycle this creep so we can spawn another with more parts
                }
                else if (err == OK) {
                    creep.say(ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true);
                }
            }
            else if (_.some(reservedControllerIDs, (cID) => (cID == creep.memory.controllerID)) == false) { // NOTE: Using _.some in this way breaks earlier than _.each when false
                err = creep.claimController(theController);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTROLLER], true);
                    creep.travelTo(theController);
                }
                else if (err == OK) {
                    creep.say(ICONS["claimController"] + ICONS[STRUCTURE_CONTROLLER], true);
                    console.log("Claimed controller in " + creep.room.name);
                    Game.notify("Claimed controller in " + creep.room.name);
                }
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                err = creep.reserveController(theController);
                if (creep.reserveController(theController) == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTROLLER], true);
                    creep.travelTo(theController);
                }
                else if (err == OK) {
                    creep.say(ICONS["reserveController"] + ICONS[STRUCTURE_CONTROLLER], true);
                }
            }
            if (err != OK && err != ERR_NOT_IN_RANGE) {
                /*
                if (_.some(reservedControllerIDs, (cID) => (cID == creep.memory.controllerID)) == false) { // TODO: Get an array of controller.id from harvest rooms to check against here instead of hard coding the array
                    Memory.rooms[creep.memory.roomID].creepMins.claimer = 0;
                }
                */
                console.log("Can't interact with controller in " + _.get(Memory.controllers, [creep.memory.controllerID, "pos", "roomName"], creep.room.name) + ": " + err);
                creep.say(ICONS[STRUCTURE_CONTROLLER] + "?", true);
                creep.memory.role = "recyclable"; // recycle this creep since it can't seem to do anything
            }
        }
    }
};

module.exports = roleClaimer;
