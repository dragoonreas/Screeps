// TODO: Help build ally construction sites (without accidently steping on them)
let roleBuilder = {
    run: function(creep) {
        creep.memory.executingRole = "builder";
        
        if (creep.memory.working == false
            && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined; // can be a harvester when not working
            creep.memory.demolishStructure = undefined; // can be a demolisher
        }
        else if (creep.memory.working == true
            && (creep.carry[RESOURCE_ENERGY] == 0 
                && (creep.memory.role != "builder" 
                    || (creep.carry[RESOURCE_POWER] || 0) == 0))) {
            creep.memory.working = false;
            creep.memory.constructionSite = undefined;
            creep.memory.repairStructure = undefined; // can be a repairer when working
            creep.memory.depositStructure = undefined; // can be a harvester when working
        }
        
        if (creep.memory.working == true) {
            let constructionSiteID = _.get(creep.memory, ["constructionSite", "id"], undefined);
            let constructionSite = Game.getObjectById(constructionSiteID);
            let constructionSiteMemPos = _.get(creep.memory, ["constructionSite", "pos"], undefined);
            let repairStructureID = _.get(creep.memory, ["repairStructure", "id"], undefined);
            if (constructionSite == undefined && constructionSiteMemPos != undefined) {
                let constructionSiteMemRoomName = _.get(creep.memory, ["constructionSite", "pos", "roomName"], undefined); 
                if (Game.rooms[constructionSiteMemRoomName] == undefined) {
                    constructionSitePos = _.create(RoomPosition.prototype, constructionSiteMemPos);
                    creep.travelTo(constructionSitePos, {
                        range: 3
                    });
                    creep.say(travelToIcons(creep) + constructionSitePos.roomName, true);
                    return;
                }
                else if (repairStructureID == undefined) {
                    creep.memory.constructionSite = undefined;
                    let newRampart = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.hits <= RAMPART_DECAY_AMOUNT
                            && s.structureType == STRUCTURE_RAMPART
                    )});
                    if (newRampart != undefined) {
                        creep.memory.repairStructure = { 
                            id: newRampart.id
                            , pos: newRampart.pos
                        };
                        creep.say(ICONS["wait00"] + ICONS["repair"] + ICONS[STRUCTURE_RAMPART], true);
                        return; // need to wait till next tick to repair it for some reason
                    }
                }
            }
            
            if (repairStructureID != undefined) {
                ROLES["repairer"].run(creep);
                return;
            }
            
            if (constructionSite == undefined
                && _.size(Game.constructionSites) > 0
                && (creep.carry[RESOURCE_POWER] || 0) == 0) {
                let roomConstructionSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
                /*
                if (roomConstructionSites.length == 0) { // TODO: Change this block to check if there's any in rooms the creep can reasonably reach with construction sites needing to be built in them
                    for (let roomID in Game.rooms) {
                        if (roomID != creep.room.name) {
                            roomConstructionSites = Game.rooms[roomID].find(FIND_MY_CONSTRUCTION_SITES);
                            if (roomConstructionSites.length > 0) {
                                break;
                            }
                        }
                    }
                }
                */
                if (roomConstructionSites.length > 0) {
                    if (_.get(Memory.rooms, [creep.room.name, "buildOrderFILO"], false) == true) {
                        constructionSite = roomConstructionSites[roomConstructionSites.length - 1]; // TODO: Get max based on id instead
                        creep.memory.constructionSite = { 
                            id: constructionSite.id
                            , pos: constructionSite.pos
                        };
                    }
                    else {
                        let priorityQueue = [STRUCTURE_SPAWN, 
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
                        let i = 0;
                        do {
                            constructionSite = creep.pos.findClosestByRange(roomConstructionSites, {
                                filter: function(c) {
                                    return c.structureType == priorityQueue[i]
                            }});
                            ++i;
                        }
                        while (i < priorityQueue.length
                            && constructionSite == undefined) // TODO: Change this to a for...of loop with a break case for when constructionSite != undefined
                        
                        if (constructionSite != undefined) {
                            creep.memory.constructionSite = { 
                                id: constructionSite.id
                                , pos: constructionSite.pos
                            };
                        }
                        else {
                            creep.memory.constructionSite = undefined;
                        }
                    }
                }
                else {
                    creep.memory.constructionSite = undefined;
                }
            }
            
            if(constructionSite != undefined) {
                let err = creep.build(constructionSite);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(constructionSite, {
                        range: 3
                    });
                    creep.say(travelToIcons(creep) + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
                }
                else if (err == OK) {
                    creep.say(ICONS["build"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?"), true);
                } // TODO: Go back to towers for repairs when can't work
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS["build"] + ICONS["constructionSite"] + _.get(ICONS, constructionSite.structureType, "?") + "?", true);
                }
            }
            else {
                let thePowerSpawn = _.get(Game.rooms, [creep.memory.roomID, "powerSpawn"], undefined);
                if (creep.memory.role == "builder" 
                    && thePowerSpawn != undefined 
                    && thePowerSpawn.my == true 
                    && thePowerSpawn.power < Math.floor(thePowerSpawn.energy / POWER_SPAWN_ENERGY_RATIO) 
                    && (creep.carry[RESOURCE_POWER] || 0) > 0) {
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
                } else if (creep.memory.role != "builder" 
                    || (creep.carry[RESOURCE_POWER] || 0) == 0 
                    || ROLES["hoarder"].run(creep) == ERR_INVALID_TARGET) {
                    ROLES["harvester"].run(creep);
                }
            }
        }
        else {
            let source = undefined;
            switch (creep.memory.roomID) {
                //case "W87N29": source = Game.getObjectById("5873bb9511e3e4361b4d6159"); break;
                case "W86N29": source = Game.getObjectById("5873bbab11e3e4361b4d63fc"); break;
                case "W85N23": source = Game.getObjectById("5873bbc911e3e4361b4d677e"); break;
                case "W86N43": source = Game.getObjectById("5873bbaa11e3e4361b4d63c4"); break;
                case "W91N45": source = Game.getObjectById("58dbc3288283ff5308a3d20f"); break;
                case "W94N49": source = Game.getObjectById("58dbc2d48283ff5308a3c962"); break;
                case "W9N45": source = Game.getObjectById("577b935b0f9d51615fa48074"); break;
                case "W81N29": source = Game.getObjectById("5873bc2711e3e4361b4d7255"); break;
                case "W72N28": source = Game.getObjectById("5836b6eb8b8b9619519ef90e"); break;
                case "W64N31": source = Game.getObjectById("57ef9cad86f108ae6e60ca54"); break;
                case "W55N31": source = Game.getObjectById("579fa8950700be0674d2de53"); break;
                case "W53N39": source = Game.getObjectById("579fa8b40700be0674d2e27d"); break;
                case "W53N42": source = Game.getObjectById("579fa8b30700be0674d2e277"); break;
                case "W46N41": source = Game.getObjectById("577b92b30f9d51615fa46f1f"); break;
                case "W46N18": source = Game.getObjectById("577b92b60f9d51615fa46f87"); break;
                case "W52N47": source = Game.getObjectById("579fa8c40700be0674d2e3e8"); break;
                case "W48N52": source = Game.getObjectById("579fa8e90700be0674d2e743"); break;
                case "W42N51": source = Game.getObjectById("579fa8f80700be0674d2e929"); break;
            }
            
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let theRecycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
            let thePowerSpawn = _.get(Game.rooms, [creep.memory.roomID, "powerSpawn"], undefined);
            if ((creep.memory.role == "builder" 
                    && (creep.carry[RESOURCE_POWER] || 0) > 0) 
                || (source != undefined 
                    && source.energy == 0 
                    && (theRecycleContainer == undefined 
                        || theRecycleContainer.store[RESOURCE_ENERGY] == 0) 
                    && (((theStorage == undefined 
                                || theStorage.store[RESOURCE_ENERGY] == 0) 
                            && (theTerminal == undefined 
                                || (theTerminal.energyCapacityFree >= 0 
                                    || (theTerminal.my == false 
                                        && theTerminal.store[RESOURCE_ENERGY] > 0))))
                        || (((_.size(Game.constructionSites) == 0) 
                                || (Game.rooms[creep.memory.roomID] == undefined 
                                    || Game.rooms[creep.memory.roomID].find(FIND_MY_CONSTRUCTION_SITES).length == 0))
                            /*&& _.get(Game.rooms, [creep.memory.roomID, "energyAvailable"], 0) == _.get(Game.rooms, [creep.memory.roomID, "energyCapacityAvailable"], 0)*/)))) {
                if (creep.memory.role == "builder" 
                    && thePowerSpawn != undefined 
                    && thePowerSpawn.my == true 
                    && thePowerSpawn.power < Math.floor(thePowerSpawn.energy / POWER_SPAWN_ENERGY_RATIO)) { 
                    let requiredPower = Math.floor(thePowerSpawn.energy / POWER_SPAWN_ENERGY_RATIO) - (thePowerSpawn.power + (creep.carry[RESOURCE_POWER] || 0));
                    if (requiredPower > 0 
                        && ((theStorage != undefined 
                                && (theStorage.store[RESOURCE_POWER] || 0) > 0) 
                            ||  theTerminal != undefined 
                                && (theTerminal.store[RESOURCE_POWER] || 0) > 0)) {
                        if (theStorage != undefined 
                            && (theStorage.store[RESOURCE_POWER] || 0) > 0) {
                            let err = creep.withdraw(theStorage, RESOURCE_POWER, _.min([requiredPower, theStorage.store[RESOURCE_POWER], creep.carryCapacityAvailable]));
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
                        } else if (theTerminal != undefined 
                            && (theTerminal.store[RESOURCE_POWER] || 0) > 0) {
                            let err = creep.withdraw(theTerminal, RESOURCE_POWER, _.min([requiredPower, theTerminal.store[RESOURCE_POWER], creep.carryCapacityAvailable]));
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
                        } else {
                            incrementConfusedCreepCount(creep);
                            creep.say(ICONS["withdraw"] + "?", true);
                        }
                        
                        return;
                    }
                    else if ((creep.carry[RESOURCE_POWER] || 0) > 0) {
                        creep.memory.working = true;
                        ROLES["builder"].run(creep);
                        return;
                    } // NOTE: Drops out here to try and do other things when no power in storage or terminal
                }
                else if (creep.memory.role == "builder" 
                    && (creep.carry[RESOURCE_POWER] || 0) > 0 
                    && ROLES["hoarder"].run(creep) != ERR_INVALID_TARGET) {
                    return;
                }
                
                if (_.get(Memory, ["rooms", creep.memory.roomID, "creepCounts", "upgrader"], 0) == 0 
                    && ROLES["upgrader"].run(creep) != ERR_NOT_ENOUGH_RESOURCES) {
                    return;
                }
                
                if ((creep.memory.roomID == "W52N47") // Add rooms creeps can demolish in here
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
                ROLES["builder"].run(creep);
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

module.exports = roleBuilder;
