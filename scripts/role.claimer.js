let roleClaimer = {
   run: function(creep) {
        creep.memory.executingRole = "claimer";
        
        let reservedControllerIDs = [
            "5873bb7f11e3e4361b4d5f13"
            , "5873bbab11e3e4361b4d6401"
            , "5873bbe111e3e4361b4d6ac5"
            , "5873bb9411e3e4361b4d6139"
            , "5873bbaa11e3e4361b4d63d1"
            , "5873bb9311e3e4361b4d612e"
            , "577b935b0f9d51615fa4807a"
            , "5873bc2811e3e4361b4d725a" // W81N28
            , "5836b6eb8b8b9619519ef90b" // W72N29
            , "57ef9cad86f108ae6e60ca51" // W64N32
            , "579fa8850700be0674d2dc0e" // W56N31
            , "579fa8a50700be0674d2e04b" // W54N39
            , "579fa8b40700be0674d2e27a" // W53N41
            , "579fa8d40700be0674d2e575" // W51N47
            , "579fa8e60700be0674d2e700" // W49N52
            , "579fa8fa0700be0674d2e965" // W41N51
        ]; // TODO: Get an array of controller.id from harvest rooms to check against here instead of hard coding the array
        if (_.includes(reservedControllerIDs, creep.memory.controllerID) == true && (Game.time < _.get(Memory.rooms, [_.get(Memory.controllers, [creep.memory.controllerID, "pos", "roomName"], ""), "avoidTravelUntil"], 0))) {
            ROLES["recyclable"].run(creep);
            return;
        }
        let theController = Game.getObjectById(creep.memory.controllerID);
        let canAttack = (_.countBy(creep.body, "type")[CLAIM] || 0) >= 5;
        if (theController == undefined || creep.room.name != theController.room.name) {
            let controllerMem = Memory.controllers[creep.memory.controllerID];
            if (controllerMem != undefined) {
                if ((_.get(Memory.controllers, [creep.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" || _.get(Memory.controllers, [creep.memory.controllerID, "reservation", "owner"], "dragoonreas") != "dragoonreas") && canAttack == false) { // TODO: Add additional checks to make sure we're not accidently attacking an ally
                    creep.memory.role = "recyclable"; // recycle this creep so we can spawn another with more parts
                }
                else if (creep.memory.controllerID == "577b935b0f9d51615fa48076" && creep.room.name != "W9N45") { // NOTE: Any controllers that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.travelTo(_.create(RoomPosition.prototype, controllerMem.pos));
                    creep.say(travelToIcons(creep) + controllerMem.pos.roomName, true);
                }
            }
            else if (creep.memory.controllerID == "5873bb7f11e3e4361b4d5f13") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(13, 32, "W88N29"));
                creep.say(travelToIcons(creep) + "W88N29", true);
            }
            else if (creep.memory.controllerID == "5873bbab11e3e4361b4d6401") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(31, 12, "W86N28"));
                creep.say(travelToIcons(creep) + "W86N28", true);
            }
            else if (creep.memory.controllerID == "5873bbe111e3e4361b4d6ac5") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(23, 22, "W84N23"));
                creep.say(travelToIcons(creep) + "W84N23", true);
            }
            else if (creep.memory.controllerID == "5873bb9411e3e4361b4d6139") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(24, 40, "W87N39"));
                creep.say(travelToIcons(creep) + "W87N39", true);
            }
            else if (creep.memory.controllerID == "5873bbaa11e3e4361b4d63d1") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(44, 5, "W86N38"));
                creep.say(travelToIcons(creep) + "W86N38", true);
            }
            else if (creep.memory.controllerID == "5873bb9311e3e4361b4d612e") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(8, 39, "W87N43"));
                creep.say(travelToIcons(creep) + "W87N43", true);
            }
            else if (creep.memory.controllerID == "577b935b0f9d51615fa4807a") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(44, 31, "W9N44"));
                creep.say(travelToIcons(creep) + "W9N44", true);
            }
            else if (creep.memory.controllerID == "5873bc2811e3e4361b4d725a") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(10, 38, "W81N28"));
                creep.say(travelToIcons(creep) + "W81N28", true);
            }
            else if (creep.memory.controllerID == "5836b6eb8b8b9619519ef90b") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(7, 9, "W72N29"));
                creep.say(travelToIcons(creep) + "W72N29", true);
            }
            else if (creep.memory.controllerID == "57ef9cad86f108ae6e60ca51") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(31, 28, "W64N32"));
                creep.say(travelToIcons(creep) + "W64N32", true);
            }
            else if (creep.memory.controllerID == "579fa8950700be0674d2de54") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(5, 10, "W56N31"));
                creep.say(travelToIcons(creep) + "W56N31", true);
            }
            else if (creep.memory.controllerID == "579fa8a50700be0674d2e04b") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(34, 21, "W54N39"));
                creep.say(travelToIcons(creep) + "W54N39", true);
            }
            else if (creep.memory.controllerID == "579fa8b40700be0674d2e27a") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(29, 10, "W53N41"));
                creep.say(travelToIcons(creep) + "W53N41", true);
            }
            else if (creep.memory.controllerID == "579fa8d40700be0674d2e575") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(29, 32, "W51N47"));
                creep.say(travelToIcons(creep) + "W51N47", true);
            }
            else if (creep.memory.controllerID == "579fa8e60700be0674d2e700") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(12, 43, "W49N52"));
                creep.say(travelToIcons(creep) + "W49N52", true);
            }
            else if (creep.memory.controllerID == "579fa8fa0700be0674d2e965") { // TODO: Store controller.pos in memory for controllers in harvest rooms
                creep.travelTo(new RoomPosition(42, 17, "W41N51"));
                creep.say(travelToIcons(creep) + "W41N51", true);
            }
            else if (creep.memory.controllerID == "5873bbaa11e3e4361b4d63cd") {
                creep.travelTo(new RoomPosition(19, 19, "W86N39"));
                creep.say(travelToIcons(creep) + "W86N39", true);
            }
            else if (creep.memory.controllerID == "5873bbc711e3e4361b4d6732") {
                creep.travelTo(new RoomPosition(43, 37, "W85N38"));
                creep.say(travelToIcons(creep) + "W85N38", true);
            }
            else if (creep.memory.controllerID == "5873bbaa11e3e4361b4d63c3") {
                creep.travelTo(new RoomPosition(30, 17, "W86N43"));
                creep.say(travelToIcons(creep) + "W86N43", true);
            }
            else if (creep.memory.controllerID == "577b935b0f9d51615fa48076") {
                ROLES["scout"].run(creep);
                creep.say(travelToIcons(creep) + "W9N45", true);
            }
            else if (creep.memory.controllerID == "5873bc2711e3e4361b4d7257") {
                creep.travelTo(new RoomPosition(34, 31, "W81N29"));
                creep.say(travelToIcons(creep) + "W81N29", true);
            }
            else if (creep.memory.controllerID == "5836b6eb8b8b9619519ef910") {
                creep.travelTo(new RoomPosition(17, 36, "W72N28"));
                creep.say(travelToIcons(creep) + "W72N28", true);
            }
            else if (creep.memory.controllerID == "57ef9cad86f108ae6e60ca55") {
                creep.travelTo(new RoomPosition(30, 16, "W64N31"));
                creep.say(travelToIcons(creep) + "W64N31", true);
            }
            else if (creep.memory.controllerID == "579fa8950700be0674d2de54") {
                creep.travelTo(new RoomPosition(27, 42, "W55N31"));
                creep.say(travelToIcons(creep) + "W55N31", true);
            }
            else if (creep.memory.controllerID == "579fa8b40700be0674d2e27f") {
                creep.travelTo(new RoomPosition(11, 38, "W53N39"));
                creep.say(travelToIcons(creep) + "W53N39", true);
            }
            else if (creep.memory.controllerID == "579fa8b30700be0674d2e276") {
                creep.travelTo(new RoomPosition(23, 8, "W53N42"));
                creep.say(travelToIcons(creep) + "W53N42", true);
            }
            else if (creep.memory.controllerID == "579fa8c40700be0674d2e3e9") {
                creep.travelTo(new RoomPosition(35, 28, "W52N47"));
                creep.say(travelToIcons(creep) + "W52N47", true);
            }
            else if (creep.memory.controllerID == "579fa8e90700be0674d2e742") {
                creep.travelTo(new RoomPosition(38, 7, "W48N52"));
                creep.say(travelToIcons(creep) + "W48N52", true);
            }
            else if (creep.memory.controllerID == "579fa8f80700be0674d2e928") {
                creep.travelTo(new RoomPosition(26, 28, "W42N51"));
                creep.say(travelToIcons(creep) + "W42N51", true);
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say(ICONS[STRUCTURE_CONTROLLER] + "?", true);
                //creep.memory.role = "recyclable"; // recycle this creep since it can't seem to do anything
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
                    creep.travelTo(theController);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTROLLER], true);
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
