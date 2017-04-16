let roleScout = {
    run: function(creep) {
        _.defaults(creep.memory, {
            waypoint: 0
        });
        
        if (creep.memory.goalReached != true && creep.ticksToLive == (CREEP_LIFE_TIME - CREEP_CLAIM_LIFE_TIME) && creep.memory.role == "scout") {
            console.log("CLAIMER RUN TEST: Claimer would only make it from " + creep.memory.roomID + " to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
            Game.notify("CLAIMER RUN TEST: Claimer would only make it from " + creep.memory.roomID + " to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
        }
        
        if (creep.memory.goalReached != true) {
            if (creep.memory.roomID == "W17N79") {
                if (creep.room.name != "W8N78" || creep.pos.isNearTo(8, 39) == false) {
                    creep.say(ICONS["moveTo"] + "W8N78", true);
                    creep.travelTo(new RoomPosition(13, 42, "W8N78"));
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
            else if (creep.memory.roomID == "W86N43" || creep.memory.roomSentTo == "W9N45") {
                let waypoints = [
                    "W85N45"
                    , "W5N45"
                    , "W5N44"
                    , "W7N44"
                    , "W9N45"
                ];
                if (creep.memory.waypoint > 1 && creep.room.name == "W85N45") {
                    creep.memory.waypoint = 1;
                }
                else if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.say(ICONS["moveTo"] + "W85N45", true);
                    creep.travelTo(new RoomPosition(13, 49, "W85N45"));
                }
                else if (creep.memory.waypoint == 1) {
                    creep.say(ICONS["moveTo"] + "W85N45", true);
                    creep.travelTo(new RoomPosition(19, 14, "W85N45"));
                }
                else if (creep.memory.waypoint == 2) {
                    creep.say(ICONS["moveTo"] + "W5N44", true);
                    creep.travelTo(new RoomPosition(25, 25, "W5N44"));
                }
                else if (creep.memory.waypoint == 3) {
                    creep.say(ICONS["moveTo"] + "W7N44", true);
                    creep.travelTo(new RoomPosition(25, 25, "W7N44"));
                }
                else if (creep.memory.waypoint == 4 || creep.pos.isNearTo(26, 37) == false) {
                    creep.say(ICONS["moveTo"] + "W9N45", true);
                    creep.travelTo(new RoomPosition(26, 37, "W9N45"));
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
            creep.memory.role = "recyclable";
        }
    }
};

module.exports = roleScout;
