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
                    actionIcon = "⬆";
                }
                else {
                    err = creep.repair(structure);
                    actionIcon = "🔧";
                }
                
                var structureIcon = "?";
                switch (structure.structureType) {
                    case STRUCTURE_SPAWN: structureIcon = "🏥"; break;
                    case STRUCTURE_EXTENSION: structureIcon = "🏘"; break;
                    case STRUCTURE_CONTAINER: structureIcon = "🛢"; break;
                    case STRUCTURE_STORAGE: structureIcon = "🏦"; break;
                    case STRUCTURE_RAMPART: structureIcon = "🚧"; break;
                    case STRUCTURE_WALL: structureIcon = "⛰"; break;
                    case STRUCTURE_TOWER: structureIcon = "🔫"; break;
                    case STRUCTURE_ROAD: structureIcon = "🛣"; break;
                    case STRUCTURE_LINK: structureIcon = "🏤"; break;
                    case STRUCTURE_EXTRACTOR: structureIcon = "🏭"; break;
                    case STRUCTURE_LAB: structureIcon = "⚗"; break;
                    case STRUCTURE_TERMINAL: structureIcon = "🏬"; break;
                    case STRUCTURE_OBSERVER: structureIcon = "📡"; break;
                    case STRUCTURE_POWER_SPAWN: structureIcon = "🏛"; break;
                    case STRUCTURE_NUKER: structureIcon = "☢"; break;
                }
                
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("➡" + structureIcon, true);
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
                    creep.say("➡⛏", true);
                    creep.moveTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say("⛏", true);
                }
                else {
                    switch (creep.saying) {
                        case "🕛⛏": creep.say("🕧⛏", true); break;
                        case "🕧⛏": creep.say("🕐⛏", true); break;
                        case "🕐⛏": creep.say("🕜⛏", true); break;
                        case "🕜⛏": creep.say("🕑⛏", true); break;
                        case "🕑⛏": creep.say("🕝⛏", true); break;
                        case "🕝⛏": creep.say("🕒⛏", true); break;
                        case "🕒⛏": creep.say("🕞⛏", true); break;
                        case "🕞⛏": creep.say("🕓⛏", true); break;
                        case "🕓⛏": creep.say("🕟⛏", true); break;
                        case "🕟⛏": creep.say("🕔⛏", true); break;
                        case "🕔⛏": creep.say("🕠⛏", true); break;
                        case "🕠⛏": creep.say("🕕⛏", true); break;
                        case "🕕⛏": creep.say("🕡⛏", true); break;
                        case "🕡⛏": creep.say("🕖⛏", true); break;
                        case "🕖⛏": creep.say("🕢⛏", true); break;
                        case "🕢⛏": creep.say("🕗⛏", true); break;
                        case "🕗⛏": creep.say("🕣⛏", true); break;
                        case "🕣⛏": creep.say("🕘⛏", true); break;
                        case "🕘⛏": creep.say("🕤⛏", true); break;
                        case "🕤⛏": creep.say("🕙⛏", true); break;
                        case "🕙⛏": creep.say("🕥⛏", true); break;
                        case "🕥⛏": creep.say("🕚⛏", true); break;
                        case "🕚⛏": creep.say("🕦⛏", true); break;
                        default: creep.say("🕛⛏", true);
                    }
                }
            }
            else {
                creep.say("⛏?", true);
            }
        }
    }
};

module.exports = roleRepairer;
