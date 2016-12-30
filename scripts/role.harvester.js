var roleUpgrader = require("role.upgrader");

var roleHarvester = {

    run: function(creep) {
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.depositeStructureID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        
        if (creep.memory.working == false) {
            var source = undefined;
            if (creep.memory.roomID == "E43N18" && _.countBy(creep.body, (bp) => bp.type)[WORK] >= 4) {
                source = Game.getObjectById(creep.memory.wallID);
                if (source == undefined) {
                    source = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_WALL && s.hits > 1) });
                }
            }
            
            if (source == undefined) {
                creep.memory.wallID = undefined;
                source = Game.getObjectById(creep.memory.sourceID);
            }
            else {
                creep.memory.wallID = source.id;
                var err = creep.dismantle(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("➡⛰", true);
                    creep.moveTo(source);
                }
                else if (err == OK) {
                    creep.say("⚒⛰", true);
                }
                return;
            }

            if (source == undefined || source.energy == 0) {
                if (source != undefined) {
                    creep.memory.sourceID = undefined;
                }
                
                var sourceMem = Memory.sources[creep.memory.sourceID];
                if (sourceMem != undefined && sourceMem.regenAt <= Game.time && creep.room.name != sourceMem.roomID) {
                    creep.say("➡" + sourceMem.pos.roomName, true);
                    creep.moveTo(new RoomPosition(sourceMem.pos.x, sourceMem.pos.y, sourceMem.pos.roomName));
                    return;
                }
                else {
                    creep.memory.sourceID = undefined;
                    
                    var sourceIDs = {
                        "E69N44": [
                            "57ef9ee786f108ae6e6101b6"
                            , "57ef9efc86f108ae6e610380"
                        ]
                        , "E68N45": [
                            "57ef9ee786f108ae6e6101b2"
                            , "57ef9ee786f108ae6e6101b6"
                        ]
                        , "E54N9": [
                            "579faa250700be0674d307cb"
                            , "579faa250700be0674d307ca"
                        ]
                        , "E39N24": [
                            "577b93f30f9d51615fa48e56"
                            , "577b93f30f9d51615fa48e57"
                        ]
                        , "E39N17": [
                            "576a9cd357110ab231d89c86"
                            , "576a9cd357110ab231d89c87"
                            , "576a9cd357110ab231d89c83"
                        ]
                        , "E43N18": [
                            "577b94120f9d51615fa490f8"
                            , "577b94220f9d51615fa49272"
                            , "577b94210f9d51615fa4926f"
                            , "577b94210f9d51615fa4926e"
                        ]
                        , "W53N32": [
                            "579fa8b50700be0674d2e297"
                            , "579fa8b50700be0674d2e293"
                            , "579fa8b50700be0674d2e296"
                        ]
                    };
                    for (let sourceIndex in sourceIDs[creep.memory.roomID]) {
                        var sourceID = sourceIDs[creep.memory.roomID][sourceIndex];
                        source = Game.getObjectById(sourceID);
                        if (source != undefined && source.energy > 0) { // TODO: Also check if there's space around the source (also determine if this check may be better done elsewhere)
                            creep.memory.sourceID = sourceID;
                            break;
                        }

                        sourceMem = Memory.sources[sourceID];
                        if (sourceMem != undefined) {
                            if (source != undefined && source.energy == 0 && sourceMem.regenAt < (Game.time + source.ticksToRegeneration)) {
                                sourceMem.regenAt = Game.time + source.ticksToRegeneration;
                                console.log("Energy source " + sourceID + " in " + source.room.name + " will regen in " + source.ticksToRegeneration + " ticks");
                            }
                            else if (source == undefined && sourceMem.regenAt <= Game.time) {
                                creep.memory.sourceID = sourceID;
                                creep.say("➡" + sourceMem.pos.roomName, true);
                                creep.moveTo(new RoomPosition(sourceMem.pos.x, sourceMem.pos.y, sourceMem.pos.roomName));
                                return;
                            }
                        }
                        else if (sourceID == "577b94220f9d51615fa49272") {
                            creep.moveTo(new RoomPosition(25, 25, "E44N18"));
                        }
                    }
                }
            }
            
            if (creep.memory.sourceID != undefined) {
                var err = creep.harvest(source);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.say("➡⛏", true);
                    creep.moveTo(source);
                }
                else if (err == OK) {
                    creep.say("⛏", true);
                }
            }
            else if (creep.carry.energy > 0) {
                creep.memory.working = true;
            }
            else {
                switch (creep.saying) {
                    case "🕛⛏": creep.say("🕧⛏", true); break;
                    case "🕧⛏": creep.say("🕐⛏", true); break;
                    case "🕐⛏": creep.say("🕜⛏", true); break;
                    case "🕜⛏": creep.say("🕑⛏", true); break;
                    case "🕑⛏": creep.say("🕝⛏", true); break;
                    case "🕝⛏": creep.say("🕒⛏", true); break;
                    case "🕒⛏": creep.say("🕞⛏", true); break;
                    case "🕞⛏": creep.say("🕓⛏", true); break;
                    case "🕓⛏": creep.say("🕟⛏", true); break;
                    case "🕟⛏": creep.say("🕔⛏", true); break;
                    case "🕔⛏": creep.say("🕠⛏", true); break;
                    case "🕠⛏": creep.say("🕕⛏", true); break;
                    case "🕕⛏": creep.say("🕡⛏", true); break;
                    case "🕡⛏": creep.say("🕖⛏", true); break;
                    case "🕖⛏": creep.say("🕢⛏", true); break;
                    case "🕢⛏": creep.say("🕗⛏", true); break;
                    case "🕗⛏": creep.say("🕣⛏", true); break;
                    case "🕣⛏": creep.say("🕘⛏", true); break;
                    case "🕘⛏": creep.say("🕤⛏", true); break;
                    case "🕤⛏": creep.say("🕙⛏", true); break;
                    case "🕙⛏": creep.say("🕥⛏", true); break;
                    case "🕥⛏": creep.say("🕚⛏", true); break;
                    case "🕚⛏": creep.say("🕦⛏", true); break;
                    default: creep.say("🕛⛏", true);
                }
            }
        }
        else {
            if (creep.room.name != creep.memory.roomID) {
                creep.say("➡" + creep.memory.roomID, true);
                creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
            }
            else { // TODO: Store creep.memory.structureID and only check if it still requires energy each tick
                var structure = Game.getObjectById(creep.memory.depositeStructureID);
                if (structure == undefined || structure.energy < structure.energyCapacity) {
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
                }
                
                var theTerminal = creep.room.terminal;
                var theStorage = creep.room.storage;
                if (structure != undefined) {
                    var structureIcon = "?";
                    switch (structure.structureType) {
                        case STRUCTURE_SPAWN: structureIcon = "🏥"; break;
                        case STRUCTURE_EXTENSION: structureIcon = "🏪"; break;
                        case STRUCTURE_TOWER: structureIcon = "🔫"; break;
                    }
                    var err = creep.transfer(structure, RESOURCE_ENERGY);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.say("➡" + structureIcon, true);
                        creep.moveTo(structure);
                    }
                    else if (err == OK) {
                        creep.say("⬆" + structureIcon, true);
                        if (structure.structureType == STRUCTURE_TERMINAL) {
                        }
                    }
                }
                else if (creep.memory.roomID == "E69N44" && Memory.TooAngleDealings.isFriendly == false && theTerminal.store.energy < Memory.TooAngleDealings.totalCost) {
                    var err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry.energy, Memory.TooAngleDealings.totalCost - theTerminal.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("➡🏬", true);
                        creep.moveTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say("⬆🏬", true);
                        console.log("TooAngle dealing terminal at: " + (theTerminal.store.energy + Math.min(creep.carry.energy, Memory.TooAngleDealings.totalCost - theTerminal.store.energy)) + "/" + Memory.TooAngleDealings.totalCost);
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy < (theTerminal.storeCapacity / 2)) {
                    var err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry.energy, (theTerminal.storeCapacity / 2) - theTerminal.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("➡🏬", true);
                        creep.moveTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say("⬆🏬", true);
                        console.log(theTerminal.room.name + " terminal reserve at: " + (theTerminal.store.energy + Math.min(creep.carry.energy, (theTerminal.storeCapacity / 2) - theTerminal.store.energy)) + "/" + (theTerminal.storeCapacity / 2));
                    }
                }
                else if (theStorage != undefined && theStorage.store.energy < (theStorage.storeCapacity / 2)) {
                    var err = creep.transfer(theStorage, RESOURCE_ENERGY, Math.min(creep.carry.energy, (theStorage.storeCapacity / 2) - theStorage.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("➡🏦", true);
                        creep.moveTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say("⬆🏦", true);
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

module.exports = roleHarvester;
