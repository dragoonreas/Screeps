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
            if (creep.memory.roomID == "W64N31" || creep.memory.roomSentTo == "W53N39") {
                let waypoints = [
                    "W60N30"
                    , "W60N40"
                    , "W53N39"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W60N30"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W60N30", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W60N40"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W60N40", true);
                }
                else if (creep.memory.waypoint == 2 || creep.pos.isNearTo(11, 38) == false) {
                    creep.travelTo(new RoomPosition(11, 38, "W53N39"));
                    creep.say(travelToIcons(creep) + "W53N39", true);
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
            else if (creep.memory.roomID == "W48N52") {
                let waypoints = [
                    "W48N51"
                    , "W47N50"
                    , "W42N51"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W48N51"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W48N51", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W47N50"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W47N50", true);
                }
                else if (creep.memory.waypoint == 2 || creep.pos.isNearTo(26, 28) == false) {
                    creep.travelTo(new RoomPosition(26, 28, "W42N51"));
                    creep.say(travelToIcons(creep) + "W42N51", true);
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
            else if (creep.memory.roomID == "W52N47" || creep.memory.roomSentTo == "W42N51") {
                let waypoints = [
                    "W50N50"
                    , "W42N51"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N50"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N50", true);
                }
                else if (creep.memory.waypoint == 1 || creep.pos.isNearTo(26, 28) == false) {
                    creep.travelTo(new RoomPosition(26, 28, "W42N51"));
                    creep.say(travelToIcons(creep) + "W42N51", true);
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
            else if (creep.memory.roomID == "W53N39" || creep.memory.roomSentTo == "W52N47") {
                let waypoints = [
                    "W50N45"
                ];
                if (creep.memory.working == false) {
                    waypoints.push("W52N47");
                }
                else {
                    waypoints.push("W53N39");
                }
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N45"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N45", true);
                }
                else if (creep.memory.working == false 
                    && (creep.memory.waypoint == 1 
                        || creep.pos.isNearTo(11, 38) == false)) {
                    creep.travelTo(new RoomPosition(11, 38, "W52N47"));
                    creep.say(travelToIcons(creep) + "W52N47", true);
                }
                else if (creep.memory.working == true 
                    && (creep.memory.waypoint == 1 
                        || creep.pos.isNearTo(35, 28) == false)) {
                    creep.travelTo(new RoomPosition(35, 28, "W53N39"));
                    creep.say(travelToIcons(creep) + "W53N39", true);
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
            else if (creep.memory.roomSentFrom == "W86N43" && (creep.memory.roomSentTo == "W85N38" || creep.memory.roomSentTo == "W86N39")) {
                let waypoints = [
                    "W87N44"
                    , "W90N44"
                    , "W90N40"
                    , creep.memory.roomSentTo
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W87N44"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W87N44", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W90N44"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W90N44", true);
                }
                else if (creep.memory.waypoint == 2) {
                    creep.travelTo(new RoomPosition(25, 25, "W90N40"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W90N40", true);
                }
                else if (creep.memory.waypoint == 3 
                    || (creep.memory.roomSentTo == "W85N38" && creep.pos.isNearTo(43, 37) == false) 
                    || (creep.memory.roomSentTo == "W86N39" && creep.pos.isNearTo(19, 19) == false)) {
                    if (creep.memory.roomSentTo == "W85N38") {
                        creep.travelTo(new RoomPosition(43, 37, "W85N38"));
                        creep.say(travelToIcons(creep) + "W85N38", true);
                    }
                    else if (creep.memory.roomSentTo == "W86N39") {
                        creep.travelTo(new RoomPosition(19, 19, "W86N39"));
                        creep.say(travelToIcons(creep) + "W86N39", true);
                    }
                    else {
                        incrementConfusedCreepCount(creep);
                        creep.say("?", true);
                    }
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
            else if (creep.memory.roomSentTo == "W86N43") {
                let waypoints = [
                    "W90N40"
                    , "W90N44"
                    , "W87N44"
                    , "W86N43"
                ];
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W90N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W90N40", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W90N44"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W90N44", true);
                }
                else if (creep.memory.waypoint == 2) {
                    creep.travelTo(new RoomPosition(25, 25, "W87N44"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W87N44", true);
                }
                else if (creep.memory.waypoint == 3 || creep.pos.isNearTo(30, 17) == false) {
                    creep.travelTo(new RoomPosition(30, 17, "W86N43"));
                    creep.say(travelToIcons(creep) + "W86N43", true);
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
            /*else if (creep.memory.roomID == "W53N39") {
                if (creep.room.name != "W52N47" || creep.pos.isNearTo(35, 28) == false) {
                    creep.travelTo(new RoomPosition(35, 28, "W52N47"));
                    creep.say(travelToIcons(creep) + "W52N47", true);
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
