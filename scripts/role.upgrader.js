var roleUpgrader = {

    run: function(creep) {

        if(creep.memory.working && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            var source = undefined;
            if (creep.memory.roomID == "E69N44") {
                source = Game.getObjectById("57ef9efc86f108ae6e610381");
            }
            else if (creep.memory.roomID == "E68N45") {
                source = Game.getObjectById("57ef9ee786f108ae6e6101b3");
            }
            else if (creep.memory.roomID == "E54N9") {
                source = Game.getObjectById("579faa250700be0674d307cb");
                if (source.energy == 0) {
                    source.Game.getObjectById("579faa250700be0674d307ca");
                }
            }
            
            var err = undefined;
            if (source != undefined) {
                err = creep.harvest(source);
            }
            
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            else if (err == ERR_NOT_ENOUGH_RESOURCES 
                && creep.carry.energy > 0) {
                creep.memory.working = true;
            }
        }
    }
};

module.exports = roleUpgrader;
