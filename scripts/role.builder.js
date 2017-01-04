var roleHarvester = require("role.harvester");

var roleBuilder = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.checkedForDrops = undefined;
            creep.room.checkForDrops = true;
            creep.memory.wallID = undefined;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        
        if (false && creep.memory.roomID == "E39N17") {
            if (creep.room.controller.sign.username != "dragoonreas") {
                if (creep.signController(creep.room.controller, "Congrats to roncli for passing the QA test. Please stand by while this QA Dept. prepares to relocate to a different room.") == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                    return;
                }
            }
        }
        
        if(creep.memory.working == true) {
            var constructionSite = Game.getObjectById(creep.memory.constructionSiteID);
            if (constructionSite == undefined) {
                var roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                if (roomConstructionSites.length == 0) { // TODO: Change this block to check if there's any construction sites at all, then check if there's any in rooms the creep can reasonably reach
                    for (let roomID in Game.rooms) {
                        if (roomID != creep.room.name) {
                            roomConstructionSites = Game.rooms[roomID].find(FIND_MY_CONSTRUCTION_SITES);
                            if (roomConstructionSites.length > 0) {
                                break;
                            }
                        }
                    }
                }
                
                if (roomConstructionSites.length > 0) {
                    if (Memory.rooms[creep.room.name].buildOrderFILO == true) {
                        constructionSite = roomConstructionSites[roomConstructionSites.length - 1];
                        creep.memory.constructionSiteID = constructionSite.id;
                    }
                    else {
                        var priorityQueue = [STRUCTURE_SPAWN, 
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
                        var i = 0;
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
                var structureIcon = "?";
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
                
                var err = creep.build(constructionSite);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                    creep.say("\u27A1\uD83C\uDFD7" + structureIcon, true);
                }
                else if (err == OK) {
                    creep.say("\uD83D\uDD28\uD83C\uDFD7" + structureIcon, true);
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
        else {
            var source = undefined;
            if (creep.memory.roomID == "E69N44") {
                source = Game.getObjectById("57ef9efc86f108ae6e610380");
                if (source != undefined && source.energy == 0) {
                    roleHarvester.run(creep);
                    return;
                }
            }
            else if (creep.memory.roomID == "E68N45") {
                source = Game.getObjectById("57ef9ee786f108ae6e6101b2");
            }
            else if (creep.memory.roomID == "W53N32") {
                source = Game.getObjectById("579fa8b50700be0674d2e297");
                if (source != undefined && source.energy == 0) {
                    roleHarvester.run(creep);
                    return;
                }
            }
            
            var err = undefined;
            if (source != undefined) {
                err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\u26CF", true);
                    creep.moveTo(source);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES 
                    && creep.carry.energy > 0) {
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
            else {
                creep.say("\u26CF?", true);
            }
        }
    }
};

module.exports = roleBuilder;
