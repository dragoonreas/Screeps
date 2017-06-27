// Transfer any non-energy resources to storage or terminal
let roleHoarder = {
    run: function(creep) {
        creep.memory.executingRole = "hoarder";
        
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
        let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
        if (theStorage != undefined 
            && _.sum(theStorage.store) < theStorage.storeCapacity
            && theStorage.my == true) {
            for (let resourceType in creep.carry) {
                if (resourceType != RESOURCE_ENERGY) {
                    let err = creep.transfer(theStorage, resourceType, creep.carry[resourceType]);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theStorage);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                    break;
                }
            }
        }
        else if (theTerminal != undefined 
            && _.sum(theTerminal.store) < theTerminal.storeCapacity
            && theTerminal.my == true) {
            for (let resourceType in creep.carry) {
                if (resourceType != RESOURCE_ENERGY) {
                    let err = creep.transfer(theTerminal, resourceType, creep.carry[resourceType]);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theTerminal);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                    }
                    break;
                }
            }
        }
        else {
            incrementConfusedCreepCount(creep);
            creep.say(ICONS["transfer"] + "?", true);
            return ERR_INVALID_TARGET;
        }
    }
};

module.exports = roleHoarder;
