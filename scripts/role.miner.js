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
                
                creep.say(ICONS["moveTo"] + sourceMem.pos.roomName, true);
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
                            creep.say(ICONS["moveTo"] + sourceMem.pos.roomName, true);
                            creep.travelTo(sourceMem);
                            return;
                        }
                        else if (sourceID == "5873bb7f11e3e4361b4d5f17" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say(ICONS["moveTo"] + "W88N28", true);
                            creep.travelTo(new RoomPosition(24, 40, "W88N28"));
                            return;
                        }
                        else if (sourceID == "5873bb9511e3e4361b4d615c" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say(ICONS["moveTo"] + "W87N28", true);
                            creep.travelTo(new RoomPosition(20, 26, "W87N28"));
                            return;
                        }
                        else if (sourceID == "5873bbe111e3e4361b4d6ac4" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say(ICONS["moveTo"] + "W84N23", true);
                            creep.travelTo(new RoomPosition(3, 3, "W84N23"));
                            return;
                        }
                        else if (sourceID == "5873bbc911e3e4361b4d6770" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.say(ICONS["moveTo"] + "W85N25", true);
                            creep.travelTo(new RoomPosition(32, 37, "W85N25"));
                            return;
                        }
                    }
                }
            }
        }
        
        // Can't do anything if there's no source
        if (source == undefined) {
            creep.say(ICONS["harvest"] + "?", true);
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
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
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
                    let err = creep.build(constructionSite);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(constructionSite);
                        creep.say(ICONS["moveTo"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["build"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
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
                        let err = creep.repair(theStructure);
                        if (err == OK) {
                            creep.say(ICONS["repair"] + _.get(ICONS, theStructure.structureType, "?"), true);
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
                    creep.say(ICONS["pickup"] + ICONS["resource"], true);
                }
                else if (theContainer != undefined && theContainer instanceof StructureContainer && theContainer.store.energy > 0 && creep.withdraw(theContainer, RESOURCE_ENERGY) == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_CONTAINER], true);
                }
                else if (theLink != undefined && theLink instanceof StructureContainer && theLink.energy > 0 && creep.withdraw(theLink, RESOURCE_ENERGY) == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_LINK], true);
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
        else {
            if (theContainer != undefined && creep.pos.isEqualTo(theContainer) == false) {
                creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTAINER], true);
                creep.travelTo(theContainer);
                return;
            }
            else if (creep.memory.working == false && creep.pos.isNearTo(source) == false) {
                creep.say(ICONS["moveTo"] + ICONS["harvest"] + ICONS["source"], true);
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
                creep.say(ICONS["harvest"] + ICONS["source"], true);
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

module.exports = roleMiner;
