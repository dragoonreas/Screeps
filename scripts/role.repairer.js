var roleBuilder = require("role.builder");

var roleRepairer = {
	
    run: function(creep) {
		
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.structureID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
            var structure = Game.getObjectById(creep.memory.structureID);
			if (structure != undefined 
                && structure.hits < structure.hitsMax) {
				creep.say("Repaired!");
				structure = undefined;
			}
            if (structure == undefined) {
				if (creep.memory.structureType == STRUCTURE_WALL 
					|| creep.memory.structureType == STRUCTURE_RAMPART) { // TODO: Make wall repairers help rampart repairers once all walls are repaired
					var structures = creep.room.find(FIND_STRUCTURES, {
	                    filter: (s) => (s.hits < s.hitsMax 
	                        && s.structureType == creep.memory.structureType
	                )});
	                if (structures.length > 0) {
	                    structure = structures.sort(function(s0,s1){return (s1.hitsMax - s1.hits) - (s0.hitsMax - s0.hits)})[0];
	                }
				}
				if (structure == undefined && creep.memory.structureType != undefined) { // assumes only other structure type we're going to assign to repairers apart from walls and ramparts is roads
					structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    	filter: (s) => (s.hits < s.hitsMax 
                    	    && s.structureType == STRUCTURE_ROAD
                	)});
				}
				if (structure == undefined) {
					structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    	filter: (s) => (s.hits < s.hitsMax 
                    	    && s.structureType != STRUCTURE_WALL
                    	    && s.structureType != STRUCTURE_RAMPART
                    	    && s.structureType != STRUCTURE_ROAD
                	)});
				}
				if (structure != undefined) {
					creep.memory.structureID = structure.id;
                }
				else {
					creep.memory.structureID = undefined;
				}
			}
            
            if (structure != undefined) {
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
                roleBuilder.run(creep);
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

module.exports = roleRepairer;
