let roleUpgrader = {
    run: function(creep) {
        creep.memory.executingRole = "upgrader";
        
        if (creep.memory.working == false
            && (creep.carryCapacityAvailable == 0 
                || (creep.memory.role == "upgrader" 
                    && creep.memory.speeds["1"] > 1 
                    && (creep.carryTotal + (creep.getActiveBodyparts(WORK) * HARVEST_POWER)) > creep.carryCapacity))) {
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
                    && (creep.carryTotal + (creep.getActiveBodyparts(WORK) * HARVEST_POWER)) <= creep.carryCapacity) {
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
                case "W28N5": source = Game.getObjectById("5fb29bce0d314f7d0888d152"); break;
                case "W12S26": source = Game.getObjectById("5fb29dfd0d314f7d0888e8eb"); break;
            }
            
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            if (creep.memory.speeds["1"] <= 1 
                && ((_.get(theStorage, ["my"], true) == false 
                        && theStorage.store[RESOURCE_ENERGY] > 0) 
                    || (_.get(theTerminal, ["my"], true) == false 
                        && theTerminal.store[RESOURCE_ENERGY] > 0))) {
                source = undefined;
            }
            
            let err = ERR_INVALID_TARGET;
            if (source != undefined) {
                err = creep.harvest(source);
            }
            
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
                && (theTerminal.energyCapacityFree < 0 
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
                    case ICONS["wait00"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait01"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait01"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait02"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait02"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait03"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait03"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait04"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait04"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait05"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait05"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait06"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait06"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait07"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait07"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait08"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait08"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait09"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait09"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
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
                    default: creep.say(ICONS["wait00"] + ICONS["harvest"] + ICONS["source"], true);
                }
            }
        }
    }
};

module.exports = roleUpgrader;
