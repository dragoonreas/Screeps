// TODO: Repair ally structures and help fill their towers
let roleRepairer = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined; // can be a harvester when not working
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.repairStructure = undefined;
            creep.memory.constructionSite = undefined; // can be a builder when working
            creep.memory.depositStructure = undefined; // can be a harvester when working
        }
        
        if (creep.memory.working == true) {
            let structureID = _.get(creep.memory, ["repairStructure", "id"], undefined);
            let structure = Game.getObjectById(structureID);
            let structureMemPos = _.get(creep.memory, ["repairStructure", "pos"], undefined);
            let structureMemRoomName = _.get(creep.memory, ["repairStructure", "pos", "roomName"], undefined);
            if (structure == undefined 
                && structureMemPos != undefined 
                && Game.rooms[structureMemRoomName] == undefined) {
                let structurePos = _.create(RoomPosition.prototype, structureMemPos);
                creep.say(ICONS["moveTo"] + structurePos.roomName, true);
                creep.travelTo(structurePos, {
                    range: 3
                });
                return;
            }
            
            if (structure != undefined && 
                ((structure.structureType != STRUCTURE_TOWER 
                    && structure.hits == structure.hitsMax)
                || (structure.structureType == STRUCTURE_TOWER 
                    && structure.energy == structure.energyCapacity
                    && structure.hits == structure.hitsMax))) {
                structure = undefined;
            }
            
            if (structure == undefined) {
                creep.memory.repairStructure = undefined;
                structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER 
                    && s.energy < s.energyCapacity
                )});
                if (structure != undefined) {
                    creep.memory.repairStructure = { 
                        id: structure.id
                        , pos: structure.pos
                    };
                }
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
                            creep.memory.repairStructure = { 
                                id: structure.id
                                , pos: structure.pos
                            };
                            break;
                        }
                    }
                }
			}
            
            if (structure != undefined) {
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
                else {
                    creep.say(actionIcon + _.get(ICONS, structure.structureType, "?") + "?", true);
                }
            }
            else {
				creep.memory.repairStructure = undefined;
                ROLES["builder"].run(creep);
            }
        }
        else {
            let source = undefined;
            switch (creep.memory.roomID) {
                case "W87N29": source = Game.getObjectById("5873bb9511e3e4361b4d6159"); break;
                case "W86N29": source = Game.getObjectById("5873bbab11e3e4361b4d63fc"); break;
                case "W85N23": source = Game.getObjectById("5873bbc911e3e4361b4d677e"); break;
                case "W86N39": source = Game.getObjectById("5873bbaa11e3e4361b4d63cf"); break;
                case "W85N38": source = Game.getObjectById("5873bbc711e3e4361b4d6731"); break;
                case "W86N43": source = Game.getObjectById("5873bbaa11e3e4361b4d63c4"); break;
                case "W9N45": source = Game.getObjectById("577b935b0f9d51615fa48074"); break;
                case "W81N29": source = Game.getObjectById("5873bc2711e3e4361b4d7255"); break;
            }
            
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let theRecycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
            if (source != undefined && source.energy == 0 && (theRecycleContainer == undefined || theRecycleContainer.store.energy == 0) && (theStorage == undefined || theStorage.store.energy == 0) && (theTerminal == undefined || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) {
                ROLES["harvester"].run(creep);
                return;
            }
            
            let err = ERR_INVALID_TARGET;
            if (source != undefined) {
                err = creep.harvest(source);
            }
            
            if (err == ERR_NOT_IN_RANGE) {
                creep.say(ICONS["moveTo"] + ICONS["harvest"] + ICONS["source"], true);
                creep.travelTo(source);
            }
            else if (err == OK) {
                creep.say(ICONS["harvest"] + ICONS["source"], true);
            }
            else if (theRecycleContainer != undefined && theRecycleContainer.store.energy > 0) {
                creep.cancelOrder("harvest");
                err = creep.withdraw(theRecycleContainer, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTAINER], true);
                    creep.travelTo(theRecycleContainer);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_CONTAINER], true);
                }
                else {
                    creep.say(ICONS[STRUCTURE_CONTAINER] + "?", true);
                }
            }
            else if (theStorage != undefined && theStorage.store.energy > 0) {
                creep.cancelOrder("harvest");
                err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                    creep.travelTo(theStorage);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                }
                else {
                    creep.say(ICONS[STRUCTURE_STORAGE] + "?", true);
                }
            }
            else if (theTerminal != undefined && theTerminal.store.energy > (theTerminal.storeCapacity / 2)) {
                creep.cancelOrder("harvest");
                err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                    creep.travelTo(theTerminal);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                }
                else {
                    creep.say(ICONS[STRUCTURE_TERMINAL] + "?", true);
                }
            }
            else if (err == ERR_NOT_ENOUGH_RESOURCES 
                && creep.carry.energy > 0) {
                creep.memory.working = true;
                ROLES["repairer"].run(creep);
            }
            else if (err == ERR_INVALID_TARGET) {
                creep.say(ICONS["harvest"] + "?", true);
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
    }
};

module.exports = roleRepairer;
