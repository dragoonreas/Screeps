var roleHarvester = {

    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        if(creep.memory.working == false) {
            if (creep.room.name != "E68N44") {
                creep.moveTo(new RoomPosition(40, 43, "E68N44"));
            }
            else {
                var source = Game.getObjectById("57ef9ee786f108ae6e6101b6");
                if (source == null) {
                    source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
                }
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        else {
            if (creep.room.name != "E69N44") {
                creep.moveTo(new RoomPosition(18, 20, "E69N44"));
            } else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });
                if(target == undefined) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                }
                if(target != undefined) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    var theController = Game.getObjectById("57ef9efc86f108ae6e61037f");
                    if(creep.upgradeController(theController) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(theController);
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
