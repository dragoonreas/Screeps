var roleHarvester = require("role.harvester");

var roleBuilder = {

    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var constructionSite = Game.getObjectById(creep.memory.constuctionSiteID);
            if (constructionSite == undefined) {
                if (Memory.buildOrderFILO) {
                    var roomConstructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if (roomConstructionSites.length > 0) {
                        constructionSite = roomConstructionSites[roomConstructionSites.length - 1];
                        creep.memory.constuctionSiteID = constructionSite.id;
                    }
                    else {
                        creep.memory.constuctionSiteID = undefined;
                    }
                }
                else {
                    var priorityQueue = [STRUCTURE_SPAWN, 
                                         STRUCTURE_EXTENSION, 
                                         STRUCTURE_ROAD, 
                                         STRUCTURE_WALL, 
                                         STRUCTURE_RAMPART, 
                                         STRUCTURE_TOWER, 
                                         STRUCTURE_CONTAINER, 
                                         STRUCTURE_STORAGE, 
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
                        constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
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
            /*
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                filter: (s) => s.id != "57ef9efc86f108ae6e610381"
            });
            */
            var source = Game.getObjectById("57ef9efc86f108ae6e610380");
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleBuilder;
