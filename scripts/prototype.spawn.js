const DEFAULT_HARVEST_COUNT = 6; // NOTE: Arbitary 'magic number'

/*
    Production seemed to peak with the body size used during controller lvl 3 and subsequently fell off at the new couple of higher levels in E69N44.
    So, use that energy capacity as the GENERAL_WORKER_ENERGY_CAP: 
    CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][3] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][3] * EXTENSION_ENERGY_CAPACITY[3] 
    = 1*300 + 10*50 
    = 800
*/
//const GENERAL_WORKER_RCL_SCALING_CAP = 3;
//const GENERAL_WORKER_ENERGY_CAP = CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][GENERAL_WORKER_RCL_SCALING_CAP] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][GENERAL_WORKER_RCL_SCALING_CAP] * EXTENSION_ENERGY_CAPACITY[GENERAL_WORKER_RCL_SCALING_CAP];

const MINER_WORK_PART_CAP = ((SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME) / HARVEST_POWER) + 1; // +1 so there's some down time to repair it's container

/*
    The upgraders were using almost all the energy in their dedicated source almost right as it refreshed with the body size used during controller lvl 5 in E69N44.
    So, use that energy capacity as the UPGRADER_ENERGY_CAP: 
    CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][5] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][5] * EXTENSION_ENERGY_CAPACITY[5] 
    = 1*300 + 30*50 
    = 1800
    TODO: Find a better metric to base upgrader size off, like room energy income and/or storage energy reserves
*/
const UPGRADER_RCL_SCALING_CAP = 5;
const UPGRADER_ENERGY_CAP = CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][UPGRADER_RCL_SCALING_CAP] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][UPGRADER_RCL_SCALING_CAP] * EXTENSION_ENERGY_CAPACITY[UPGRADER_RCL_SCALING_CAP];

const DEMOLISHER_WORK_TO_CARRY_RATIO = _.ceil(1 / (DISMANTLE_POWER * DISMANTLE_COST));

const RESERVE_CLAIM_PART_CAP = 2; // TODO: Look into scaling this with RCL
const ATTACK_CLAIM_PART_MULTIPLIER = 5;

let prototypeSpawn = function() {
    StructureSpawn.prototype.createCustomCreep = function(roleName) {
        
        let creepMemory = {
            spawnID: this.name
            , roomID: this.room.name
            , role: roleName
            , executingRole: "spawn"
            , working: false // TODO: Only apply the working property to creeps with carry parts
        };
        
        if (roleName == "miner") {
            creepMemory.mining = false;
        }
        else if (roleName == "repairer") {
            for (let repairerType in Memory.rooms[this.room.name].repairerTypeMins) {
                if (Memory.rooms[this.room.name].repairerTypeCounts[repairerType] < Memory.rooms[this.room.name].repairerTypeMins[repairerType] 
                    || repairerType == "all") {
                    creepMemory.repairerType = repairerType;
                    break;
                }
            }
        }
        else if (roleName == "adaptable") {
            creepMemory.roomSentFrom = this.room.name;
            // TODO: Update when bootstrapping network is reconfigured
            /*if (this.room.name == "W87N29") {
                if (Memory.rooms.W86N29.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N29";
                }
                else if (Memory.rooms.W85N23.creepCounts.builder == 0 && Memory.rooms.W85N23.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N23";
                }
                else if (Memory.rooms.W85N38.creepCounts.builder == 0 && Memory.rooms.W85N38.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N38";
                }
            }
            else */if (this.room.name == "W86N29") {
                /*if (Memory.rooms.W87N29.creepCounts.builder == 0 && Memory.rooms.W87N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W87N29";
                }
                else */if (Memory.rooms.W85N23.creepCounts.builder == 0 && Memory.rooms.W85N23.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N23";
                }
                /*else if (Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N39.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N39";
                }*/
                /*else if (Memory.rooms.W81N29.creepCounts.builder == 0 && Memory.rooms.W81N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W81N29";
                }*/
                /*else if (Memory.rooms.W72N28.creepCounts.builder == 0 && Memory.rooms.W72N28.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W72N28";
                }*/
                else if (Memory.rooms.W64N31.creepCounts.builder == 0 && Memory.rooms.W64N31.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W64N31";
                }
            }
            else if (this.room.name == "W85N23") {
                /*if (Memory.rooms.W87N29.creepCounts.builder == 0 && Memory.rooms.W87N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W87N29";
                }
                else */if (Memory.rooms.W86N29.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N29";
                }
            }
            else if (this.room.name == "W86N39") {
                /*if (Memory.rooms.W86N43.creepCounts.builder == 0 && Memory.rooms.W86N43.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N43";
                }
                else if (Memory.rooms.W91N45.creepCounts.builder == 0 && Memory.rooms.W91N45.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W91N45";
                }
                else if (Memory.rooms.W94N49.creepCounts.builder == 0 && Memory.rooms.W94N49.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W94N49";
                }
                else */if (Memory.rooms.W85N38.creepCounts.builder == 0 && Memory.rooms.W85N38.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N38";
                }
                /*else if (Memory.rooms.W87N29.creepCounts.builder == 0 && Memory.rooms.W87N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W87N29";
                }*/
            }
            else if (this.room.name == "W85N38") {
                /*if (Memory.rooms.W86N43.creepCounts.builder == 0 && Memory.rooms.W86N43.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N43";
                }
                else if (Memory.rooms.W91N45.creepCounts.builder == 0 && Memory.rooms.W91N45.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W91N45";
                }
                else if (Memory.rooms.W94N49.creepCounts.builder == 0 && Memory.rooms.W94N49.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W94N49";
                }
                else */if (Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N39";
                }
                /*else if (Memory.rooms.W86N29.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N29";
                }*/
            }
            else if (this.room.name == "W86N43") {
                if (Memory.rooms.W86N43.creepCounts.builder == 0 && Memory.rooms.W86N43.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N43";
                }
                /*else if (Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N39";
                }
                else if (Memory.rooms.W85N38.creepCounts.builder == 0 && Memory.rooms.W85N38.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N38";
                }*/
            }
            else if (this.room.name == "W9N45") {
                if (Memory.rooms.W9N45.creepCounts.builder == 0 && Memory.rooms.W9N45.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W9N45";
                }
            }
            else if (this.room.name == "W64N31") {
                /*if (Memory.rooms.W55N31.creepCounts.builder == 0 && Memory.rooms.W55N31.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W55N31";
                }
                else */if (Memory.rooms.W53N39.creepCounts.builder == 0 && Memory.rooms.W53N39.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W53N39";
                }
            }
            else if (this.room.name == "W53N39") {
                /*if (Memory.rooms.W53N42.creepCounts.builder == 0 && Memory.rooms.W53N42.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W53N42";
                }
                else */if (Memory.rooms.W52N47.creepCounts.builder == 0 && Memory.rooms.W52N47.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W52N47";
                }
            }/*
            else if (this.room.name == "W52N47") {
                if (Memory.rooms.W48N52.creepCounts.builder == 0 && Memory.rooms.W48N52.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W48N52";
                }
                else if (Memory.rooms.W42N51.creepCounts.builder == 0 && Memory.rooms.W42N51.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W42N51";
                }
            }*/
        }
        else if (roleName == "exporter") {
            switch (this.room.name) {
                case "W86N39":
                    creepMemory.roomSentFrom = "W91N42";
                    creepMemory.roomSentTo = "W85N38";
                    break;
                case "W9N45":
                    creepMemory.roomSentFrom = "W8N47";
                    break;
                case "W64N31":
                    creepMemory.roomSentFrom = "W67N25";
                    break;
                case "W53N39":
                    creepMemory.roomSentFrom = "W53N38";
                    break;
                case "W52N47":
                    creepMemory.roomSentFrom = "W48N42";
                    creepMemory.roomSentTo = "W53N39";
                    break;
            }
            _.defaults(creepMemory, {
                roomSentFrom: this.room.name
                , roomSentTo: this.room.name
            });
        }
        else if (roleName == "demolisher") {
            switch (this.room.name) {
                case "W86N29": 
                    creepMemory.roomSentTo = "W81N29";
                    break;
                case "W86N39": 
                    creepMemory.roomSentTo = "W87N39";
                    break;
                case "W9N45": 
                    creepMemory.roomSentTo = "W8N47";
                    creepMemory.demolishStructure = { id: "579677e0ef9178212bc1d9a5" };
                    break;
                case "W53N39": 
                    creepMemory.roomSentTo = "W48N42";
                    break;
                case "W52N47": 
                    creepMemory.roomSentTo = "W48N42";
                    break;
                default: 
                    creepMemory.roomSentTo = _.get(Memory.rooms, [this.room.name, "harvestRooms", 0], undefined);
                    if (_.isString(creepMemory.roomSentTo) == false) { creepMemory.roomSentTo = undefined; }
                    break;
            }
        }
        else if (roleName == "claimer") {
            /*if (this.room.name == "W87N29") {
                creepMemory.controllerID = "5873bb7f11e3e4361b4d5f13"; // harvest room
            }
            else */if (this.room.name == "W86N29") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "5873bbab11e3e4361b4d6401"; // harvest room
                }
                else {
                    creepMemory.controllerID = "5873bc2711e3e4361b4d7257";
                }
            }
            else if (this.room.name == "W85N23") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "5873bbe111e3e4361b4d6ac5"; // harvest room
                }
                else {
                    creepMemory.controllerID = "5873bccb11e3e4361b4d8313";
                }
            }
            else if (this.room.name == "W86N39") {
                creepMemory.controllerID = "5873bb9411e3e4361b4d6139"; // harvest room
            }
            else if (this.room.name == "W85N38") {
                creepMemory.controllerID = "5873bbaa11e3e4361b4d63d1"; // harvest room
            }
            else if (this.room.name == "W86N43") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "5873bb9311e3e4361b4d612e"; // harvest room
                }
                else {
                    //creepMemory.controllerID = "577b935b0f9d51615fa48076";
                    creepMemory.controllerID = "58dbc3288283ff5308a3d211";
                }
            }
            else if (this.room.name == "W91N45") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "58dbc30d8283ff5308a3cf8c"; // harvest room
                }
                else {
                    creepMemory.controllerID = "58dbc2d48283ff5308a3c963";
                }
            }
            else if (this.room.name == "W94N49") {
                creepMemory.controllerID = "58dbc2b78283ff5308a3c5c4"; // harvest room
            }
            else if (this.room.name == "W9N45") {
                creepMemory.controllerID = "577b935b0f9d51615fa4807a"; // harvest room
            }
            else if (this.room.name == "W81N29") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "5873bc2811e3e4361b4d725a"; // harvest room
                }
                else {
                    creepMemory.controllerID = "5836b6eb8b8b9619519ef910";
                }
            }
            else if (this.room.name == "W72N28") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "5836b6eb8b8b9619519ef90b"; // harvest room
                }
                else {
                    creepMemory.controllerID = "57ef9cad86f108ae6e60ca55";
                }
            }
            else if (this.room.name == "W64N31") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "57ef9cad86f108ae6e60ca51"; // harvest room
                }
                else {
                    creepMemory.controllerID = "579fa8950700be0674d2de54";
                }
            }
            else if (this.room.name == "W55N31") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "579fa8850700be0674d2dc0e"; // harvest room
                }
                else {
                    creepMemory.controllerID = "579fa8b40700be0674d2e27f";
                }
            }
            else if (this.room.name == "W53N39") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "579fa8a50700be0674d2e04b"; // harvest room
                }
                else {
                    creepMemory.controllerID = "579fa8b30700be0674d2e276";
                }
            }
            else if (this.room.name == "W53N42") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "579fa8b40700be0674d2e27a"; // harvest room
                }
                else {
                    creepMemory.controllerID = "579fa8c40700be0674d2e3e9";
                }
            }
            else if (this.room.name == "W52N47") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "579fa8d40700be0674d2e575"; // harvest room
                }
                else {
                    creepMemory.controllerID = "579fa8e90700be0674d2e742";
                }
            }
            else if (this.room.name == "W48N52") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "579fa8e60700be0674d2e700"; // harvest room
                }
                else {
                    creepMemory.controllerID = "579fa8f80700be0674d2e928";
                }
            }
            else if (this.room.name == "W42N51") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "579fa8fa0700be0674d2e965"; // harvest room
                }
            }
            let controllerRoom = _.get(Memory.controllers, [creepMemory.controllerID, "pos", "roomName"], "");
            if (_.includes(_.get(Memory.rooms, [this.room.name, "harvestRooms"], []), controllerRoom) == true && Game.time < _.get(Memory.rooms, [controllerRoom, "avoidTravelUntil"], 0)) {
                return -10.5; // NOTE: Fake error for when a claimer would just die to an invader in the room they're going to reserve
            }
        }
        else if (roleName == "powerHarvester") {
            creepMemory.harvestRoom = { id: this.room.name, x: 25, y: 25 }; // TODO: Populate this automatically
        }
        
        let energyAvaliable = this.room.energyCapacityAvailable;
        if ((Memory.rooms[this.room.name].creepCounts.harvester / Memory.rooms[this.room.name].creepMins.harvester) < 0.5) { // TODO: Allow harvesters to scale gradually instead of jump between lowest to maximum scale
            energyAvaliable = _.max([this.room.energyAvailable, SPAWN_ENERGY_CAPACITY]); // start small if forced to build up from scratch
        }
        
        creepMemory.energyAvaliableOnSpawn = energyAvaliable;
        
        /*
            The move ratio is the ratio of move parts to the total of all the other types of parts in the body of the creep.
            It should only need to be set to one of the following values:
            5.0: To maintain a speed of 1 per tick over swamp terrain
            1.0: To maintain a speed of 1 per tick over plain terrain
            0.5: To maintain a speed of 1 per tick over roads
            0.0: To maintain the slowest speed, using only a single move part
        */
        let moveRatio = 1;
        
        /*
            The body template describes the smallest version of the body the creep will have, minus move & non-scaling parts
            Move parts are placed at set intervals behind all other parts to maintain a constant speed based on the speedRatio
            Tough parts are always placed infront non-move parts
            All other parts are placed in the order of the first occurance of that part
            All parts are added in ratios relative to the rest of the parts that appear in the body template
        */
        let bodyTemplate = [WORK, CARRY];
        if (roleName == "attacker") {
            moveRatio = 0.5;
            bodyTemplate = [ATTACK];
        }
        else if (roleName == "hauler" || roleName == "exporter") {
            bodyTemplate = [CARRY]; // haulers also have a single work part that doesn't get multiplied dynamically with avaliable energy
        }
        else if (roleName == "miner") {
            moveRatio = 0.5; // Only care about moving the work parts since the carry will be empty on the trip to the source
            bodyTemplate = [WORK]; // miners also have a single carry part that doesn't get multiplied dynamically with avaliable energy
        }
        else if (roleName == "powerHarvester") {
            bodyTemplate = [CARRY, ATTACK, HEAL];
        }
        else if (roleName == "upgrader") {
            if (this.room.name == "W86N39"
                || this.room.name == "W85N38" 
                || this.room.name == "W94N49" 
                || this.room.name == "W9N45" 
                || this.room.name == "W72N28" 
                || this.room.name == "W64N31" 
                || this.room.name == "W55N31" 
                || this.room.name == "W53N39" 
                || this.room.name == "W53N42" 
                || this.room.name == "W52N47" 
                || this.room.name == "W48N52"
                || this.room.name == "W42N51") { // these rooms have a source in range of the controller
                moveRatio = 0;
                bodyTemplate = [WORK]; // these upgraders also have at least one carry part that gets multiplied dynamically with avaliable energy later
            }
            else if (this.room.controller.level > 3 && _.size(this.room.sources) > 1) { // NOTE: Assumes roads built between the dedicated upgrader source (2 source rooms only) and the controller at RCL 4 onwards
                moveRatio = 0.5;
            }
        }
        else if (roleName == "scout") {
            //bodyTemplate = []; // moveRatio is set automatically when an empty body template is used, so no use setting it here
            bodyTemplate = [TOUGH]; // since scouts are mainly used for claimer test runs, use a tough piece to stand in for the extra weight of the claim piece
        }
        else if (roleName == "demolisher") {
            let minHarvestingDemolisherCost = (DEMOLISHER_WORK_TO_CARRY_RATIO * BODYPART_COST[WORK]) + BODYPART_COST[CARRY] + (Math.ceil((DEMOLISHER_WORK_TO_CARRY_RATIO + 1) * moveRatio) * BODYPART_COST[MOVE]);
            if (minHarvestingDemolisherCost <= energyAvaliable 
                && creepMemory.roomSentTo != "W8N47" 
                && creepMemory.roomSentTo != "W48N42") {
                bodyTemplate = _.fill(Array(DEMOLISHER_WORK_TO_CARRY_RATIO), WORK);
                bodyTemplate.push(CARRY);
            }
            else {
                bodyTemplate = [WORK];
            }
        }
        else if (roleName == "claimer") {
            bodyTemplate = [CLAIM];
        }
        // TODO: SK Miner (10W 2C 14M 10RA 8H, eg: E64N36 - o4kapuk)
        
        if (bodyTemplate.length == 0) {
            moveRatio = 5; // since only using move parts will allow movement each tick no matter the terrain the moveRatio is automatically set to 5, mainly to ensure that the moveRatio == 0 sections aren't run accidently
            bodyTemplate = [MOVE];
        }
        else if (moveRatio > 0) {
            let bodyTemplatePartCount = bodyTemplate.length;
            if (roleName == "hauler") {
                bodyTemplatePartCount += 1; // accounts for the single work part haulers have that doesn't get multiplied dynamically with avaliable energy
            } // don't need to account for the extra carry on the miner since it'll be empty the only time it moves
            bodyTemplate.push(_.fill(Array(Math.ceil((bodyTemplatePartCount * moveRatio))), MOVE));
            bodyTemplate = _.flattenDeep(bodyTemplate);
        }
        
        let bodyCost = _.sum(bodyTemplate, (bp) => (BODYPART_COST[bp]));
        
        if (moveRatio == 0) {
            energyAvaliable -= BODYPART_COST[MOVE]; // when move ratio is 0, remove energy from the total avaliable to account for the 1 mandatory move part that will be added that's not included in the body cost
        }
        if (roleName == "hauler") {
            energyAvaliable -= BODYPART_COST[WORK]; // accounts for the single work part haulers have that doesn't get multiplied dynamically with avaliable energy
        }
        else if (roleName == "miner") {
            energyAvaliable -= BODYPART_COST[CARRY]; // accounts for the single carry part miners have that doesn't get multiplied dynamically with avaliable energy
        }
        
        let bodyPartCounts = _.countBy(bodyTemplate);
        
        /*
            Base general worker size off capacity to fill 3 extentions from a single haul
            NOTES:  [WORK,CARRY,MOVE,MOVE] has 50 carry & costs 250, so carry*5=cost
            RCL     Room.energyCapacityAvaliable    Creep.carryCapacity energyToSpawn   totalNumberOfParts
            1-6:      300-2300          ( 50/50)*3= 150*5=               750/5/50*4=    12
            7:       5600               (100/50)*3= 300*5=              1500/5/50*4=    24
            1-6:    12900               (200/50)*3= 600*5=              3000/5/50*4=    48
        */
        //const GENERAL_WORKER_CARRY_PART_CAP = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] / CARRY_CAPACITY) * 3;
        /*
            Alternative equation for this part cap to try that scales more smoothly with RCL:
            Creep.carryCapacity = ceil(Room.energyCapacityAvaliable / defaultHarvesterCount / (curentExtentionCapacity / rcl1ExtentionCapacity) / CARRY_CAPACITY) * CARRY_CAPACITY
            RCL                 Room.energyCapacityAvaliable    Creep.carryCapacity energyToSpawn   totalNumOfParts
            1:  1*300+ 0* 50=     300/6/( 50/50)=   50           50*5=               250/5/50*4=     4
            2:  1*300+ 5* 50=     550/6/( 50/50)=   91          100*5=               500/5/50*4=     8
            3:  1*300+10* 50=     800/6/( 50/50)=   133         150*5=               750/5/50*4=    12
            4:  1*300+20* 50=    1300/6/( 50/50)=   216         250*5=              1250/5/50*4=    20
            5:  1*300+30* 50=    1800/6/( 50/50)=   300         300*5=              1500/5/50*4=    24
            6:  1*300+40* 50=    2300/6/( 50/50)=   383         400*5=              2000/5/50*4=    32
            7:  2*300+50*100=    5600/6/(100/50)=   466         500*5=              2500/5/50*4=    40
            8:  3*300+60*200=   12900/6/(200/50)=   537         550*5=              2750/5/50*4=	44
        */
        const GENERAL_WORKER_CARRY_PART_CAP = Math.ceil(this.room.energyCapacityAvailable / DEFAULT_HARVEST_COUNT / (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] / EXTENSION_ENERGY_CAPACITY[1]) / CARRY_CAPACITY);
        
        let slowUpgraderCarryCount = 1; // Used for upgraders with moveRatio == 0
        
        let partMultiplier = Math.min(Math.floor(energyAvaliable / bodyCost), GENERAL_WORKER_CARRY_PART_CAP);
        if (roleName == "miner") {
            partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * MINER_WORK_PART_CAP) / bodyCost);
        }
        else if (roleName == "rockhound" 
            || roleName == "exporter" 
            || roleName == "adaptable" 
            || roleName == "demolisher" 
            || roleName == "attacker" 
            || roleName == "powerHarvester") {
            partMultiplier = Math.floor(energyAvaliable / bodyCost); // go all out if we're under attack, going after a power bank or doing some ad-hoc stuff
        }
        else if (roleName == "upgrader") {
            if (moveRatio == 0) {
                /*const TOTAL_CARRY = (bodyPartCounts[CARRY] || 1) * CARRY_CAPACITY;
                const TICKS_TO_FILL = TOTAL_CARRY / ((bodyPartCounts[WORK] || 1) * HARVEST_POWER);
                const TICKS_TO_UPGRADE = TOTAL_CARRY / ((bodyPartCounts[WORK] || 1) * UPGRADE_CONTROLLER_POWER);
                const TOTAL_UPGRADER_PARTS_REQUIRED = ((SOURCE_ENERGY_CAPACITY / TOTAL_CARRY) * (TICKS_TO_FILL + TICKS_TO_UPGRADE)) / ENERGY_REGEN_TIME;
                const UPGRADER_PART_MULTIPLIER_CAP = Math.ceil(TOTAL_UPGRADER_PARTS_REQUIRED / (_.get(Memory.rooms, [this.room.name, "creepMins", "upgrader"], 1) || 1));
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * UPGRADER_PART_MULTIPLIER_CAP) / bodyCost); // NOTE: Still useful for rooms where controller is 4 tiles away from the source instead of 3*/
                const TOTAL_UPGRADER_WORK_PARTS_REQUIRED = Math.ceil((SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME) / Math.min(HARVEST_POWER, UPGRADE_CONTROLLER_POWER));
                const UPGRADER_WORK_PART_CAP = Math.ceil(TOTAL_UPGRADER_WORK_PARTS_REQUIRED / (_.get(Memory.rooms, [this.room.name, "creepMins", "upgrader"], 1) || 1));
                // TODO: Figure out max needed carry capacity using constants
                energyAvaliable -= (BODYPART_COST[CARRY] * slowUpgraderCarryCount);
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * UPGRADER_WORK_PART_CAP) / bodyCost);
            }
            else {
                partMultiplier = Math.floor(Math.min(energyAvaliable, UPGRADER_ENERGY_CAP) / bodyCost);
            }
        }
        else if (roleName == "claimer" 
            && _.get(Memory.rooms[this.room.name], "harvestRooms", undefined) != undefined 
            && _.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) {
            let claimPartMulitplier = RESERVE_CLAIM_PART_CAP;
            if (_.get(Memory.controllers, [creepMemory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" || _.get(Memory.controllers, [creepMemory.controllerID, "reservation", "owner"], "dragoonreas") != "dragoonreas") {
                if (energyAvaliable < bodyCost * ATTACK_CLAIM_PART_MULTIPLIER) {
                    return -6.5; // NOTE: Fake error for if spawn can't scale this creep to the rooms energy capacity
                }
                partMultiplier = Math.floor((bodyCost * ATTACK_CLAIM_PART_MULTIPLIER) / bodyCost); // rooms using other rooms to harvest send out claimers to take back those harvest rooms and need five claim parts to attack an enemy controller before it can start reserving it again
            }
            else {
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * RESERVE_CLAIM_PART_CAP) / bodyCost); // rooms using other rooms to harvest send out claimers to reserve those harvest rooms and need up to two claim parts to keep the room reservation up
            }
            
        }
        else if (roleName == "scout" 
            || roleName =="claimer") {
            partMultiplier = 1; // for creeps that don't scale with energy avaliable
        }
        
        // can't use MAX_CREEP_SIZE directly as we need to account for parts not included in the bodyTemplate
        let maxCreepSize = MAX_CREEP_SIZE;
        if (moveRatio == 0) {
            --maxCreepSize;
            if (roleName == "upgrader") {
                maxCreepSize -= slowUpgraderCarryCount;
            }
        }
        if (roleName == "hauler" 
            || roleName == "miner") {
            --maxCreepSize;
        }
        partMultiplier = Math.min(partMultiplier, Math.floor(maxCreepSize / ((bodyTemplate.length > 0) ? bodyTemplate.length : 1))); // make sure we only don't try and make a creep with more than 50 body parts
        
        let body = [];
        body.push(_.fill(Array(partMultiplier * (bodyPartCounts[TOUGH] || 0)), TOUGH)); // add any tough parts first
        
        // add any remaining (non-move & non-heal) parts in the order they first occured
        if (roleName == "hauler") {
            body.push(WORK);
        }
        for (let bodyPart in bodyPartCounts) {
            if (bodyPart != TOUGH && bodyPart != MOVE && bodyPart != HEAL) {
                body.push(_.fill(Array(partMultiplier * bodyPartCounts[bodyPart]), bodyPart));
            }
        }
        if (roleName == "miner") {
            body.push(CARRY);
        }
        else if (roleName == "upgrader" 
            && moveRatio == 0) {
            body.push(_.fill(Array(slowUpgraderCarryCount), CARRY));
        }
        
        // Add the move part(s)
        if (moveRatio == 0) {
            body.push(MOVE);
            bodyPartCounts[MOVE] = 1;
        }
        else if (bodyPartCounts[MOVE] == bodyTemplate.length) {
            body = _.fill(Array(bodyTemplate.length * partMultiplier), MOVE);
        }
        else {
            body = _.flattenDeep(body);
            body.push(_.fill(Array(Math.ceil((body.length + partMultiplier * (bodyPartCounts[HEAL] || 0)) * moveRatio)), MOVE));
        }
        
        body.push(_.fill(Array(partMultiplier * (bodyPartCounts[HEAL] || 0)), HEAL)); // add any heal parts last
        
        body = _.flattenDeep(body);
        
        if (body.length < 1) {
            return -6.5; // NOTE: Fake error for if spawn can't scale this creep to the rooms energy capacity
        }
        
        bodyPartCounts = _.countBy(body);
        
        creepMemory.spawnTick = Game.time + (body.length * CREEP_SPAWN_TIME) - 1 // -1 because it uses the last tick to leave the spawn
        
		// Worst case (full carry parts) ticks per movement when transversing roads (1), plain terrain (2), or swamp terrain (10)
        creepMemory.speeds = {
            ["1"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["2"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["10"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
        };
        
        let result = this.createCreep(body, undefined, creepMemory); // TODO: Work out a custom naming scheme
        
        if (_.isString(result) == true) {
            ++Memory.rooms[creepMemory.roomID].creepCounts[creepMemory.role];
            
            if (roleName == "repairer") {
                ++Memory.rooms[creepMemory.roomID].repairerTypeCounts[creepMemory.repairerType];
            }
        }
        
        return result;
    };
};

module.exports = prototypeSpawn;
