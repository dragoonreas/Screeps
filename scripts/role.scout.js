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
            
            // if (sentFrom == "W12S26" 
            //     || sentTo == "W17S15") {
            //     let waypoints = [
            //         "W17S15"
            //     ];
            //     if (creep.memory.waypoint < waypoints.length 
            //         && creep.room.name == waypoints[creep.memory.waypoint]) {
            //         ++creep.memory.waypoint;
            //     }
                
            //     if (creep.memory.waypoint == 0 
            //         || creep.pos.isNearTo(11, 36) == false) {
            //         creep.travelTo(new RoomPosition(11, 36, "W17S15"));
            //         creep.say(travelToIcons(creep) + "W17S15", true);
            //     }
            //     else if (creep.memory.goalReached != true) {
            //         creep.say(ICONS["testPassed"], true);
            //         creep.memory.goalReached = true;
            //         if (creep.memory.role == "scout") {
            //             console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
            //             Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
            //             Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
            //         }
            //     }
            // } else if (sentFrom == "W28N5" 
            //     || sentTo == "W12S26") {
            //     let waypoints = [
            //         "W15S25"
            //         , "W12S26"
            //     ];
            //     if (creep.memory.waypoint > 0 
            //         && creep.room.name == "W25N5") { // back-tracked through portal
            //         creep.memory.waypoint = 0;
            //     }
            //     else if (creep.memory.waypoint < waypoints.length 
            //         && creep.room.name == waypoints[creep.memory.waypoint]) {
            //         ++creep.memory.waypoint;
            //     }
                
            //     if (creep.memory.waypoint == 0) {
            //         creep.travelTo(new RoomPosition(14, 6, "W25N5"));
            //         creep.say(travelToIcons(creep) + "W25N5", true);
            //     }
            //     else if (creep.memory.waypoint == 1 
            //         || creep.pos.isNearTo(6, 42) == false) {
            //         creep.travelTo(new RoomPosition(6, 42, "W12S26"));
            //         creep.say(travelToIcons(creep) + "W12S26", true);
            //     }
            //     else if (creep.memory.goalReached != true) {
            //         creep.say(ICONS["testPassed"], true);
            //         creep.memory.goalReached = true;
            //         if (creep.memory.role == "scout") {
            //             console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
            //             Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
            //             Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
            //         }
            //     }
            // }
            // else if (sentFrom == "W12S26" 
            //     || sentTo == "W28N5") {
            //     let waypoints = [
            //         "W25N5"
            //         , "W28N5"
            //     ];
            //     if (creep.memory.waypoint > 0 
            //         && creep.room.name == "W15S25") { // back-tracked through portal
            //         creep.memory.waypoint = 0;
            //     }
            //     else if (creep.memory.waypoint < waypoints.length 
            //         && creep.room.name == waypoints[creep.memory.waypoint]) {
            //         ++creep.memory.waypoint;
            //     }
                
            //     if (creep.memory.waypoint == 0) {
            //         creep.travelTo(new RoomPosition(5, 10, "W15S25"));
            //         creep.say(travelToIcons(creep) + "W15S25", true);
            //     }
            //     else if (creep.memory.waypoint == 1 
            //         || creep.pos.isNearTo(12, 31) == false) {
            //         creep.travelTo(new RoomPosition(12, 31, "W28N5"));
            //         creep.say(travelToIcons(creep) + "W28N5", true);
            //     }
            //     else if (creep.memory.goalReached != true) {
            //         creep.say(ICONS["testPassed"], true);
            //         creep.memory.goalReached = true;
            //         if (creep.memory.role == "scout") {
            //             console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
            //             Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
            //             Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
            //         }
            //     }
            // } else {
                incrementConfusedCreepCount(creep);
                creep.say("?", true);
            // }
        }
        else {
            creep.say(ICONS["testFinished"], true);
            creep.memory.role = "recyclable";
        }
    }
};

module.exports = roleScout;
