// TODO: Finish this role
let roleMiner = {
    run: function(creep) {
        creep.memory.executingRole = "miner";
        
        let source = Game.getObjectById(creep.memory.sourceID);
        if (source == undefined) {
            let sourceMem = Memory.sources[creep.memory.sourceID];
            if (sourceMem != undefined && _.get(sourceMem, "minerName", creep.name) == creep.name && creep.room.name != sourceMem.pos.roomName) {
                if (sourceMem.minerName == undefined) {
                    sourceMem.minerName = creep.name;
                }
                creep.travelTo(sourceMem);
                creep.say(travelToIcons(creep) + sourceMem.pos.roomName, true);
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
                            creep.travelTo(RoomPositionFromObject(sourceMem));
                            creep.say(travelToIcons(creep) + sourceMem.pos.roomName, true);
                            return;
                        }
                        else if (sourceID == "5873bb7f11e3e4361b4d5f14" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(3, 34, "W88N29"));
                            creep.say(travelToIcons(creep) + "W88N29", true);
                            return;
                        }
                        else if (sourceID == "5873bb6711e3e4361b4d5cc5" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(7, 39, "W89N29"));
                            creep.say(travelToIcons(creep) + "W89N29", true);
                            return;
                        }
                        else if (sourceID == "5873bbab11e3e4361b4d6400" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(18, 8, "W86N28"));
                            creep.say(travelToIcons(creep) + "W86N28", true);
                            return;
                        }
                        else if (sourceID == "5873bbc811e3e4361b4d675b" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(23, 9, "W85N29"));
                            creep.say(travelToIcons(creep) + "W85N29", true);
                            return;
                        }
                        else if (sourceID == "5873bbe111e3e4361b4d6ac4" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(3, 3, "W84N23"));
                            creep.say(travelToIcons(creep) + "W84N23", true);
                            return;
                        }
                        else if (sourceID == "5873bbc911e3e4361b4d676e" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(4, 8, "W85N25"));
                            creep.say(travelToIcons(creep) + "W85N25", true);
                            return;
                        }
                        else if (sourceID == "5873bb9411e3e4361b4d6137" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(34, 19, "W87N39"));
                            creep.say(travelToIcons(creep) + "W87N39", true);
                            return;
                        }
                        else if (sourceID == "5873bb7e11e3e4361b4d5ef2" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(35, 4, "W88N39"));
                            creep.say(travelToIcons(creep) + "W88N39", true);
                            return;
                        }
                        else if (sourceID == "5873bbaa11e3e4361b4d63d2" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(8, 12, "W86N38"));
                            creep.say(travelToIcons(creep) + "W86N38", true);
                            return;
                        }
                        else if (sourceID == "5873bbc711e3e4361b4d672e" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(21, 12, "W85N39"));
                            creep.say(travelToIcons(creep) + "W85N39", true);
                            return;
                        }
                        else if (sourceID == "5873bb9311e3e4361b4d612d" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(18, 36, "W87N43"));
                            creep.say(travelToIcons(creep) + "W87N43", true);
                            return;
                        }
                        else if (sourceID == "5873bb9311e3e4361b4d612b" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(4, 35, "W87N44"));
                            creep.say(travelToIcons(creep) + "W87N44", true);
                            return;
                        }
                        else if (sourceID == "5873bbc611e3e4361b4d6715" && _.get(sourceMem, "minerName", creep.name) == creep.name) { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(17, 41, "W85N45"));
                            creep.say(travelToIcons(creep) + "W85N45", true);
                            return;
                        }
                    }
                }
            }
        }
        
        // Can't do anything if there's no source
        if (source == undefined) {
            incrementConfusedCreepCount(creep);
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
        if (creep.memory.working == false && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        
        let theContainer = source.container;
        let theLink = source.link;
        if(creep.memory.mining == false) {
            if (creep.memory.working == true) {
                let constructionSiteID = _.get(creep.memory, ["constructionSite", "id"], undefined);
                let constructionSite = Game.getObjectById(constructionSiteID);
                // TODO: Finish implementing travelTo if room not visible
                if (constructionSite == undefined) {
                    if (theLink != undefined && theLink instanceof ConstructionSite) {
                        constructionSite = theLink;
                    }
                    else if (theContainer != undefined && theContainer instanceof ConstructionSite) {
                        constructionSite = theContainer;
                    }
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
                
                if (constructionSite != undefined) {
                    let err = creep.build(constructionSite);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(constructionSite, {
                            range: 3
                        });
                        creep.say(travelToIcons(creep) + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
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
                let droppedResources = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
                    filter: (dr) => (dr.resourceType == RESOURCE_ENERGY)
                });
                if (droppedResources.length > 0) {
                    droppedResource = _.max(droppedResources, "amount");
                }
                
                if (droppedResource != undefined && creep.pickup(droppedResource) == OK) {
                    creep.say(ICONS["pickup"] + ICONS["resource"], true);
                }
                else if (theContainer != undefined && theContainer instanceof StructureContainer && theContainer.store[RESOURCE_ENERGY] > 0 && creep.withdraw(theContainer, RESOURCE_ENERGY) == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_CONTAINER], true);
                }
                else if (theLink != undefined && theLink instanceof StructureContainer && theLink.energy > 0 && creep.withdraw(theLink, RESOURCE_ENERGY) == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_LINK], true);
                }
                else {
                    incrementIdleCreepCount(creep);
                    switch (creep.saying) {
                        case ICONS["wait00"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait01"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait01"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait02"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait02"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait03"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait03"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait04"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait04"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait05"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait05"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait06"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait06"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait07"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait07"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait08"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait08"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait09"] + ICONS["harvest"] + ICONS["source"], true); break;
                        case ICONS["wait09"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
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
                        default: creep.say(ICONS["wait00"] + ICONS["harvest"] + ICONS["source"], true);
                    }
                }
            }
        }
        else {
            if (theContainer != undefined && creep.pos.isEqualTo(theContainer) == false) {
                creep.travelTo(theContainer);
                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTAINER], true);
                return;
            }
            else if (creep.memory.working == false && creep.pos.isNearTo(source) == false) {
                creep.travelTo(source);
                creep.say(travelToIcons(creep) + ICONS["harvest"] + ICONS["source"], true);
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
                    let theConstructionSites = Game.rooms[creep.memory.containerConstructionPos.roomName].lookForAt(LOOK_CONSTRUCTION_SITES, creep.memory.containerConstructionPos.x, creep.memory.containerConstructionPos.y);
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
                incrementIdleCreepCount(creep);
                switch (creep.saying) {
                    case ICONS["wait00"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait01"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait01"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait02"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait02"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait03"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait03"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait04"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait04"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait05"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait05"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait06"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait06"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait07"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait07"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait08"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait08"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait09"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait09"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
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
                    default: creep.say(ICONS["wait00"] + ICONS["harvest"] + ICONS["source"], true);
                }
            }
        }
    }
};

module.exports = roleMiner;
