var roleBuilder = require("role.builder");
var roleHarvester = require("role.harvester");

var roleRepairer = {
	
    run: function(creep) {
		
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.repairStructureID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
            var structure = Game.getObjectById(creep.memory.repairStructureID);
			if (structure != undefined 
			    && structure.structureType != STRUCTURE_TOWER 
                && structure.hits == structure.hitsMax) {
				structure = undefined;
			}
			else if (structure != undefined 
			    && structure.structureType == STRUCTURE_TOWER 
			    && structure.energy == structure.energyCapacity) {
			    structure = undefined;
		    }
		    
            if(structure == undefined) {
                structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER 
                    && s.energy < s.energyCapacity
                )});
            }
            
            if (structure == undefined) {
                var repairerTypeFound = false;
                for (let repairerType in Memory.rooms[creep.memory.roomID].repairerTypeMins) {
                    if (repairerTypeFound == false && (repairerType == creep.memory.repairerType || repairerType == "all")) {
                        repairerTypeFound = true;
                    }
                    
                    if (creep.memory.roomID == "E39N17" && repairerType != creep.memory.repairerType) {
                        continue;
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
				creep.memory.repairStructureID = structure.id;
				
                var err = undefined;
                var actionIcon = "?";
                if(structure.structureType == STRUCTURE_TOWER 
                    && structure.energy < structure.energyCapacity) {
                    err = creep.transfer(structure, RESOURCE_ENERGY);
                    actionIcon = "\u2B06";
                }
                else {
                    err = creep.repair(structure);
                    actionIcon = "\u1f527";
                }
                
                var structureIcon = "?";
                switch (structure.structureType) {
                    case STRUCTURE_SPAWN: structureIcon = "\u1f3e5"; break;
                    case STRUCTURE_EXTENSION: structureIcon = "\u1f3ea"; break;
                    case STRUCTURE_CONTAINER: structureIcon = "\u1f4e4"; break;
                    case STRUCTURE_STORAGE: structureIcon = "\u1F3E6"; break;
                    case STRUCTURE_RAMPART: structureIcon = "\u1f6a7"; break;
                    case STRUCTURE_WALL: structureIcon = "\u26f0"; break;
                    case STRUCTURE_TOWER: structureIcon = "\u1f52b"; break;
                    case STRUCTURE_ROAD: structureIcon = "\u1f6e3"; break;
                    case STRUCTURE_LINK: structureIcon = "\u1f4ee"; break;
                    case STRUCTURE_EXTRACTOR: structureIcon = "\u1f3ed"; break;
                    case STRUCTURE_LAB: structureIcon = "\u2697"; break;
                    case STRUCTURE_TERMINAL: structureIcon = "\u1f3ec"; break;
                    case STRUCTURE_OBSERVER: structureIcon = "\u1f4e1"; break;
                    case STRUCTURE_POWER_SPAWN: structureIcon = "\u1f3db"; break;
                    case STRUCTURE_NUKER: structureIcon = "\u2622"; break;
                }
                
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1" + structureIcon, true);
                    creep.moveTo(structure);
                }
                else if (err == OK) {
                    creep.say(actionIcon + structureIcon, true);
                }
            }
            else {
				creep.memory.repairStructureID = undefined;
                roleBuilder.run(creep);
            }
        }
        else {
            var source = undefined;
            switch (creep.memory.roomID) {
                case "E69N44": source = Game.getObjectById("57ef9efc86f108ae6e610380"); break;
                case "E68N45": source = Game.getObjectById("57ef9ee786f108ae6e6101b2"); break;
                case "E54N9": {
                    source = Game.getObjectById("579faa250700be0674d307cb");
                    if (source.energy == 0) {
                        source = Game.getObjectById("579faa250700be0674d307ca");
                    }
                } break;
                case "E68N45": roleHarvester.run(creep); return;
                case "E39N17": roleHarvester.run(creep); return;
                case "E43N18": roleHarvester.run(creep); return;
                case "W53N32": roleHarvester.run(creep); return;
            }
            
            if (source != undefined) {
                var err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\u26CF", true);
                    creep.moveTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say("\u26CF", true);
                }
                else {
                    switch (creep.saying) {
                        case "\u1f55b\u26CF": creep.say("\u1f567\u26CF", true); break;
                        case "\u1f567\u26CF": creep.say("\u1f550\u26CF", true); break;
                        case "\u1f550\u26CF": creep.say("\u1f55c\u26CF", true); break;
                        case "\u1f55c\u26CF": creep.say("\u1f551\u26CF", true); break;
                        case "\u1f551\u26CF": creep.say("\u1f55d\u26CF", true); break;
                        case "\u1f55d\u26CF": creep.say("\u1f552\u26CF", true); break;
                        case "\u1f552\u26CF": creep.say("\u1f55e\u26CF", true); break;
                        case "\u1f55e\u26CF": creep.say("\u1f553\u26CF", true); break;
                        case "\u1f553\u26CF": creep.say("\u1f55f\u26CF", true); break;
                        case "\u1f55f\u26CF": creep.say("\u1f554\u26CF", true); break;
                        case "\u1f554\u26CF": creep.say("\u1f560\u26CF", true); break;
                        case "\u1f560\u26CF": creep.say("\u1f555\u26CF", true); break;
                        case "\u1f555\u26CF": creep.say("\u1f561\u26CF", true); break;
                        case "\u1f561\u26CF": creep.say("\u1f556\u26CF", true); break;
                        case "\u1f556\u26CF": creep.say("\u1f562\u26CF", true); break;
                        case "\u1f562\u26CF": creep.say("\u1f557\u26CF", true); break;
                        case "\u1f557\u26CF": creep.say("\u1f563\u26CF", true); break;
                        case "\u1f563\u26CF": creep.say("\u1f558\u26CF", true); break;
                        case "\u1f558\u26CF": creep.say("\u1f564\u26CF", true); break;
                        case "\u1f564\u26CF": creep.say("\u1f559\u26CF", true); break;
                        case "\u1f559\u26CF": creep.say("\u1f565\u26CF", true); break;
                        case "\u1f565\u26CF": creep.say("\u1f55a\u26CF", true); break;
                        case "\u1f55a\u26CF": creep.say("\u1f566\u26CF", true); break;
                        default: creep.say("\u1f55b\u26CF", true);
                    }
                }
            }
            else {
                creep.say("\u26CF?", true);
            }
        }
    }
};

module.exports = roleRepairer;
