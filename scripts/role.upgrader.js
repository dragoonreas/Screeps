let roleUpgrader = {
    run: function(creep) {
        creep.memory.executingRole = "upgrader";
        
        if (creep.memory.working == false
            && (_.sum(creep.carry) == creep.carryCapacity 
                || (creep.memory.role == "upgrader" 
                    && creep.memory.speeds["1"] > 1 
                    && (_.sum(creep.carry) + (creep.getActiveBodyparts(WORK) * HARVEST_POWER)) > creep.carryCapacity))) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined; // can be a harvester when not working
        }
        else if (creep.memory.working == true
            && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        
        if (creep.memory.working == true 
            && creep.memory.topUp !== true) {
            let theController = Game.rooms[creep.memory.roomID].controller;
            let err = creep.upgradeController(theController);
            if (err == ERR_NOT_IN_RANGE) {
                creep.travelTo(theController, {
                    range: 3
                });
                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTROLLER], true);
            }
            else if (err == OK) {
                creep.say(ICONS["upgradeController"] + ICONS[STRUCTURE_CONTROLLER], true);
                if (creep.memory.role == "upgrader" 
                    && creep.memory.speeds["1"] > 1 
                    && (_.sum(creep.carry) + (creep.getActiveBodyparts(WORK) * HARVEST_POWER)) <= creep.carryCapacity) {
                    creep.memory.topUp = true;
                    ROLES["upgrader"].run(creep);
                }
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say(ICONS[STRUCTURE_CONTROLLER] + "?", true);
            }
        }
        else {
            creep.memory.topUp = undefined;
            
            let source = undefined;
            switch (creep.memory.roomID) {
                case "E8S2": source = Game.getObjectById("596cea9da4b0a6000a635bb6"); break;
                case "E17S1": source = Game.getObjectById("596ce23b3c1b99000a4d32af"); break;
                case "E18S3": source = Game.getObjectById("596ce23b3c1b99000a4d3293"); break;
                case "E18S9": source = Game.getObjectById("596ce23b3c1b99000a4d3365"); break;
                case "E21S9": source = Game.getObjectById("59791d3c55e51c000b0bcb48"); break;
                case "E19S13": source = Game.getObjectById("59791d3c55e51c000b0bcc25"); break;
                case "E18S17": source = Game.getObjectById("59791d3c55e51c000b0bcc19"); break;
                case "E1S13": source = Game.getObjectById("59790a4b833ada000b96f435"); break;
                case "E2S11": source = Game.getObjectById("59790a4b833ada000b96f39b"); break;
                case "E3S15": source = Game.getObjectById("59790a4b833ada000b96f396"); break;
                case "E7S12": source = Game.getObjectById("59790d46833ada000b96f4d5"); break;
            }
            
            let err = ERR_INVALID_TARGET;
            if (source != undefined) {
                err = creep.harvest(source);
            }
            
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let theRecycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
            if (err == ERR_NOT_IN_RANGE) {
                creep.travelTo(source);
                creep.say(travelToIcons(creep) + ICONS["harvest"] + ICONS["source"], true);
            }
            else if (err == ERR_NOT_ENOUGH_RESOURCES 
                && creep.carry[RESOURCE_ENERGY] > 0) {
                creep.memory.working = true;
            }
            else if (err == OK) {
                creep.say(ICONS["harvest"] + ICONS["source"], true);
            }
            else if (creep.memory.role == "builder" || creep.memory.role == "repairer") {
                return ERR_NOT_ENOUGH_RESOURCES;
            }
            else if (theRecycleContainer != undefined
                && theRecycleContainer.store[RESOURCE_ENERGY] > 0
                && creep.memory.speeds["1"] <= 1) {
                err = creep.withdraw(theRecycleContainer, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theRecycleContainer);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTAINER], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_CONTAINER], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS[STRUCTURE_CONTAINER] + "?", true);
                }
            }
            else if (theStorage != undefined
                && theStorage.store[RESOURCE_ENERGY] > 0
                && creep.memory.speeds["1"] <= 1) {
                err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theStorage);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry[RESOURCE_ENERGY] > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                }
            }
            else if (theTerminal != undefined
                && (theTerminal.store[RESOURCE_ENERGY] > (theTerminal.storeCapacity / 2)
                    || (theTerminal.my == false
                        && theTerminal.store[RESOURCE_ENERGY] > 0))
                && creep.memory.speeds["1"] <= 1) {
                err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theTerminal);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry[RESOURCE_ENERGY] > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                }
            }
            else if (err == ERR_INVALID_TARGET) {
                incrementConfusedCreepCount(creep);
                creep.say(ICONS["harvest"] + "?", true);
            }
            else if (creep.memory.speeds["2"] < 2) {
                ROLES["harvester"].run(creep);
            }
            else {
                incrementIdleCreepCount(creep);
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
    }
};

module.exports = roleUpgrader;
