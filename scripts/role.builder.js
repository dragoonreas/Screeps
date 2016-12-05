var roleHarvester = require("role.harvester");

var roleBuilder = {

    run: function(creep) {

        if(creep.memory.working && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var constructionSite = Game.getObjectById(creep.memory.constuctionSiteID);
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
                        creep.memory.constuctionSiteID = constructionSite.id;
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
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
        else {
            var source = undefined;
            if (creep.memory.roomID == "E69N44") {
                /*
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                    filter: (s) => s.id != "57ef9efc86f108ae6e610381"
                });
                */
                source = Game.getObjectById("57ef9efc86f108ae6e610380");
            }
            else if (creep.memory.roomID == "E68N45") {
                /*
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                    filter: (s) => s.id != "57ef9ee786f108ae6e6101b3"
                });
                */
                source = Game.getObjectById("57ef9ee786f108ae6e6101b2");
            }
            
            var err = undefined;
            if (source != undefined) {
                err = creep.harvest(source);
            }
            
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            else if (err == ERR_NOT_ENOUGH_RESOURCES 
                && creep.carry.energy > 0) {
                creep.memory.working = true;
            }
        }
    }
};

module.exports = roleBuilder;
