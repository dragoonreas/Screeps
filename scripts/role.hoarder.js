var roleHoarder = {
    
    run: function(creep) {
        
        // Transfer any non-energy resources to storage
        for (let resourceType in creep.carry) {
            if (resourceType != RESOURCE_ENERGY) {
                var theStorage = Game.getObjectById("5830f0cb5e8515625b0b6ee4");
                if (creep.transfer(theStorage, resourceType, creep.carry[resourceType]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(theStorage);
                }
                break;
            }
        }
    }
};

module.exports = roleHoarder;
