// TODO: Help build ally construction sites (without accidently steping on them)
let roleBuilder = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
            creep.memory.repairStructureID = undefined;
        }
        
        if(creep.memory.working == true) {
            let constructionSite = Game.getObjectById(creep.memory.constructionSiteID);
            if (constructionSite == undefined && creep.memory.constructionSiteID != undefined && creep.memory.repairStructureID == undefined) {
                let newRampart = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.hits <= RAMPART_DECAY_AMOUNT
                        && s.structureType == STRUCTURE_RAMPART
                )});
                if (newRampart != undefined) {
                    creep.memory.repairStructureID = newRampart.id;
                    return; // need to wait till next tick to repair it for some reason
                }
            }
            
            if (creep.memory.repairStructureID != undefined) {
                ROLES["repairer"].run(creep);
                return;
            }
            
            if (constructionSite == undefined && _.size(Game.constructionSites) > 0) {
                let roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                /*
                if (roomConstructionSites.length == 0) { // TODO: Change this block to check if there's any in rooms the creep can reasonably reach
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
                        constructionSite = roomConstructionSites[roomConstructionSites.length - 1];
                        creep.memory.constructionSiteID = constructionSite.id;
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
                            Memory.constructionStructureToFind = priorityQueue[i];
                            constructionSite = creep.pos.findClosestByRange(roomConstructionSites, {
                                filter: (c) => c.structureType == Memory.constructionStructureToFind
                            });
                            ++i;
                        }
                        while (i < priorityQueue.length && constructionSite == undefined) // TODO: Change this to a for...of loop with a break case for when constructionSite != undefined
                        
                        if (constructionSite != undefined) {
                            creep.memory.constructionSiteID = constructionSite.id;
                        }
                        else {
                            creep.memory.constructionSiteID = undefined;
                        }
                    }
                }
                else {
                    creep.memory.constructionSiteID = undefined;
                }
            }
            
            if(constructionSite != undefined) {
                let structureIcon = "?";
                switch (constructionSite.structureType) {
                    case STRUCTURE_SPAWN: structureIcon = "\uD83C\uDFE5"; break;
                    case STRUCTURE_EXTENSION: structureIcon = "\uD83C\uDFEA"; break;
                    case STRUCTURE_CONTAINER: structureIcon = "\uD83D\uDCE4"; break;
                    case STRUCTURE_STORAGE: structureIcon = "\uD83C\uDFE6"; break;
                    case STRUCTURE_RAMPART: structureIcon = "\uD83D\uDEA7"; break;
                    case STRUCTURE_WALL: structureIcon = "\u26F0"; break;
                    case STRUCTURE_TOWER: structureIcon = "\uD83D\uDD2B"; break
                    case STRUCTURE_ROAD: structureIcon = "\uD83D\uDEE3"; break;
                    case STRUCTURE_LINK: structureIcon = "\uD83D\uDCEE"; break;
                    case STRUCTURE_EXTRACTOR: structureIcon = "\uD83C\uDFED"; break;
                    case STRUCTURE_LAB: structureIcon = "\u2697"; break;
                    case STRUCTURE_TERMINAL: structureIcon = "\uD83C\uDFEC"; break;
                    case STRUCTURE_OBSERVER: structureIcon = "\uD83D\uDCE1"; break;
                    case STRUCTURE_POWER_SPAWN: structureIcon = "\uD83C\uDFDB"; break;
                    case STRUCTURE_NUKER: structureIcon = "\u2622"; break;
                }
                
                let err = creep.build(constructionSite);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(constructionSite);
                    creep.say("\u27A1\uD83C\uDFD7" + structureIcon, true);
                }
                else if (err == OK) {
                    creep.say("\uD83D\uDD28\uD83C\uDFD7" + structureIcon, true);
                } // TODO: go back to towers for repairs when can't work
            }
            else {
                ROLES["harvester"].run(creep);
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

module.exports = roleBuilder;
