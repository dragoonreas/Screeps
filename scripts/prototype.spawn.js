const ONE_MOVE_RATIO = 1 / MAX_CREEP_SIZE;

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

// const RESERVE_CLAIM_PART_CAP = INVADER_CORE_CONTROLLER_POWER * CONTROLLER_RESERVE + 2 * CONTROLLER_RESERVE;
const RESERVE_CLAIM_PART_CAP = 2; // TODO: Look into scaling this with RCL

// Taken from: https://github.com/screeps/engine/blob/master/src/game/names.js
const MALE_NAMES = [ 'Jackson', 'Aiden', 'Liam', 'Lucas', 'Noah', 'Mason', 'Jayden', 'Ethan', 'Jacob', 'Jack', 'Caden', 'Logan', 'Benjamin', 'Michael', 'Caleb', 'Ryan', 'Alexander', 'Elijah', 'James', 'William', 'Oliver', 'Connor', 'Matthew', 'Daniel', 'Luke', 'Brayden', 'Jayce', 'Henry', 'Carter', 'Dylan', 'Gabriel', 'Joshua', 'Nicholas', 'Isaac', 'Owen', 'Nathan', 'Grayson', 'Eli', 'Landon', 'Andrew', 'Max', 'Samuel', 'Gavin', 'Wyatt', 'Christian', 'Hunter', 'Cameron', 'Evan', 'Charlie', 'David', 'Sebastian', 'Joseph', 'Dominic', 'Anthony', 'Colton', 'John', 'Tyler', 'Zachary', 'Thomas', 'Julian', 'Levi', 'Adam', 'Isaiah', 'Alex', 'Aaron', 'Parker', 'Cooper', 'Miles', 'Chase', 'Muhammad', 'Christopher', 'Blake', 'Austin', 'Jordan', 'Leo', 'Jonathan', 'Adrian', 'Colin', 'Hudson', 'Ian', 'Xavier', 'Camden', 'Tristan', 'Carson', 'Jason', 'Nolan', 'Riley', 'Lincoln', 'Brody', 'Bentley', 'Nathaniel', 'Josiah', 'Declan', 'Jake', 'Asher', 'Jeremiah', 'Cole', 'Mateo', 'Micah', 'Elliot' ];
const FEMALE_NAMES = [ 'Sophia', 'Emma', 'Olivia', 'Isabella', 'Mia', 'Ava', 'Lily', 'Zoe', 'Emily', 'Chloe', 'Layla', 'Madison', 'Madelyn', 'Abigail', 'Aubrey', 'Charlotte', 'Amelia', 'Ella', 'Kaylee', 'Avery', 'Aaliyah', 'Hailey', 'Hannah', 'Addison', 'Riley', 'Harper', 'Aria', 'Arianna', 'Mackenzie', 'Lila', 'Evelyn', 'Adalyn', 'Grace', 'Brooklyn', 'Ellie', 'Anna', 'Kaitlyn', 'Isabelle', 'Sophie', 'Scarlett', 'Natalie', 'Leah', 'Sarah', 'Nora', 'Mila', 'Elizabeth', 'Lillian', 'Kylie', 'Audrey', 'Lucy', 'Maya', 'Annabelle', 'Makayla', 'Gabriella', 'Elena', 'Victoria', 'Claire', 'Savannah', 'Peyton', 'Maria', 'Alaina', 'Kennedy', 'Stella', 'Liliana', 'Allison', 'Samantha', 'Keira', 'Alyssa', 'Reagan', 'Molly', 'Alexandra', 'Violet', 'Charlie', 'Julia', 'Sadie', 'Ruby', 'Eva', 'Alice', 'Eliana', 'Taylor', 'Callie', 'Penelope', 'Camilla', 'Bailey', 'Kaelyn', 'Alexis', 'Kayla', 'Katherine', 'Sydney', 'Lauren', 'Jasmine', 'London', 'Bella', 'Adeline', 'Caroline', 'Vivian', 'Juliana', 'Gianna', 'Skyler', 'Jordyn' ];

let prototypeSpawn = function() {
    StructureSpawn.prototype.spawnCustomCreep = function(roleName) {
        
        let options = {};
        options.memory = {
            spawnID: this.name
            , roomID: this.room.name
            , role: roleName
            , executingRole: "spawn"
            , working: false // TODO: Only apply the working property to creeps with carry parts
        };
        
        let needsHeal = false; // Flag that the creep needs a single heal part added (mainly used where it's not viable for the creep to return home for repairs from towers)
        
        if (roleName == "miner") {
            options.memory.mining = false;
        }
        else if (roleName == "repairer") {
            for (let repairerType in Memory.rooms[this.room.name].repairerTypeMins) {
                if (Memory.rooms[this.room.name].repairerTypeCounts[repairerType] < Memory.rooms[this.room.name].repairerTypeMins[repairerType] 
                    || repairerType == "all") {
                    options.memory.repairerType = repairerType;
                    break;
                }
            }
        }
        else if (roleName == "adaptable") {
            options.memory.roomSentFrom = this.room.name;
            // TODO: Update when bootstrapping network is reconfigured
            if (this.room.name == "E11S18") {
                if (_.get(Memory.rooms, ["E11S18", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E11S18", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E11S18";
                }
                else if (_.get(Memory.rooms, ["E15S13", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E15S13", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E15S13";
                }
                else if (_.get(Memory.rooms, ["E12S12", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E12S12", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E12S12";
                }
            }
            else if (this.room.name == "E15S13") {
                if (_.get(Memory.rooms, ["E15S13", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E15S13", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E15S13";
                }
                else if (_.get(Memory.rooms, ["E11S18", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E11S18", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E11S18";
                }
                else if (_.get(Memory.rooms, ["E12S12", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E12S12", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E12S12";
                }
            }
            else if (this.room.name == "E12S12") {
                if (_.get(Memory.rooms, ["E12S12", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E12S12", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E12S12";
                }
                else if (_.get(Memory.rooms, ["E11S18", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E11S18", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E11S18";
                }
                else if (_.get(Memory.rooms, ["E15S13", "creepCounts", "builder"], -1) == 0 
                    && _.get(Memory.rooms, ["E15S13", "creepCounts", "adaptable"], -1) == 0) {
                    options.memory.roomSentTo = "E15S13";
                }
            }
            if (Game.map.getRoomLinearDistance(this.room.name, _.get(options.memory, "roomSentTo", this.room.name)) > 1) {
                needsHeal = true;
            }
        }
        else if (roleName == "exporter") {
            options.memory.roomSentFrom = _.get(this.room.nextExporter, "from", this.room.name);
            options.memory.roomSentTo = _.get(this.room.nextExporter, "to", this.room.name);
            options.memory.type = _.get(this.room.nextExporter, "type", "E");
            if (Game.map.getRoomLinearDistance(this.room.name, _.get(options.memory, "roomSentFrom", this.room.name)) > 1
                || Game.map.getRoomLinearDistance(_.get(options.memory, "roomSentFrom", this.room.name), _.get(options.memory, "roomSentTo", this.room.name)) > 1) {
                needsHeal = true;
            }
            if (Game.time < _.get(Memory.rooms, [options.memory.roomSentFrom, "avoidTravelUntil"], 0)) {
                return -10.1; // NOTE: Fake error for when an exporter would just die to a hostile in the room they're going to export from
            }
            if (options.memory.type != "E" 
                && _.get(Game.rooms, [options.memory.roomSentFrom, "ownedSymbols", options.memory.type], 0) <= 0) {
                return -10.2; // NOTE: Fake error for when there is no symbols for the exporter to export
            }
        }
        else if (roleName == "demolisher") {
            options.memory.roomSentTo = _.get(this.room.nextDemolisher, "to", _.get(Memory.rooms, [this.room.name, "harvestRooms", 0], undefined));
            options.memory.demolishStructure = _.get(this.room.nextDemolisher, "target", undefined);
            if (Game.map.getRoomLinearDistance(this.room.name, _.get(options.memory, "roomSentTo", this.room.name)) > 1) {
                needsHeal = true;
            }
            if (Game.time < _.get(Memory.rooms, [options.memory.roomSentTo, "avoidTravelUntil"], 0)) {
                return -10.1; // NOTE: Fake error for when a demolisher would just die to a hostile in the room they're going to demolish
            }
        }
        else if (roleName == "claimer") {
            if (this.room.name == "E11S18") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "6027a9fc992216018438d9e5"; // harvest room E11S19
                }
                else {
                    options.memory.controllerID = "6027aa36992216018438dfd6"; // E15S13
                }
            }
            else if (this.room.name == "E15S13") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "6027aa27992216018438de02"; // harvest room E14S13
                }
                else {
                    options.memory.controllerID = "6027aa0a992216018438db17"; // E12S12
                }
            }
            else if (this.room.name == "E12S12") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "6027aa0a992216018438db13"; // harvest room E12S11
                }
            }
            let controllerRoom = _.get(Memory.controllers, [options.memory.controllerID, "pos", "roomName"], "");
            if (_.includes(_.get(Memory.rooms, [this.room.name, "harvestRooms"], []), controllerRoom) == true && Game.time < _.get(Memory.rooms, [controllerRoom, "avoidTravelUntil"], 0)) {
                return -10.1; // NOTE: Fake error for when a claimer would just die to an invader in the room they're going to reserve
            }
        }
        else if (roleName == "powerHarvester") {
            options.memory.harvestRoom = { id: this.room.name, x: 25, y: 25 }; // TODO: Populate this automatically
        }
        else if (roleName == "scout") {
            if (this.room.name == "E11S18") {
                options.memory.roomSentTo = "E15S13";
            }
        }
        else if (roleName == "attacker") {
            if ((this.room.hasHostileCreep == false) 
                && (this.room.harvestRoomsWithLvl0InvaderCore.length > 0) 
                && (_.get(Memory.rooms, [this.room.name, "creepCounts", "attacker"], -2) + 1) >= _.get(Memory.rooms, [this.room.name, "creepMins", "attacker"], 0)) {
                options.memory.roomSentTo = _.first(this.room.harvestRoomsWithLvl0InvaderCore);
                options.memory.structureID = _.get(Memory.rooms, [options.memory.roomSentTo, "invaderCore", "id"], undefined);
            }
            if (Game.map.getRoomLinearDistance(this.room.name, _.get(options.memory, "roomSentTo", this.room.name)) > 1) {
                needsHeal = true;
            }
        }
        
        let energyAvaliable = this.room.energyCapacityAvailable;
        if ((Memory.rooms[this.room.name].creepCounts.harvester / Memory.rooms[this.room.name].creepMins.harvester) < 0.5) {
            energyAvaliable = _.max([this.room.energyAvailable, SPAWN_ENERGY_CAPACITY]); // start small if forced to build up from scratch
        }
        
        options.memory.energyAvaliableOnSpawn = energyAvaliable;
        
        /*
            The move ratio is the ratio of move parts to the total of all the other types of parts in the body of the creep.
            It should only need to be set to one of the following values:
            5.0: To maintain a speed of 1 per tick over swamp terrain
            1.0: To maintain a speed of 1 per tick over plain terrain
            0.5: To maintain a speed of 1 per tick over roads
            ONE_MOVE_RATIO: To maintain the slowest speed, using only a single move part
            0.0: To never move from where it was spawned
        */
        let moveRatio = 1;
        
        /*
            The body template describes the smallest version of the body the creep will have, minus move & non-scaling parts
            Tough parts are always placed infront of all other parts
            Heal parts are always placed behind all other parts
            Move parts are placed behind all non-heal parts in a number based on the moveRatio
            All other parts are placed in the order of the first occurance of that part
            All parts are added in ratios relative to the rest of the parts that appear in the body template
        */
        let bodyTemplate = [WORK, CARRY];
        if (roleName == "attacker") {
            if (_.get(options.memory, ["roomSentTo"], this.room.name) == this.room.name) {
                moveRatio = 0.5;
            }
            else {
                moveRatio = 1;
            }
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
            if (this.room.name == "E11S18" 
                || this.room.name == "E15S13") { // these rooms have a source in range of the controller
                moveRatio = ONE_MOVE_RATIO;
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
                && _.get(this.room.nextDemolisher, "type", "D") == "H") {
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
            moveRatio = 5; // since only using move parts will allow movement each tick no matter the terrain the moveRatio is automatically set to 5, mainly to ensure that the moveRatio == ONE_MOVE_RATIO sections aren't run accidently
            bodyTemplate = [MOVE];
        }
        else if (moveRatio > ONE_MOVE_RATIO) {
            let bodyTemplatePartCount = bodyTemplate.length;
            bodyTemplate.push(_.fill(Array(Math.ceil((bodyTemplatePartCount * moveRatio))), MOVE));
            bodyTemplate = _.flattenDeep(bodyTemplate);
        }
        
        let bodyCost = _.sum(bodyTemplate, (bp) => (BODYPART_COST[bp]));
        
        if (moveRatio == ONE_MOVE_RATIO) {
            energyAvaliable -= BODYPART_COST[MOVE]; // when move ratio is ONE_MOVE_RATIO, remove energy from the total avaliable to account for the 1 move part that will be added that's not included in the body cost
        }
        if (roleName == "hauler") { // accounts for the single work part haulers have that doesn't get multiplied dynamically with avaliable energy
            energyAvaliable -= BODYPART_COST[WORK];
            if (moveRatio > ONE_MOVE_RATIO) { // TODO: Make a proper check for if an extra move part is needed or not
                energyAvaliable -= BODYPART_COST[MOVE];
            }
        }
        else if (roleName == "miner") { // accounts for the single carry part miners have that doesn't get multiplied dynamically with avaliable energy
            energyAvaliable -= BODYPART_COST[CARRY];
            if (moveRatio > ONE_MOVE_RATIO) { // TODO: Make a proper check for if an extra move part is needed or not
                energyAvaliable -= BODYPART_COST[MOVE];
            }
        }
        else if (needsHeal == true) { // accounts for the single heal part some creeps need that doesn't get multiplied dynamically with avaliable energy
            energyAvaliable -= BODYPART_COST[HEAL];
            if (moveRatio > ONE_MOVE_RATIO) { // TODO: Make a proper check for if an extra move part is needed or not
                energyAvaliable -= BODYPART_COST[MOVE];
            }
        }
        
        let bodyPartCounts = _.countBy(bodyTemplate);
        
        /*
            Base general worker size off capacity to fill 3 extentions from a single haul
            NOTES:  [WORK,CARRY,MOVE,MOVE] has 50 carry & costs 250, so carry*5=cost
            RCL     Room.energyCapacityAvaliable    Creep.carryCapacity energyToSpawn   totalNumberOfParts
            1-6:      300-2300          ( 50/50)*3= 150*5=               750/5/50*4=    12
            7:       5600               (100/50)*3= 300*5=              1500/5/50*4=    24
            8:      12900               (200/50)*3= 600*5=              3000/5/50*4=    48
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
            8:  3*300+60*200=   12900/6/(200/50)=   537         550*5=              2750/5/50*4=    44
        */
        const GENERAL_WORKER_CARRY_PART_CAP = Math.ceil(this.room.energyCapacityAvailable / DEFAULT_HARVEST_COUNT / (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] / EXTENSION_ENERGY_CAPACITY[1]) / CARRY_CAPACITY);
        
        let slowUpgraderCarryCount = 1; // Used for upgraders with moveRatio == ONE_MOVE_RATIO
        
        let partMultiplier = Math.min(Math.floor(energyAvaliable / bodyCost), GENERAL_WORKER_CARRY_PART_CAP);
        if (roleName == "miner") {
            partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * MINER_WORK_PART_CAP) / bodyCost);
        }
        else if (roleName == "attacker" 
            && (_.get(options.memory, ["roomSentTo"], this.room.name) != this.room.name)) {
            partMultiplier = 1;
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
            if (moveRatio == ONE_MOVE_RATIO) {
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
            // TODO: Fix the partMultiplier calculation when the controller needs to be attacked
            /*if ((_.get(Memory.controllers, [options.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" 
                    || _.get(Memory.controllers, [options.memory.controllerID, "reservation", "username"], "dragoonreas") != "dragoonreas") 
                && _.get(Memory.controllers, [options.memory.controllerID, "unblockedAt"], Game.time) <= Game.time) {
                let neutralAt = _.get(Memory.controllers, [options.memory.controllerID, "neutralAt"], (Game.time + CONTROLLER_CLAIM_DOWNGRADE));
                let theTicksToNeutral = ((neutralAt - Game.time) > 0) ? (neutralAt - Game.time) : CONTROLLER_CLAIM_DOWNGRADE;
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * (theTicksToNeutral / CONTROLLER_CLAIM_DOWNGRADE)) / bodyCost); // rooms using other rooms to harvest send out claimers to take back those harvest rooms and need more claim parts to attack an enemy controller before it can start reserving it again
            }
            else {*/
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * RESERVE_CLAIM_PART_CAP) / bodyCost); // rooms using other rooms to harvest send out claimers to reserve those harvest rooms and need up to two claim parts to keep the room reservation up
            //}
            
        }
        else if (roleName == "scout" 
            || roleName =="claimer") {
            partMultiplier = 1; // for creeps that don't scale with energy avaliable
        }
        
        // can't use MAX_CREEP_SIZE directly as we need to account for parts not included in the bodyTemplate
        let maxCreepSize = MAX_CREEP_SIZE;
        if (moveRatio == ONE_MOVE_RATIO) {
            --maxCreepSize;
            if (roleName == "upgrader") {
                maxCreepSize -= slowUpgraderCarryCount;
            }
        }
        if (roleName == "hauler" // haulers have extra work part
            || roleName == "miner" // miners have extra carry part
            || needsHeal == true) { // some creeps have extra heal part
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
            && moveRatio == ONE_MOVE_RATIO) {
            body.push(_.fill(Array(slowUpgraderCarryCount), CARRY));
        }
        
        // Add the move part(s)
        if (moveRatio == ONE_MOVE_RATIO) {
            body.push(MOVE);
            bodyPartCounts[MOVE] = 1;
        }
        else if (bodyPartCounts[MOVE] == bodyTemplate.length) {
            body = _.fill(Array(bodyTemplate.length * partMultiplier), MOVE);
        }
        else {
            body = _.flattenDeep(body);
            body.push(_.fill(Array(Math.ceil((body.length + partMultiplier * (bodyPartCounts[HEAL] || 0) + (((roleName == "hauler") || (needsHeal == true)) ? 1 : 0)) * moveRatio)), MOVE));
        }
        
        // add any heal parts last
        if (needsHeal == true) {
            body.push(HEAL);
        }
        body.push(_.fill(Array(partMultiplier * (bodyPartCounts[HEAL] || 0)), HEAL));
        
        body = _.flattenDeep(body);
        
        if (body.length < 1 
            || partMultiplier < 1) {
            return -6.1; // NOTE: Fake error for if spawn can't scale this creep to the rooms energy capacity
        }
        
        bodyPartCounts = _.countBy(body);
        
        options.memory.spawnTick = Game.time + (body.length * CREEP_SPAWN_TIME) - 1 // -1 because it uses the last tick to leave the spawn
        
        // Worst case (full/destroyed carry parts) ticks per movement when transversing roads (1), plain terrain (2), or swamp terrain (10)
        options.memory.speeds = {
            ["1"]: (moveRatio == 0 ? 0 : Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1))
            , ["2"]: (moveRatio == 0 ? 0 : Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1))
            , ["10"]: (moveRatio == 0 ? 0 : Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1))
        };
        
        let nameList = MALE_NAMES;
        let creepName = "";
        let nameExists = true;
        let numGivenNames = 0;
        do {
            nameList = ((Math.random() > 0.5) ? MALE_NAMES : FEMALE_NAMES);
            creepName = _.sample(nameList, ++numGivenNames).toString().replace(",", "");
            nameExists = _.any(Memory.creeps, (cm, cn) => (cn == creepName));
        } while (nameExists == true);
        
        let result = this.spawnCreep(body, creepName, options);
        
        if (result == OK) {
            ++Memory.rooms[options.memory.roomID].creepCounts[options.memory.role];
            
            if (roleName == "repairer") {
                ++Memory.rooms[options.memory.roomID].repairerTypeCounts[options.memory.repairerType];
            }
            
            result = creepName;
        }
        
        return result;
    };
};

module.exports = prototypeSpawn;
