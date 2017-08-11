let roleScout = {
    run: function(creep) {
        creep.memory.executingRole = "scout";
        
        _.defaults(creep.memory, {
            waypoint: 0
        });
        
        if (creep.memory.role == "scout" && creep.ticksToLive == (CREEP_LIFE_TIME - CREEP_CLAIM_LIFE_TIME) && creep.memory.goalReached !== true) {
            console.log("CLAIMER RUN TEST: Claimer would only make it from " + creep.memory.roomID + " to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
            Game.notify("CLAIMER RUN TEST: Claimer would only make it from " + creep.memory.roomID + " to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
        }
        
        if (creep.memory.goalReached !== true) {
            if (creep.memory.roomID == "E8S2" || creep.memory.roomSentTo == "E17S1") {
                let waypoints = [
                    "E11S0"
                    , "E17S1"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "E11S0"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E11S0", true);
                }
                else if (creep.memory.waypoint == 1 || creep.pos.isNearTo(44, 11) == false) {
                    creep.travelTo(new RoomPosition(44, 11, "E17S1"));
                    creep.say(travelToIcons(creep) + "E17S1", true);
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
            else if (creep.memory.roomID == "E1S13" || creep.memory.roomSentTo == "E1S18") {
                let waypoints = [
                    "E0S12"
                    , "E0S18"
                    , "E1S18"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "E0S12"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E0S12", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "E0S18"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E0S18", true);
                }
                else if (creep.memory.waypoint == 2 || creep.pos.isNearTo(20, 32) == false) {
                    creep.travelTo(new RoomPosition(20, 32, "E1S18"));
                    creep.say(travelToIcons(creep) + "E1S18", true);
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
            else if (creep.memory.roomID == "E17S1" || creep.memory.roomSentTo == "E18S3") {
                let waypoints = [
                    "E11S0"
                    , "E18S0"
                    , "E18S3"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                else if (creep.room.name == "E17S0" && creep.memory.waypoint == 0) {
                    creep.memory.waypoint = 1;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "E11S0"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E11S0", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "E18S0"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E18S0", true);
                }
                else if (creep.memory.waypoint == 2 || creep.pos.isNearTo(38, 32) == false) {
                    creep.travelTo(new RoomPosition(38, 32, "E18S3"));
                    creep.say(travelToIcons(creep) + "E18S3", true);
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
            else if (creep.memory.roomSentTo == "E18S9") {
                let waypoints = [
                    "E20S7"
                    , "E18S9"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "E20S7"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E20S7", true);
                }
                else if (creep.memory.waypoint == 1 || creep.pos.isNearTo(23, 38) == false) {
                    creep.travelTo(new RoomPosition(23, 38, "E18S9"));
                    creep.say(travelToIcons(creep) + "E18S9", true);
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
            else if (creep.memory.roomSentTo == "E18S17") {
                let waypoints = [
                    "E20S7"
                    , "E18S17"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "E20S7"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E20S7", true);
                }
                else if (creep.memory.waypoint == 1 || creep.pos.isNearTo(22, 16) == false) {
                    creep.travelTo(new RoomPosition(22, 16, "E18S17"));
                    creep.say(travelToIcons(creep) + "E18S17", true);
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
            /*else if (creep.memory.roomID == "W86N43" || creep.memory.roomSentTo == "W9N45") {
                let waypoints = [
                    "W85N45"
                    , "W5N45"
                    , "W5N44"
                    , "W7N44"
                    , "W9N45"
                ];
                if (creep.memory.waypoint > 1 && creep.room.name == "W85N45") { // back-tracked through portal
                    creep.memory.waypoint = 1;
                }
                else if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(13, 49, "W85N45"));
                    creep.say(travelToIcons(creep) + "W85N45", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(19, 14, "W85N45"));
                    creep.say(travelToIcons(creep) + "W85N45", true);
                }
                else if (creep.memory.waypoint == 2) {
                    creep.travelTo(new RoomPosition(25, 25, "W5N44"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W5N44", true);
                }
                else if (creep.memory.waypoint == 3) {
                    creep.travelTo(new RoomPosition(25, 25, "W7N44"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W7N44", true);
                }
                else if (creep.memory.waypoint == 4 || creep.pos.isNearTo(26, 37) == false) {
                    creep.travelTo(new RoomPosition(26, 37, "W9N45"));
                    creep.say(travelToIcons(creep) + "W9N45", true);
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
            }*/
            else {
                incrementConfusedCreepCount(creep);
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
