let roleCollector = {
    run: function(creep) {
        let droppedResource = Game.getObjectById(creep.memory.droppedResourceID);
        if (droppedResource == undefined) {
            console.log(creep.name + " failed to pickup the dropped resources in " + creep.room.name);
            creep.memory.droppedResourceID = undefined;
            Memory.rooms[creep.room.name].checkForDrops = true;
            creep.say("\uD83D\uDEE2?", true);
        }
        else if(creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
            creep.travelTo(droppedResource);
            creep.say("\u27A1\uD83D\uDEE2", true);
        }
        else {
            console.log(creep.name + " picked up " + Math.min(droppedResource.amount, creep.carryCapacity - _.sum(creep.carry)) + " of " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + droppedResource.room.name);
            creep.memory.droppedResourceID = undefined;
            Memory.rooms[creep.room.name].checkForDrops = true;
            creep.say("\u2B07\uD83D\uDEE2", true);
        }
    }
};

module.exports = roleCollector;
