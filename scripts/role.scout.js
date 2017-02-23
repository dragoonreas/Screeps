let roleScout = {
    run: function(creep) {
        _.defaults(creep.memory, {
            waypoint: 0
        });
        
        if (creep.memory.goalReached != true && creep.ticksToLive == (CREEP_LIFE_TIME - CREEP_CLAIM_LIFE_TIME) && creep.memory.role == "scout") {
            console.log("CLAIMER RUN TEST: Claimer would only make it to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
            Game.notify("CLAIMER RUN TEST: Claimer would only make it to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
        }
        
        if (creep.memory.goalReached != true) {
            if (creep.memory.roomID == "W86N29") {
                /*
                if (creep.room.name != "W85N23") {
                    creep.say(ICONS["moveTo"] + "W85N23", true);
                    creep.travelTo(new RoomPosition(24, 29, "W85N23"));
                }
                */
                if (creep.room.name != "W86N39" || creep.pos.isNearTo(19, 19) == false) {
                    creep.say(ICONS["moveTo"] + "W86N39", true);
                    creep.travelTo(new RoomPosition(19, 19, "W86N39"));
                }
                else if (creep.memory.goalReached != true) {
                    creep.say(ICONS["testPassed"], true);
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
                    }
                }
            }
            else if (creep.memory.roomID == "W87N29") {
                if (creep.room.name != "W86N29") {
                    creep.say(ICONS["moveTo"] + "W86N29", true);
                    creep.travelTo(new RoomPosition(9, 39, "W86N29"));
                }
                else if (creep.memory.goalReached != true) {
                    creep.say(ICONS["testPassed"], true);
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
                    }
                }
            }
            else if (creep.memory.roomID == "W85N23") {
                if (creep.room.name != "W87N29") {
                    creep.say(ICONS["moveTo"] + "W87N29", true);
                    creep.travelTo(new RoomPosition(7, 25, "W87N29"));
                }
                else if (creep.memory.goalReached != true) {
                    creep.say(ICONS["testPassed"], true);
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
                    }
                }
            }
            else {
                creep.say("?", true);
            }
        }
        else {
            creep.say(ICONS["testFinished"], true);
        }
    }
};

module.exports = roleScout;
