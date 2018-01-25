let roleScout = {
    run: function(creep) {
        let previousRole = _.clone(creep.memory.executingRole);
        creep.memory.executingRole = "scout";
        
        _.defaults(creep.memory, {
            waypoint: 0
        });
        
        if (creep.memory.role == "scout" 
            && creep.ticksToLive == (CREEP_LIFE_TIME - CREEP_CLAIM_LIFE_TIME) 
            && creep.memory.goalReached !== true) {
            console.log("CLAIMER RUN TEST: Claimer would only make it from " + creep.memory.roomID + " to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
            Game.notify("CLAIMER RUN TEST: Claimer would only make it from " + creep.memory.roomID + " to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
        }
        
        if (creep.memory.goalReached !== true) {
            let sentFrom = _.get(creep.memory, ["roomSentFrom"], creep.memory.roomID);
            let sentTo = _.get(creep.memory, ["roomSentTo"], creep.memory.roomID);
            if ((previousRole == "demolisher" 
                    && creep.memory.working == true)
                || ((previousRole == "rockhound" 
                        || (previousRole == "exporter" 
                            && creep.memory.roomID == sentTo)) 
                    && creep.memory.working == false)) {
                sentFrom = _.get(creep.memory, ["roomSentTo"], creep.memory.roomID);
                sentTo = _.get(creep.memory, ["roomSentFrom"], creep.memory.roomID);
            } else if (previousRole == "exporter" 
                && creep.memory.roomID != sentTo 
                && creep.memory.working == false) {
                sentFrom = creep.memory.roomID;
                sentTo = _.get(creep.memory, ["roomSentFrom"], creep.memory.roomID);
            } // TODO: May need to account for when neither from nor to rooms match room spawned in
            
            if (sentFrom == "E8S2"
                && sentTo == "E17S1") {
                let waypoints = [
                    "E11S0"
                    , "E17S1"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "E11S0"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "E11S0", true);
                }
                else if (creep.memory.waypoint == 1
                    || creep.pos.isNearTo(44, 11) == false) {
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
            else if (sentFrom == "E1S13"
                && sentTo == "E1S18") {
                let waypoints = [
                    "E0S12"
                    , "E0S18"
                    , "E1S18"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
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
                else if (creep.memory.waypoint == 2 ||
                    creep.pos.isNearTo(20, 32) == false) {
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
            else if (sentFrom == "E17S1"
                && sentTo == "E18S3") {
                let waypoints = [
                    "E11S0"
                    , "E18S0"
                    , "E18S3"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                else if (creep.room.name == "E17S0"
                    && creep.memory.waypoint == 0) {
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
                else if (creep.memory.waypoint == 2 ||
                    creep.pos.isNearTo(38, 32) == false) {
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
