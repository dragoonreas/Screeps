const TOWER_REFILL_THRESHOLD = Math.ceil((TOWER_CAPACITY / TOWER_ENERGY_COST) * 0.9) * TOWER_ENERGY_COST; // Energy required for a tower to do at least 90% of the shots it can do at full energy capacity

let roleHarvester = {
    run: function(creep) {
        creep.memory.executingRole = "harvester";
        
        if (creep.memory.working == false
            && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true
            && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.memory.depositStructure = undefined;
            creep.memory.constructionSite = undefined; // can be a builder when working
            creep.memory.repairStructure = undefined; // can be a repairer when working
        }
        
        if (creep.memory.working == false) {
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let theRecycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
            let quickFill = (((_.get(Memory.rooms, [creep.memory.roomID, "creepCounts", "harvester"], 0) < _.get(Memory.rooms, [creep.memory.roomID, "creepMins", "harvester"], 1))
                || (creep.energyAvaliableOnSpawn < _.get(Game.rooms, [creep.memory.roomID, "energyCapacityAvailable"], (creep.room.energyCapacityAvailable || SPAWN_ENERGY_CAPACITY))))
                && ((theRecycleContainer != undefined 
                        && theRecycleContainer.store[RESOURCE_ENERGY] > 0) 
                    || (theStorage != undefined 
                        && theStorage.store[RESOURCE_ENERGY] > 0) 
                    || (theTerminal != undefined 
                        & theTerminal.store[RESOURCE_ENERGY] > 0)));
            let source = Game.getObjectById(creep.memory.sourceID);
            if (quickFill == false 
                && (source == undefined
                    || source.energy == 0
                    || _.get(source.room, ["controller", "owner", "username"], "dragoonreas") != "dragoonreas"
                    || _.get(source.room, ["controller", "reservation", "username"], "dragoonreas") != "dragoonreas")) {
                if (source != undefined) {
                    source = undefined;
                    creep.memory.sourceID = undefined;
                }
                
                let sourceMem = Memory.sources[creep.memory.sourceID];
                if (sourceMem != undefined
                    && sourceMem.regenAt <= Game.time
                    && creep.room.name != sourceMem.pos.roomName) {
                    creep.travelTo(_.create(RoomPosition.prototype, sourceMem.pos));
                    creep.say(travelToIcons(creep) + sourceMem.pos.roomName, true);
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
                        "E8S2": [
                            "596cea9da4b0a6000a635bb8" // E8S2
                            , "596e563e638d01000b4ed6de" // E8S3
                            , "596e563e638d01000b4ed6dd" // E8S3
                        ]
                        , "E17S1": [
                            "596ce23b3c1b99000a4d32b0" // E17S1
                        ]
                        , "E18S3": [
                            "596ce23b3c1b99000a4d32d6" // E17S3
                            , "596ce23b3c1b99000a4d32d7" // E17S3
                            , "596ce23b3c1b99000a4d32dd" // E19S3
                            , "596ce23b3c1b99000a4d32de" // E19S3
                            , "596ce23b3c1b99000a4d3299" // E18S2
                            , "596ce23b3c1b99000a4d3291" // E18S3
                        ]
                        , "E18S9": [
                            "596ce23b3c1b99000a4d3365" // E18S9
                        ]
                        , "E21S9": [
                            "59791d3c55e51c000b0bcb8b" // E19S11
                            , "59791d3c55e51c000b0bcb46" // E21S9
                        ]
                        , "E19S13": [
                            "59791d3c55e51c000b0bcb79" // E18S13
                            , "59791d3c55e51c000b0bcbe3" // E19S14
                            , "59791d3c55e51c000b0bcbab" // E19S12
                            , "59791d3c55e51c000b0bcc24" // E19S13
                        ]
                        , "E18S17": [
                            "59791d3c55e51c000b0bcc0e" // E18S18
                            , "59791d3c55e51c000b0bcc0d" // E18S18
                            , "59791d3c55e51c000b0bcb7c" // E18S16
                            , "59791d3c55e51c000b0bcb67" // E17S17
                            , "59791d3c55e51c000b0bcc1a" // E18S17
                        ]
                        , "E1S13": [
                            /*"59790a4b833ada000b96f462" // E1S12
                            , "59790a4b833ada000b96f464" // E1S12
                            , */"59790a4b833ada000b96f431" // E2S13
                            , "59790a4b833ada000b96f434" // E1S13
                        ]
                        , "E2S11": [
                            "59790a4b833ada000b96f341" // E3S11
                            , "59790a4b833ada000b96f33f" // E3S11
                            /*, "598869041a4816000a1a2dd2" // E1S11
                            , "598869041a4816000a1a2dd3" // E1S11
                            , "59790a4b833ada000b96f45c" // E2S12
                            */, "59790a4b833ada000b96f399" // E2S11
                        ]
                        , "E3S15": [
                            "59790a4b833ada000b96f3f8" // E5S15
                            , "59790a4b833ada000b96f3f7" // E5S15
                            , "59790a4b833ada000b96f3f9" // E5S15
                            , "59790a4b833ada000b96f438" // E3S16
                            , "59790a4b833ada000b96f395" // E3S15
                        ]
                        , "E7S12": [
                            "59790d46833ada000b96f4d8" // E7S13
                            , "59790d46833ada000b96f4d9" // E7S13
                            , "59790d46833ada000b96f4d0" // E8S12
                            , "59790d46833ada000b96f4d2" // E8S12
                            , "59790a4b833ada000b96f363" // E6S12
                            , "59790d46833ada000b96f4cb" // E7S11
                            , "59790d46833ada000b96f4d4" // E7S12
                        ]
                    };
                    for (let sourceIndex in sourceIDs[creep.memory.roomID]) {
                        let sourceID = sourceIDs[creep.memory.roomID][sourceIndex];
                        source = Game.getObjectById(sourceID);
                        if (source != undefined) {
                            if (_.get(source.room, ["controller", "owner", "username"], "dragoonreas") == "dragoonreas"
                                && _.get(source.room, ["controller", "reservation", "username"], "dragoonreas") == "dragoonreas") {
                                if (source.regenAt <= Game.time) { // TODO: Also check if there's space around the source (and also determine if this check may be better done elsewhere)
                                    creep.memory.sourceID = sourceID;
                                    break;
                                }
                                else {
                                    source = undefined;
                                }
                            }
                            else {
                                if (_.get(source.room, ["controller", "owner", "username"], "dragoonreas") != "dragoonreas") {
                                    source.regenAt = Math.max(_.get(source.room, ["controllerMem", "neutralAt"], Game.time), source.regenAt);
                                }
                                else {
                                    source.regenAt = Math.max(_.get(source.room, ["controllerMem", "reservation", "endsAt"], Game.time), source.regenAt);
                                }
                                source = undefined;
                            }
                        }
                        else {
                            sourceMem = Memory.sources[sourceID];
                            if (sourceMem != undefined) {
                                if (_.get(Memory.rooms, [_.get(sourceMem, ["pos", "roomname"], ""), "controller", "owner", "username"], "dragoonreas") == "dragoonreas"
                                    && _.get(Memory.rooms, [_.get(sourceMem, ["pos", "roomname"], ""), "controller", "reservation", "username"], "dragoonreas") == "dragoonreas") {
                                    if (sourceMem.regenAt <= Game.time) {
                                        creep.memory.sourceID = sourceID;
                                        creep.travelTo(_.create(RoomPosition.prototype, sourceMem.pos));
                                        creep.say(travelToIcons(creep) + sourceMem.pos.roomName, true);
                                        return;
                                    }
                                }
                                else {
                                    if (_.get(Memory.rooms, [_.get(sourceMem, ["pos", "roomname"], ""), "controller", "owner", "username"], "dragoonreas") == "dragoonreas") {
                                        sourceMem.regenAt = Math.max(_.get(Memory.rooms, [_.get(sourceMem, ["pos", "roomname"], ""), "controller", "neutralAt"], Game.time), sourceMem.regenAt);
                                    }
                                    else {
                                        sourceMem.regenAt = Math.max(_.get(Memory.rooms, [_.get(sourceMem, ["pos", "roomname"], ""), "controller", "reservation", "endsAt"], Game.time), sourceMem.regenAt);
                                    }
                                }
                            }
                            else if (sourceID == "596e563e638d01000b4ed6de") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(15, 44, "E8S3"));
                                creep.say(travelToIcons(creep) + "E8S3", true);
                                return;
                            }
                            else if (sourceID == "596cea9da4b0a6000a635bb8") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(7, 39, "E8S2"));
                                creep.say(travelToIcons(creep) + "E8S2", true);
                                return;
                            }
                            else if (sourceID == "596ce23b3c1b99000a4d32b0") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(39, 31, "E17S1"));
                                creep.say(travelToIcons(creep) + "E17S1", true);
                                return;
                            }
                            else if (sourceID == "596ce23b3c1b99000a4d32d6") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(15, 26, "E17S3"));
                                creep.say(travelToIcons(creep) + "E17S3", true);
                                return;
                            }
                            else if (sourceID == "596ce23b3c1b99000a4d32dd") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(19, 13, "E19S3"));
                                creep.say(travelToIcons(creep) + "E19S3", true);
                                return;
                            }
                            else if (sourceID == "596ce23b3c1b99000a4d3299") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(46, 39, "E18S2"));
                                creep.say(travelToIcons(creep) + "E18S2", true);
                                return;
                            }
                            else if (sourceID == "596ce23b3c1b99000a4d3291") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(23, 21, "E18S3"));
                                creep.say(travelToIcons(creep) + "E18S3", true);
                                return;
                            }
                            else if (sourceID == "596ce23b3c1b99000a4d3363") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(43, 10, "E18S9"));
                                creep.say(travelToIcons(creep) + "E18S9", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcb8b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(15, 15, "E19S11"));
                                creep.say(travelToIcons(creep) + "E19S11", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcb46") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(44, 26, "E21S9"));
                                creep.say(travelToIcons(creep) + "E21S9", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcb79") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(23, 33, "E18S13"));
                                creep.say(travelToIcons(creep) + "E18S13", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcbe3") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(25, 42, "E19S14"));
                                creep.say(travelToIcons(creep) + "E19S14", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcbab") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(31, 18, "E19S12"));
                                creep.say(travelToIcons(creep) + "E19S12", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcc24") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(35, 29, "E19S13"));
                                creep.say(travelToIcons(creep) + "E19S13", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcc0e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(37, 44, "E18S18"));
                                creep.say(travelToIcons(creep) + "E18S18", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcb7c") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(22, 33, "E18S16"));
                                creep.say(travelToIcons(creep) + "E18S16", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcb67") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 15, "E17S17"));
                                creep.say(travelToIcons(creep) + "E17S17", true);
                                return;
                            }
                            else if (sourceID == "59791d3c55e51c000b0bcc1a") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(31, 28, "E18S17"));
                                creep.say(travelToIcons(creep) + "E18S17", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f431") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(26, 19, "E2S13"));
                                creep.say(travelToIcons(creep) + "E2S13", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f462") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(7, 3, "E1S12"));
                                creep.say(travelToIcons(creep) + "E1S12", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f434") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 21, "E1S13"));
                                creep.say(travelToIcons(creep) + "E1S13", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f341") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(28, 30, "E3S11"));
                                creep.say(travelToIcons(creep) + "E3S11", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f45c") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(7, 26, "E2S12"));
                                creep.say(travelToIcons(creep) + "E2S12", true);
                                return;
                            }
                            else if (sourceID == "598869041a4816000a1a2dd2") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(45, 4, "E1S11"));
                                creep.say(travelToIcons(creep) + "E1S11", true);
                                return;
                            }
                            else if (sourceID == "598869041a4816000a1a2dd3") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(45, 22, "E1S11"));
                                creep.say(travelToIcons(creep) + "E1S11", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f399") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(16, 28, "E2S11"));
                                creep.say(travelToIcons(creep) + "E2S11", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f3f8") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(33, 21, "E5S15"));
                                creep.say(travelToIcons(creep) + "E5S15", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f438") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 35, "E3S16"));
                                creep.say(travelToIcons(creep) + "E3S16", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f395") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(19, 5, "E3S15"));
                                creep.say(travelToIcons(creep) + "E3S15", true);
                                return;
                            }
                            else if (sourceID == "59790d46833ada000b96f4d8") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(31, 7, "E7S13"));
                                creep.say(travelToIcons(creep) + "E7S13", true);
                                return;
                            }
                            else if (sourceID == "59790d46833ada000b96f4d0") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(37, 10, "E8S12"));
                                creep.say(travelToIcons(creep) + "E8S12", true);
                                return;
                            }
                            else if (sourceID == "59790a4b833ada000b96f363") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(37, 38, "E6S12"));
                                creep.say(travelToIcons(creep) + "E6S12", true);
                                return;
                            }
                            else if (sourceID == "59790d46833ada000b96f4cb") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(5, 18, "E7S11"));
                                creep.say(travelToIcons(creep) + "E7S11", true);
                                return;
                            }
                            else if (sourceID == "59790d46833ada000b96f4d4") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(7, 19, "E7S12"));
                                creep.say(travelToIcons(creep) + "E7S12", true);
                                return;
                            }
                        }
                    }
                }
            }
            
            if (quickFill == true) {
                if (theRecycleContainer != undefined
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
                    && theTerminal.store[RESOURCE_ENERGY] > 0) {
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
            }
            else if (source != undefined) {
                let err = creep.harvest(source);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(source);
                    creep.say(travelToIcons(creep) + ICONS["harvest"] + ICONS["source"], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["harvest"] + ICONS["source"], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS["harvest"] + ICONS["source"] + "?", true);
                }
            }
            else if (creep.carry[RESOURCE_ENERGY] > 0) {
                creep.memory.working = true;
            }
            else {
                incrementIdleCreepCount(creep);
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
            if ((creep.memory.constructionSite != undefined 
                    && _.get(creep.memory, ["constructionSite", "pos", "roomName"], undefined) != creep.room.name) 
                || (creep.memory.repairStructure != undefined 
                    && _.get(creep.memory, ["repairStructure", "pos", "roomName"], undefined) != creep.room.name)) {
                ROLES["builder"].run(creep);
                return;
            }
            
            let structureID = _.get(creep.memory, ["depositStructure", "id"], undefined);
            let structure = Game.getObjectById(structureID);
            let structureMemPos = _.get(creep.memory, ["depositStructure", "pos"], undefined);
            let structureMemRoomName = _.get(creep.memory, ["depositStructure", "pos", "roomName"], undefined);
            if (structure == undefined 
                && structureMemPos != undefined 
                && Game.rooms[structureMemRoomName] == undefined) {
                let structurePos = _.create(RoomPosition.prototype, structureMemPos);
                creep.travelTo(structurePos);
                creep.say(travelToIcons(creep) + structurePos.roomName, true);
                return;
            }
            
            if (structure == undefined
                || structure.energy == structure.energyCapacity) {
                if (_.isString(creep.memory.roomID) == true
                    && creep.room.name != creep.memory.roomID) {
                    creep.memory.depositStructure = undefined;
                    creep.travelTo(new RoomPosition(25, 25, creep.memory.roomID), {
                        range: 23
                    });
                    creep.say(travelToIcons(creep) + creep.memory.roomID, true);
                    return;
                }
                
                if (_.get(creep.room, ["controller", "my"], false) == true 
                    && (creep.room.controller.ticksToDowngrade <= (CONTROLLER_DOWNGRADE[creep.room.controller.level] - Math.max(CONTROLLER_DOWNGRADE_SAFEMODE_THRESHOLD - creep.ticksToLive, 0))) 
                    && _.get(creep.memory, ["role"], "exporter") != "exporter") {
                    ROLES["upgrader"].run(creep);
                    return;
                }
                
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
                    let repairerCount = _.get(Memory.rooms, [_.get(creep.memory, ["roomID"], creep.room.name), "creepCounts", "repairer"], 0);
                    structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { // TODO: Find closest tower to Game.getObjectByID(Game.rooms[creep.memory.roomID].priorityTargetID) instead
                        filter: (s) => {
                            return (s.structureType == STRUCTURE_TOWER 
                                && s.energy < s.energyCapacity 
                                && (repairerCount == 0 
                                    || s.energy < TOWER_REFILL_THRESHOLD));
                        }
                    });
                }
                
                if (structure != undefined) {
                    creep.memory.depositStructure = { 
                        id: structure.id
                        , pos: structure.pos
                    };
                }
                else {
                    creep.memory.depositStructure = undefined;
                }
            }
            
            let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined);
            let terminalEnergy = _.get(theTerminal, ["store", RESOURCE_ENERGY], 0);
            terminalEnergy = _.isFinite(terminalEnergy) ? terminalEnergy : 0;
            let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
            let storageEnergy = _.get(theStorage, ["store", RESOURCE_ENERGY], 0);
            storageEnergy = _.isFinite(storageEnergy) ? storageEnergy : 0;
            let thePowerSpawn = _.get(Game.rooms, [creep.memory.roomID, "powerSpawn"], undefined);
            if (structure != undefined) {
                let err = creep.transfer(structure, RESOURCE_ENERGY);
                if(err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(structure);
                    creep.say(travelToIcons(creep) + _.get(ICONS, structure.structureType, "?"), true);
                }
                else if (err == OK) {
                    creep.say(ICONS["transfer"] + _.get(ICONS, structure.structureType, "?"), true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS["transfer"] + _.get(ICONS, structure.structureType, "?") + "?", true);
                }
            }
            else if (theTerminal != undefined 
                    && theTerminal.energyCapacityFree > 0 
                    && theTerminal.my == true) {
                let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], theTerminal.energyCapacityFree));
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theTerminal);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL] + "?", true);
                }
            }
            else if (creep.memory.roomID == "E1S15" 
                    && theTerminal != undefined 
                    && Memory.TooAngelDealings.isFriendly == false 
                    && terminalEnergy < Memory.TooAngelDealings.totalCost 
                    && theTerminal.my == true) {
                let err = creep.transfer(theTerminal, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], Memory.TooAngelDealings.totalCost - terminalEnergy));
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theTerminal);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL] + "?", true);
                }
            }
            else if (theStorage != undefined 
                    && storageEnergy < Math.min((theStorage.storeCapacity / 2), (theStorage.storeCapacity - _.sum(theStorage.store) + storageEnergy)) 
                    && theStorage.my == true) {
                let err = creep.transfer(theStorage, RESOURCE_ENERGY, Math.min(creep.carry[RESOURCE_ENERGY], Math.min((theStorage.storeCapacity / 2), (theStorage.storeCapacity - _.sum(theStorage.store) + storageEnergy)) - storageEnergy));
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(theStorage);
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                }
                else if (err == OK) {
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                }
                else {
                    incrementConfusedCreepCount(creep);
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE] + "?", true);
                }
            }
            else if (_.get(thePowerSpawn, ["my"], false) == true 
                    && thePowerSpawn.energy < thePowerSpawn.energyCapacity) {
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
            else if (_.get(creep.memory, ["role"], "exporter") != "exporter") {
                if (_.size(Game.constructionSites) > 0 && creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0) {
                    ROLES["builder"].run(creep);
                }
                else {
                    ROLES["upgrader"].run(creep);
                }
            }
        }
    }
};

module.exports = roleHarvester;
