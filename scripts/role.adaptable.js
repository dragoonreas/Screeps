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
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.structureID = undefined;
        }
        
        if (creep.memory.roomID == "E69N44") {
            if (creep.memory.working == true) {
                if (creep.room.name != "E68N45") {
                    creep.say("\u27A1E68N45", true);
                    creep.moveTo(new RoomPosition(25, 25, "E68N45"));
                }
                else {
                    let tower = Game.getObjectById(creep.memory.towerID);
                    if (tower == undefined || tower.energy >= (tower.energyCapacity - TOWER_ENERGY_COST)) { // NOTE: if the tower had enough energy to do something last tick and did it, it won't quite be full when it's checked the tick after filling it
                        let towers = creep.room.find(FIND_MY_STRUCTURES, {
                            filter: (s) => (
                                s.structureType == STRUCTURE_TOWER 
                                && s.energy < (s.energyCapacity - TOWER_ENERGY_COST)
                        )});
                        
                        if (towers != undefined) {
                            tower = towers.sort(function(t0,t1){return (t1.energyCapacity - t1.energy) - (t0.energyCapacity - t0.energy)})[0];
                            creep.memory.towerID = tower.id;
                        }
                    }
                    
                    if (tower != undefined) {
                        let err = creep.transfer(tower, RESOURCE_ENERGY);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.say("\u27A1\uD83D\uDD2B", true);
                            creep.moveTo(tower);
                        }
                        else if (err == OK) {
                            creep.say("\u2B06\uD83D\uDD2B", true);
                        }
                    }
                    else {
                        creep.say("\uD83D\uDD2B?", true);
                    }
                }
            }
            else {
                if ((creep.room.name == "E68N45" && (creep.room.storage == undefined || creep.room.storage.store.energy == 0)) && creep.room.name != "E69N44") {
                    creep.say("\u27A1E69N44", true);
                    creep.moveTo(new RoomPosition(25, 25, "E69N44"));
                }
                else {
                    let theStorage = creep.room.storage;
                    if (theStorage != undefined) {
                        let err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.say("\u27A1\uD83C\uDFE6", true);
                            creep.moveTo(theStorage);
                        }
                        else if (err == OK) {
                            creep.say("\u2B07\uD83C\uDFE6", true);
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
                        creep.say("\uD83C\uDFE6?", true);
                    }
                }
            }
        }
        /*
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
        */
    }
};

module.exports = roleAdaptable;
