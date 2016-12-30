var roleUpgrader = {

    run: function(creep) {

        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working == true) {
            var theController = Game.rooms[creep.memory.roomID].controller;
            var err = creep.upgradeController(theController);
            if (err == ERR_NOT_IN_RANGE) {
                creep.say("\u27A1\u1F3F0", true);
                creep.moveTo(theController);
            }
            else if (err == OK) {
                creep.say("\u2B06\u1F3F0", true);
            }
        }
        else {
            var source = undefined;
            switch (creep.memory.roomID) {
                case "E69N44": source = Game.getObjectById("57ef9efc86f108ae6e610381"); break;
                case "E68N45": source = Game.getObjectById("57ef9ee786f108ae6e6101b3"); break;
                case "E54N9": {
                    source = Game.getObjectById("579faa250700be0674d307cb");
                    if (source.energy == 0) {
                        source = Game.getObjectById("579faa250700be0674d307ca");
                    }
                } break;
                case "E68N45": source = Game.getObjectById("576a9cd257110ab231d89c70"); break;
                case "E39N17": source = Game.getObjectById("576a9cd357110ab231d89c87"); break;
                case "E43N18": source = Game.getObjectById("577b94120f9d51615fa490fa"); break;
                case "W53N32": source = Game.getObjectById("579fa8b50700be0674d2e296"); break;
            }
            
            if (source != undefined) {
                var theStorage = creep.room.storage;
                var err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\u26CF", true);
                    creep.moveTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say("\u26CF", true);
                }
                else if (theStorage != undefined && theStorage.store.energy > 0) {
                    creep.cancelOrder("harvest");
                    var err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\u1F3E6", true);
                        creep.moveTo(source);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say("\u2B07\u1F3E6", true);
                    }
                }
                else {
                    switch (creep.saying) {
                        case "\u1f55b\u26CF": creep.say("\u1f567\u26CF", true); break;
                        case "\u1f567\u26CF": creep.say("\u1f550\u26CF", true); break;
                        case "\u1f550\u26CF": creep.say("\u1f55c\u26CF", true); break;
                        case "\u1f55c\u26CF": creep.say("\u1f551\u26CF", true); break;
                        case "\u1f551\u26CF": creep.say("\u1f55d\u26CF", true); break;
                        case "\u1f55d\u26CF": creep.say("\u1f552\u26CF", true); break;
                        case "\u1f552\u26CF": creep.say("\u1f55e\u26CF", true); break;
                        case "\u1f55e\u26CF": creep.say("\u1f553\u26CF", true); break;
                        case "\u1f553\u26CF": creep.say("\u1f55f\u26CF", true); break;
                        case "\u1f55f\u26CF": creep.say("\u1f554\u26CF", true); break;
                        case "\u1f554\u26CF": creep.say("\u1f560\u26CF", true); break;
                        case "\u1f560\u26CF": creep.say("\u1f555\u26CF", true); break;
                        case "\u1f555\u26CF": creep.say("\u1f561\u26CF", true); break;
                        case "\u1f561\u26CF": creep.say("\u1f556\u26CF", true); break;
                        case "\u1f556\u26CF": creep.say("\u1f562\u26CF", true); break;
                        case "\u1f562\u26CF": creep.say("\u1f557\u26CF", true); break;
                        case "\u1f557\u26CF": creep.say("\u1f563\u26CF", true); break;
                        case "\u1f563\u26CF": creep.say("\u1f558\u26CF", true); break;
                        case "\u1f558\u26CF": creep.say("\u1f564\u26CF", true); break;
                        case "\u1f564\u26CF": creep.say("\u1f559\u26CF", true); break;
                        case "\u1f559\u26CF": creep.say("\u1f565\u26CF", true); break;
                        case "\u1f565\u26CF": creep.say("\u1f55a\u26CF", true); break;
                        case "\u1f55a\u26CF": creep.say("\u1f566\u26CF", true); break;
                        default: creep.say("\u1f55b\u26CF", true);
                    }
                }
            }
            else {
                creep.say("\u26CF?", true);
            }
        }
    }
};

module.exports = roleUpgrader;
