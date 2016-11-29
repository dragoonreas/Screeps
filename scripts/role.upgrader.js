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
            if (creep.memory.roomID == "E69N44") {
                var source = Game.getObjectById("57ef9efc86f108ae6e610381");
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else if (creep.memory.roomID == "E68N45") {
                if (creep.room.name != "E68N45") {
                    creep.moveTo(new RoomPosition(26, 24, "E68N45"));
                }
                else {
                    var source = Game.getObjectById("57ef9ee786f108ae6e6101b3");
                    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;
