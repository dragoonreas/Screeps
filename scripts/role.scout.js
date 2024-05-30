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
            
            if (sentFrom == "W64N31" 
                && sentTo == "W53N39") {
                let waypoints = [
                    "W60N30"
                    , "W60N40"
                    , "W53N39"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
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
                else if (creep.memory.waypoint == 2 
                    || creep.pos.isNearTo(11, 38) == false) {
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
            else if (sentFrom == "W64N31" 
                && sentTo == "W67N25") {
                let waypoints = [
                    "W66N29"
                    , "W67N25"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W66N29"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W66N29", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(44, 44) == false) {
                    creep.travelTo(new RoomPosition(44, 44, "W67N25"));
                    creep.say(travelToIcons(creep) + "W67N25", true);
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
            else if (sentFrom == "W67N25" 
                && sentTo == "W64N31") {
                let waypoints = [
                    "W66N29"
                    , "W64N31"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W66N29"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W66N29", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(30, 16) == false) {
                    creep.travelTo(new RoomPosition(30, 16, "W64N31"));
                    creep.say(travelToIcons(creep) + "W64N31", true);
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
            else if (sentFrom == "W48N52" 
                && sentTo == "W42N51") {
                let waypoints = [
                    "W48N51"
                    , "W47N50"
                    , "W42N51"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
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
                else if (creep.memory.waypoint == 2 
                    || creep.pos.isNearTo(26, 28) == false) {
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
            else if (sentFrom == "W52N47" 
                && sentTo == "W42N51") {
                let waypoints = [
                    "W40N51"
                    , "W42N51"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0 
                    || creep.room.name == "W50N51") {
                    creep.travelTo(new RoomPosition(38, 48, "W50N51"));
                    creep.say(travelToIcons(creep) + "W50N51", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(26, 28) == false) {
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
            else if (sentFrom == "W42N51" 
                && sentTo == "W52N47") {
                let waypoints = [
                    "W50N51"
                    , "W52N47"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0 
                    || creep.room.name == "W40N51") {
                    creep.travelTo(new RoomPosition(12, 48, "W40N51"));
                    creep.say(travelToIcons(creep) + "W50N50", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(11, 38) == false) {
                    creep.travelTo(new RoomPosition(11, 38, "W52N47"));
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
            else if (sentFrom == "W53N39" 
                && sentTo == "W52N47") {
                let waypoints = [
                    "W53N40"
                    , "W50N40"
                    , "W50N47"
                    , "W52N47"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W53N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W53N40", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N40", true);
                }
                else if (creep.memory.waypoint == 2) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N47"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N47", true);
                }
                else if (creep.memory.waypoint == 3 
                    || creep.pos.isNearTo(11, 38) == false) {
                    creep.travelTo(new RoomPosition(11, 38, "W52N47"));
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
            else if (sentFrom == "W52N47" 
                && sentTo == "W53N39") {
                let waypoints = [
                    "W50N47"
                    , "W50N40"
                    , "W53N40"
                    , "W53N39"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N47"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N47", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N40", true);
                }
                else if (creep.memory.waypoint == 2) {
                    creep.travelTo(new RoomPosition(25, 25, "W53N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W53N40", true);
                }
                else if (creep.memory.waypoint == 3 
                    || creep.pos.isNearTo(35, 28) == false) {
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
            else if (sentFrom == "W48N42" 
                && sentTo == "W53N39") {
                let waypoints = [
                    "W52N40"
                    , "W53N39"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W52N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W52N40", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(11, 38) == false) {
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
            else if (sentFrom == "W53N39" 
                && sentTo == "W48N42") {
                let waypoints = [
                    "W52N40"
                    , "W48N42"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W52N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W52N40", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(23, 41) == false) {
                    creep.travelTo(new RoomPosition(23, 41, "W48N42"));
                    creep.say(travelToIcons(creep) + "W48N42", true);
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
            else if (sentFrom == "W52N47" 
                && sentTo == "W48N42") {
                let waypoints = [
                    "W50N44"
                    , "W48N42"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N44"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N44", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(23, 41) == false) {
                    creep.travelTo(new RoomPosition(23, 41, "W48N42"));
                    creep.say(travelToIcons(creep) + "W48N42", true);
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
            else if (sentFrom == "W42N56" 
                && sentTo == "W42N51") {
                let waypoints = [
                    "W40N56"
                    , "W40N50"
                    , "W42N51"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W40N56"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W40N56", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W40N50"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W40N50", true);
                }
                else if (creep.memory.waypoint == 2 
                    || creep.pos.isNearTo(26, 28) == false) {
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
            else if (sentFrom == "W47N44" 
                && sentTo == "W53N39") {
                let waypoints = [
                    "W52N40"
                    , "W53N39"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W52N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W52N40", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(11, 38) == false) {
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
            else if (sentFrom == "W53N39" 
                && sentTo == "W47N44") {
                let waypoints = [
                    "W52N40"
                    , "W47N44"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W52N40"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W52N40", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(16, 10) == false) {
                    creep.travelTo(new RoomPosition(16, 10, "W47N44"));
                    creep.say(travelToIcons(creep) + "W47N44", true);
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
            else if (sentFrom == "W47N44" 
                && sentTo == "W52N47") {
                let waypoints = [
                    "W50N44"
                    , "W52N47"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N44"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N44", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(35, 28) == false) {
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
            else if (sentFrom == "W52N47" 
                && sentTo == "W47N44") {
                let waypoints = [
                    "W50N44"
                    , "W47N44"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W50N44"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W50N44", true);
                }
                else if (creep.memory.waypoint == 1 
                    || creep.pos.isNearTo(16, 10) == false) {
                    creep.travelTo(new RoomPosition(16, 10, "W47N44"));
                    creep.say(travelToIcons(creep) + "W47N44", true);
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
            else if (sentFrom == "W42N51" 
                && sentTo == "W42N56") {
                let waypoints = [
                    "W40N50"
                    , "W40N56"
                    , "W42N56"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W40N50"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W40N50", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W40N56"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W40N56", true);
                }
                else if (creep.memory.waypoint == 2 
                    || creep.pos.isNearTo(7, 25) == false) {
                    creep.travelTo(new RoomPosition(7, 25, "W42N56"));
                    creep.say(travelToIcons(creep) + "W42N56", true);
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
            else if (sentTo == "W91N45" 
                && sentFrom == "W86N43") {
                let waypoints = [
                    "W86N44"
                    , "W86N46"
                    , "W88N46"
                    , "W90N46"
                    , "W91N45"
                ];
                if (creep.memory.waypoint < waypoints.length 
                    && creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.travelTo(new RoomPosition(25, 25, "W86N44"), { 
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W86N44", true);
                }
                else if (creep.memory.waypoint == 1) {
                    creep.travelTo(new RoomPosition(25, 25, "W86N46"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W86N46", true);
                }
                else if (creep.memory.waypoint == 2) {
                    creep.travelTo(new RoomPosition(25, 25, "W88N46"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W88N46", true);
                }
                else if (creep.memory.waypoint == 3) {
                    creep.travelTo(new RoomPosition(25, 25, "W90N46"), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + "W90N46", true);
                }
                else if (creep.memory.waypoint == 4 
                    || creep.pos.isNearTo(44, 42) == false) {
                    creep.travelTo(new RoomPosition(44, 42, "W91N45"));
                    creep.say(travelToIcons(creep) + "W91N45", true);
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
            else if (sentFrom == "W46N41" 
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
