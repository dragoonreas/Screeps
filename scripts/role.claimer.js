let roleClaimer = {
   run: function(creep) {
        creep.memory.executingRole = "claimer";
        
        let reservedControllerIDs = [
            "5fb2a3e60d314f7d088923c5" // E32S11
            //, "5fb2a44c0d314f7d08892889" // E35S12 -remote mined by Donatzor
            , "5fb2a42a0d314f7d088926bb" // E34S13
            , "5fb2a4090d314f7d0889251a" // E33S15
            , "5fb2a4090d314f7d0889251e" // E33S16
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
                        // case "5fb2a44d0d314f7d0889288d": creep.memory.roomSentTo = "E35S13";
                        default: creep.memory.roomSentTo = creep.memory.roomID; break;
                    }
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.travelTo(RoomPositionFromObject(controllerMem.pos));
                    creep.say(travelToIcons(creep) + controllerMem.pos.roomName, true);
                }
            }
            else if (creep.memory.controllerID == "5fb2a3e60d314f7d088923c5") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(39, 38, "E32S11"));
                creep.say(travelToIcons(creep) + "E32S11", true);
            }
            else if (creep.memory.controllerID == "5fb2a44c0d314f7d08892889") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(28, 28, "E35S12"));
                creep.say(travelToIcons(creep) + "E35S12", true);
            }
            else if (creep.memory.controllerID == "5fb2a42a0d314f7d088926bb") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(39, 24, "E34S13"));
                creep.say(travelToIcons(creep) + "E34S13", true);
            }
            else if (creep.memory.controllerID == "5fb2a4090d314f7d0889251a") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(30, 21, "E33S15"));
                creep.say(travelToIcons(creep) + "E33S15", true);
            }
            else if (creep.memory.controllerID == "5fb2a4090d314f7d0889251e") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(9, 24, "E33S16"));
                creep.say(travelToIcons(creep) + "E33S16", true);
            }
            else if (creep.memory.controllerID == "5fb2a44d0d314f7d0889288d") {
                creep.travelTo(new RoomPosition(10, 9, "E35S13"));
                creep.say(travelToIcons(creep) + "E35S13", true);
            }
            else if (creep.memory.controllerID == "5fb2a4090d314f7d08892516") {
                creep.travelTo(new RoomPosition(29, 11, "E33S14"));
                creep.say(travelToIcons(creep) + "E33S14", true);
            }
            else if (creep.memory.controllerID == "5fb2a3e80d314f7d088923d6") {
                creep.travelTo(new RoomPosition(31, 11, "E32S16"));
                creep.say(travelToIcons(creep) + "E32S16", true);
            }
            /*else if (creep.memory.controllerID == "5fb2a44d0d314f7d0889288d") {
                creep.memory.roomSentTo = "E35S13";
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
