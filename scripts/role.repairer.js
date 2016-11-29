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
                && structure.hits == structure.hitsMax) {
				creep.say("Repaired!");
				structure = undefined;
			}
            if (structure == undefined) {
                var repairerTypeFound = false;
                for (let repairerType in Memory.rooms[creep.memory.roomID].repairerTypeMins) {
                    if (repairerTypeFound == false && (repairerType == creep.memory.repairerType || repairerType == "all")) {
                        repairerTypeFound = true;
                    }
                    if (repairerTypeFound == true) {
                        if (repairerType == STRUCTURE_ROAD) {
        					structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            	filter: (s) => (s.hits < s.hitsMax 
                            	    && s.structureType == repairerType
                        	)});
                        }
                        else if (repairerType != "all") {
        					var structures = creep.room.find(FIND_STRUCTURES, {
        	                    filter: (s) => (s.hits < s.hitsMax 
        	                        && s.structureType == repairerType
        	                )});
        	                if (structures.length > 0) {
        	                    structure = structures.sort(function(s0,s1){return (s1.hitsMax - s1.hits) - (s0.hitsMax - s0.hits)})[0];
        	                }
                        }
                        else {
        					structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            	filter: (s) => (s.hits < s.hitsMax
                        	)});
                        }
                        if (structure != undefined) {
                            break;
                        }
                    }
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
            if (creep.memory.roomID == "E69N44") {
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
            else if (creep.memory.roomID == "E68N45") {
                /*
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                    filter: (s) => s.id != "57ef9ee786f108ae6e6101b3"
                });
                */
                var source = Game.getObjectById("57ef9ee786f108ae6e6101b2");
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};

module.exports = roleRepairer;
