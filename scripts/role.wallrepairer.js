var roleRepairer = require('role.repairer');

module.exports = {

    run: function(creep) {

        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.wallID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
            var wall = Game.getObjectById(creep.memory.wallID);
            if (wall == undefined) {
                var walls = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < s.hitsMax 
                        && s.structureType == STRUCTURE_WALL
                )});
                if (walls.length > 0) {
                    Memory.wallRepairerCarryCapacity = creep.carryCapacity * 100;
                    wall = walls.sort(function(a,b){return Math.floor((b.hitsMax-b.hits)/Memory.wallRepairerCarryCapacity) - Math.floor((a.hitsMax-a.hits)/Memory.wallRepairerCarryCapacity)})[0];
                    creep.memory.wallID = wall.id;
                }
            }
    
            if (wall != undefined) {
                if (wall.hits < wall.hitsMax) {
                    if (creep.repair(wall) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(wall);
                    }
                }
                else {
                    creep.memory.wallID = undefined;
                    creep.say("Repaired!");
                }
            }
            else {
                roleRepairer.run(creep);
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