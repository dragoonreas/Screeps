let roleClaimer = {
   run: function(creep) {
        creep.memory.executingRole = "claimer";
        
        let reservedControllerIDs = [
            "596e563e638d01000b4ed6dc" // E8S3
            , "596ce23b3c1b99000a4d32d5" // E17S3
            , "59791d3c55e51c000b0bcc0c" // E18S18
            , "59790a4b833ada000b96f463" // E1S12
            , "59790a4b833ada000b96f432" // E2S13
            , "59790a4b833ada000b96f45b" // E2S12
            , "598869041a4816000a1a2dd4" // E1S11
            , "59790a4b833ada000b96f340" // E3S11
            , "59790d46833ada000b96f4da" // E7S13
        ]; // TODO: Get an array of controller.id from harvest rooms to check against here instead of hard coding the array
        if (_.includes(reservedControllerIDs, creep.memory.controllerID) == true && (Game.time < _.get(Memory.rooms, [_.get(Memory.controllers, [creep.memory.controllerID, "pos", "roomName"], ""), "avoidTravelUntil"], 0))) {
            ROLES["recyclable"].run(creep);
            return;
        }
        let theController = Game.getObjectById(creep.memory.controllerID);
        if (theController == undefined || creep.room.name != theController.room.name) {
            let controllerMem = Memory.controllers[creep.memory.controllerID];
            if (controllerMem != undefined) {
                if ((_.get(Memory.controllers, [creep.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" 
                        || _.get(Memory.controllers, [creep.memory.controllerID, "reservation", "username"], "dragoonreas") != "dragoonreas") 
                    && _.get(Memory.controllers, [creepMemory.controllerID, "unblockedAt"], Game.time) > Game.time) { // TODO: Add additional checks to make sure we're not accidently attacking an ally
                    creep.memory.role = "recyclable"; // recycle this creep so we can spawn another with more parts
                }
                else if (creep.memory.controllerID == "596ce23b3c1b99000a4d32ae") { // NOTE: Any controllers that require waypoints to get to should be added here
                    switch (creep.memory.controllerID) {
                        case "596ce23b3c1b99000a4d32ae": creep.memory.roomSentTo = "E17S1"; break;
                    }
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.travelTo(_.create(RoomPosition.prototype, controllerMem.pos));
                    creep.say(travelToIcons(creep) + controllerMem.pos.roomName, true);
                }
            }
            else if (creep.memory.controllerID == "596e563e638d01000b4ed6dc") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(11, 5, "E8S3"));
                creep.say(travelToIcons(creep) + "E8S3", true);
            }
            else if (creep.memory.controllerID == "596ce23b3c1b99000a4d32d5") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(40, 7, "E17S3"));
                creep.say(travelToIcons(creep) + "E17S3", true);
            }
            else if (creep.memory.controllerID == "59791d3c55e51c000b0bcc0c") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(18, 20, "E18S18"));
                creep.say(travelToIcons(creep) + "E18S18", true);
            }
            else if (creep.memory.controllerID == "59790a4b833ada000b96f432") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(43, 23, "E2S13"));
                creep.say(travelToIcons(creep) + "E2S13", true);
            }
            else if (creep.memory.controllerID == "59790a4b833ada000b96f463") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(19, 33, "E1S12"));
                creep.say(travelToIcons(creep) + "E1S12", true);
            }
            else if (creep.memory.controllerID == "59790a4b833ada000b96f45b") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(16, 13, "E2S12"));
                creep.say(travelToIcons(creep) + "E2S12", true);
            }
            else if (creep.memory.controllerID == "59790a4b833ada000b96f340") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(16, 22, "E3S11"));
                creep.say(travelToIcons(creep) + "E3S11", true);
            }
            else if (creep.memory.controllerID == "598869041a4816000a1a2dd4") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(16, 31, "E1S11"));
                creep.say(travelToIcons(creep) + "E1S11", true);
            }
            else if (creep.memory.controllerID == "59790d46833ada000b96f4da") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(16, 19, "E7S13"));
                creep.say(travelToIcons(creep) + "E7S13", true);
            }
            else if (creep.memory.controllerID == "596ce23b3c1b99000a4d32ae") {
                creep.memory.roomSentTo = "E17S1";
                ROLES["scout"].run(creep);
            }
            else if (creep.memory.controllerID == "596ce23b3c1b99000a4d3292") {
                creep.travelTo(new RoomPosition(38, 32, "E18S3"));
                creep.say(travelToIcons(creep) + "E18S3", true);
            }
            else if (creep.memory.controllerID == "596ce23b3c1b99000a4d3364") {
                creep.travelTo(new RoomPosition(23, 38, "E18S9"));
                creep.say(travelToIcons(creep) + "E18S9", true);
            }
            else if (creep.memory.controllerID == "59791d3c55e51c000b0bcc26") {
                creep.travelTo(new RoomPosition(14, 38, "E19S13"));
                creep.say(travelToIcons(creep) + "E19S13", true);
            }
            else if (creep.memory.controllerID == "59791d3c55e51c000b0bcb47") {
                creep.travelTo(new RoomPosition(21, 36, "E21S9"));
                creep.say(travelToIcons(creep) + "E21S9", true);
            }
            else if (creep.memory.controllerID == "59791d3c55e51c000b0bcc18") {
                creep.travelTo(new RoomPosition(22, 16, "E18S17"));
                creep.say(travelToIcons(creep) + "E18S17", true);
            }
            else if (creep.memory.controllerID == "59790a4b833ada000b96f39a") {
                creep.travelTo(new RoomPosition(20, 4, "E2S11"));
                creep.say(travelToIcons(creep) + "E2S11", true);
            }
            else if (creep.memory.controllerID == "59790a4b833ada000b96f397") {
                creep.travelTo(new RoomPosition(26, 31, "E3S15"));
                creep.say(travelToIcons(creep) + "E3S15", true);
            }
            else if (creep.memory.controllerID == "59790d46833ada000b96f4d6") {
                creep.travelTo(new RoomPosition(18, 25, "E7S12"));
                creep.say(travelToIcons(creep) + "E7S12", true);
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say(ICONS[STRUCTURE_CONTROLLER] + "?", true);
                //creep.memory.role = "recyclable"; // recycle this creep since it can't seem to do anything
            }
        }
        else {
            let err = ERR_GCL_NOT_ENOUGH;
            if (_.get(Memory.controllers, [creep.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" 
                || _.get(Memory.controllers, [creep.memory.controllerID, "reservation", "username"], "dragoonreas") != "dragoonreas") { // TODO: Add additional checks to make sure we're not accidently attacking an ally
                if (_.get(Memory.controllers, [creepMemory.controllerID, "unblockedAt"], Game.time) > Game.time) {
                    creep.memory.role = "recyclable"; // recycle this creep since it can't attack the controller
                }
                else {
                    err = creep.attackController(theController);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theController);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTROLLER], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true);
                    }
                }
            }
            else if (_.some(reservedControllerIDs, (cID) => (cID == creep.memory.controllerID)) == false) { // NOTE: Using _.some in this way breaks earlier than _.each when false
                err = creep.claimController(theController);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theController);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTROLLER], true);
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
                    creep.travelTo(theController);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTROLLER], true);
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
                incrementConfusedCreepCount(creep);
                console.log("Can't interact with controller in " + _.get(Memory.controllers, [creep.memory.controllerID, "pos", "roomName"], creep.room.name) + ": " + err);
                creep.say(ICONS[STRUCTURE_CONTROLLER] + "?", true);
                // TODO: Try and repurpose this as a reserver for the first vacant harvest room of the room it was sent to/from
                creep.memory.role = "recyclable"; // recycle this creep since it can't seem to do anything
            }
        }
    }
};

module.exports = roleClaimer;
