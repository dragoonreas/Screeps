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
			    && structure.structureType != STRUCTURE_TOWER 
                && structure.hits == structure.hitsMax) {
				structure = undefined;
				creep.say("Repaired!");
			}
			else if (structure != undefined 
			    && structure.structureType == STRUCTURE_TOWER 
			    && structure.energy == structure.energyCapacity) {
			    structure = undefined;
			    creep.say("Full!");
		    }
		    
            if(structure == undefined) {
                structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_TOWER 
                        && s.energy < s.energyCapacity;
                    }
                });
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
			}
            
            if (structure != undefined) {
				creep.memory.structureID = structure.id;
                if(structure.structureType == STRUCTURE_TOWER 
                    && structure.energy < structure.energyCapacity) {
                    if(creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                }
                else if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }
            else {
				creep.memory.structureID = undefined;
                roleBuilder.run(creep);
            }
        }
        else {
            var source = undefined;
            if (creep.memory.roomID == "E69N44") {
                /*
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                    filter: (s) => s.id != "57ef9efc86f108ae6e610381"
                });
                */
                source = Game.getObjectById("57ef9efc86f108ae6e610380");
            }
            else if (creep.memory.roomID == "E68N45") {
                /*
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                    filter: (s) => s.id != "57ef9ee786f108ae6e6101b3"
                });
                */
                source = Game.getObjectById("57ef9ee786f108ae6e6101b2");
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

module.exports = roleRepairer;
