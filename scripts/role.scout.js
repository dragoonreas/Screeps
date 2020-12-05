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
            
            /*if (sentFrom == "W46N41" 
                || sentTo == "W46N18") {
                let waypoints = [
                    "W46N20"
                    , "W46N18"
                ];
                if (creep.memory.waypoint > 0 
                    && creep.room.name == "W46N40") { // back-tracked through portal
                    creep.memory.waypoint = 0;
                }
                else if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(48, 37, "W46N40"));
                    creep.say(travelToIcons(creep) + "W46N40", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(10, 27) == false) {
                    creep.travelTo(new RoomPosition(10, 27, "W46N18"));
                    creep.say(travelToIcons(creep) + "W46N18", true);
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
            else if (sentFrom == "W46N18" 
                || sentTo == "W46N41") {
                let waypoints = [
                    "W46N40"
                    , "W46N41"
                ];
                if (creep.memory.waypoint > 0 
                    && creep.room.name == "W46N20") { // back-tracked through portal
                    creep.memory.waypoint = 0;
                }
                else if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(20, 6, "W46N20"));
                    creep.say(travelToIcons(creep) + "W46N20", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(14, 17) == false) {
                    creep.travelTo(new RoomPosition(14, 17, "W46N41"));
                    creep.say(travelToIcons(creep) + "W46N41", true);
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
            } else {*/
                incrementConfusedCreepCount(creep);
                creep.say("?", true);
            //}
        }
        else {
            creep.say(ICONS["testFinished"], true);
            creep.memory.role = "recyclable";
        }
    }
};

module.exports = roleScout;
