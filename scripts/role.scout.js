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
                let waypoints = [
                    "W85N29"
                    , "W85N26"
                    , "W85N24"
                    , "W85N23"
                ]
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.say(ICONS["moveTo"] + waypoints[creep.memory.waypoint], true);
                    creep.travelTo(new RoomPosition(25, 25, "W85N29"));
                }
                else if (creep.memory.waypoint == 1) {
                    creep.say(ICONS["moveTo"] + waypoints[creep.memory.waypoint], true);
                    if (creep.room.name == "W85N27" && creep.pos.y < 45) {
                        creep.travelTo(new RoomPosition(46, 45, "W85N27"));
                    }
                    else {
                        creep.travelTo(new RoomPosition(46, 1, "W85N26"));
                    }
                }
                else if (creep.memory.waypoint == 2) {
                    creep.say(ICONS["moveTo"] + waypoints[creep.memory.waypoint], true);
                    if (creep.room.name == "W85N26" && creep.pos.y < 32) {
                        creep.travelTo(new RoomPosition(48, 32, "W85N26"));
                    }
                    else {
                        creep.travelTo(new RoomPosition(36, 1, "W85N24"));
                    }
                }
                else if (creep.memory.waypoint == 3) {
                    creep.say(ICONS["moveTo"] + waypoints[creep.memory.waypoint], true);
                    if (creep.pos.y < 34) {
                        creep.travelTo(new RoomPosition(44, 34, "W85N24"));
                    }
                    else {
                        creep.travelTo(new RoomPosition(44, 1, "W85N23"));
                    }
                }
                else if (creep.room.name == "W85N23" && creep.pos.isNearTo(24, 29) == false) {
                    creep.say(ICONS["moveTo"] + "W85N23", true);
                    creep.travelTo(new RoomPosition(24, 29, "W85N23"));
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
