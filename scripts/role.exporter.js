let roleExporter = {
    run: function(creep) {
        creep.memory.executingRole = "exporter";
        
        if (creep.memory.working == false && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
            creep.memory.withdrawStructure = undefined;
            creep.memory.waypoint = 0;
        }
        else if (creep.memory.working == true && creep.carryTotal == 0) {
            creep.memory.working = false;
            if (creep.memory.stopExporting == undefined) {
                creep.memory.stopExporting = Game.time;
            }
            creep.memory.transferStructure = undefined;
            creep.memory.waypoint = 0;
        }
        
        let sentTo = creep.memory.roomSentTo;
        if (_.isString(sentTo) == false) {
            switch (creep.memory.roomID) {
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
        
        let shuttingDown = [
        ];
        
        let safeRooms = [
        ];
        
        if (creep.memory.working == false) {
            if (creep.room.name != sentFrom 
                && creep.memory.withdrawStructure == undefined) {
                if (sentFrom == "") { // NOTE: Any rooms that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.say(travelToIcons(creep) + sentFrom, true);
                    creep.travelTo(new RoomPosition(25, 25, sentFrom), {
                        range: 23
                    });
                }
            }
            else {
                if (creep.memory.startExporting == undefined) {
                    creep.memory.startExporting = Game.time;
                }
                let theStorage = _.get(Game.rooms, [sentFrom, "storage"], undefined);
                let theTerminal = _.get(Game.rooms, [sentFrom, "terminal"], undefined);
                if ((_.get(creep.room, ["controller", "owner", "username"], "dragoonreas") == "dragoonreas" 
                        && _.get(creep.room, ["controller", "reservation", "username"], "dragoonreas") == "dragoonreas") 
                    || _.any(safeRooms, (r) => (creep.room.name)) == true) {
                    if (theStorage != undefined 
                        && _.sum(theStorage.store) > 0 
                        && (((theStorage.my == false 
                                    || _.any(shuttingDown, (r) => (sentFrom)) == true) 
                                && _.filter(theStorage.pos.lookFor(LOOK_STRUCTURES), (s) => (
                                    s.structureType == STRUCTURE_RAMPART 
                                    && s.my == false 
                                    && s.isPublic == false)) < 1)
                            || (sentTo == sentFrom 
                                && _.sum(theStorage.store) > theStorage.store[RESOURCE_ENERGY] 
                                && theTerminal != undefined 
                                && theTerminal.my == true 
                                && theTerminal.storeCapacityFree > 0 
                                && (_.sum(theTerminal.store) - theTerminal.store[RESOURCE_ENERGY]) < Math.min((theTerminal.storeCapacity - theTerminal.store[RESOURCE_ENERGY]), (theTerminal.storeCapacity / 2))))) {
                        let resourceType = _.max(_.keys(theStorage.store), (r) => (resourceWorth(r)));
                        let err = creep.withdraw(theStorage, resourceType);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(theStorage);
                            creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                            creep.memory.withdrawStructure = { 
                                id: theStorage.id
                                , pos: theStorage.pos
                            };
                        }
                        else if (err == OK) {
                            creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                        }
                    }
                    else if (theTerminal != undefined 
                        && _.sum(theTerminal.store) > 0 
                        && (theTerminal.my == false
                            || _.any(shuttingDown, (r) => (sentFrom)) == true) 
                        && _.filter(theTerminal.pos.lookFor(LOOK_STRUCTURES), (s) => (
                            s.structureType == STRUCTURE_RAMPART 
                            && s.my == false 
                            && s.isPublic == false)) < 1) {
                        let resourceType = _.max(_.keys(theTerminal.store), (r) => (resourceWorth(r)));
                        let err = creep.withdraw(theTerminal, resourceType);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(theTerminal);
                            creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                            creep.memory.withdrawStructure = { 
                                id: theTerminal.id
                                , pos: theTerminal.pos
                            };
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
                            || structure.structureType == STRUCTURE_STORAGE 
                            || structure.structureType == STRUCTURE_TERMINAL
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
                            structure = _.find(creep.room.find(((_.any(shuttingDown, (r) => (sentFrom)) == true) ? FIND_STRUCTURES : FIND_HOSTILE_STRUCTURES)), (s) => (
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
                                resourceType = RESOURCE_POWER;
                            }
                            else if (structure.structureType == STRUCTURE_LAB 
                                && structure.mineralAmount > 0) {
                                resourceType = structure.mineralType;
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
                            _.invoke(Game.rooms[sentFrom].find(FIND_FLAGS, { filter: (f) => (
                                f.color == COLOR_ORANGE
                            ) }), (f) => {
                                _.set(Memory.rooms, [_.first(f.name.split("_")), "creepMins", "exporter"], 0);
                                return f.remove();
                            });
                            console.log("Finished exporting from " + sentFrom);
                            Game.notify("Finished exporting from " + sentFrom, 60);
                            if (creep.carryTotal == 0) {
                                creep.memory.role = "recyclable";
                                ROLES["recyclable"].run(creep);
                            }
                            else {
                                creep.memory.working = true;
                                creep.memory.waypoint = 0;
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
                    _.invoke(Game.rooms[sentFrom].find(FIND_FLAGS, { filter: (f) => (
                        f.color == COLOR_ORANGE
                    ) }), (f) => {
                        _.set(Memory.rooms, [_.first(f.name.split("_")), "creepMins", "exporter"], 0);
                        return f.remove();
                    });
                    console.log("Finished exporting from " + sentFrom);
                    Game.notify("Finished exporting from " + sentFrom, 60);
                    if (creep.carryTotal == 0) {
                        creep.memory.role = "recyclable";
                        ROLES["recyclable"].run(creep);
                    }
                    else {
                        creep.memory.working = true;
                        creep.memory.waypoint = 0;
                        ROLES["exporter"].run(creep);
                    }
                }
            }
        }
        else {
            if (creep.room.name != sentTo 
                && creep.memory.transferStructure == undefined) {
                if (creep.memory.roomID != sentTo) {
                    _.set(Memory.rooms, [creep.memory.roomID, "creepCounts", "exporter"], _.get(Memory.rooms, [creep.memory.roomID, "creepCounts", "exporter"], 1) - 1);
                    _.set(Memory.rooms, [sentTo, "creepCounts", "exporter"], _.get(Memory.rooms, [sentTo, "creepCounts", "exporter"], 0) + 1);
                    creep.memory.roomID = sentTo;
                }
                if (sentTo == "") { // NOTE: Any rooms that require waypoints to get to should be added here
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
                    if (creep.carryTotal > creep.carry[RESOURCE_ENERGY]) {
                        ROLES["hoarder"].run(creep);
                        creep.memory.transferStructure = true;
                    }
                    else {
                        if (creep.memory.transferStructure === true) {
                            creep.memory.transferStructure = undefined;
                        }
                        
                        let structureID = _.get(creep.memory, ["transferStructure", "id"], undefined);
                        let structure = Game.getObjectById(structureID);
                        let structureMemPos = _.get(creep.memory, ["transferStructure", "pos"], undefined);
                        let structureMemRoomName = _.get(creep.memory, ["transferStructure", "pos", "roomName"], undefined);
                        if (structure == undefined 
                            && structureMemPos != undefined 
                            && Game.rooms[structureMemRoomName] == undefined) {
                            let structurePos = _.create(RoomPosition.prototype, structureMemPos);
                            creep.travelTo(structurePos);
                            creep.say(travelToIcons(creep) + structurePos.roomName, true);
                            return;
                        }
                        
                        let theTerminal = _.get(Game.rooms, [sentTo, "terminal"], undefined);
                        let terminalEnergy = _.get(theTerminal, ["store", RESOURCE_ENERGY], 0);
                        terminalEnergy = _.isFinite(terminalEnergy) ? terminalEnergy : 0;
                        let theStorage = _.get(Game.rooms, [sentTo, "storage"], undefined);
                        let storageEnergy = _.get(theStorage, ["store", RESOURCE_ENERGY], 0);
                        storageEnergy = _.isFinite(storageEnergy) ? storageEnergy : 0;
                        if (theTerminal != undefined 
                            && theTerminal.energyCapacityFree > 0 
                            && theTerminal.my == true) {
                            for (let resourceType in creep.carry) {
                                let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], theTerminal.energyCapacityFree));
                                if (err == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(theTerminal);
                                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                                    creep.memory.transferStructure = { 
                                        id: theTerminal.id
                                        , pos: theTerminal.pos
                                    };
                                    break;
                                }
                                else if (err == OK) {
                                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                                    break;
                                }
                                else {
                                    console.log(creep.name + " (exporter) is confused transfering " + resourceType + " to " + STRUCTURE_TERMINAL + ": " + err);
                                    incrementConfusedCreepCount(creep);
                                    creep.say(ICONS[STRUCTURE_TERMINAL] + "?", true);
                                }
                            }
                        }
                        else if (theStorage != undefined 
                            && _.sum(theStorage.store) < theStorage.storeCapacity 
                            && theStorage.my == true) {
                            for (let resourceType in creep.carry) {
                                let err = creep.transfer(theStorage, resourceType, Math.min(creep.carry[resourceType], theStorage.storeCapacity - _.sum(theStorage.store)));
                                if (err == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(theStorage);
                                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                                    creep.memory.transferStructure = { 
                                        id: theStorage.id
                                        , pos: theStorage.pos
                                    };
                                    break;
                                }
                                else if (err == OK) {
                                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                                    break;
                                }
                                else {
                                    console.log(creep.name + " (exporter) is confused transfering " + resourceType + " to " + STRUCTURE_STORAGE + ": " + err);
                                    incrementConfusedCreepCount(creep);
                                    creep.say(ICONS[STRUCTURE_STORAGE] + "?", true);
                                }
                            }
                        }
                        else if (theTerminal != undefined 
                            && theTerminal.storeCapacityFree > 0 
                            && theTerminal.my == true) {
                            for (let resourceType in creep.carry) {
                                let err = creep.transfer(theTerminal, resourceType, Math.min(creep.carry[resourceType], theTerminal.storeCapacityFree));
                                if (err == ERR_NOT_IN_RANGE) {
                                    creep.travelTo(theTerminal);
                                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                                    creep.memory.transferStructure = { 
                                        id: theTerminal.id
                                        , pos: theTerminal.pos
                                    };
                                    break;
                                }
                                else if (err == OK) {
                                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                                    break;
                                }
                                else {
                                    console.log(creep.name + " (exporter) is confused transfering " + resourceType + " to " + STRUCTURE_TERMINAL + ": " + err);
                                    incrementConfusedCreepCount(creep);
                                    creep.say(ICONS[STRUCTURE_TERMINAL] + "?", true);
                                }
                            }
                        }
                        else {
                            _.invoke(Game.rooms[sentFrom].find(FIND_FLAGS, { filter: (f) => (
                                f.color == COLOR_ORANGE
                            ) }), (f) => {
                                let flagInfo = f.name.split("_");
                                if (_.get(nameInfo, 4, _.get(nameInfo, 0, "")) != sentTo) { return false; }
                                _.set(Memory.rooms, [_.first(flagInfo), "creepMins", "exporter"], 0);
                                return f.remove(); // NOTE: May not update immidiatly when room not visible
                            });
                            console.log("Stopped exporting from " + sentFrom + " to " + sentTo);
                            Game.notify("Stopped exporting from " + sentFrom + " to " + sentTo, 60);
                            if (creep.carryTotal == 0) {
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
