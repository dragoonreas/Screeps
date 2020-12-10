// TODO: Repair ally structures and help fill their towers
let roleRepairer = {
    run: function(creep) {
        creep.memory.executingRole = "repairer";
        
        if (creep.memory.working == false
            && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined; // can be a harvester when not working
            creep.memory.demolishStructure = undefined; // can be a demolisher
        }
        else if (creep.memory.working == true
            && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.memory.repairStructure = undefined;
            creep.memory.constructionSite = undefined; // can be a builder when working
            creep.memory.depositStructure = undefined; // can be a harvester when working
        }
        
        if (creep.memory.working == true) {
            let structureID = _.get(creep.memory, ["repairStructure", "id"], undefined);
            let structure = Game.getObjectById(structureID);
            let structureMemPos = _.get(creep.memory, ["repairStructure", "pos"], undefined);
            let structureMemRoomName = _.get(creep.memory, ["repairStructure", "pos", "roomName"], undefined);
            if (structure == undefined 
                && structureMemPos != undefined 
                && Game.rooms[structureMemRoomName] == undefined) {
                let structurePos = RoomPositionFromObject(structureMemPos);
                creep.travelTo(structurePos, {
                    range: 3
                });
                creep.say(travelToIcons(creep) + structurePos.roomName, true);
                return;
            }
            
            if (structure != undefined && 
                ((structure.structureType != STRUCTURE_TOWER 
                    && structure.hits == structure.hitsMax)
                || (structure.structureType == STRUCTURE_TOWER 
                    && structure.energy == structure.energyCapacity
                    && structure.hits == structure.hitsMax))) {
                structure = undefined;
            }
            
            if (structure == undefined) {
                creep.memory.repairStructure = undefined;
                structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { // TODO: Find closest tower to Game.getObjectByID(Game.rooms[creep.memory.roomID].priorityTargetID) instead
                filter: (s) => (s.structureType == STRUCTURE_TOWER 
                    && s.energy < s.energyCapacity
                )});
                if (structure != undefined) {
                    creep.memory.repairStructure = { 
                        id: structure.id
                        , pos: structure.pos
                    };
                }
            }
            
            if (structure == undefined) {
                let repairerTypeFound = false;
                for (let repairerType in Memory.rooms[creep.memory.roomID].repairerTypeMins) { // TODO: Change to for...of once Memory.rooms[creep.memory.roomID].repairerTypeMins is changed to an array
                    if (repairerTypeFound == false
                        && (repairerType == creep.memory.repairerType
                            || repairerType == "all")) {
                        repairerTypeFound = true;
                    }
                    
                    if (repairerTypeFound == true 
                        && (repairerType != STRUCTURE_ROAD
                        || creep.memory.repairerType == STRUCTURE_ROAD)) { // TODO: Add check for roads when towers aren't avaliable to repair them
                        if (repairerType == STRUCTURE_ROAD) {
                            structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (s) => (s.hits < s.hitsMax 
                                    && s.structureType == repairerType
                            )});
                        }
                        else {
                            let theStructures = undefined;
                            if (repairerType != "all") {
                                theStructures = creep.room.find(FIND_STRUCTURES, {
                                    filter: (s) => (s.hits < s.hitsMax 
                                        && s.structureType == repairerType
                                )});
                            }
                            else {
                                let numRoadRepairers = _.get(Memory.rooms, [_.get(creep.memory, ["roomID"], creep.room.name), "repairerTypeCounts", STRUCTURE_ROAD], 0);
                                let numTowers = _.get(creep.room, ["myActiveTowers", "length"], 0);
                                theStructures = creep.room.find(FIND_STRUCTURES, {
                                    filter: (s) => (s.hits < s.hitsMax 
                                        && (s.structureType != STRUCTURE_ROAD
                                            || (numRoadRepairers == 0 
                                                && numTowers == 0)
                                            || s.hits <= (ROAD_DECAY_AMOUNT * ((s.hitsMax == ROAD_HITS) ? 1 : CONSTRUCTION_COST_ROAD_SWAMP_RATIO)))
                                )});
                            }
                            
                            if (theStructures.length > 0) {
                                structure = _.min(theStructures, "hits");
                            }
                        }
                        if (structure != undefined) {
                            creep.memory.repairStructure = { 
                                id: structure.id
                                , pos: structure.pos
                            };
                            break;
                        }
                    }
                }
            }
            
            if (structure != undefined) {
                let err = undefined;
                let actionIcon = "?";
                if(structure.structureType == STRUCTURE_TOWER 
                    && structure.energy < structure.energyCapacity) {
                    err = creep.transfer(structure, RESOURCE_ENERGY);
                    actionIcon = ICONS["transfer"];
                }
                else {
                    err = creep.repair(structure);
                    actionIcon = ICONS["repair"];
                }
                
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(structure, {
                        range: ((actionIcon == ICONS["repair"]) ? 3 : 1)
                    });
                    creep.say(travelToIcons(creep) + _.get(ICONS, structure.structureType, "?"), true);
                }
                else if (err == OK) {
                    creep.say(actionIcon + _.get(ICONS, structure.structureType, "?"), true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(actionIcon + _.get(ICONS, structure.structureType, "?") + "?", true);
                }
            }
            else {
                creep.memory.repairStructure = undefined;
                ROLES["builder"].run(creep);
            }
        }
        else {
            let source = undefined;
            switch (creep.memory.roomID) {
                case "W28N5": source = Game.getObjectById("5fb29bce0d314f7d0888d151"); break;
                case "W12S26": source = Game.getObjectById("5fb29dfd0d314f7d0888e8e9"); break;
            }
            
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let theRecycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
            if (source != undefined
                && source.energy == 0
                && (theRecycleContainer == undefined
                    || theRecycleContainer.store[RESOURCE_ENERGY] == 0)
                && (theStorage == undefined
                    || theStorage.store[RESOURCE_ENERGY] == 0)
                && (theTerminal == undefined
                    || (theTerminal.energyCapacityFree >= 0 
                        || (theTerminal.my == false
                            && theTerminal.store[RESOURCE_ENERGY] == 0)))) {
                if (_.get(Memory, ["rooms", creep.memory.roomID, "creepCounts", "upgrader"], 0) == 0) {
                    if (ROLES["upgrader"].run(creep) != ERR_NOT_ENOUGH_RESOURCES) {
                        return;
                    }
                }
                if ((false) // Add rooms creeps can demolish in here
                    && (_.countBy(creep.body, "type")[WORK] || 0) >= 4) { // for new rooms that have old structures
                    ROLES["demolisher"].run(creep);
                }
                else {
                    ROLES["harvester"].run(creep);
                }
                return;
            }
            else if ((_.get(theStorage, ["my"], true) == false 
                    && theStorage.store[RESOURCE_ENERGY] > 0) 
                || (_.get(theTerminal, ["my"], true) == false 
                    && theTerminal.store[RESOURCE_ENERGY] > 0)) {
                source = undefined;
            }
            
            let err = ERR_INVALID_TARGET;
            if (source != undefined) {
                err = creep.harvest(source);
            }
            
            if (err == ERR_NOT_IN_RANGE) {
                creep.travelTo(source);
                creep.say(travelToIcons(creep) + ICONS["harvest"] + ICONS["source"], true);
            }
            else if (err == OK) {
                creep.say(ICONS["harvest"] + ICONS["source"], true);
            }
            else if (theRecycleContainer != undefined
                && theRecycleContainer.store[RESOURCE_ENERGY] > 0) {
                err = creep.withdraw(theRecycleContainer, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theRecycleContainer);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTAINER], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_CONTAINER], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS[STRUCTURE_CONTAINER] + "?", true);
                }
            }
            else if (theStorage != undefined
                && theStorage.store[RESOURCE_ENERGY] > 0) {
                err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theStorage);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS[STRUCTURE_STORAGE] + "?", true);
                }
            }
            else if (theTerminal != undefined
                && (theTerminal.energyCapacityFree < 0 
                    || (theTerminal.my == false
                        && theTerminal.store[RESOURCE_ENERGY] > 0))) {
                err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theTerminal);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS[STRUCTURE_TERMINAL] + "?", true);
                }
            }
            else if (err == ERR_NOT_ENOUGH_RESOURCES 
                && creep.carry[RESOURCE_ENERGY] > 0) {
                creep.memory.working = true;
                ROLES["repairer"].run(creep);
            }
            else if (err == ERR_INVALID_TARGET) {
                incrementConfusedCreepCount(creep);
                creep.say(ICONS["harvest"] + "?", true);
            }
            else {
                incrementIdleCreepCount(creep);
                switch (creep.saying) {
                    case ICONS["wait00"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait01"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait01"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait02"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait02"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait03"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait03"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait04"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait04"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait05"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait05"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait06"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait06"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait07"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait07"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait08"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait08"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait09"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait09"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait10"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait11"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait11"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait12"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait12"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait13"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait13"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait14"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait14"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait15"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait15"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait16"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait16"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait17"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait17"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait18"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait18"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait19"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait19"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait20"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait20"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait21"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait21"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait22"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait22"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait23"] + ICONS["harvest"] + ICONS["source"], true); break;
                    default: creep.say(ICONS["wait00"] + ICONS["harvest"] + ICONS["source"], true);
                }
            }
        }
    }
};

module.exports = roleRepairer;
