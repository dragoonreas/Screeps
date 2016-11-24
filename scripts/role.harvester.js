var roleHarvester = {

    run: function(creep) {
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        
        if (creep.room.name == 'E68N44') {
            var invaders = creep.room.find(FIND_HOSTILE_CREEPS);
            if (invaders > 0) {
                invaders.sort(function(a,b){return a.ticksToLive - b.ticksToLive});
                Memory.E68N44EnergyAvaliable = Game.time + invaders[0].ticksToLive;
                Game.notify("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + creep.room.name + " for " + invaders[0].ticksToLive + " ticks.", 4 * invaders[0].ticksToLive);
            }
        }
        
        if (!creep.memory.working & creep.memory.sourceID == undefined) {
            if (Memory.E68N44EnergyAvaliable <= Game.time) {
                creep.memory.sourceID = "57ef9ee786f108ae6e6101b6";
            }
            else {
                creep.memory.sourceID = "57ef9efc86f108ae6e610380";
            }
        }
        if(creep.memory.working == false) {
            if (creep.memory.sourceID == "57ef9ee786f108ae6e6101b6" & creep.room.name != "E68N44" & Memory.E68N44EnergyAvaliable <= Game.time) {
                creep.moveTo(new RoomPosition(40, 43, "E68N44"));
            }
            else if (creep.memory.sourceID == "57ef9efc86f108ae6e610380" & creep.room.name != "E69N44") {
                creep.moveTo(new RoomPosition(37, 11, "E69N44"))
            }
            else {
                var source = Game.getObjectById(creep.memory.sourceID);
                if (source.energy == 0) {
                    if (creep.memory.sourceID == "57ef9ee786f108ae6e6101b6" & Memory.E68N44EnergyAvaliable < Game.time + source.ticksToRegeneration) {
                        Memory.E68N44EnergyAvaliable = Game.time + source.ticksToRegeneration;
                        console.log("E68N44's energy source will regen in " + source.ticksToRegeneration + " ticks");
                    }
                    creep.memory.sourceID = undefined;
                }
                else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
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
