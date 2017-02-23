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
                    actionIcon = ICONS["transfer"];
                }
                else {
                    err = creep.repair(structure);
                    actionIcon = ICONS["repair"];
                }
                
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + _.get(ICONS, structure.structureType, "?"), true);
                    creep.travelTo(structure, {
                        range: ((actionIcon == ICONS["repair"]) ? 3 : 1)
                    });
                }
                else if (err == OK) {
                    creep.say(actionIcon + _.get(ICONS, structure.structureType, "?"), true);
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
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "W86N29") {
                source = Game.getObjectById("5873bbab11e3e4361b4d63fc");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "W85N23") {
                source = Game.getObjectById("5873bbc911e3e4361b4d677e");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "W86N39") {
                source = Game.getObjectById("5873bbaa11e3e4361b4d63cf");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "W85N38") {
                source = Game.getObjectById("5873bbc711e3e4361b4d6731");
                if (source != undefined && source.energy == 0 && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            
            if (source != undefined) {
                let err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS["harvest"] + ICONS["source"], true);
                    creep.travelTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
                    creep.memory.working = true;
                }
                else if (err == OK) {
                    creep.say(ICONS["harvest"] + ICONS["source"], true);
                }
                else if (theStorage != undefined && theStorage.store.energy > 0) {
                    creep.cancelOrder("harvest");
                    err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy > (theTerminal.storeCapacity / 2)) {
                    creep.cancelOrder("harvest");
                    err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == ERR_NOT_ENOUGH_RESOURCES 
                        && creep.carry.energy > 0) {
                        creep.memory.working = true;
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                    }
                }
                else {
                    switch (creep.saying) {
                        case ICONS["wait0"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait1"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait1"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait2"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait2"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait3"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait3"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait4"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait4"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait5"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait5"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait6"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait6"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait7"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait7"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait8"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait8"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait9"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait9"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait10"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait11"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait11"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait12"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait12"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait13"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait13"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait14"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait14"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait15"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait15"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait16"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait16"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait17"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait17"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait18"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait18"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait19"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait19"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait20"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait20"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait21"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait21"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait22"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait22"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait23"] + ICONS["harvest"] + ICONS["source"], true); break;
                        default: creep.say(ICONS["wait0"] + ICONS["harvest"] + ICONS["source"], true);
                    }
                }
            }
            else {
                creep.say(ICONS["harvest"] + "?", true);
            }
        }
    }
};

module.exports = roleRepairer;
