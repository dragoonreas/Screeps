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
            
            if (sentFrom == "E11S18" 
                || sentTo == "E15S13") {
                let waypoints = [
                    "E15S13"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0 
                    || creep.pos.isNearTo(35, 25) == false) {
                    creep.travelTo(new RoomPosition(35, 25, "E15S13"));
                    creep.say(travelToIcons(creep) + "E15S13", true);
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
            /*} else if (sentFrom == "W35S13" 
                && sentTo == "E32N18") {
                let waypoints = [
                    "E35N15"
                    , "E32N18"
                ];
                if (creep.memory.waypoint > 0 
                    && creep.room.name == "W35S15") { // back-tracked through portal
                    creep.memory.waypoint = 0;
                }
                else if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(37, 28, "W35S15"));
                    creep.say(travelToIcons(creep) + "W35S15", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(6, 42) == false) {
                    creep.travelTo(new RoomPosition(12, 29, "E32N18"));
                    creep.say(travelToIcons(creep) + "E32N18", true);
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
            else if (sentFrom == "E32N18" 
                && sentTo == "W35S13") {
                let waypoints = [
                    "W35S15"
                    , "W35S13"
                ];
                if (creep.memory.waypoint > 0 
                    && creep.room.name == "E35N15") { // back-tracked through portal
                    creep.memory.waypoint = 0;
                }
                else if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(29, 26, "E35N15"));
                    creep.say(travelToIcons(creep) + "E35N15", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(39, 10) == false) {
                    creep.travelTo(new RoomPosition(39, 10, "W35S13"));
                    creep.say(travelToIcons(creep) + "W35S13", true);
                }
                else if (creep.memory.goalReached != true) {
                    creep.say(ICONS["testPassed"], true);
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
                    }
                }*/
            } else {
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
