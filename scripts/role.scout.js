var roleScout = {
    run: function(creep) {
        _.defaults(creep.memory, {
            waypoint: 0
        });
        
        if (creep.memory.goalReached != true && creep.ticksToLive == (CREEP_LIFE_TIME - CREEP_CLAIM_LIFE_TIME) && creep.memory.role == "scout") {
            console.log("CLAIMER RUN TEST: Claimer would only make it to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
            Game.notify("CLAIMER RUN TEST: Claimer would only make it to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
        }
        
        if (creep.memory.goalReached != true) {
            if (creep.memory.roomID == "W53N32") {
                let waypoints = [
                    "W54N34"
                    , "W65N15"
                    , "W65N16"
                    , "W65N17"
                ]
                if (creep.memory.waypoint < waypoints.length && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.say("\u27A1" + waypoints[creep.memory.waypoint], true);
                    creep.moveTo(new RoomPosition(48, 9, "W54N34"));
                }
                else if (creep.memory.waypoint == 1 || creep.room.name == "W55N35") { // extra check to make sure the creep didn't step back through the portal
                    creep.say("\u27A1" + waypoints[creep.memory.waypoint], true);
                    if (creep.room.name == "W54N35" && creep.pos.x > 16) {
                        if (creep.pos.x > 32) {
                            creep.moveTo(new RoomPosition(32, 47, "W54N35"));
                        }
                        else if (creep.pos.y > 35 && creep.pos.x >= 26) {
                            creep.moveTo(new RoomPosition(26, 35, "W54N35"));
                        }
                        else if (creep.pos.y > 31 && creep.pos.x >= 21) {
                            creep.moveTo(new RoomPosition(22, 31, "W54N35"));
                        }
                        else {
                            creep.moveTo(new RoomPosition(16, 29, "W54N35"));
                        }
                    }
                    else {
                        creep.moveTo(new RoomPosition(42, 29, "W55N35"));
                    }
                }
                else if (creep.memory.waypoint == 2) {
                    creep.say("\u27A1" + waypoints[creep.memory.waypoint], true);
                    creep.moveTo(new RoomPosition(40, 48, "W65N16"));
                }
                else if (creep.memory.waypoint == 3 || creep.room.name == "W65N17" && creep.pos.isEqualTo(22, 40) == false) {
                    creep.say("\u27A1W65N17", true);
                    creep.moveTo(new RoomPosition(22, 40, "W65N17"));
                }
                else if (creep.memory.goalReached != true) {
                    creep.say("\uD83C\uDF89", true);
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
            creep.say("\uD83C\uDFC1", true);
        }
    }
};

module.exports = roleScout;
