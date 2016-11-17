var roleBuilder = require('role.repairer');

module.exports = {

    run: function(creep) {

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_WALL
            });
            var wall = undefined;
            if (walls.length > 0) {
                Memory.wallRepairerCarryCapacity = creep.carryCapacity * 100;
                var wall = walls.sort(function(a,b){return Math.floor((b.hitsMax-b.hits)/Memory.wallRepairerCarryCapacity) - Math.floor((a.hitsMax-a.hits)/Memory.wallRepairerCarryCapacity)})[0];
            }
            if (wall != undefined) {
                if (creep.repair(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
            }
            else {
                roleBuilder.run(repairer);
            }
        }
        else {
            /*
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                filter: (s) => s.id != "57ef9efc86f108ae6e610381"
            });
            */
            var source = Game.getObjectById("57ef9efc86f108ae6e610380");
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};
