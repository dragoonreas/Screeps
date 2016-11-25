var roleCollector = {
    
    run: function(creep) {
        
        var droppedResource = Game.getObjectById(creep.memory.droppedResourceID);
        if (droppedResource == undefined) {
            creep.memory.droppedResourceID = undefined;
            console.log(creep.name + " failed to pickup the dropped resources in " + creep.room.name);
            creep.say("Aww...");
        }
        else if(creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedResource);
            creep.say("Mine!");
        }
        else {
            creep.memory.droppedResourceID = undefined;
            Memory.checkForDrops[creep.room.name] = true;
            console.log(creep.name + " picked up the dropped resources in " + creep.room.name);
            creep.say("Yay!");
        }
    }
};

module.exports = roleCollector;
