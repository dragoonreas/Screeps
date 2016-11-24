var rolePickup = {
    
    run: function(creep) {
        
        var droppedEnergy = Game.getObjectById(creep.memory.droppedEnergyID);
        if (droppedEnergy == undefined) {
            creep.memory.droppedEnergyID = undefined;
            console.log(creep.name + " failed to pickup the dropped energy in " + creep.room.name);
            creep.say("Aww...");
        }
        else if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedEnergy);
            creep.say("Mine!");
        }
        else {
            creep.memory.droppedEnergyID = undefined;
            console.log(creep.name + " picked up the dropped energy in " + creep.room.name);
            creep.say("Yay!");
        }
    }
};

module.exports = rolePickup;
