var roleMiner = {
    // TODO: Make this role (currently just a copy of upgrader)
    run: function(creep) {

        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
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
                case "W53N32": roleHarvester.run(creep); return;
            }
            
            if (source != undefined) {
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
                else {
                    switch (creep.saying) {
                        case "\uD83D\uDD5B\u26CF": creep.say("\uD83D\uDD67\u26CF", true); break;
                        case "\uD83D\uDD67\u26CF": creep.say("\uD83D\uDD50\u26CF", true); break;
                        case "\uD83D\uDD50\u26CF": creep.say("\uD83D\uDD5C\u26CF", true); break;
                        case "\uD83D\uDD5C\u26CF": creep.say("\uD83D\uDD51\u26CF", true); break;
                        case "\uD83D\uDD51\u26CF": creep.say("\uD83D\uDD5D\u26CF", true); break;
                        case "\uD83D\uDD5D\u26CF": creep.say("\uD83D\uDD52\u26CF", true); break;
                        case "\uD83D\uDD52\u26CF": creep.say("\uD83D\uDD5E\u26CF", true); break;
                        case "\uD83D\uDD5E\u26CF": creep.say("\uD83D\uDD53\u26CF", true); break;
                        case "\uD83D\uDD53\u26CF": creep.say("\uD83D\uDD5F\u26CF", true); break;
                        case "\uD83D\uDD5F\u26CF": creep.say("\uD83D\uDD54\u26CF", true); break;
                        case "\uD83D\uDD54\u26CF": creep.say("\uD83D\uDD60\u26CF", true); break;
                        case "\uD83D\uDD60\u26CF": creep.say("\uD83D\uDD55\u26CF", true); break;
                        case "\uD83D\uDD55\u26CF": creep.say("\uD83D\uDD61\u26CF", true); break;
                        case "\uD83D\uDD61\u26CF": creep.say("\uD83D\uDD56\u26CF", true); break;
                        case "\uD83D\uDD56\u26CF": creep.say("\uD83D\uDD62\u26CF", true); break;
                        case "\uD83D\uDD62\u26CF": creep.say("\uD83D\uDD57\u26CF", true); break;
                        case "\uD83D\uDD57\u26CF": creep.say("\uD83D\uDD63\u26CF", true); break;
                        case "\uD83D\uDD63\u26CF": creep.say("\uD83D\uDD58\u26CF", true); break;
                        case "\uD83D\uDD58\u26CF": creep.say("\uD83D\uDD64\u26CF", true); break;
                        case "\uD83D\uDD64\u26CF": creep.say("\uD83D\uDD59\u26CF", true); break;
                        case "\uD83D\uDD59\u26CF": creep.say("\uD83D\uDD65\u26CF", true); break;
                        case "\uD83D\uDD65\u26CF": creep.say("\uD83D\uDD5A\u26CF", true); break;
                        case "\uD83D\uDD5A\u26CF": creep.say("\uD83D\uDD66\u26CF", true); break;
                        default: creep.say("\uD83D\uDD5B\u26CF", true);
                    }
                }
            }
            else {
                creep.say("\u26CF?", true);
            }
        }
    }
};

module.exports = roleMiner;
