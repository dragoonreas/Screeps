var roleCollector = {
    
    run: function(creep) {
        
        var droppedResource = Game.getObjectById(creep.memory.droppedResourceID);
        if (droppedResource == undefined) {
            console.log(creep.name + " failed to pickup the dropped resources in " + creep.room.name);
            creep.memory.droppedResourceID = undefined;
            Memory.rooms[creep.room.name].checkForDrops = true;
            creep.say("Aww...");
        }
        else if(creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedResource);
            creep.say("Mine!");
        }
        else {
            console.log(creep.name + " picked up " + Math.min(droppedResource.amount, creep.carryCapacity - _.sum(creep.carry)) + " of " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + droppedResource.room.name);
            creep.memory.droppedResourceID = undefined;
            Memory.rooms[creep.room.name].checkForDrops = true;
            creep.say("Yay!");
        }
    }
};

module.exports = roleCollector;
