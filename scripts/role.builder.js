// TODO: Help build ally construction sites (without accidently steping on them)
let roleBuilder = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined; // can be a harvester when not working
            creep.memory.demolishStructure = undefined; // can be a demolisher
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.constructionSite = undefined;
            creep.memory.repairStructure = undefined; // can be a repairer when working
            creep.memory.depositStructure = undefined; // can be a harvester when working
        }
        
        if (creep.memory.working == true) {
            let constructionSiteID = _.get(creep.memory, ["constructionSite", "id"], undefined);
            let constructionSite = Game.getObjectById(constructionSiteID);
            let constructionSiteMemPos = _.get(creep.memory, ["constructionSite", "pos"], undefined);
            let repairStructureID = _.get(creep.memory, ["repairStructure", "id"], undefined);
            if (constructionSite == undefined && constructionSiteMemPos != undefined) {
                let constructionSiteMemRoomName = _.get(creep.memory, ["constructionSite", "pos", "roomName"], undefined); 
                if (Game.rooms[constructionSiteMemRoomName] == undefined) {
                    constructionSitePos = _.create(RoomPosition.prototype, constructionSiteMemPos);
                    creep.say(ICONS["moveTo"] + constructionSitePos.roomName, true);
                    creep.travelTo(constructionSitePos, {
                        range: 3
                    });
                    return;
                }
                else if (repairStructureID == undefined) {
                    creep.memory.constructionSite = undefined;
                    let newRampart = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.hits <= RAMPART_DECAY_AMOUNT
                            && s.structureType == STRUCTURE_RAMPART
                    )});
                    if (newRampart != undefined) {
                        creep.memory.repairStructure = { 
                            id: newRampart.id
                            , pos: newRampart.pos
                        };
                        creep.say(ICONS["wait0"] + ICONS["repair"] + ICONS[STRUCTURE_RAMPART], true);
                        return; // need to wait till next tick to repair it for some reason
                    }
                }
            }
            
            if (repairStructureID != undefined) {
                ROLES["repairer"].run(creep);
                return;
            }
            
            if (constructionSite == undefined && _.size(Game.constructionSites) > 0) {
                let roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                /*
                if (roomConstructionSites.length == 0) { // TODO: Change this block to check if there's any in rooms the creep can reasonably reach with construction sites needing to be built in them
                    for (let roomID in Game.rooms) {
                        if (roomID != creep.room.name) {
                            roomConstructionSites = Game.rooms[roomID].find(FIND_MY_CONSTRUCTION_SITES);
                            if (roomConstructionSites.length > 0) {
                                break;
                            }
                        }
                    }
                }
                */
                if (roomConstructionSites.length > 0) {
                    if (Memory.rooms[creep.room.name].buildOrderFILO == true) {
                        constructionSite = roomConstructionSites[roomConstructionSites.length - 1]; // TODO: Get max based on id instead
                        creep.memory.constructionSite = { 
                            id: constructionSite.id
                            , pos: constructionSite.pos
                        };
                    }
                    else {
                        let priorityQueue = [STRUCTURE_SPAWN, 
                                             STRUCTURE_EXTENSION, 
                                             STRUCTURE_CONTAINER, 
                                             STRUCTURE_STORAGE, 
                                             STRUCTURE_RAMPART, 
                                             STRUCTURE_WALL, 
                                             STRUCTURE_TOWER, 
                                             STRUCTURE_ROAD, 
                                             STRUCTURE_LINK, 
                                             STRUCTURE_EXTRACTOR, 
                                             STRUCTURE_LAB, 
                                             STRUCTURE_TERMINAL, 
                                             STRUCTURE_OBSERVER, 
                                             STRUCTURE_POWER_SPAWN, 
                                             STRUCTURE_NUKER];
                        let i = 0;
                        do {
                            Memory.constructionStructureToFind = priorityQueue[i]; // TODO: Find out why memory seems to be needed here instead of just a regualar variable
                            constructionSite = creep.pos.findClosestByRange(roomConstructionSites, {
                                filter: (c) => c.structureType == Memory.constructionStructureToFind
                            });
                            ++i;
                        }
                        while (i < priorityQueue.length && constructionSite == undefined) // TODO: Change this to a for...of loop with a break case for when constructionSite != undefined
                        
                        if (constructionSite != undefined) {
                            creep.memory.constructionSite = { 
                                id: constructionSite.id
                                , pos: constructionSite.pos
                            };
                        }
                        else {
                            creep.memory.constructionSite = undefined;
                        }
                    }
                }
                else {
                    creep.memory.constructionSite = undefined;
                }
            }
            
            if(constructionSite != undefined) {
                let err = creep.build(constructionSite);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
                    creep.travelTo(constructionSite, {
                        range: 3
                    });
                }
                else if (err == OK) {
                    creep.say(ICONS["build"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
                } // TODO: Go back to towers for repairs when can't work
                else {
                    creep.say(ICONS["build"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?") + "?", true);
                }
            }
            else {
                ROLES["harvester"].run(creep);
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
                case "W72N28": source = Game.getObjectById("5836b6eb8b8b9619519ef90e"); break;
                case "W64N31": source = Game.getObjectById("57ef9cad86f108ae6e60ca54"); break;
            }
            
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let theRecycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
            if (source != undefined 
                && source.energy == 0 
                && (theRecycleContainer == undefined 
                    || theRecycleContainer.store.energy == 0) 
                && (((theStorage == undefined 
                            || theStorage.store.energy == 0) 
                        && (theTerminal == undefined 
                            || theTerminal.store.energy <= (theTerminal.storeCapacity / 2))) 
                    || (((_.size(Game.constructionSites) == 0) 
                            || (Game.rooms[creep.memory.roomID] == undefined 
                                || Game.rooms[creep.memory.roomID].find(FIND_MY_CONSTRUCTION_SITES).length == 0))
                        /*&& _.get(Game.rooms, [creep.memory.roomID, "energyAvailable"], 0) == _.get(Game.rooms, [creep.memory.roomID, "energyCapacityAvailable"], 0)*/))) {
                if (_.get(Memory, ["rooms", creep.memory.roomID, "creepCounts", "upgrader"], 0) == 0) {
                    if (ROLES["upgrader"].run(creep) != ERR_NOT_ENOUGH_RESOURCES) {
                        return;
                    }
                }
                if ((creep.memory.roomID == "W9N45" || creep.memory.roomID == "W81N29" || creep.memory.roomID == "W72N28" || creep.memory.roomID == "W64N31") && (_.countBy(creep.body, "type")[WORK] || 0) >= 4) { // for new rooms that have old structures
                    ROLES["demolisher"].run(creep);
                }
                else {
                    ROLES["harvester"].run(creep);
                }
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
                ROLES["builder"].run(creep);
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

module.exports = roleBuilder;
