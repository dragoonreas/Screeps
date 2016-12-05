var roleHarvester = {

    run: function(creep) {
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }

        if (creep.memory.working == false) {
            if (creep.memory.roomID == "E69N44") {
                if (creep.memory.sourceID == undefined) {
                    if (Memory.E68N44EnergyAvaliable <= Game.time) {
                        creep.memory.sourceID = "57ef9ee786f108ae6e6101b6";
                    }
                    else {
                        creep.memory.sourceID = "57ef9efc86f108ae6e610380";
                    }
                }
                if (creep.memory.sourceID == "57ef9ee786f108ae6e6101b6" 
                    && creep.room.name != "E68N44" 
                    && Memory.E68N44EnergyAvaliable <= Game.time) {
                    creep.moveTo(new RoomPosition(40, 43, "E68N44"));
                }
                else if (creep.memory.sourceID == "57ef9efc86f108ae6e610380" 
                    && creep.room.name != "E69N44") {
                    creep.moveTo(new RoomPosition(37, 11, "E69N44"))
                }
                else {
                    var source = Game.getObjectById(creep.memory.sourceID);
                    if (source.energy == 0) {
                        if (creep.memory.sourceID == "57ef9ee786f108ae6e6101b6" 
                            && Memory.E68N44EnergyAvaliable < Game.time + source.ticksToRegeneration) {
                            Memory.E68N44EnergyAvaliable = Game.time + source.ticksToRegeneration;
                            console.log("E68N44's energy source will regen in " + source.ticksToRegeneration + " ticks");
                        }
                        else if (creep.memory.sourceID == "57ef9efc86f108ae6e610380" 
                            && creep.carry.energy > 0) {
                            creep.memory.working = true;
                        }
                        creep.memory.sourceID = undefined;
                    }
                    else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            } else if (creep.memory.roomID == "E68N45") {
                /*
                if (creep.memory.sourceID == undefined) {
                    creep.memory.sourceID = "57ef9ee786f108ae6e6101b2";
                }
                var source = Game.getObjectById(creep.memory.sourceID);
                */
                var source = Game.getObjectById("57ef9ee786f108ae6e6101b2");
                var err = creep.harvest(source);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
            }
        }
        else {
            if (creep.room.name != creep.memory.roomID) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_EXTENSION 
                            || s.structureType == STRUCTURE_SPAWN) 
                            && s.energy < s.energyCapacity;
                    }
                });
                if(target == undefined) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType == STRUCTURE_TOWER 
                            && s.energy < s.energyCapacity;
                    }
                });
                }
                if(target != undefined) {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
                else {
                    var theController = creep.room.controller;
                    if(creep.upgradeController(theController) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(theController);
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
