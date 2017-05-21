// Transfer any non-energy resources to storage
let roleHoarder = {
    run: function(creep) {
        creep.memory.executingRole = "hoarder";
        
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
        if (theStorage != undefined) {
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
        else {
            creep.say(ICONS[STRUCTURE_STORAGE] + "?", true);
        }
    }
};

module.exports = roleHoarder;
