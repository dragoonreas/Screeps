let roleExporter = {
    run: function(creep) {
        creep.memory.executingRole = "exporter";
        
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.withdrawStructure = undefined;
        }
        else if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            if (creep.memory.stopExporting == undefined) {
                creep.memory.stopExporting = Game.time;
            }
        }
        
        let sentTo = creep.memory.roomSentTo;
        if (_.isString(sentTo) == false) {
            switch (creep.memory.roomID) {
                //case "W87N29": sentTo = "W86N29"; break; // NOTE: Update when bootstrapping network reconfigured
                case "W86N29": sentTo = "W85N23"; break;
                case "W85N23": sentTo = "W86N29"; break;
                case "W86N39": sentTo = "W85N38"; break;
                case "W85N38": sentTo = "W86N43"; break;
                case "W86N43": sentTo = "W86N39"; break;
                case "W81N29": sentTo = "W86N29"; break;
                case "W72N28": sentTo = "W86N29"; break;
                case "W64N31": sentTo = "W86N29"; break;
                case "W55N31": sentTo = "W64N31"; break;
                case "W53N39": sentTo = "W64N31"; break;
                case "W53N42": sentTo = "W53N39"; break;
                case "W52N47": sentTo = "W53N39"; break;
                case "W48N52": sentTo = "W52N47"; break;
                default: sentTo = creep.memory.roomID; break;
            }
            if (_.isString(sentTo) == true) {
                creep.memory.roomSentTo = sentTo;
            }
        }
        
        let sentFrom = (creep.memory.roomSentFrom || creep.memory.roomID);
        if (_.isString(creep.memory.roomSentFrom) == false) {
            creep.memory.roomSentFrom = sentFrom;
        }
        
        if (_.isString(sentTo) == false || _.isString(sentFrom) == false) {
            incrementConfusedCreepCount(creep);
            creep.say("?", true);
            return;
        }
        
        if (creep.memory.working == false) {
            if (creep.room.name != sentFrom 
                && creep.memory.withdrawStucture == undefined) {
                creep.say(travelToIcons(creep) + sentFrom, true);
                creep.travelTo(new RoomPosition(25, 25, sentFrom), {
                    range: 23
                });
            }
            else {
                if (creep.memory.startExporting == undefined) {
                    creep.memory.startExporting = Game.time;
                }
                let theStorage = Game.rooms[sentFrom].storage;
                let theTerminal = Game.rooms[sentFrom].terminal;
                if (_.get(creep.room, ["controller", "owner", "username"], "dragoonreas") == "dragoonreas" 
                    && _.get(creep.room, ["controller", "reservation", "username"], "dragoonreas") == "dragoonreas") {
                    if (theStorage != undefined 
                        && _.sum(theStorage.store) > 0 
                        && ((theStorage.my == false 
                                && _.filter(theStorage.pos.lookFor(LOOK_STRUCTURES), (s) => (
                                    s.structureType == STRUCTURE_RAMPART 
                                    && s.my == false 
                                    && s.isPublic == false)) < 1)
                            || (sentTo == sentFrom 
                                && _.sum(theStorage.store) > theStorage.store[RESOURCE_ENERGY] 
                                && theTerminal != undefined 
                                && theTerminal.my == true 
                                && _.sum(theTerminal.store) < theTerminal.storeCapacity
                                && (_.sum(theTerminal.store) - theTerminal.store[RESOURCE_ENERGY]) < Math.min((theTerminal.storeCapacity - theTerminal.store[RESOURCE_ENERGY]), (theTerminal.storeCapacity / 2))))) {
                        let resourceType = _.max(_.keys(theStorage.store), (r) => (resourceWorth(r)));
                        let err = creep.withdraw(theStorage, resourceType);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(theStorage);
                            creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                        }
                        else if (err == OK) {
                            creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                        }
                    }
                    else if (theTerminal != undefined 
                        && _.sum(theTerminal.store) > 0 
                        && theTerminal.my == false
                        && _.filter(theStorage.pos.lookFor(LOOK_STRUCTURES), (s) => (
                            s.structureType == STRUCTURE_RAMPART 
                            && s.my == false 
                            && s.isPublic == false)) < 1) {
                        let resourceType = _.max(_.keys(theTerminal.store), (r) => (resourceWorth(r)));
                        let err = creep.withdraw(theTerminal, resourceType);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(theTerminal);
                            creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                        }
                        else if (err == OK) {
                            creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                        }
                    }
                    else {
                        let structureID = _.get(creep.memory, ["withdrawStructure", "id"], undefined);
                        let structure = Game.getObjectById(structureID);
                        let structureMemPos = _.get(creep.memory, ["withdrawStructure", "pos"], undefined);
                        let structureMemRoomName = _.get(creep.memory, ["withdrawStructure", "pos", "roomName"], undefined);
                        if (structure == undefined 
                            && structureMemPos != undefined 
                            && Game.rooms[structureMemRoomName] == undefined) {
                            let structurePos = _.create(RoomPosition.prototype, structureMemPos);
                            creep.travelTo(structurePos);
                            creep.say(travelToIcons(creep) + structurePos.roomName, true);
                            return;
                        }
                        
                        if (structure == undefined
                            || (structure.structureType == STRUCTURE_CONTAINER 
                                    && _.sum(structure.store) == 0)
                                || (structure.structureType == STRUCTURE_POWER_SPAWN 
                                    && (structure.energy == 0 
                                        && structure.power == 0)) 
                                || (structure.structureType == STRUCTURE_LAB 
                                    && (structure.energy == 0 
                                        && structure.mineralAmount == 0)) 
                                || ((structure.structureType == STRUCTURE_TOWER 
                                        || structure.structureType == STRUCTURE_SPAWN 
                                        || structure.structureType == STRUCTURE_EXTENSION 
                                        || structure.structureType == STRUCTURE_LINK) 
                                    && structure.energy == 0)) {
                            structure = _.find(creep.room.find(FIND_HOSTILE_STRUCTURES), (s) => (
                                (((s.structureType == STRUCTURE_CONTAINER 
                                        && _.sum(s.store) > 0)
                                    || (s.structureType == STRUCTURE_POWER_SPAWN 
                                        && (s.energy > 0 
                                            || s.power > 0)) 
                                    || (s.structureType == STRUCTURE_LAB 
                                        && (s.energy > 0 
                                            || s.mineralAmount > 0)) 
                                    || ((s.structureType == STRUCTURE_TOWER 
                                            || s.structureType == STRUCTURE_SPAWN 
                                            || s.structureType == STRUCTURE_EXTENSION 
                                            || s.structureType == STRUCTURE_LINK) 
                                        && s.energy > 0))
                                && _.filter(s.pos.lookFor(LOOK_STRUCTURES), (r) => (
                                    r.structureType == STRUCTURE_RAMPART 
                                    && r.my == false 
                                    && r.isPublic == false)) < 1)));
                            
                            if (structure != undefined) {
                                creep.memory.withdrawStructure = { 
                                    id: structure.id
                                    , pos: structure.pos
                                };
                            }
                            else {
                                creep.memory.withdrawStructure = undefined;
                            }
                        }
                        
                        if (structure != undefined) {
                            let resourceType = RESOURCE_ENERGY;
                            if (structure.structureType == STRUCTURE_CONTAINER) {
                                resourceType = _.max(_.keys(structure.store), (r) => (resourceWorth(r)));
                            }
                            else if (structure.structureType == STRUCTURE_POWER_SPAWN 
                                && structure.power > 0) {
                                resourceType == RESOURCE_POWER;
                            }
                            else if (structure.structureType == STRUCTURE_LAB 
                                && structure.mineralAmount > 0) {
                                resourceType == structure.mineralType;
                            }
                            
                            let err = creep.withdraw(structure, resourceType);
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(structure);
                                creep.say(travelToIcons(creep) + ICONS[structure.structureType], true);
                            }
                            else if (err == OK) {
                                creep.say(ICONS["withdraw"] + ICONS[structure.structureType], true);
                            }
                            else {
                                if (err == ERR_NOT_OWNER) {
                                    creep.memory.withdrawStructure = undefined;
                                }
                                else {
                                    console.log(creep.name + " (exporter) is confused withdrawing " + resourceType + " from " + structure.structureType + ": " + err);
                                    incrementConfusedCreepCount(creep);
                                    creep.say(ICONS[structure.structureType] + "?", true);
                                }
                            }
                        }
                        else {
                            _.set(Memory.rooms, [creep.memory.roomID, "creepMins", "exporter"], 0);
                            if (_.sum(creep.carry) == 0) {
                                creep.memory.role = "recyclable";
                                ROLES["recyclable"].run(creep);
                            }
                            else {
                                creep.memory.working = true;
                                ROLES["exporter"].run(creep);
                            }
                        }
                    }
                }
                else {
                    // TODO: Finish this block
                    /*let towers = creep.room.find(FIND_HOSTILE_STRUCTURES, (s) => (
                        s.structureType == STRUCTURE_TOWER 
                        && s.energy >= TOWER_ENERGY_COST
                    ));
                    if (_.get(creep.room, ["controller", "my"], false) == true))*/
                    // NOTE: Stop-gap till above is finished
                    _.set(Memory.rooms, [creep.memory.roomID, "creepMins", "exporter"], 0);
                    if (_.sum(creep.carry) == 0) {
                        creep.memory.role = "recyclable";
                        ROLES["recyclable"].run(creep);
                    }
                    else {
                        creep.memory.working = true;
                        ROLES["exporter"].run(creep);
                    }
                }
            }
        }
        else {
            if (creep.room.name != sentTo) {
                if (creep.memory.roomID == sentFrom) {
                    creep.memory.roomID = sentTo;
                    _.set(Memory.rooms, [sentFrom, "creepCounts", "exporter"], _.get(Memory.rooms, [sentFrom, "creepCounts", "exporter"], 1) - 1);
                    _.set(Memory.rooms, [sentTo, "creepCounts", "exporter"], _.get(Memory.rooms, [sentTo, "creepCounts", "exporter"], 0) + 1);
                }
                if (sentTo == "W9N45"
                    || sentTo == "W53N39") { // NOTE: Any rooms that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.say(travelToIcons(creep) + sentTo, true);
                    creep.travelTo(new RoomPosition(25, 25, sentTo), {
                        range: 23
                    });
                }
            }
            else {
                let tripStartTime = _.get(creep.memory, ["startExporting"], Game.time - (CREEP_LIFE_TIME - creep.ticksToLive));
                let tripEndTime = _.get(creep.memory, ["stopExporting"], Game.time + 1);
                let returnTripTime = (tripEndTime - tripStartTime) * 2;
                let tripsLeft = Math.floor(creep.ticksToLive / returnTripTime);
                if (sentFrom == sentTo 
                    || tripsLeft > 0) {
                    if (_.sum(creep.carry) > creep.carry[RESOURCE_ENERGY]) {
                        ROLES["hoarder"].run(creep);
                    }
                    else {
                        let theTerminal = _.get(Game.rooms, [sentTo, "terminal"], undefined);
                        let theStorage = _.get(Game.rooms, [sentTo, "storage"], undefined);
                        if (theTerminal != undefined 
                            && _.sum(theTerminal.store) < theTerminal.storeCapacity 
                            && theTerminal.my == true) {
                            for (let resourceType in creep.carry) {
                                let err = creep.transfer(theTerminal, resourceType, creep.carry[resourceType]);
                                if (err == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(theTerminal);
                                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                                    break;
                                }
                                else if (err == OK) {
                                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                                    break;
                                }
                            }
                        }
                        else if (theStorage != undefined 
                            && _.sum(theStorage.store) < theStorage.storeCapacity 
                            && theStorage.my == true) {
                            for (let resourceType in creep.carry) {
                                let err = creep.transfer(theStorage, resourceType, creep.carry[resourceType]);
                                if (err == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(theStorage);
                                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                                    break;
                                }
                                else if (err == OK) {
                                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                                    break;
                                }
                            }
                        }
                        else {
                            //_.set(Memory.rooms, [sentFrom, "creepMins", "exporter"], 0); // TODO: Need a new memory key to keep where the creep originally spawned from since roomID can be changed and they don't have to be spawned from the sentFrom room
                            if (_.sum(creep.carry) == 0) {
                                creep.memory.role = "recyclable";
                                ROLES["recyclable"].run(creep);
                            }
                        }
                    }
                }
                else {
                    creep.memory.role = "recyclable";
                    ROLES["recyclable"].run(creep);
                }
            }
        }
    }
};

module.exports = roleExporter;
