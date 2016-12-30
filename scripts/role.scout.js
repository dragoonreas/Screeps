var roleScout = {

    run: function(creep) {
        
        if (creep.memory.goalReached != true && creep.ticksToLive == (CREEP_LIFE_TIME - CREEP_CLAIM_LIFE_TIME) && creep.memory.role == "scout") {
            console.log("CLAIMER RUN TEST: Claimer would only make it to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
            Game.notify("CLAIMER RUN TEST: Claimer would only make it to (" + creep.pos.x + ", " + creep.pos.y + ") in " + creep.room.name);
        }
        
        if (creep.memory.goalReached != true) {
            if (creep.memory.roomID == "E68N45") {
                if (creep.room.name == "E35N25" && creep.memory.warped != true) {
                    creep.memory.warped = true;
                }
                else if (creep.room.name == "E65N45" && creep.memory.warped == true) {
                    creep.memory.warped = false;
                }
                
                if (creep.room.name != "E35N25" && creep.memory.warped != true) {
                    creep.say("\u27A1E65N45", true);
                    if (creep.room.name == "E66N45" && creep.pos.x < 20 && creep.pos.x > 4) {
                        creep.moveTo(new RoomPosition(4, 27, "E66N45"));
                    }
                    else {
                        creep.moveTo(new RoomPosition(13, 9, "E65N45"));
                    }
                }
                else if ((creep.room.name != "E39N24" || (creep.room.name == "E39N24" && creep.pos.x == 29 && creep.pos.y == 13) == false) && creep.memory.warped == true) {
                    creep.say("\u27A1E39N24", true);
                    creep.moveTo(new RoomPosition(29, 13, "E39N24"), { reusePath: 0 }); // Need to react quick to evade enemy patrols
                }
                else if (creep.memory.goalReached != true) {
                    creep.memory.goalReached = true;
                    if (creep.memory.role == "scout") {
                        console.log("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                        Game.notify("CLAIMER TEST RUN: It would take a claimer " + (CREEP_LIFE_TIME - creep.ticksToLive) + " ticks to get to its goal.");
                    }
                }
            }
            else if (creep.memory.roomID == "E39N24") {
                if (creep.room.name == "E40N22") {
                    creep.memory.checkPoint0 = true;
                }
                if (creep.room.name == "E40N19") {
                    creep.memory.checkPoint1 = true;
                }
    
                if (creep.memory.checkPoint0 == undefined) {
                    creep.say("\u27A1E40N22", true);
                    creep.moveTo(new RoomPosition(25, 25, "E40N22"));
                }
                else if (creep.memory.checkPoint1 == undefined) {
                    creep.say("\u27A1E40N19", true);
                    creep.moveTo(new RoomPosition(25, 25, "E40N19"));
                }
                else if (creep.room.name != "E39N17" || (creep.pos.x == 6 && creep.pos.y == 20) == false) {
                    creep.say("\u27A1E39N17", true);
                    creep.moveTo(new RoomPosition(6, 20, "E39N17"));
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
            else if (creep.memory.roomID == "E39N17") {
                if (creep.room.name == "E40N20") {
                    creep.memory.checkPoint0 = true;
                }
                else if (creep.room.name == "E46N20") {
                    creep.memory.checkPoint1 = true;
                }
                else if (creep.room.name == "E46N18") {
                    creep.memory.chechpoint2 = true;
                }
                
                if (creep.memory.checkPoint0 == undefined) {
                    creep.say("\u27A1E40N20", true);
                    creep.moveTo(new RoomPosition(25, 25, "E40N20"));
                }
                else if (creep.memory.checkPoint1 == undefined) {
                    creep.say("\u27A1E46N20", true);
                    creep.moveTo(new RoomPosition(25, 25, "E46N20"));
                }
                else if (creep.memory.chechpoint2 == undefined) {
                    creep.say("\u27A1E46N18", true);
                    creep.moveTo(new RoomPosition(25, 25, "E46N18"));
                }
                else if (creep.room.name != "E43N18" || (creep.pos.x == 25 && creep.pos.y == 43) == false) {
                    creep.say("\u27A1E43N18", true);
                    creep.moveTo(new RoomPosition(25, 43, "E43N18"));
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
            else if (creep.memory.roomID == "E43N18") {
                if (creep.room.name == "W55N35" && creep.memory.warped != true) {
                    creep.memory.warped = true;
                }
                else if (creep.room.name == "E45N15" && creep.memory.warped == true) {
                    creep.memory.warped = false;
                }
                
                if (creep.room.name == "E45N18") {
                    creep.memory.checkPoint = 0;
                }
                else if (creep.room.name == "E45N15") {
                    creep.memory.checkPoint = 1;
                }
                else if (creep.room.name == "W53N34") {
                    creep.memory.checkPoint = 2;
                }
                
                if (creep.memory.checkPoint == undefined) {
                    creep.say("\u27A1E45N18", true);
                    creep.moveTo(new RoomPosition(5, 45, "E45N18"));
                }
                else if (creep.memory.checkPoint == 0 || creep.memory.warped != true) {
                    creep.say("\u27A1E45N15", true);
                    if (creep.room.name == "E45N17" && creep.pos.y < 10) {
                        creep.moveTo(new RoomPosition(5, 11, "E45N17"));
                    }
                    else {
                        creep.moveTo(new RoomPosition(36, 12, "E45N15"));
                    }
                }
                else if (creep.memory.checkPoint == 1 && creep.memory.warped == true) {
                    creep.say("\u27A1W53N34", true);
                    if (creep.room.name == "W54N35" && creep.pos.x < 22) {
                        creep.moveTo(new RoomPosition(22, 31, "W54N35"));
                    }
                    else {
                        creep.moveTo(new RoomPosition(25, 25, "W53N34"));
                    }
                }
                else if (creep.room.name != "W53N32" || (creep.pos.x == 28 && creep.pos.y == 16) == false) {
                    creep.say("\u27A1W53N32", true);
                    creep.moveTo(new RoomPosition(28, 16, "W53N32"));
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
