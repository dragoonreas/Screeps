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
            if (creep.memory.roomID == "W19N85") {
                if (creep.room.name != "W17N79" || creep.pos.isNearTo(8, 39) == false) {
                    creep.say(ICONS["moveTo"] + "W17N79", true);
                    creep.travelTo(new RoomPosition(8, 39, "W17N79"));
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
            else if (creep.memory.roomID == "W85N23" || creep.memory.roomSentTo == "W17N79") {
                let waypoints = [
                    "W25N85"
                    , "W24N84"
                    , "W24N83"
                    , "W22N82"
                    , "W20N80"
                    , "W17N79"
                ];
                if (creep.memory.waypoint > 0 && creep.room.name == "W85N25") {
                    creep.memory.waypoint = 0;
                }
                else if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.say(ICONS["moveTo"] + "W85N25", true);
                    creep.travelTo(new RoomPosition(6, 13, "W85N25"));
                }
                else if (creep.memory.waypoint == 1) {
                    creep.say(ICONS["moveTo"] + "W24N84", true);
                    creep.travelTo(new RoomPosition(25, 25, "W24N84"));
                }
                else if (creep.memory.waypoint == 2) {
                    creep.say(ICONS["moveTo"] + "W24N83", true);
                    creep.travelTo(new RoomPosition(25, 25, "W24N83"));
                }
                else if (creep.memory.waypoint == 3) {
                    creep.say(ICONS["moveTo"] + "W22N82", true);
                    creep.travelTo(new RoomPosition(25, 25, "W22N82"));
                }
                else if (creep.memory.waypoint == 4) {
                    creep.say(ICONS["moveTo"] + "W20N80", true);
                    creep.travelTo(new RoomPosition(25, 25, "W20N80"));
                }
                else if (creep.memory.waypoint == 5 || creep.pos.isNearTo(8, 39) == false) {
                    creep.say(ICONS["moveTo"] + "W17N79", true);
                    creep.travelTo(new RoomPosition(8, 39, "W17N79"));
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
