let roleHarvester = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.depositStructureID = undefined;
        }
        
        if (creep.memory.working == false) {
            let source = Game.getObjectById(creep.memory.sourceID);
            if (source == undefined || source.energy == 0) {
                if (source != undefined) {
                    creep.memory.sourceID = undefined;
                }
                
                let sourceMem = Memory.sources[creep.memory.sourceID];
                if (sourceMem != undefined && sourceMem.regenAt <= Game.time && creep.room.name != sourceMem.pos.roomName) {
                    creep.say(ICONS["moveTo"] + sourceMem.pos.roomName, true);
                    creep.travelTo(new RoomPosition(sourceMem.pos.x, sourceMem.pos.y, sourceMem.pos.roomName));
                    return;
                }
                else {
                    creep.memory.sourceID = undefined;
                    
                    /*
                        TODO:
                        Create these lists from the sources stored in the memory of the harvest rooms, which in turn are stored in the memory of the creeps spawn room.
                        Also make sure to use for...of instead of for...in since the order the sources are listed defines their priority
                    */
                    let sourceIDs = {
                        "W87N29": [
                            "5873bb7f11e3e4361b4d5f14"
                            , "5873bb6711e3e4361b4d5cc5"
                            , "5873bb9511e3e4361b4d6159"
                        ] 
                        , "W86N29": [
                            "5873bbab11e3e4361b4d6400"
                            , "5873bbc811e3e4361b4d675b"
                            , "5873bbc811e3e4361b4d675c"
                            , "5873bbab11e3e4361b4d63fc"
                        ] 
                        , "W85N23": [
                            "5873bbe111e3e4361b4d6ac4"
                            , "5873bbc911e3e4361b4d676e"
                            , "5873bbc911e3e4361b4d676f"
                            , "5873bbc911e3e4361b4d6770"
                            , "5873bbc911e3e4361b4d677e"
                        ]
                        , "W86N39": [
                            "5873bb9411e3e4361b4d6137"
                            , "5873bb9411e3e4361b4d6138"
                            , "5873bb7e11e3e4361b4d5ef2"
                            , "5873bbaa11e3e4361b4d63cf"
                        ]
                        , "W85N38": [
                            "5873bbaa11e3e4361b4d63d2"
                            , "5873bbc711e3e4361b4d672e"
                            , "5873bbc711e3e4361b4d6731"
                        ]
                        , "W86N43": [
                            "5873bb9311e3e4361b4d612d"
                            , "5873bb9311e3e4361b4d612b"
                            , "5873bbc611e3e4361b4d6715"
                            , "5873bbc611e3e4361b4d6713"
                            , "5873bbc611e3e4361b4d6714"
                            , "5873bbaa11e3e4361b4d63c4"
                        ]
                    };
                    for (let sourceIndex in sourceIDs[creep.memory.roomID]) {
                        let sourceID = sourceIDs[creep.memory.roomID][sourceIndex];
                        source = Game.getObjectById(sourceID);
                        if (source != undefined) {
                            if (source.regenAt <= Game.time) { // TODO: Also check if there's space around the source (and also determine if this check may be better done elsewhere)
                                creep.memory.sourceID = sourceID;
                                break;
                            }
                        }
                        else {
                            sourceMem = Memory.sources[sourceID];
                            if (sourceMem != undefined) {
                                if (sourceMem.regenAt <= Game.time) {
                                    creep.memory.sourceID = sourceID;
                                    creep.say(ICONS["moveTo"] + sourceMem.pos.roomName, true);
                                    creep.travelTo(new RoomPosition(sourceMem.pos.x, sourceMem.pos.y, sourceMem.pos.roomName));
                                    return;
                                }
                            }
                            else if (sourceID == "5873bb7f11e3e4361b4d5f14") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W88N29", true);
                                creep.travelTo(new RoomPosition(3, 34, "W88N29"));
                                return;
                            }
                            else if (sourceID == "5873bb6711e3e4361b4d5cc5") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W89N29", true);
                                creep.travelTo(new RoomPosition(7, 39, "W89N29"));
                                return;
                            }
                            else if (sourceID == "5873bbab11e3e4361b4d6400") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W86N28", true);
                                creep.travelTo(new RoomPosition(18, 8, "W86N28"));
                                return;
                            }
                            else if (sourceID == "5873bbc811e3e4361b4d675b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W85N29", true);
                                creep.travelTo(new RoomPosition(23, 9, "W85N29"));
                                return;
                            }
                            else if (sourceID == "5873bbe111e3e4361b4d6ac4") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W84N23", true);
                                creep.travelTo(new RoomPosition(3, 3, "W84N23"));
                                return;
                            }
                            else if (sourceID == "5873bbc911e3e4361b4d676e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W85N25", true);
                                creep.travelTo(new RoomPosition(4, 8, "W85N25"));
                                return;
                            }
                            else if (sourceID == "5873bb9411e3e4361b4d6137") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W87N39", true);
                                creep.travelTo(new RoomPosition(34, 19, "W87N39"));
                                return;
                            }
                            else if (sourceID == "5873bb7e11e3e4361b4d5ef2") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W88N39", true);
                                creep.travelTo(new RoomPosition(35, 4, "W88N39"));
                                return;
                            }
                            else if (sourceID == "5873bbaa11e3e4361b4d63d2") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W86N38", true);
                                creep.travelTo(new RoomPosition(8, 12, "W86N38"));
                                return;
                            }
                            else if (sourceID == "5873bbc711e3e4361b4d672e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W85N39", true);
                                creep.travelTo(new RoomPosition(21, 12, "W85N39"));
                                return;
                            }
                            else if (sourceID == "5873bb9311e3e4361b4d612d") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W87N43", true);
                                creep.travelTo(new RoomPosition(18, 36, "W87N43"));
                                return;
                            }
                            else if (sourceID == "5873bb9311e3e4361b4d612b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W87N44", true);
                                creep.travelTo(new RoomPosition(4, 35, "W87N44"));
                                return;
                            }
                            else if (sourceID == "5873bbc611e3e4361b4d6715") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.say(ICONS["moveTo"] + "W85N45", true);
                                creep.travelTo(new RoomPosition(17, 41, "W85N45"));
                                return;
                            }
                        }
                    }
                }
            }
            
            if (source != undefined) {
                let err = creep.harvest(source);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS["harvest"] + ICONS["source"], true);
                    creep.travelTo(source);
                }
                else if (err == OK) {
                    creep.say(ICONS["harvest"] + ICONS["source"], true);
                }
            }
            else if (creep.carry.energy > 0) {
                creep.memory.working = true;
            }
            else {
                switch (creep.saying) {
                    case ICONS["wait0"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait1"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait1"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait2"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait2"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait3"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait3"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait4"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait4"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait5"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait5"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait6"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait6"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait7"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait7"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait8"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait8"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait9"] + ICONS["harvest"] + ICONS["source"], true); break;
                    case ICONS["wait9"] + ICONS["harvest"] + ICONS["source"]: creep.say(ICONS["wait10"] + ICONS["harvest"] + ICONS["source"], true); break;
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
                    default: creep.say(ICONS["wait0"] + ICONS["harvest"] + ICONS["source"], true);
                }
            }
        }
        else {
            if (_.isString(creep.memory.roomID) == true && creep.room.name != creep.memory.roomID) {
                creep.say(ICONS["moveTo"] + creep.memory.roomID, true);
                creep.travelTo(new RoomPosition(25, 25, creep.memory.roomID));
            }
            else {
                let structure = Game.getObjectById(creep.memory.depositStructureID);
                if (structure == undefined || structure.energy == structure.energyCapacity) {
                    structure = undefined;
                    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                        structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (s) => {
                                return (s.structureType == STRUCTURE_EXTENSION 
                                    || s.structureType == STRUCTURE_SPAWN) 
                                    && s.energy < s.energyCapacity;
                            }
                        });
                    }
                    if (structure == undefined) {
                        structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (s) => {
                                return s.structureType == STRUCTURE_TOWER 
                                    && s.energy < s.energyCapacity;
                            }
                        });
                    }
                    creep.memory.depositStructureID = _.get(structure, "id", undefined);
                }
                
                let theTerminal = creep.room.terminal;
                let theStorage = creep.room.storage;
                if (structure != undefined) {
                    let err = creep.transfer(structure, RESOURCE_ENERGY);
                    if(err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + _.get(ICONS, structure.structureType, "?"), true);
                        creep.travelTo(structure);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["transfer"] + _.get(ICONS, structure.structureType, "?"), true);
                        if (structure.structureType == STRUCTURE_TERMINAL) {
                        }
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy < (theTerminal.storeCapacity / 2)) {
                    let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry.energy, (theTerminal.storeCapacity / 2) - theTerminal.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                        //console.log(theTerminal.room.name + " terminal reserve at: " + (theTerminal.store.energy + Math.min(creep.carry.energy, (theTerminal.storeCapacity / 2) - theTerminal.store.energy)).toLocaleString() + "/" + (theTerminal.storeCapacity / 2).toLocaleString());
                    }
                }
                else if (creep.memory.roomID == "W87N29" && theTerminal != undefined && Memory.TooAngelDealings.isFriendly == false && theTerminal.store.energy < Memory.TooAngelDealings.totalCost) {
                    let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry.energy, Memory.TooAngelDealings.totalCost - theTerminal.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                        //console.log("TooAngel dealing terminal at: " + (theTerminal.store.energy + Math.min(creep.carry.energy, Memory.TooAngelDealings.totalCost - theTerminal.store.energy)).toLocaleString() + "/" + Memory.TooAngelDealings.totalCost.toLocaleString());
                    }
                }
                else if (theStorage != undefined && theStorage.store.energy < (theStorage.storeCapacity / 2)) {
                    let err = creep.transfer(theStorage, RESOURCE_ENERGY, Math.min(creep.carry.energy, (theStorage.storeCapacity / 2) - theStorage.store.energy));
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                        //console.log(theStorage.room.name + " storage reserve at: " + (theStorage.store.energy + Math.min(creep.carry.energy, (theStorage.storeCapacity / 2) - theStorage.store.energy)).toLocaleString() + "/" + (theStorage.storeCapacity / 2).toLocaleString());
                    }
                }
                else {
                    ROLES["upgrader"].run(creep);
                }
            }
        }
    }
};

module.exports = roleHarvester;
