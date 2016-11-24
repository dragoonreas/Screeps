var roleBuilder = require('role.builder');
var roleHarvester = require('role.harvester');

module.exports = {

    run: function(creep) {
        /*
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.structureID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        */
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.structureID = undefined;
        }

        if (creep.memory.working == false) {
            var structure = Game.getObjectById(creep.memory.structureID);
            /*
            if (structure == undefined || structure.hits == structure.hitsMax) {
                structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < s.hitsMax 
                        && s.structureType != STRUCTURE_WALL
                        && s.structureType != STRUCTURE_RAMPART
                        && s.structureType != STRUCTURE_ROAD
                )});
            }
            */
            if (structure == undefined) {
                structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_ROAD
                )});
            }
            if (structure != undefined) {
                if (creep.dismantle(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                Memory.minimumNumberOfRepairers = 0;
                roleBuilder.run(creep);
            }
        }
        else {
            /*
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                filter: (s) => s.id != "57ef9efc86f108ae6e610381"
            });
            */
            /*
            var source = Game.getObjectById("57ef9efc86f108ae6e610380");
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            */
            roleHarvester.run(creep);
        }
    }
};
