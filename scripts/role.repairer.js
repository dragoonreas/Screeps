// TODO: Repair ally structures and help fill their towers
let roleRepairer = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined; // can be a harvester when not working
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.repairStructureID = undefined;
            creep.memory.constructionSiteID = undefined; // can be a builder when working
            creep.memory.depositeStructureID = undefined; // can be a harvester when working
        }
        
        if (creep.memory.working == true) {
            let structure = Game.getObjectById(creep.memory.repairStructureID);
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
		    
            if (structure == undefined) {
                creep.memory.repairStructureID = undefined;
                structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER 
                    && s.energy < s.energyCapacity
                )});
            }
            
            if (structure == undefined) {
                let repairerTypeFound = false;
                for (let repairerType in Memory.rooms[creep.memory.roomID].repairerTypeMins) { // TODO: Change to for...of once Memory.rooms[creep.memory.roomID].repairerTypeMins is changed to an array
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
                        else {
                            let theStructures = undefined;
                            if (repairerType != "all") {
                                theStructures = creep.room.find(FIND_STRUCTURES, {
                                    filter: (s) => (s.hits < s.hitsMax 
                                        && s.structureType == repairerType
                                )});
                            }
                            else {
                                theStructures = creep.room.find(FIND_STRUCTURES, {
                                    filter: (s) => (s.hits < s.hitsMax
                                )});
                            }
                            
                            if (theStructures.length > 0) {
                                structure = _.min(theStructures, "hits");
                            }
                        }
                        if (structure != undefined) {
                            break;
                        }
                    }
                }
			}
            
            if (structure != undefined) {
				creep.memory.repairStructureID = structure.id;
				
                let err = undefined;
                let actionIcon = "?";
                if(structure.structureType == STRUCTURE_TOWER 
                    && structure.energy < structure.energyCapacity) {
                    err = creep.transfer(structure, RESOURCE_ENERGY);
                    actionIcon = "\u2B06";
                }
                else {
                    err = creep.repair(structure);
                    actionIcon = "\uD83D\uDD27";
                }
                
                let structureIcon = "?";
                switch (structure.structureType) {
                    case STRUCTURE_SPAWN: structureIcon = "\uD83C\uDFE5"; break;
                    case STRUCTURE_EXTENSION: structureIcon = "\uD83C\uDFEA"; break;
                    case STRUCTURE_CONTAINER: structureIcon = "\uD83D\uDCE4"; break;
                    case STRUCTURE_STORAGE: structureIcon = "\uD83C\uDFE6"; break;
                    case STRUCTURE_RAMPART: structureIcon = "\uD83D\uDEA7"; break;
                    case STRUCTURE_WALL: structureIcon = "\u26F0"; break;
                    case STRUCTURE_TOWER: structureIcon = "\uD83D\uDD2B"; break;
                    case STRUCTURE_ROAD: structureIcon = "\uD83D\uDEE3"; break;
                    case STRUCTURE_LINK: structureIcon = "\uD83D\uDCEE"; break;
                    case STRUCTURE_EXTRACTOR: structureIcon = "\uD83C\uDFED"; break;
                    case STRUCTURE_LAB: structureIcon = "\u2697"; break;
                    case STRUCTURE_TERMINAL: structureIcon = "\uD83C\uDFEC"; break;
                    case STRUCTURE_OBSERVER: structureIcon = "\uD83D\uDCE1"; break;
                    case STRUCTURE_POWER_SPAWN: structureIcon = "\uD83C\uDFDB"; break;
                    case STRUCTURE_NUKER: structureIcon = "\u2622"; break;
                }
                
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1" + structureIcon, true);
                    creep.travelTo(structure);
                }
                else if (err == OK) {
                    creep.say(actionIcon + structureIcon, true);
                }
            }
            else {
				creep.memory.repairStructureID = undefined;
                ROLES["builder"].run(creep);
            }
        }
        else {
            let source = undefined;
            let theStorage = Game.rooms[creep.memory.roomID].storage;
            let theTerminal = Game.rooms[creep.memory.roomID].terminal;
            if (creep.memory.roomID == "W87N29") {
                source = Game.getObjectById("5873bb9511e3e4361b4d6159");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy > (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "W86N29") {
                source = Game.getObjectById("5873bbab11e3e4361b4d63fc");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy > (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "W85N23") {
                source = Game.getObjectById("5873bbc911e3e4361b4d677e");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy > (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            
            if (source != undefined) {
                let err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\u26CF", true);
                    creep.travelTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say("\u26CF", true);
                }
                else if (theStorage != undefined && theStorage.store.energy > 0) {
                    creep.cancelOrder("harvest");
                    err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFE6", true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say("\u2B07\uD83C\uDFE6", true);
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy > (theTerminal.storeCapacity / 2)) {
                    creep.cancelOrder("harvest");
                    err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFEC", true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say("\u2B07\uD83C\uDFEC", true);
                    }
                }
                else {
                    switch (creep.saying) {
                        case "\uD83D\uDD5B\u26CF": creep.say("\uD83D\uDD67\u26CF", true); break;
                        case "\uD83D\uDD67\u26CF": creep.say("\uD83D\uDD50\u26CF", true); break;
                        case "\uD83D\uDD50\u26CF": creep.say("\uD83D\uDD5C\u26CF", true); break;
                        case "\uD83D\uDD5C\u26CF": creep.say("\uD83D\uDD51\u26CF", true); break;
                        case "\uD83D\uDD51\u26CF": creep.say("\uD83D\uDD5D\u26CF", true); break;
                        case "\uD83D\uDD5D\u26CF": creep.say("\uD83D\uDD52\u26CF", true); break;
                        case "\uD83D\uDD52\u26CF": creep.say("\uD83D\uDD5E\u26CF", true); break;
                        case "\uD83D\uDD5E\u26CF": creep.say("\uD83D\uDD53\u26CF", true); break;
                        case "\uD83D\uDD53\u26CF": creep.say("\uD83D\uDD5F\u26CF", true); break;
                        case "\uD83D\uDD5F\u26CF": creep.say("\uD83D\uDD54\u26CF", true); break;
                        case "\uD83D\uDD54\u26CF": creep.say("\uD83D\uDD60\u26CF", true); break;
                        case "\uD83D\uDD60\u26CF": creep.say("\uD83D\uDD55\u26CF", true); break;
                        case "\uD83D\uDD55\u26CF": creep.say("\uD83D\uDD61\u26CF", true); break;
                        case "\uD83D\uDD61\u26CF": creep.say("\uD83D\uDD56\u26CF", true); break;
                        case "\uD83D\uDD56\u26CF": creep.say("\uD83D\uDD62\u26CF", true); break;
                        case "\uD83D\uDD62\u26CF": creep.say("\uD83D\uDD57\u26CF", true); break;
                        case "\uD83D\uDD57\u26CF": creep.say("\uD83D\uDD63\u26CF", true); break;
                        case "\uD83D\uDD63\u26CF": creep.say("\uD83D\uDD58\u26CF", true); break;
                        case "\uD83D\uDD58\u26CF": creep.say("\uD83D\uDD64\u26CF", true); break;
                        case "\uD83D\uDD64\u26CF": creep.say("\uD83D\uDD59\u26CF", true); break;
                        case "\uD83D\uDD59\u26CF": creep.say("\uD83D\uDD65\u26CF", true); break;
                        case "\uD83D\uDD65\u26CF": creep.say("\uD83D\uDD5A\u26CF", true); break;
                        case "\uD83D\uDD5A\u26CF": creep.say("\uD83D\uDD66\u26CF", true); break;
                        default: creep.say("\uD83D\uDD5B\u26CF", true);
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
