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
                        else if (sourceID == "5fb2a3e60d314f7d088923c4") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(10, 10, "E32S11"));
                            creep.say(travelToIcons(creep) + "E32S11", true);
                            return;
                        }
                        else if (sourceID == "5fb2a3c40d314f7d08892288") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(3, 4, "E31S12"));
                            creep.say(travelToIcons(creep) + "E31S12", true);
                            return;
                        }
                        else if (sourceID == "5fb2a3c30d314f7d08892286") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(16, 44, "E31S11"));
                            creep.say(travelToIcons(creep) + "E31S11", true);
                            return;
                        }
                        else if (sourceID == "5fb2a44c0d314f7d0889288b") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(25, 46, "E35S12"));
                            creep.say(travelToIcons(creep) + "E35S12", true);
                            return;
                        }
                        else if (sourceID == "5fb2a42a0d314f7d088926bc") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(25, 40, "E34S13"));
                            creep.say(travelToIcons(creep) + "E34S13", true);
                            return;
                        }
                        else if (sourceID == "5fb2a44d0d314f7d0889289a") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(36, 6, "E35S15"));
                            creep.say(travelToIcons(creep) + "E35S15", true);
                            return;
                        }
                        else if (sourceID == "5fb2a44d0d314f7d0889288f") { // TODO: Remove this after the source has been added to memory
                            creep.memory.sourceID = sourceID;
                            sourceMem.minerName = creep.name;
                            creep.travelTo(new RoomPosition(24, 44, "E35S13"));
                            creep.say(travelToIcons(creep) + "E35S13", true);
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
