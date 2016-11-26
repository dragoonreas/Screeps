var roleCollector = {
    
    run: function(creep) {
        
        var droppedResource = Game.getObjectById(creep.memory.droppedResourceID);
        if (droppedResource == undefined) {
            console.log(creep.name + " failed to pickup the dropped resources in " + creep.room.name);
            creep.memory.droppedResourceID = undefined;
            creep.say("Aww...");
        }
        else if(creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedResource);
            creep.say("Mine!");
        }
        else {
            console.log(creep.name + " picked up the dropped resources in " + creep.room.name);
            Memory.checkForDrops[creep.room.name] = true;
            creep.memory.droppedResourceID = undefined;
            creep.say("Yay!");
        }
    }
};

module.exports = roleCollector;
