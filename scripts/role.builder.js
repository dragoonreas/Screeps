var roleHarvester = require("role.harvester");

var roleBuilder = {

    run: function(creep) {

        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.checkedForDrops = undefined;
            creep.room.checkForDrops = true;
            creep.memory.wallID = undefined;
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
                if (roomConstructionSites.length == 0) {
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
                        while (i < priorityQueue.length && constructionSite == undefined)
                        
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
                    case STRUCTURE_SPAWN: structureIcon = "\u1f3e5"; break;
                    case STRUCTURE_EXTENSION: structureIcon = "\u1f3ea"; break;
                    case STRUCTURE_CONTAINER: structureIcon = "\u1f4e4"; break;
                    case STRUCTURE_STORAGE: structureIcon = "\u1F3E6"; break;
                    case STRUCTURE_RAMPART: structureIcon = "\u1f6a7"; break;
                    case STRUCTURE_WALL: structureIcon = "\u26f0"; break;
                    case STRUCTURE_TOWER: structureIcon = "\u1f52b"; break
                    case STRUCTURE_ROAD: structureIcon = "\u1f6e3"; break;
                    case STRUCTURE_LINK: structureIcon = "\u1f4ee"; break;
                    case STRUCTURE_EXTRACTOR: structureIcon = "\u1f3ed"; break;
                    case STRUCTURE_LAB: structureIcon = "\u2697"; break;
                    case STRUCTURE_TERMINAL: structureIcon = "\u1f3ec"; break;
                    case STRUCTURE_OBSERVER: structureIcon = "\u1f4e1"; break;
                    case STRUCTURE_POWER_SPAWN: structureIcon = "\u1f3db"; break;
                    case STRUCTURE_NUKER: structureIcon = "\u2622"; break;
                }
                
                var err = creep.build(constructionSite);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                    creep.say("\u27A1\u1F3D7" + structureIcon, true);
                }
                else if (err == OK) {
                    creep.say("\u1f528\u1F3D7" + structureIcon, true);
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
            else if (creep.memory.roomID == "E54N9") {
                source = Game.getObjectById("579faa250700be0674d307cb");
                if (source.energy == 0) {
                    source = Game.getObjectById("579faa250700be0674d307ca");
                }
            }
            else if (creep.memory.roomID == "E39N24") {
                source = Game.getObjectById("576a9cd257110ab231d89c70");
                if (source != undefined && source.energy == 0) {
                    if (creep.memory.checkedForDrops != true) {
                        creep.moveTo(new RoomPosition(42, 40, "E39N23"));
                        if (creep.room.name == "E39N23") {
                            creep.memory.droppedResourceID = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY}).id;
                            if (creep.memory.droppedResourceID == undefined) {
                                creep.cancelOrder(moveTo);
                                roleHarvester.run(creep);
                                creep.memory.checkedForDrops = true;
                            }
                        }
                    }
                    else {
                        roleHarvester.run(creep);
                    }
                    return;
                }
            }
            else if (creep.memory.roomID == "E39N17") {
                if (_.countBy(creep.body, (bp) => bp.type)[WORK] >= 4) {
                    source = Game.getObjectById(creep.memory.wallID);
                    if (source == undefined) {
                        source = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_WALL && s.hits > 1) });
                    }
                }
                if (source == undefined) {
                    creep.memory.wallID = undefined;
                    source = Game.getObjectById("576a9cd357110ab231d89c87");
                    if (source != undefined && source.energy == 0) {
                        roleHarvester.run(creep);
                        return;
                    }
                }
                else {
                    creep.memory.wallID = source.id;
                    var err = creep.dismantle(source);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\u26f0", true);
                        creep.moveTo(source);
                    }
                    else if (err == OK) {
                        creep.say("\u2692\u26f0", true);
                    }
                    return;
                }
            }
            else if (creep.memory.roomID == "E43N18") {
                if (_.countBy(creep.body, (bp) => bp.type)[WORK] >= 4) {
                    source = Game.getObjectById(creep.memory.wallID);
                    if (source == undefined) {
                        source = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_WALL && s.hits > 1) });
                    }
                }
                if (source == undefined) {
                    creep.memory.wallID = undefined;
                    source = Game.getObjectById("577b94120f9d51615fa490fa");
                    if (source != undefined && source.energy == 0) {
                        roleHarvester.run(creep);
                        return;
                    }
                }
                else {
                    creep.memory.wallID = source.id;
                    var err = creep.dismantle(source);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\u26f0", true);
                        creep.moveTo(source);
                    }
                    else if (err == OK) {
                        creep.say("\u2692\u26f0", true);
                    }
                    return;
                }
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
                        case "\u1f55b\u26CF": creep.say("\u1f567\u26CF", true); break;
                        case "\u1f567\u26CF": creep.say("\u1f550\u26CF", true); break;
                        case "\u1f550\u26CF": creep.say("\u1f55c\u26CF", true); break;
                        case "\u1f55c\u26CF": creep.say("\u1f551\u26CF", true); break;
                        case "\u1f551\u26CF": creep.say("\u1f55d\u26CF", true); break;
                        case "\u1f55d\u26CF": creep.say("\u1f552\u26CF", true); break;
                        case "\u1f552\u26CF": creep.say("\u1f55e\u26CF", true); break;
                        case "\u1f55e\u26CF": creep.say("\u1f553\u26CF", true); break;
                        case "\u1f553\u26CF": creep.say("\u1f55f\u26CF", true); break;
                        case "\u1f55f\u26CF": creep.say("\u1f554\u26CF", true); break;
                        case "\u1f554\u26CF": creep.say("\u1f560\u26CF", true); break;
                        case "\u1f560\u26CF": creep.say("\u1f555\u26CF", true); break;
                        case "\u1f555\u26CF": creep.say("\u1f561\u26CF", true); break;
                        case "\u1f561\u26CF": creep.say("\u1f556\u26CF", true); break;
                        case "\u1f556\u26CF": creep.say("\u1f562\u26CF", true); break;
                        case "\u1f562\u26CF": creep.say("\u1f557\u26CF", true); break;
                        case "\u1f557\u26CF": creep.say("\u1f563\u26CF", true); break;
                        case "\u1f563\u26CF": creep.say("\u1f558\u26CF", true); break;
                        case "\u1f558\u26CF": creep.say("\u1f564\u26CF", true); break;
                        case "\u1f564\u26CF": creep.say("\u1f559\u26CF", true); break;
                        case "\u1f559\u26CF": creep.say("\u1f565\u26CF", true); break;
                        case "\u1f565\u26CF": creep.say("\u1f55a\u26CF", true); break;
                        case "\u1f55a\u26CF": creep.say("\u1f566\u26CF", true); break;
                        default: creep.say("\u1f55b\u26CF", true);
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
