var roleMiner = {
    // TODO: Make this role (currently just a copy of upgrader)
    run: function(creep) {

        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working == true) {
            var theController = Game.rooms[creep.memory.roomID].controller;
            if(creep.upgradeController(theController) == ERR_NOT_IN_RANGE) {
                creep.moveTo(theController);
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
                case "E43N18": roleHarvester.run(creep); return;
                case "W53N32": roleHarvester.run(creep); return;
                case "E43N18": roleHarvester.run(creep); return;
                case "W53N32": roleHarvester.run(creep); return;
            }
            
            if (source != undefined) {
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

module.exports = roleMiner;
