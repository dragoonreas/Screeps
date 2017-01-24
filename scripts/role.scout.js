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
            if (creep.memory.roomID == "E69N44") {
                var waypoints = [
                    "E70N37"
                    , "E69N37"
                    , "E68N37"
                ]
                if (creep.room.name == waypoints[creep.memory.waypoint]) {
                    ++creep.memory.waypoint;
                }
                
                if (creep.memory.waypoint == 0) {
                    creep.say("\u27A1E70N37", true);
                    creep.moveTo(new RoomPosition(1, 42, "E70N37"));
                }
                else if (creep.memory.waypoint == 1) {
                    creep.say("\u27A1E69N37", true);
                    creep.moveTo(new RoomPosition(48, 42, "E69N37"));
                }
                else if (creep.memory.waypoint == 2) {
                    creep.say("\u27A1E68N37", true);
                    creep.moveTo(new RoomPosition(48, 15, "E68N37"));
                }
                else if (creep.room.name == "E68N37" && creep.pos.isEqualTo(24, 34) == true) {
                    creep.say("\u27A1E68N37", true);
                    creep.moveTo(new RoomPosition(24, 34, "E68N37"));
                }
                else if (creep.memory.goalReached != true) {
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Memory.rooms[creep.memory.roomID].creepMins.scout = 0;
                    }
                }
            }
        }
    }
};

module.exports = roleScout;
