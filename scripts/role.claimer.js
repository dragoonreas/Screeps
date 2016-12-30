var roleScout = require("role.scout");

var roleClaimer = {

    run: function(creep) {
        
        var theController = Game.getObjectById(creep.memory.controllerID);
        if (theController == undefined || creep.room.name != theController.room.name) {
            if (creep.memory.controllerID == "57ef9ee786f108ae6e6101b5") {
                creep.say("➡E68N44", true);
                creep.moveTo(new RoomPosition(25, 11, "E68N44"));
            }
            else if (creep.memory.controllerID == "576a9cd257110ab231d89c71") {
                if (creep.room.name == "E35N25" && creep.memory.warped != true) {
                    creep.memory.warped = true;
                }
                else if (creep.room.name == "E65N45" && creep.memory.warped == true) {
                    creep.memory.warped = false;
                }
                
                if (creep.memory.warped != true) {
                    creep.say("➡E65N45", true);
                    if (creep.room.name == "E66N45" && creep.pos.x < 20 && creep.pos.x > 4) {
                        creep.moveTo(new RoomPosition(4, 27, "E66N45"));
                    }
                    else {
                        creep.moveTo(new RoomPosition(13, 9, "E65N45"));
                    }
                }
                else {
                    creep.say("➡E39N24", true);
                    creep.moveTo(new RoomPosition(29, 13, "E39N24"));
                }
            }
            else if (creep.memory.controllerID == "576a9cc757110ab231d89b66") {
                creep.say("➡E38N24", true);
                creep.moveTo(new RoomPosition(43, 38, "E38N24"));
            }
            else if (creep.memory.controllerID == "576a9cd357110ab231d89c85") {
                roleScout.run(creep);
            }
            else if (creep.memory.controllerID == "577b94120f9d51615fa490f9") {
                roleScout.run(creep);
            }
            else if (creep.memory.controllerID == "579fa8b50700be0674d2e295") {
                roleScout.run(creep);
            }
        }
        else {
            var err = ERR_GCL_NOT_ENOUGH;
            // TODO: Add if case for when claimer has 5+ claim parts and controller.my == false to attack controller
            if (creep.memory.controllerID != "57ef9ee786f108ae6e6101b5" && creep.memory.controllerID != "576a9cc757110ab231d89b66") {
                err = creep.claimController(theController);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("➡🏰", true);
                    creep.moveTo(theController);
                }
                else if (err == OK) {
                    creep.say("🗝🏰", true);
                    console.log("Claimed controller in " + creep.room.name);
                    Game.notify("Claimed controller in " + creep.room.name);
                }
            }
            if (err == ERR_GCL_NOT_ENOUGH) {
                err = creep.reserveController(theController);
                if (creep.reserveController(theController) == ERR_NOT_IN_RANGE) {
                    creep.say("➡🏰", true);
                    creep.moveTo(theController);
                }
                else if (err == OK) {
                    creep.say("🔒🏰", true);
                }
            }
            if (err != OK && err != ERR_NOT_IN_RANGE) {
                if (creep.memory.roomID == "E39N24") {
                    Memory.rooms[creep.memory.roomID].creepMins.claimer = 0;
                }
                creep.memory.controllerID = undefined;
                console.log("Can't interact with controller in " + creep.room.name + ": " + err);
            }
        }
    }
};

module.exports = roleClaimer;
