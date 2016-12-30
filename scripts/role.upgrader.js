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
                creep.say("➡🏰", true);
                creep.moveTo(theController);
            }
            else if (err == OK) {
                creep.say("⬆🏰", true);
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
                    creep.say("➡⛏", true);
                    creep.moveTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say("⛏", true);
                }
                else if (theStorage != undefined && theStorage.store.energy > 0) {
                    creep.cancelOrder("harvest");
                    var err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("➡🏦", true);
                        creep.moveTo(source);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say("⬇🏦", true);
                    }
                }
                else {
                    switch (creep.saying) {
                        case "🕛⛏": creep.say("🕧⛏", true); break;
                        case "🕧⛏": creep.say("🕐⛏", true); break;
                        case "🕐⛏": creep.say("🕜⛏", true); break;
                        case "🕜⛏": creep.say("🕑⛏", true); break;
                        case "🕑⛏": creep.say("🕝⛏", true); break;
                        case "🕝⛏": creep.say("🕒⛏", true); break;
                        case "🕒⛏": creep.say("🕞⛏", true); break;
                        case "🕞⛏": creep.say("🕓⛏", true); break;
                        case "🕓⛏": creep.say("🕟⛏", true); break;
                        case "🕟⛏": creep.say("🕔⛏", true); break;
                        case "🕔⛏": creep.say("🕠⛏", true); break;
                        case "🕠⛏": creep.say("🕕⛏", true); break;
                        case "🕕⛏": creep.say("🕡⛏", true); break;
                        case "🕡⛏": creep.say("🕖⛏", true); break;
                        case "🕖⛏": creep.say("🕢⛏", true); break;
                        case "🕢⛏": creep.say("🕗⛏", true); break;
                        case "🕗⛏": creep.say("🕣⛏", true); break;
                        case "🕣⛏": creep.say("🕘⛏", true); break;
                        case "🕘⛏": creep.say("🕤⛏", true); break;
                        case "🕤⛏": creep.say("🕙⛏", true); break;
                        case "🕙⛏": creep.say("🕥⛏", true); break;
                        case "🕥⛏": creep.say("🕚⛏", true); break;
                        case "🕚⛏": creep.say("🕦⛏", true); break;
                        default: creep.say("🕛⛏", true);
                    }
                }
            }
            else {
                creep.say("⛏?", true);
            }
        }
    }
};

module.exports = roleUpgrader;
