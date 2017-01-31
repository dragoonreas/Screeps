// Transfer any non-energy resources to storage
let roleHoarder = {
    run: function(creep) {
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
        if (theStorage != undefined) {
            for (let resourceType in creep.carry) {
                if (resourceType != RESOURCE_ENERGY) {
                    let err = creep.transfer(theStorage, resourceType, creep.carry[resourceType]);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFE6", true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say("\u2B06\uD83C\uDFE6", true);
                    }
                    break;
                }
            }
        }
        else {
            creep.say("\uD83C\uDFE6?", true);
        }
    }
};

module.exports = roleHoarder;
