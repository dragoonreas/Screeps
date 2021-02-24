const TOWER_REFILL_THRESHOLD = Math.ceil((TOWER_CAPACITY / TOWER_ENERGY_COST) * 0.9) * TOWER_ENERGY_COST; // Energy required for a tower to do at least 90% of the shots it can do at full energy capacity

// TODO: Make this role (currently just a copy of harvester)
let roleHauler = {
    run: function(creep) {
        creep.memory.executingRole = "hauler";
        
        if (creep.memory.working == false
            && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true
            && creep.carry[RESOURCE_ENERGY] == 0 
            && creep.carryCapacityAvailable > 0) {
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
                && _.get(Game.rooms, [creep.memory.roomID, "energyAvailable"], (creep.room.energyAvailable || SPAWN_ENERGY_CAPACITY)) < _.get(Game.rooms, [creep.memory.roomID, "energyCapacityAvailable"], (creep.room.energyCapacityAvailable || SPAWN_ENERGY_CAPACITY)) 
                && ((theRecycleContainer != undefined 
                        && theRecycleContainer.store[RESOURCE_ENERGY] > 0) 
                    || (theStorage != undefined 
                        && theStorage.store[RESOURCE_ENERGY] > 0) 
                    || (theTerminal != undefined 
                        && theTerminal.store[RESOURCE_ENERGY] > 0)));
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
                    creep.travelTo(RoomPositionFromObject(sourceMem.pos));
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
                        /*"W87N29": [
                            "5873bb7f11e3e4361b4d5f14"
                            , "5873bb6711e3e4361b4d5cc5"
                            , "5873bb9511e3e4361b4d6159"
                        ] 
                        , */"W86N29": [
                            "5873bbc811e3e4361b4d675b"
                            , "5873bbc811e3e4361b4d675c"
                            , "5873bbab11e3e4361b4d6400"
                            , "5873bb9511e3e4361b4d6159"
                            , "5873bb9511e3e4361b4d6157"
                            , "5873bbab11e3e4361b4d63fc"
                        ] 
                        , "W85N23": [
                            "5873bbe111e3e4361b4d6ac4"
                            , "5873bbac11e3e4361b4d6423"
                            , "5873bbc911e3e4361b4d676e"
                            , "5873bbc911e3e4361b4d676f"
                            , "5873bbc911e3e4361b4d6770"
                            , "5873bbac11e3e4361b4d6424"
                            , "5873bbc911e3e4361b4d677e"
                        ]
                        , "W86N43": [
                            /*"5873bb9311e3e4361b4d612d"
                            , "5873bb9311e3e4361b4d612b"
                            , "5873bbc611e3e4361b4d6715"
                            , "5873bbc611e3e4361b4d6713"
                            , "5873bbc611e3e4361b4d6714"
                            , */"5873bbaa11e3e4361b4d63c4"
                        ]
                        , "W91N45": [
                            "58dbc30d8283ff5308a3cf8b" // W92N45
                            , "58dbc3298283ff5308a3d213" // W91N44
                            , "58dbc3288283ff5308a3d20d" // W91N46
                            , "58dbc3288283ff5308a3d20f" // W91N45
                        ]
                        , "W94N49": [
                            /*"58dbc2b78283ff5308a3c5c6" // W95N49
                            , "58dbc2b78283ff5308a3c5c5" // W95N49
                            , "58dbc2d48283ff5308a3c967" // W94N48
                            , "58dbc2f08283ff5308a3cce8" // W93N49
                            , */"58dbc2d48283ff5308a3c95e" // W94N51
                            , "58dbc2f08283ff5308a3cce5" // W93N51
                            , "58dbc2d48283ff5308a3c962" // W94N49
                        ]
                        , "W9N45": [
                            "577b935b0f9d51615fa48078"
                            , "577b935b0f9d51615fa48079"
                            , "577b935d0f9d51615fa480ba"
                            , "577b935b0f9d51615fa48071"
                            , "577b935b0f9d51615fa48074"
                        ]
                        , "W81N29": [
                            "5873bc2811e3e4361b4d7259" // W81N28
                            , "5873bc1011e3e4361b4d7004" // W82N29
                            , "5873bc2711e3e4361b4d7252" // W81N31
                            , "5873bc1011e3e4361b4d6fff" // W82N31
                            , "5873bc1011e3e4361b4d6ffe" // W82N31
                            , "5873bc2711e3e4361b4d7255" // W81N29
                        ]
                        , "W72N28": [
                            "5836b6eb8b8b9619519ef90a" // W72N29
                            , "5836b6eb8b8b9619519ef90c" // W72N29
                            , "5836b6d58b8b9619519ef709" // W73N28
                            , "5836b6eb8b8b9619519ef913" // W72N27
                            , "5836b6eb8b8b9619519ef90e" // W72N28
                        ]
                        , "W64N31": [
                            "57ef9cad86f108ae6e60ca52" // W64N32
                            //, "57ef9cad86f108ae6e60ca50" // W64N32 (may cause blockages)
                            , "57ef9cc386f108ae6e60ccb7" // W63N31
                            //, "57ef9c9886f108ae6e60c7d9" // W65N31 Remote mined by Pimaco
                            , "57ef9cad86f108ae6e60ca54" // W64N31
                        ]
                        , "W55N31": [
                            "579fa8850700be0674d2dc0f" // W56N31
                            , "579fa8a60700be0674d2e07b" // W54N31
                            , "579fa8950700be0674d2de50" // W55N32
                            , "579fa8950700be0674d2de51" // W55N32
                            , "579fa8a60700be0674d2e07c" // W54N31
                            , "579fa8950700be0674d2de53" // W55N31
                        ]
                        , "W53N39": [
                            "579fa8a50700be0674d2e04c" // W54N39
                            , "579fa8a50700be0674d2e04d" // W54N39
                            //, "579fa8b40700be0674d2e283" // W53N38 (owned by Donatzor)
                            //, "579fa8b40700be0674d2e281" // W53N38 (owned by Donatzor)
                            //, "579fa8c50700be0674d2e400" // W52N39 (remote mined by Donatzor)
                            //, "579fa8c50700be0674d2e402" // W52N39 (remote mined by Donatzor)
                            , "579fa8b40700be0674d2e27d" // W53N39
                        ]
                        , "W53N42": [
                            "579fa8c50700be0674d2e3f9" // W52N42
                            , "579fa8b30700be0674d2e273" // W53N43
                            , "579fa8b30700be0674d2e277" // W53N42
                        ]
                        , "W46N41": [
                            "577b92a40f9d51615fa46dc9" // W47N41
                            , "577b92b30f9d51615fa46f1a" // W46N42
                            , "577b92c20f9d51615fa47108" // W45N41
                            , "577b92b30f9d51615fa46f1f" // W46N41
                        ]
                        , "W46N18": [
                            "577b92b60f9d51615fa46f8b" // W46N17
                            , "577b92b60f9d51615fa46f8d" // W46N17
                            , "577b92c50f9d51615fa4716a" // W45N18
                            , "577b92b60f9d51615fa46f84" // W46N19
                            , "577b92b60f9d51615fa46f87" // W46N18
                        ]
                        , "W52N47": [
                            "579fa8d40700be0674d2e574" // W51N47
                            , "579fa8d40700be0674d2e576" // W51N47
                            , "579fa8b30700be0674d2e265" // W53N47
                            , "579fa8c40700be0674d2e3e8" // W52N47
                        ]
                        , "W48N52": [
                            "579fa8e60700be0674d2e701" // W49N52
                            , "579fa8e60700be0674d2e6ff" // W49N52
                            , "579fa8e90700be0674d2e73f" // W48N53
                            , "579fa8e90700be0674d2e746" // W48N51
                            , "579fa8e90700be0674d2e743" // W48N52
                        ]
                        , "W42N51": [
                            "579fa8fa0700be0674d2e966" // W41N51
                            , "579fa8fa0700be0674d2e964" // W41N51
                            , "577b92f70f9d51615fa476fe" // W41N49
                            , "579fa8fe0700be0674d2e9bb" // W39N51
                            , "579fa8f80700be0674d2e929" // W42N51
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
                                        creep.travelTo(RoomPositionFromObject(sourceMem.pos));
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
                            else if (sourceID == "5873bb7f11e3e4361b4d5f14") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(3, 34, "W88N29"));
                                creep.say(travelToIcons(creep) + "W88N29", true);
                                return;
                            }
                            else if (sourceID == "5873bb6711e3e4361b4d5cc5") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(7, 39, "W89N29"));
                                creep.say(travelToIcons(creep) + "W89N29", true);
                                return;
                            }
                            else if (sourceID == "5873bbc811e3e4361b4d675b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(23, 9, "W85N29"));
                                creep.say(travelToIcons(creep) + "W85N29", true);
                                return;
                            }
                            else if (sourceID == "5873bbab11e3e4361b4d6400") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(18, 8, "W86N28"));
                                creep.say(travelToIcons(creep) + "W86N28", true);
                                return;
                            }
                            else if (sourceID == "5873bb9511e3e4361b4d6159") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(13, 25, "W87N29"));
                                creep.say(travelToIcons(creep) + "W87N29", true);
                                return;
                            }
                            else if (sourceID == "5873bbe111e3e4361b4d6ac4") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(3, 3, "W84N23"));
                                creep.say(travelToIcons(creep) + "W84N23", true);
                                return;
                            }
                            else if (sourceID == "5873bbac11e3e4361b4d6423") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(32, 10, "W86N23"));
                                creep.say(travelToIcons(creep) + "W86N23", true);
                                return;
                            }
                            else if (sourceID == "5873bbc911e3e4361b4d676e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 8, "W85N25"));
                                creep.say(travelToIcons(creep) + "W85N25", true);
                                return;
                            }
                            else if (sourceID == "5873bb9411e3e4361b4d6137") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(34, 19, "W87N39"));
                                creep.say(travelToIcons(creep) + "W87N39", true);
                                return;
                            }
                            else if (sourceID == "5873bb7e11e3e4361b4d5ef2") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(35, 4, "W88N39"));
                                creep.say(travelToIcons(creep) + "W88N39", true);
                                return;
                            }
                            else if (sourceID == "5873bbdf11e3e4361b4d6a6f") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(43, 38, "W84N39"));
                                creep.say(travelToIcons(creep) + "W84N39", true);
                                return;
                            }
                            else if (sourceID == "5873bbc711e3e4361b4d672b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(23, 43, "W85N41"));
                                creep.say(travelToIcons(creep) + "W85N41", true);
                                return;
                            }
                            else if (sourceID == "5873bbaa11e3e4361b4d63d2") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(8, 12, "W86N38"));
                                creep.say(travelToIcons(creep) + "W86N38", true);
                                return;
                            }
                            else if (sourceID == "5873bbc711e3e4361b4d672e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(21, 12, "W85N39"));
                                creep.say(travelToIcons(creep) + "W85N39", true);
                                return;
                            }
                            else if (sourceID == "5873bb9311e3e4361b4d612d") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(18, 36, "W87N43"));
                                creep.say(travelToIcons(creep) + "W87N43", true);
                                return;
                            }
                            else if (sourceID == "5873bb9311e3e4361b4d612b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 35, "W87N44"));
                                creep.say(travelToIcons(creep) + "W87N44", true);
                                return;
                            }
                            else if (sourceID == "5873bbc611e3e4361b4d6715") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(17, 41, "W85N45"));
                                creep.say(travelToIcons(creep) + "W85N45", true);
                                return;
                            }
                            else if (sourceID == "5873bb9311e3e4361b4d6128") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(14, 39, "W87N45"));
                                creep.say(travelToIcons(creep) + "W87N45", true);
                                return;
                            }
                            else if (sourceID == "58dbc30d8283ff5308a3cf8b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(16, 21, "W92N45"));
                                creep.say(travelToIcons(creep) + "W92N45", true);
                                return;
                            }
                            else if (sourceID == "58dbc3298283ff5308a3d213") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(46, 11, "W91N44"));
                                creep.say(travelToIcons(creep) + "W91N44", true);
                                return;
                            }
                            else if (sourceID == "58dbc3288283ff5308a3d20d") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(45, 39, "W91N46"));
                                creep.say(travelToIcons(creep) + "W91N46", true);
                                return;
                            }
                            else if (sourceID == "58dbc3288283ff5308a3d20f") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(18, 4, "W91N45"));
                                creep.say(travelToIcons(creep) + "W91N45", true);
                                return;
                            }
                            else if (sourceID == "58dbc2b78283ff5308a3c5c6") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(31, 32, "W95N49"));
                                creep.say(travelToIcons(creep) + "W95N49", true);
                                return;
                            }
                            else if (sourceID == "58dbc2b78283ff5308a3c5c5") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(28, 11, "W95N49"));
                                creep.say(travelToIcons(creep) + "W95N49", true);
                                return;
                            }
                            else if (sourceID == "58dbc2d48283ff5308a3c967") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(15, 38, "W94N48"));
                                creep.say(travelToIcons(creep) + "W94N48", true);
                                return;
                            }
                            else if (sourceID == "58dbc2f08283ff5308a3cce8") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(33, 10, "W93N49"));
                                creep.say(travelToIcons(creep) + "W93N49", true);
                                return;
                            }
                            else if (sourceID == "58dbc2d48283ff5308a3c95e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(17, 7, "W94N51"));
                                creep.say(travelToIcons(creep) + "W94N51", true);
                                return;
                            }
                            else if (sourceID == "58dbc2f08283ff5308a3cce5") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(15, 17, "W93N51"));
                                creep.say(travelToIcons(creep) + "W93N51", true);
                                return;
                            }
                            else if (sourceID == "577b935b0f9d51615fa48078") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(42, 11, "W9N44"));
                                creep.say(travelToIcons(creep) + "W9N44", true);
                                return;
                            }
                            else if (sourceID == "577b935d0f9d51615fa480ba") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(30, 22, "W8N45"));
                                creep.say(travelToIcons(creep) + "W8N45", true);
                                return;
                            }
                            else if (sourceID == "577b935b0f9d51615fa48071") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(8, 14, "W9N46"));
                                creep.say(travelToIcons(creep) + "W9N46", true);
                                return;
                            }
                            else if (sourceID == "5873bc2811e3e4361b4d7259") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(22, 30, "W81N28"));
                                creep.say(travelToIcons(creep) + "W81N28", true);
                                return;
                            }
                            else if (sourceID == "5873bc1011e3e4361b4d7004") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(17, 17, "W82N29"));
                                creep.say(travelToIcons(creep) + "W82N29", true);
                                return;
                            }
                            else if (sourceID == "5873bc2711e3e4361b4d7252") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(18, 22, "W81N31"));
                                creep.say(travelToIcons(creep) + "W81N31", true);
                                return;
                            }
                            else if (sourceID == "5873bc1011e3e4361b4d6fff") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(38, 27, "W82N31"));
                                creep.say(travelToIcons(creep) + "W82N31", true);
                                return;
                            }
                            else if (sourceID == "5836b6eb8b8b9619519ef90a") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(21, 7, "W72N29"));
                                creep.say(travelToIcons(creep) + "W72N29", true);
                                return;
                            }
                            else if (sourceID == "5836b6d58b8b9619519ef709") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(33, 24, "W73N28"));
                                creep.say(travelToIcons(creep) + "W73N28", true);
                                return;
                            }
                            else if (sourceID == "5836b6eb8b8b9619519ef913") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(21, 46, "W72N27"));
                                creep.say(travelToIcons(creep) + "W72N27", true);
                                return;
                            }
                            else if (sourceID == "5836b6eb8b8b9619519ef90e") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(20, 32, "W72N28"));
                                creep.say(travelToIcons(creep) + "W72N28", true);
                                return;
                            }
                            else if (sourceID == "57ef9cad86f108ae6e60ca52") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(19, 38, "W64N32"));
                                creep.say(travelToIcons(creep) + "W64N32", true);
                                return;
                            }
                            else if (sourceID == "57ef9cc386f108ae6e60ccb7") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 8, "W63N31"));
                                creep.say(travelToIcons(creep) + "W63N31", true);
                                return;
                            }
                            else if (sourceID == "57ef9c9886f108ae6e60c7d9") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(26, 42, "W65N31"));
                                creep.say(travelToIcons(creep) + "W65N31", true);
                                return;
                            }
                            else if (sourceID == "57ef9cad86f108ae6e60ca54") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(40, 8, "W64N31"));
                                creep.say(travelToIcons(creep) + "W64N31", true);
                                return;
                            }
                            else if (sourceID == "579fa8850700be0674d2dc0f") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(46, 24, "W56N31"));
                                creep.say(travelToIcons(creep) + "W56N31", true);
                                return;
                            }
                            else if (sourceID == "579fa8a60700be0674d2e07b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(5, 27, "W54N31"));
                                creep.say(travelToIcons(creep) + "W54N31", true);
                                return;
                            }
                            else if (sourceID == "579fa8950700be0674d2de50") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(27, 40, "W55N32"));
                                creep.say(travelToIcons(creep) + "W55N32", true);
                                return;
                            }
                            else if (sourceID == "579fa8950700be0674d2de53") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(33, 6, "W55N31"));
                                creep.say(travelToIcons(creep) + "W55N31", true);
                                return;
                            }
                            else if (sourceID == "579fa8a50700be0674d2e04c") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(17, 38, "W54N39"));
                                creep.say(travelToIcons(creep) + "W54N39", true);
                                return;
                            }
                            else if (sourceID == "579fa8b40700be0674d2e283") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(31, 29, "W53N38"));
                                creep.say(travelToIcons(creep) + "W53N38", true);
                                return;
                            }
                            else if (sourceID == "579fa8c50700be0674d2e400") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(24, 15, "W52N39"));
                                creep.say(travelToIcons(creep) + "W52N39", true);
                                return;
                            }
                            else if (sourceID == "579fa8b40700be0674d2e27d") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(18, 15, "W53N39"));
                                creep.say(travelToIcons(creep) + "W53N39", true);
                                return;
                            }
                            else if (sourceID == "579fa8c50700be0674d2e3f9") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(31, 20, "W52N42"));
                                creep.say(travelToIcons(creep) + "W52N42", true);
                                return;
                            }
                            else if (sourceID == "579fa8b30700be0674d2e273") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(32, 35, "W53N43"));
                                creep.say(travelToIcons(creep) + "W53N43", true);
                                return;
                            }
                            else if (sourceID == "579fa8b30700be0674d2e275") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(23, 4, "W53N42"));
                                creep.say(travelToIcons(creep) + "W53N42", true);
                                return;
                            }
                            else if (sourceID == "577b92a40f9d51615fa46dc9") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(27, 12, "W47N41"));
                                creep.say(travelToIcons(creep) + "W47N41", true);
                                return;
                            }
                            else if (sourceID == "577b92b30f9d51615fa46f1a") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(16, 7, "W46N42"));
                                creep.say(travelToIcons(creep) + "W46N42", true);
                                return;
                            }
                            else if (sourceID == "577b92c20f9d51615fa47108") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(13, 10, "W45N41"));
                                creep.say(travelToIcons(creep) + "W45N41", true);
                                return;
                            }
                            else if (sourceID == "577b92b30f9d51615fa46f1f") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(8, 45, "W46N41"));
                                creep.say(travelToIcons(creep) + "W46N41", true);
                                return;
                            }
                            else if (sourceID == "577b92b60f9d51615fa46f8b") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(19, 5, "W46N17"));
                                creep.say(travelToIcons(creep) + "W46N17", true);
                                return;
                            }
                            else if (sourceID == "577b92c50f9d51615fa4716a") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(39, 6, "W45N18"));
                                creep.say(travelToIcons(creep) + "W45N18", true);
                                return;
                            }
                            else if (sourceID == "577b92b60f9d51615fa46f84") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(30, 7, "W46N19"));
                                creep.say(travelToIcons(creep) + "W46N19", true);
                                return;
                            }
                            else if (sourceID == "577b92b60f9d51615fa46f87") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(38, 23, "W46N18"));
                                creep.say(travelToIcons(creep) + "W46N18", true);
                                return;
                            }
                            else if (sourceID == "579fa8d40700be0674d2e574") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(10, 25, "W51N47"));
                                creep.say(travelToIcons(creep) + "W51N47", true);
                                return;
                            }
                            else if (sourceID == "579fa8d40700be0674d2e576") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(39, 43, "W51N47"));
                                creep.say(travelToIcons(creep) + "W51N47", true);
                                return;
                            }
                            else if (sourceID == "579fa8b30700be0674d2e265") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(40, 34, "W53N47"));
                                creep.say(travelToIcons(creep) + "W53N47", true);
                                return;
                            }
                            else if (sourceID == "579fa8e60700be0674d2e701") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(20, 43, "W49N52"));
                                creep.say(travelToIcons(creep) + "W49N52", true);
                                return;
                            }
                            else if (sourceID == "579fa8e90700be0674d2e73f") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(17, 46, "W48N53"));
                                creep.say(travelToIcons(creep) + "W48N53", true);
                                return;
                            }
                            else if (sourceID == "579fa8e90700be0674d2e746") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(6, 33, "W48N51"));
                                creep.say(travelToIcons(creep) + "W48N51", true);
                                return;
                            }
                            else if (sourceID == "579fa8e90700be0674d2e743") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(28, 19, "W48N52"));
                                creep.say(travelToIcons(creep) + "W48N52", true);
                                return;
                            }
                            else if (sourceID == "579fa8fa0700be0674d2e966") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(10, 45, "W41N51"));
                                creep.say(travelToIcons(creep) + "W41N51", true);
                                return;
                            }
                            else if (sourceID == "577b92f70f9d51615fa476fe") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(14, 5, "W41N49"));
                                creep.say(travelToIcons(creep) + "W41N49", true);
                                return;
                            }
                            else if (sourceID == "579fa8fe0700be0674d2e9bb") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(22, 11, "W39N51"));
                                creep.say(travelToIcons(creep) + "W39N51", true);
                                return;
                            }
                            else if (sourceID == "579fa8f80700be0674d2e929") { // TODO: Remove this after the source has been added to memory
                                creep.memory.sourceID = sourceID;
                                creep.travelTo(new RoomPosition(4, 35, "W42N51"));
                                creep.say(travelToIcons(creep) + "W42N51", true);
                                return;
                            }
                        }
                    }
                }
            }
            
            if (source != undefined 
                && quickFill == false) {
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
            else if (creep.carry[RESOURCE_ENERGY] > 0) {
                creep.memory.working = true;
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
                let structurePos = RoomPositionFromObject(structureMemPos);
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
            else if (creep.memory.roomID == "W86N29" 
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
                    && theStorage.my == true 
                    && _.get(Memory.rooms, [creep.memory.roomID, "isShuttingDown"], false) == false) {
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
            else {
                incrementConfusedCreepCount(creep);
                creep.say("?", true);
            }
        }
    }
};

module.exports = roleHauler;
