// Transfer any non-energy resources to storage
var roleHoarder = {
    
    run: function(creep) {
        
        var theStorage = Game.getObjectById(creep.memory.storageID);
        if (theStorage == undefined) {
            theStorage = Game.rooms[creep.memory.roomID].storage;
            if (theStorage == undefined) {
                theStorage = Game.getObjectById("5830f0cb5e8515625b0b6ee4");
            }
            
            creep.memory.storageID = theStorage.id;
        }
        
        for (let resourceType in creep.carry) {
            if (resourceType != RESOURCE_ENERGY) {
                if (creep.transfer(theStorage, resourceType, creep.carry[resourceType]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(theStorage);
                }
                break;
            }
        }
    }
};

module.exports = roleHoarder;
