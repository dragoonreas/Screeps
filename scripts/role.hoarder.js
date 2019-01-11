// Transfer any non-energy resources to storage or terminal
let roleHoarder = {
    run: function(creep) {
        creep.memory.executingRole = "hoarder";
        
        let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
        if (theTerminal != undefined 
            && theTerminal.storeCapacityFree > 0 
            && theTerminal.my == true) {
            for (let resourceType in creep.carry) {
                if (resourceType != RESOURCE_ENERGY) {
                    let err = creep.transfer(theTerminal, resourceType, Math.min(creep.carry[resourceType], theTerminal.storeCapacityFree));
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
        else if (theStorage != undefined 
            && _.sum(theStorage.store) < theStorage.storeCapacity
            && theStorage.my == true 
            && _.get(Memory.rooms, [creep.memory.roomID, "isShuttingDown"], false) == false) {
            for (let resourceType in creep.carry) {
                if (resourceType != RESOURCE_ENERGY) {
                    let err = creep.transfer(theStorage, resourceType, Math.min(creep.carry[resourceType], (theStorage.storeCapacity - _.sum(theStorage.store))));
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
        else {
            incrementConfusedCreepCount(creep);
            creep.say(ICONS["transfer"] + "?", true);
            return ERR_INVALID_TARGET;
        }
    }
};

module.exports = roleHoarder;
