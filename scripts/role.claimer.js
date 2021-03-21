let roleClaimer = {
   run: function(creep) {
        creep.memory.executingRole = "claimer";
        
        let reservedControllerIDs = [
            "6027a9fc992216018438d9e5" // E11S19
            , "6027aa27992216018438de02" // E14S13
            , "6027aa0a992216018438db13" // E12S11
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
                    && _.get(Memory.controllers, [creep.memory.controllerID, "unblockedAt"], Game.time) > Game.time) { // TODO: Add additional checks to make sure we're not accidently attacking an ally
                    creep.memory.role = "recyclable"; // recycle this creep so we can spawn another with more parts
                }
                else if (false) { // NOTE: Any controllers that require waypoints to get to should be added here
                    switch (creep.memory.controllerID) {
                        // case "5fb29a5d0d314f7d0888c2af": creep.memory.roomSentTo = "W39S17";
                        default: creep.memory.roomSentTo = creep.memory.roomID; break;
                    }
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.travelTo(RoomPositionFromObject(controllerMem.pos));
                    creep.say(travelToIcons(creep) + controllerMem.pos.roomName, true);
                }
            }
            else if (creep.memory.controllerID == "6027a9fc992216018438d9e5") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(21, 6, "E11S19"));
                creep.say(travelToIcons(creep) + "E11S19", true);
            }
            else if (creep.memory.controllerID == "6027aa27992216018438de02") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(22, 19, "E14S13"));
                creep.say(travelToIcons(creep) + "E14S13", true);
            }
            else if (creep.memory.controllerID == "6027aa0a992216018438db13") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(37, 24, "E12S11"));
                creep.say(travelToIcons(creep) + "E12S11", true);
            }
            else if (creep.memory.controllerID == "6027aa0a992216018438db17") {
                creep.travelTo(new RoomPosition(16, 31, "E12S12"));
                creep.say(travelToIcons(creep) + "E12S12", true);
            }
            /*else if (creep.memory.controllerID == "5fb29a7f0d314f7d0888c3fb") {
                creep.memory.roomSentTo = "W38S19";
                ROLES["scout"].run(creep);
            }*/
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
                if (_.get(Memory.controllers, [creep.memory.controllerID, "unblockedAt"], Game.time - 1) > Game.time + creep.ticksToLive) {
                    creep.memory.role = "recyclable"; // recycle this creep since it can't attack the controller
                }
                else if (_.get(Memory.controllers, [creep.memory.controllerID, "unblockedAt"], Game.time - 1) > Game.time) {
                    incrementIdleCreepCount(creep);
                    switch (creep.saying) {
                        case ICONS["wait00"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait01"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait01"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait02"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait02"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait03"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait03"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait04"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait04"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait05"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait05"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait06"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait06"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait07"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait07"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait08"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait08"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait09"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait09"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait10"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait10"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait11"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait11"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait12"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait12"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait13"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait13"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait14"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait14"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait15"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait15"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait16"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait16"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait17"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait17"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait18"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait18"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait19"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait19"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait20"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait20"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait21"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait21"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait22"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        case ICONS["wait22"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER]: creep.say(ICONS["wait23"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true); break;
                        default: creep.say(ICONS["wait00"] + ICONS["attackController"] + ICONS[STRUCTURE_CONTROLLER], true);
                    }
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
