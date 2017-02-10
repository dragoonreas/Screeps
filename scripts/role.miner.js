// TODO: Finish this role
let roleMiner = {
    run: function(creep) {
        let source = Game.getObjectById(creep.memory.sourceID);
        if (source == undefined) {
            let sourceMem = Memory.sources[creep.memory.sourceID];
            if (sourceMem != undefined && _.get(sourceMem, "minerName", creep.name) == creep.name && creep.room.name != sourceMem.pos.roomName) {
                if (sourceMem.minerName == undefined) {
                    sourceMem.minerName = creep.name;
                }
                
                creep.say("\u27A1" + sourceMem.pos.roomName, true);
                creep.travelTo(sourceMem);
                return;
            }
            else {
                creep.memory.sourceID = undefined;
                
                let sourceIDs = _.keys(Game.rooms[creep.memory.roomID].minerSources);
                for (let sourceID of sourceIDs) {
                    source = Game.getObjectById(sourceID);
                    if (source != undefined) {
                        if (_.get(source, ["miner", "name"], creep.name) == creep.name) {
                            creep.memory.sourceID = sourceID;
                            source.miner = creep;
                            break;
                        }
                    }
                    else {
                        sourceMem = Memory.sources[sourceID];
                        if (sourceMem != undefined && _.get(sourceMem, "minerName", creep.name) == creep.name) {
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say("\u27A1" + sourceMem.pos.roomName, true);
                            creep.travelTo(sourceMem);
                            return;
                        }
                        else if (sourceID == "5873bb7f11e3e4361b4d5f17" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say("\u27A1W88N28", true);
                            creep.travelTo(new RoomPosition(24, 40, "W88N28"));
                            return;
                        }
                        else if (sourceID == "5873bb9511e3e4361b4d615c" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say("\u27A1W87N28", true);
                            creep.travelTo(new RoomPosition(20, 26, "W87N28"));
                            return;
                        }
                    }
                }
            }
        }
        
        // Can't do anything if there's no source
        if (source == undefined) {
            creep.say("\u26CF?", true);
            return;
        }
        
        // Set if the miner can build/repair the link/container/roads/ramparts around them (without moving), or just mine the source
        if (creep.memory.mining == false && source.energy == 0) {
            creep.memory.mining = true;
        }
        else if (creep.memory.mining == true && source.energy > 0) {
            creep.memory.mining = false;
        }
        
        // Set if (when not mining) the miner should be building/repairing or collecting energy
        if (creep.lastWorkingState == undefined) {
            creep.lastWorkingState = creep.memory.working;
        }
        if ((creep.memory.working == false || creep.lastWorkingState == false) && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if ((creep.memory.working == true || creep.lastWorkingState == true) && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        
        let theContainer = source.container;
        let theLink = source.link;
        if(creep.memory.mining == false) {
            if (creep.memory.working == true) {
                let constructionSite = Game.getObjectById(creep.memory.constructionSiteID);
                if (constructionSite == undefined) {
                    if (theLink != undefined && theLink instanceof ConstructionSite) {
                        constructionSite = theLink;
                    }
                    else if (theContainer != undefined && theContainer instanceof ConstructionSite) {
                        constructionSite = theContainer;
                    }
                }
                
                if (constructionSite != undefined) {
                    let structureIcon = "?";
                    switch (constructionSite.structureType) {
                        case STRUCTURE_CONTAINER: structureIcon = "\uD83D\uDCE4"; break;
                        case STRUCTURE_RAMPART: structureIcon = "\uD83D\uDEA7"; break;
                        case STRUCTURE_ROAD: structureIcon = "\uD83D\uDEE3"; break;
                        case STRUCTURE_LINK: structureIcon = "\uD83D\uDCEE"; break;
                    }
                    
                    let err = creep.build(constructionSite);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(constructionSite);
                        creep.say("\u27A1\uD83C\uDFD7" + structureIcon, true);
                    }
                    else if (err == OK) {
                        creep.say("\uD83D\uDD28\uD83C\uDFD7" + structureIcon, true);
                    } // TODO: Move off construction site if standing on it
                }
                else {
                    let theStructure = undefined;
                    let theStructures = creep.pos.findInRange(FIND_STRUCTURES, 3, { filter: (s) => (
                        s.hits < s.hitsMax
                    )});
                    if (theStructures.length > 0) {
                        theStructure = _.min(theStructures, "hits");
                    }
                    
                    if (theStructure != undefined) {
                        let structureIcon = "?";
                        switch (theStructure.structureType) {
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
                        
                        let err = creep.repair(theStructure);
                        if (err == OK) {
                            creep.say("\uD83D\uDD27" + structureIcon, true);
                        }
                    }
                }
            }
            else {
                let droppedResource = undefined
                let droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, {
                    filter: (dr) => (dr.resourceType == RESOURCE_ENERGY)
                });
                if (droppedResources.length > 0) {
                    droppedResource = _.max(droppedResources, "amount");
                }
                
                if (droppedResource != undefined && creep.pickup(droppedResource) == OK) {
                    creep.say("\u2B07\uD83D\uDEE2", true);
                }
                else if (theContainer != undefined && theContainer instanceof StructureContainer && theContainer.store.energy > 0 && creep.withdraw(theContainer, RESOURCE_ENERGY) == OK) {
                    creep.say("\u2B07\uD83D\uDCE4", true);
                }
                else if (theLink != undefined && theLink instanceof StructureContainer && theLink.energy > 0 && creep.withdraw(theContainer, RESOURCE_ENERGY) == OK) {
                    creep.say("\u2B07\uD83D\uDCEE", true);
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
        }
        else {
            if (theContainer != undefined && creep.pos.isEqualTo(theContainer) == false) {
                creep.say("\u27A1\uD83D\uDCE4", true);
                creep.travelTo(theContainer);
                return;
            }
            else if (creep.memory.working == false && creep.pos.isNearTo(source) == false) {
                creep.say("\u27A1\u26CF", true);
                creep.travelTo(source);
                return;
            } // TODO: Make sure the link can be reached if it exists
            
            if (creep.memory.travelTime == undefined) {
                creep.memory.travelTime = CREEP_LIFE_TIME - creep.ticksToLive;
                if (theContainer == undefined) { // TODO: Remove this code block after implementing the automatic allication when calling Source.container
                    if (creep.room.createConstructionSite(creep, STRUCTURE_CONTAINER) == OK) {
                        creep.memory.containerConstructionPos = creep.pos;
                    }
                    else {
                        let theStructures = creep.pos.lookForAt(LOOK_STRUCTURES);
                        if (theStructures.length > 0) {
                            let theContainer = _.find(theStructures, (s) => (s.structureType == STRUCTURE_CONTAINER));
                            if (theContainer != undefined) {
                                source.container = theContainer;
                            }
                        }
                    }
                }
            }
            else if (creep.memory.containerConstructionPos != undefined) { // TODO: Remove this code block after implementing the automatic allication when calling Source.container
                if (theContainer != undefined) {
                    creep.memory.containerConstructionPos = undefined;
                }
                else {
                    let theConstructionSites = Game.rooms[creep.memory.containerPos.roomName].lookForAt(LOOK_CONSTRUCTION_SITES, creep.memory.containerPos.x, creep.memory.containerPos.y);
                    if (theConstructionSites.length > 0 && _.first(theConstructionSites).structureType == STRUCTURE_CONTAINER) { // NOTE: You can only have 1 construction site on a tile at a time
                        source.container = _.first(theConstructionSites);
                        theContainer = source.container;
                        creep.memory.containerConstructionPos = undefined;
                    }
                }
            } // TODO: Automate linker construction
            
            // TODO: Transfer to the link if the carry is going to overflow next tick
            
            let err = creep.harvest(source);
            if (err == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.working = true;
            }
            else if (err == OK) {
                creep.say("\u26CF", true);
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
    }
};

module.exports = roleMiner;
