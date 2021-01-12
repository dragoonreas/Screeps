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
                // case "E31S11": sentTo = "E35S13"; break;
                // case "E35S13": sentTo = "E31S11"; break;
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
        
        let type = creep.memory.type || "E";
        
        let safeRooms = [
        ];
        
        if (creep.memory.working == false) {
            if ((creep.room.name != sentFrom 
                    && creep.memory.withdrawStructure == undefined) 
                || Game.rooms[sentFrom] == undefined) {
                let structureMemPos = _.get(creep.memory, ["withdrawStructure", "pos"], undefined);
                let structureMemRoomName = _.get(creep.memory, ["withdrawStructure", "pos", "roomName"], undefined);
                if (false) { // NOTE: Any rooms that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else if (structureMemPos != undefined 
                    && Game.rooms[structureMemRoomName] == undefined) {
                    let structurePos = RoomPositionFromObject(structureMemPos);
                    creep.travelTo(structurePos);
                    creep.say(travelToIcons(creep) + structurePos.roomName, true);
                    return;
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
                let theRecycleContainer = _.get(Game.rooms, [sentFrom, "recycleContainer"], undefined);
                let thePowerSpawn = _.get(Game.rooms, [sentFrom, "powerSpawn"], undefined);
                let requiredPower = Math.floor(_.get(thePowerSpawn, ["energy"], 0) / POWER_SPAWN_ENERGY_RATIO) - (_.get(thePowerSpawn, ["power"], 0) + (creep.carry[RESOURCE_POWER] || 0));
                if ((_.get(creep.room, ["controller", "owner", "username"], "dragoonreas") == "dragoonreas" 
                        && _.get(creep.room, ["controller", "reservation", "username"], "dragoonreas") == "dragoonreas") 
                    || _.any(safeRooms, (r) => (creep.room.name)) == true) {
                    if (type == "S_P_B-S") {
                        let structureID = _.get(creep.memory, ["withdrawStructure", "id"], undefined);
                        if (structureID == undefined) {
                            if (_.get(theRecycleContainer, ["store", RESOURCE_SCORE], 0) > 0) {
                                creep.memory.withdrawStructure = { 
                                    id: theRecycleContainer.id
                                    , pos: theRecycleContainer.pos
                                };
                            }
                            else if (_.get(theTerminal, ["store", RESOURCE_SCORE], 0) > 0) {
                                creep.memory.withdrawStructure = { 
                                    id: theTerminal.id
                                    , pos: theTerminal.pos
                                };
                            }
                            else if (_.get(theStorage, ["store", RESOURCE_SCORE], 0) > 0) {
                                creep.memory.withdrawStructure = { 
                                    id: theStorage.id
                                    , pos: theStorage.pos
                                };
                            }
                            
                            structureID = _.get(creep.memory, ["withdrawStructure", "id"], undefined);
                        }
                        
                        let structure = Game.getObjectById(structureID);
                        let structureMemPos = _.get(creep.memory, ["withdrawStructure", "pos"], undefined);
                        let structureMemRoomName = _.get(creep.memory, ["withdrawStructure", "pos", "roomName"], undefined);
                        if (structure == undefined 
                            && structureMemPos != undefined 
                            && Game.rooms[structureMemRoomName] == undefined) {
                            let structurePos = RoomPositionFromObject(structureMemPos);
                            creep.travelTo(structurePos);
                            creep.say(travelToIcons(creep) + structurePos.roomName, true);
                            return;
                        }
                        
                        let err = creep.withdraw(structure, RESOURCE_SCORE);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(structure);
                            creep.say(travelToIcons(creep) + ICONS[structure.structureType], true);
                        }
                        else if (err == OK) {
                            creep.say(ICONS["withdraw"] + ICONS[structure.structureType], true);
                        }
                        else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                            _.set(creep.memory, ["withdrawStructure"], undefined);
                        }
                        else {
                            console.log(creep.name + " (exporter) is confused withdrawing " + RESOURCE_SCORE + " from " + structure.structureType + ": " + err);
                            incrementConfusedCreepCount(creep);
                            creep.say(ICONS[structure.structureType] + "?", true);
                        }
                    }
                    else if (sentFrom == sentTo 
                        && _.get(creep.room.memory, ["isShuttingDown"], false) == true 
                        && _.get(creep.room, ["controller", "level"], 0) == 8 
                        && _.get(creep.room, ["controller", "owner", "username"], undefined) == "dragoonreas" 
                        && _.get(thePowerSpawn, ["my"], false) == true 
                        && requiredPower > 0 
                        && (_.get(theStorage, ["store", RESOURCE_POWER], 0) > 0 
                            || _.get(theTerminal, ["store", RESOURCE_POWER], 0) > 0)) {
                        if (_.get(theStorage, ["store", RESOURCE_POWER], 0) > 0) {
                            let err = creep.withdraw(theStorage, RESOURCE_POWER, Math.min(requiredPower, _.get(theStorage, ["store", RESOURCE_POWER], 0), creep.carryCapacityAvailable));
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
                        else if (_.get(theTerminal, ["store", RESOURCE_POWER], 0) > 0) {
                            let err = creep.withdraw(theTerminal, RESOURCE_POWER, Math.min(requiredPower, _.get(theTerminal, ["store", RESOURCE_POWER], 0), creep.carryCapacityAvailable));
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
                    }
                    else if (theStorage != undefined 
                        && _.sum(theStorage.store) > 0 
                        && (((theStorage.my == false 
                                    || _.get(Memory.rooms, [sentFrom, "isShuttingDown"], false) == true) 
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
                            || _.get(Memory.rooms, [sentFrom, "isShuttingDown"], false) == true) 
                        && _.filter(theTerminal.pos.lookFor(LOOK_STRUCTURES), (s) => (
                            s.structureType == STRUCTURE_RAMPART 
                            && s.my == false 
                            && s.isPublic == false)) < 1) {
                        let resourceType = _.max(_.keys(theTerminal.store), (r) => (resourceWorth(r)));
                        if (_.get(Memory.rooms, [sentFrom, "isShuttingDown"], false) == true 
                            || _.get(creep.room, ["controller", "level"], 0) < 8 
                            && _.get(creep.room, ["controller", "level"], 0) >= 6 
                            && _.get(creep.room, ["controller", "owner", "username"], undefined) == "dragoonreas" 
                            && theTerminal.my == true 
                            && theTerminal.store[RESOURCE_ENERGY] >= (_.sum(theTerminal.store) / 2)) {
                            resourceType = RESOURCE_ENERGY;
                        }
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
                            let structurePos = RoomPositionFromObject(structureMemPos);
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
                            structure = creep.pos.findClosestByPath(((_.get(Memory.rooms, [sentFrom, "isShuttingDown"], false) == true) ? FIND_STRUCTURES : FIND_HOSTILE_STRUCTURES), { filter: (s) => (
                                ((s.structureType == STRUCTURE_CONTAINER 
                                        && _.sum(s.store) > 0)
                                    || (s.structureType == STRUCTURE_POWER_SPAWN 
                                        && (s.energy > 0 
                                            || s.power > 0) 
                                        && (_.get(creep.room.memory, ["isShuttingDown"], false) == false 
                                            || _.get(creep.room, ["controller", "level"], 0) < 8 
                                            || _.get(creep.room, ["controller", "owner", "username"], undefined) != "dragoonreas" 
                                            || _.get(thePowerSpawn, ["my"], false) == false)) 
                                    || (s.structureType == STRUCTURE_LAB 
                                        && (s.energy > 0 
                                            || s.mineralAmount > 0)) 
                                    || ((s.structureType == STRUCTURE_TOWER 
                                            || s.structureType == STRUCTURE_SPAWN 
                                            || s.structureType == STRUCTURE_EXTENSION 
                                            || s.structureType == STRUCTURE_LINK) 
                                        && s.energy > 0))
                                && (_.filter(s.pos.lookFor(LOOK_STRUCTURES), (r) => (
                                    r.structureType == STRUCTURE_RAMPART 
                                    && r.my == false 
                                    && r.isPublic == false)) < 1))});
                            
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
                            ) }), function() {
                                _.set(Memory.rooms, [_.first(this.name.split("_")), "creepMins", "exporter"], 0);
                                return this.remove();
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
                    ) }), function() {
                        _.set(Memory.rooms, [_.first(this.name.split("_")), "creepMins", "exporter"], 0);
                        return this.remove();
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
                if (creep.memory.roomID != sentTo 
                    && type != "S_P_B-S") {
                    _.set(Memory.rooms, [creep.memory.roomID, "creepCounts", "exporter"], _.get(Memory.rooms, [creep.memory.roomID, "creepCounts", "exporter"], 1) - 1);
                    _.set(Memory.rooms, [sentTo, "creepCounts", "exporter"], _.get(Memory.rooms, [sentTo, "creepCounts", "exporter"], 0) + 1);
                    creep.memory.roomID = sentTo;
                }
                if (false) { // NOTE: Any rooms that require waypoints to get to should be added here
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
                if (type == "S_P_B-S") {
                    let scoreCollector = _.first(creep.room.find(FIND_SCORE_COLLECTORS));
                    let taxContainer = _.first(scoreCollector.pos.findInRange(FIND_CONTAINERS, 5));
                    if (scoreCollector == undefined 
                        && taxContainer == undefined) {
                        console.log("Exporter " + creep.name + " couldn't find " + ((scoreCollector == undefined) ? "score collector" : "tax container") + " in " + creep.room.name);
                        creep.memory.role = "recyclable";
                        ROLES["recyclable"].run(creep);
                        return;
                    }
                    
                    const TAX_RATE = 0.25;
                    if (_.get(creep.memory, ["taxPaid"], false) == false) {
                        let err = creep.transfer(taxContainer, RESOURCE_SCORE, Math.ceil(creep.store[RESOURCE_SCORE] * TAX_RATE));
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(taxContainer, {
                                allowHostile: true
                            });
                            creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTAINER], true);
                        }
                        else if (err == OK) {
                            _.set(creep.memory, ["taxPaid"], true);
                            creep.say(ICONS["transfer"] + ICONS[STRUCTURE_CONTAINER], true);
                        }
                        else {
                            incrementConfusedCreepCount(creep);
                            creep.say(ICONS["transfer"] + ICONS[STRUCTURE_CONTAINER] + "?", true);
                        }
                    }
                    else {
                        let err = creep.transfer(scoreCollector, RESOURCE_SCORE);
                        if (err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(scoreCollector, {
                                allowHostile: true
                            });
                            creep.say(travelToIcons(creep) + ICONS["scoreCollector"], true);
                        }
                        else if (err == OK) {
                            _.set(creep.memory, ["taxPaid"], false);
                            creep.say(ICONS["transfer"] + ICONS["scoreCollector"], true);
                        }
                        else {
                            incrementConfusedCreepCount(creep);
                            creep.say(ICONS["transfer"] + ICONS["scoreCollector"] + "?", true);
                        }
                    }
                }
                else if (sentFrom == sentTo 
                    || tripsLeft > 0) {
                    let thePowerSpawn = _.get(Game.rooms, [sentFrom, "powerSpawn"], undefined);
                    if (creep.carryTotal > creep.carry[RESOURCE_ENERGY]) {
                        let requiredPower = Math.floor(_.get(thePowerSpawn, ["energy"], 0) / POWER_SPAWN_ENERGY_RATIO) - _.get(thePowerSpawn, ["power"], 0);
                        if (sentFrom == sentTo 
                            && _.get(creep.room, ["controller", "level"], 0) == 8 
                            && _.get(creep.room, ["controller", "owner", "username"], undefined) == "dragoonreas" 
                            && _.get(creep.room.memory, ["isShuttingDown"], false) == true 
                            && _.get(thePowerSpawn, ["my"], false) == true 
                            && requiredPower > 0 
                            && _.get(creep.carry, [RESOURCE_POWER], 0) > 0) {
                            let err = creep.transfer(thePowerSpawn, RESOURCE_POWER);
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(thePowerSpawn);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_POWER_SPAWN], true);
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_POWER_SPAWN], true);
                            }
                            else {
                                incrementConfusedCreepCount(creep);
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_POWER_SPAWN] + "?", true);
                            }
                        }
                        else {
                            ROLES["hoarder"].run(creep);
                            creep.memory.transferStructure = true;
                        }
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
                            let structurePos = RoomPositionFromObject(structureMemPos);
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
                            let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], theTerminal.energyCapacityFree));
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(theTerminal);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                                creep.memory.transferStructure = { 
                                    id: theTerminal.id
                                    , pos: theTerminal.pos
                                };
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                            }
                            else {
                                console.log(creep.name + " (exporter) is confused transfering " + RESOURCE_ENERGY + " to " + STRUCTURE_TERMINAL + ": " + err);
                                incrementConfusedCreepCount(creep);
                                creep.say(ICONS[STRUCTURE_TERMINAL] + "?", true);
                            }
                        }
                        else if (sentFrom == sentTo 
                            && _.get(creep.room.memory, ["isShuttingDown"], false) == true 
                            && _.get(creep.room, ["controller", "level"], 0) == 8 
                            && _.get(creep.room, ["controller", "owner", "username"], undefined) == "dragoonreas" 
                            && _.get(thePowerSpawn, ["my"], false) == true 
                            && _.get(thePowerSpawn, ["energy"], 0) < _.get(thePowerSpawn, ["energyCapacity"], 0)) {
                            let err = creep.transfer(thePowerSpawn, RESOURCE_ENERGY);
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(thePowerSpawn);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_POWER_SPAWN], true);
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_POWER_SPAWN], true);
                            }
                            else {
                                incrementConfusedCreepCount(creep);
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_POWER_SPAWN] + "?", true);
                            }
                        }
                        else if (theStorage != undefined 
                            && _.sum(theStorage.store) < theStorage.storeCapacity 
                            && theStorage.my == true 
                            && _.get(Memory.rooms, [sentTo, "isShuttingDown"], false) == false) {
                            let err = creep.transfer(theStorage, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], theStorage.storeCapacity - _.sum(theStorage.store)));
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(theStorage);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                                creep.memory.transferStructure = { 
                                    id: theStorage.id
                                    , pos: theStorage.pos
                                };
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                            }
                            else {
                                console.log(creep.name + " (exporter) is confused transfering " + RESOURCE_ENERGY + " to " + STRUCTURE_STORAGE + ": " + err);
                                incrementConfusedCreepCount(creep);
                                creep.say(ICONS[STRUCTURE_STORAGE] + "?", true);
                            }
                        }
                        else if (theTerminal != undefined 
                            && theTerminal.storeCapacityFree > 100 
                            && theTerminal.my == true) {
                            let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], (theTerminal.storeCapacityFree - 100)));
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(theTerminal);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                                creep.memory.transferStructure = { 
                                    id: theTerminal.id
                                    , pos: theTerminal.pos
                                };
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                            }
                            else {
                                console.log(creep.name + " (exporter) is confused transfering " + RESOURCE_ENERGY + " to " + STRUCTURE_TERMINAL + ": " + err);
                                incrementConfusedCreepCount(creep);
                                creep.say(ICONS[STRUCTURE_TERMINAL] + "?", true);
                            }
                        }
                        else {
                            if (creep.carryTotal == 0) {
                                _.invoke(_.filter(Game.flags, (f) => (
                                    f.pos.roomName = sentFrom 
                                    && f.color == COLOR_ORANGE
                                )), function(sentTo) {
                                    let flagInfo = this.name.split("_");
                                    if (_.get(flagInfo, 4, _.get(flagInfo, 0, "")) != sentTo) { return false; }
                                    _.set(Memory.rooms, [_.first(flagInfo), "creepMins", "exporter"], 0);
                                    return this.remove(); // NOTE: May not update immidiatly when room not visible
                                }, sentTo);
                                console.log("Stopped exporting from " + sentFrom + " to " + sentTo);
                                Game.notify("Stopped exporting from " + sentFrom + " to " + sentTo, 60);
                                creep.memory.role = "recyclable";
                                ROLES["recyclable"].run(creep);
                            }
                            else {
                                ROLES["harvester"].run(creep);
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
