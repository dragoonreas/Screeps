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
            if (creep.memory.roomID == "E68N45") {
                var waypoints = [
                    "W15S35"
                    , "W20S34"
                    , "W19S36"
                ]
                if (creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                else if (creep.room.name == "E65N45" && creep.memory.waypoint > 0) { // the creep moved back through the portal
                    creep.memory.waypoint = 0;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.say("\u27A1E65N45", true);
                    if (creep.room.name == "E66N45" && creep.pos.x < 20 && creep.pos.x > 4) {
                        creep.moveTo(new RoomPosition(4, 23, "E66N45"));
                    }
                    else {
                        creep.moveTo(new RoomPosition(23, 26, "E65N45"));
                    }
                }
                else if (creep.memory.waypoint == 1) { // TODO: find a way to avoid all the guards during this part
                    creep.say("\u27A1W20S34", true);
                    creep.moveTo(new RoomPosition(25, 48, "W20S34"), { reusePath: 0 }); // need to react quick to evade enemy patrols
                }
                else if (creep.memory.waypoint == 2 || (creep.room.name == "W19S36" && creep.pos.x == 8 && creep.pos.y == 34) == false) {
                    creep.say("\u27A1W19S36", true);
                    creep.moveTo(new RoomPosition(8, 34, "W19S36"));
                }
                else if (creep.memory.goalReached != true) {
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                    }
                }
            }
        }
    }
};

module.exports = roleScout;
