var rolestore = {
    
    run: function(creep) {
        
        // Transfer any non-energy resources to storage
        for (let resourceType in creep.carry) {
            if (resourceType != RESOURCE_ENERGY) {
                if (creep.transfer(Game.getObjectById("5830f0cb5e8515625b0b6ee4"), resourceType, creep.carry[resourceType]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById("5830f0cb5e8515625b0b6ee4"));
                }
                break;
            }
        }
    }
};

module.exports = rolestore;
