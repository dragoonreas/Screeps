// Transfer any non-energy resources to storage
var roleHoarder = {
    run: function(creep) {
        var theStorage = Game.getObjectById(creep.memory.storageID);
        if (theStorage == undefined) {
            theStorage = Game.rooms[creep.memory.roomID].storage;
            if (theStorage != undefined) {
                creep.memory.storageID = theStorage.id;
            }
        }
        
        for (let resourceType in creep.carry) {
            if (resourceType != RESOURCE_ENERGY) {
                var err = creep.transfer(theStorage, resourceType, creep.carry[resourceType]);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\uD83C\uDFE6", true);
                    creep.moveTo(theStorage);
                }
                else if (err == OK) {
                    creep.say("\u2B06\uD83C\uDFE6", true);
                }
                break;
            }
        }
    }
};

module.exports = roleHoarder;
