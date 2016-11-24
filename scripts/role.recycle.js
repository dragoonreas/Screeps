var rolerecycle = {
    
    run: function(creep) {
        /*
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
        */
        var err = creep.transfer(Game.getObjectById("5830f0cb5e8515625b0b6ee4"), RESOURCE_GHODIUM_OXIDE, 29);
        //console.log(err);
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById("5830f0cb5e8515625b0b6ee4"));
        }
        else {
            //creep.memory.role = "upgrader";
        }
    }
};

module.exports = rolerecycle;
