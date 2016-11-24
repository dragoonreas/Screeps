var roleAttacker = {
    
    run: function(creep) {
        
        if (creep.room.name == "E68N44") {
            var invader = Game.getObjectById(creep.memory.invaderID);
            if (invader == undefined) {
                invader = creep.room.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (invader != undefined) {
                    creep.memory.invaderID = invader.id;
                    creep.say("Attack!");
                }
                else {
                    creep.memory.invaderID = undefined;
                }
            }
            
            if (invader != undefined) {
                if (creep.attack(invader) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(invader);
                }
            }
        }
    }
};

module.exports = roleAttacker;
