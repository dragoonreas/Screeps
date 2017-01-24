var roleRepairer = require("role.repairer");

// TODO: Make this role (currently just a copy of harvester)
var roleHauler = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.depositeStructureID = undefined;
        }
        
        if (creep.memory.working == false) {
            var source = Game.getObjectById(creep.memory.sourceID);
            if (source == undefined || source.energy == 0) {
                if (source != undefined) {
                    creep.memory.sourceID = undefined;
                }
                
                var sourceMem = Memory.sources[creep.memory.sourceID];
                if (sourceMem != undefined && sourceMem.regenAt <= Game.time && creep.room.name != sourceMem.pos.roomName) {
                    creep.say("\u27A1" + sourceMem.pos.roomName, true);
                    creep.moveTo(new RoomPosition(sourceMem.pos.x, sourceMem.pos.y, sourceMem.pos.roomName));
                    return;
                }
                else {
                    creep.memory.sourceID = undefined;
                    
                    /*
                        TODO:
                        Create these lists from the sources stored in the memory of the harvest rooms, which in turn are stored in the memory of the creeps spawn room.
                        Also make sure to use for...of instead of for...in since the order the sources are listed defines their priority
                    */
                    var sourceIDs = {
                        "W53N32": [
                            "579fa8b50700be0674d2e297"
                            , "579fa8b50700be0674d2e293"
                        ]
                    };
                    for (let sourceIndex in sourceIDs[creep.memory.roomID]) {
                        var sourceID = sourceIDs[creep.memory.roomID][sourceIndex];
                        source = Game.getObjectById(sourceID);
                        if (source != undefined) {
                            if (source.energy > 0) { // TODO: Also check if there's space around the source (and also determine if this check may be better done elsewhere)
                                creep.memory.sourceID = sourceID;
                                break;
                            }
                        }
                        else {
                            sourceMem = Memory.sources[sourceID];
                            if (sourceMem != undefined && sourceMem.regenAt <= Game.time) {
                                creep.memory.sourceID = sourceID;
                                creep.say("\u27A1" + sourceMem.pos.roomName, true);
                                creep.moveTo(new RoomPosition(sourceMem.pos.x, sourceMem.pos.y, sourceMem.pos.roomName));
                                return;
                            }
                        }
                    }
                }
            }
            
            if (creep.memory.sourceID != undefined) {
                var err = creep.harvest(source);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\u26CF", true);
                    creep.moveTo(source);
                }
                else if (err == OK) {
                    creep.say("\u26CF", true);
                }
            }
            else if (creep.carry.energy > 0) {
                creep.memory.working = true;
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
            if (creep.room.name != creep.memory.roomID) {
                creep.say("\u27A1" + creep.memory.roomID, true);
                creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
            }
            else {
                var structure = Game.getObjectById(creep.memory.depositeStructureID);
                if (structure == undefined || structure.energy == structure.energyCapacity) {
                    structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => {
                            return (s.structureType == STRUCTURE_EXTENSION 
                                || s.structureType == STRUCTURE_SPAWN) 
                                && s.energy < s.energyCapacity;
                        }
                    });
                    if (structure == undefined) {
                        structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (s) => {
                                return s.structureType == STRUCTURE_TOWER 
                                    && s.energy < s.energyCapacity;
                            }
                        });
                    }
                    if (structure != undefined) {
                        creep.memory.depositeStructureID = structure.id;
                    }
                }
                
                var theTerminal = creep.room.terminal;
                var theStorage = creep.room.storage;
                if (structure != undefined) {
                    var structureIcon = "?";
                    switch (structure.structureType) {
                        case STRUCTURE_SPAWN: structureIcon = "\uD83C\uDFE5"; break;
                        case STRUCTURE_EXTENSION: structureIcon = "\uD83C\uDFEA"; break;
                        case STRUCTURE_TOWER: structureIcon = "\uD83D\uDD2B"; break;
                    }
                    var err = creep.transfer(structure, RESOURCE_ENERGY);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1" + structureIcon, true);
                        creep.moveTo(structure);
                    }
                    else if (err == OK) {
                        creep.say("\u2B06" + structureIcon, true);
                        if (structure.structureType == STRUCTURE_TERMINAL) {
                        }
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy < (theTerminal.storeCapacity / 2)) {
                    var err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry.energy, (theTerminal.storeCapacity / 2) - theTerminal.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFEC", true);
                        creep.moveTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say("\u2B06\uD83C\uDFEC", true);
                        console.log(theTerminal.room.name + " terminal reserve at: " + (theTerminal.store.energy + Math.min(creep.carry.energy, (theTerminal.storeCapacity / 2) - theTerminal.store.energy)) + "/" + (theTerminal.storeCapacity / 2));
                    }
                }
                else if (creep.memory.roomID == "W53N32" && Memory.TooAngleDealings.isFriendly == false && theTerminal.store.energy < Memory.TooAngleDealings.totalCost) {
                    var err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry.energy, Memory.TooAngleDealings.totalCost - theTerminal.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFEC", true);
                        creep.moveTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say("\u2B06\uD83C\uDFEC", true);
                        console.log("TooAngle dealing terminal at: " + (theTerminal.store.energy + Math.min(creep.carry.energy, Memory.TooAngleDealings.totalCost - theTerminal.store.energy)) + "/" + Memory.TooAngleDealings.totalCost);
                    }
                }
                else if (theStorage != undefined && theStorage.store.energy < (theStorage.storeCapacity / 2)) {
                    var err = creep.transfer(theStorage, RESOURCE_ENERGY, Math.min(creep.carry.energy, (theStorage.storeCapacity / 2) - theStorage.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFE6", true);
                        creep.moveTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say("\u2B06\uD83C\uDFE6", true);
                        console.log(theStorage.room.name + " storage reserve at: " + (theStorage.store.energy + Math.min(creep.carry.energy, (theStorage.storeCapacity / 2) - theStorage.store.energy)) + "/" + (theStorage.storeCapacity / 2));
                    }
                }
                else {
                    roleUpgrader.run(creep);
                }
            }
        }
    }
};

module.exports = roleHauler;
