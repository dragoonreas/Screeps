let roleUpgrader = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        
        if(creep.memory.working == true) {
            let theController = Game.rooms[creep.memory.roomID].controller;
            let err = creep.upgradeController(theController);
            if (err == ERR_NOT_IN_RANGE) {
                creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTROLLER], true);
                creep.travelTo(theController, {
                    range: 3
                });
            }
            else if (err == OK) {
                creep.say(ICONS["upgradeController"] + ICONS[STRUCTURE_CONTROLLER], true);
            }
        }
        else {
            let source = undefined;
            switch (creep.memory.roomID) {
                case "W87N29": source = Game.getObjectById("5873bb9511e3e4361b4d6157"); break;
                case "W86N29": source = Game.getObjectById("5873bbab11e3e4361b4d63fd"); break;
                case "W85N23": source = Game.getObjectById("5873bbc911e3e4361b4d677d"); break;
                case "W86N39": source = Game.getObjectById("5873bbaa11e3e4361b4d63ce"); break;
                case "W85N38": source = Game.getObjectById("5873bbc711e3e4361b4d6733"); break;
            }
            
            if (source != undefined) {
                let theTerminal = creep.room.terminal;
                let theStorage = creep.room.storage;
                let err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS["harvest"] + ICONS["source"], true);
                    creep.travelTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say(ICONS["harvest"] + ICONS["source"], true);
                }
                else if (theStorage != undefined && theStorage.store.energy > 0) {
                    creep.cancelOrder("harvest");
                    err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy > (theTerminal.storeCapacity / 2)) {
                    creep.cancelOrder("harvest");
                    err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                    }
                }
                else {
                    switch (creep.saying) {
                        case ICONS["wait0"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait1"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait1"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait2"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait2"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait3"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait3"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait4"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait4"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait5"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait5"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait6"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait6"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait7"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait7"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait8"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait8"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait9"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait9"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait10"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait11"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait11"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait12"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait12"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait13"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait13"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait14"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait14"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait15"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait15"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait16"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait16"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait17"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait17"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait18"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait18"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait19"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait19"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait20"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait20"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait21"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait21"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait22"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait22"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait23"] + ICONS["harvest"] + ICONS["source"], true); break;
                        default: creep.say(ICONS["wait0"] + ICONS["harvest"] + ICONS["source"], true);
                    }
                }
            }
            else {
                creep.say(ICONS["harvest"] + "?", true);
            }
        }
    }
};

module.exports = roleUpgrader;
