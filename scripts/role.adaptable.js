var roleAttacker = require("role.attacker");
var roleHoarder = require("role.hoarder");
var roleCollector = require("role.collector");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleRepairer = require("role.repairer");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleRecyclable = require("role.recyclable");
var roleScout = require("role.scout");

// role to use when doing ad-hoc stuff
var roleAdaptable = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        
        if (creep.memory.roomID == "E69N44") {
            if (creep.memory.working == false) {
                if (creep.room.name != "E71N47") {
                    creep.say("\u27A1E71N47", true);
                    creep.moveTo(new RoomPosition(25, 25, "E71N47"));
                }
                else {
                    let structure = Game.getObjectById(creep.memory.structureID);
                    if (structure == undefined || (_.get(structure, "energy", 0) == 0 && _.get(structure, "store.energy", 0) == 0)) {
                        structure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                            filter: (s) => (
                                _.get(s, "energy", 0) > 0 
                                || _.get(s, "store.energy", 0) > 0
                        )});
                        if (structure != undefined) {
                            creep.memory.structureID == structure.id;
                        }
                    }
                    
                    if (structure != undefined) {
                        let structureIcon = "?";
                        switch (structure.structureType) {
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
                        
                        let err = creep.withdraw(structure, RESOURCE_ENERGY);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.say("\u27A1" + structureIcon, true);
                            creep.moveTo(structure);
                        }
                        else if (err == OK) {
                            creep.say("\u2B07" + structureIcon, true);
                        }
                    }
                    else if (_.sum(creep.carry) > 0) {
                        creep.memory.working = true;
                    }
                    else {
                        Memory.room[creep.memory.roomID].creepMins.adaptables = 0;
                        if (creep.room.name != creep.memory.roomID) {
                            creep.say("\u27A1" + creep.memory.roomID, true);
                            creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
                        }
                        else {
                            creep.suicide();
                        }
                    }
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
    }
};

module.exports = roleAdaptable;
