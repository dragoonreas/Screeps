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
            /*if (this.room.name == "E8S2") {
                if (Memory.rooms.E17S1.creepCounts.builder == 0 && Memory.rooms.E17S1.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E17S1";
                }
                else if (Memory.rooms.E18S3.creepCounts.builder == 0 && Memory.rooms.E18S3.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E18S3";
                }
            }
            else if (this.room.name == "E18S3") {
                if (Memory.rooms.E18S9.creepCounts.builder == 0 && Memory.rooms.E18S9.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E18S9";
                }
                else if (Memory.rooms.E19S13.creepCounts.builder == 0 && Memory.rooms.E19S13.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E19S13";
                }
                else if (Memory.rooms.E18S17.creepCounts.builder == 0 && Memory.rooms.E18S17.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E18S17";
                }
            }
            else*/ if (this.room.name == "E1S13") {
                if (Memory.rooms.E1S13.creepCounts.builder == 0 && Memory.rooms.E1S13.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E1S13";
                }
                else if (Memory.rooms.E2S11.creepCounts.builder == 0 && Memory.rooms.E2S11.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E2S11";
                }
                /*else if (Memory.rooms.E3S15.creepCounts.builder == 0 && Memory.rooms.E3S15.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E3S15";
                }
                else if (Memory.rooms.E18S17.creepCounts.builder == 0 && Memory.rooms.E18S17.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E18S17";
                }*/
            }
            else if (this.room.name == "E2S11") {
                if (Memory.rooms.E2S11.creepCounts.builder == 0 && Memory.rooms.E2S11.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E2S11";
                }
                else if (Memory.rooms.E1S13.creepCounts.builder == 0 && Memory.rooms.E1S13.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E1S13";
                }
                /*else if (Memory.rooms.E3S15.creepCounts.builder == 0 && Memory.rooms.E3S15.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E3S15";
                }
                else if (Memory.rooms.E18S17.creepCounts.builder == 0 && Memory.rooms.E18S17.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E18S17";
                }*/
            }
            else if (this.room.name == "E7S12") {
                if (Memory.rooms.E1S13.creepCounts.builder == 0 && Memory.rooms.E1S13.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E1S13";
                }
                else if (Memory.rooms.E2S11.creepCounts.builder == 0 && Memory.rooms.E2S11.creepCounts.adaptable == 0) {
                    options.memory.roomSentTo = "E2S11";
                }
            }
        }
        else if (roleName == "exporter") {
            options.memory.roomSentFrom = _.get(this.room.nextExporter, "from", this.room.name);
            options.memory.roomSentTo = _.get(this.room.nextExporter, "to", this.room.name);
        }
        else if (roleName == "demolisher") {
            switch (this.room.name) {
                case "E1S13":
                    options.memory.roomSentTo = "E2S13";
                    break;
                default:
                    options.memory.roomSentTo = _.get(Memory.rooms, [this.room.name, "harvestRooms", 0], undefined);
                    if (_.isString(options.memory.roomSentTo) == false) { options.memory.roomSentTo = undefined; }
                    break;
            }
        }
        else if (roleName == "claimer") {
            if (this.room.name == "E8S2") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "596e563e638d01000b4ed6dc"; // harvest room
                }
                else {
                    options.memory.controllerID = "596ce23b3c1b99000a4d32ae";
                }
            }
            else if (this.room.name == "E17S1") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = ""; // harvest room
                }
                else {
                    options.memory.controllerID = "596ce23b3c1b99000a4d3292";
                }
            }
            else if (this.room.name == "E18S3") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "596ce23b3c1b99000a4d32d5"; // harvest room
                }
                else {
                    options.memory.controllerID = "596ce23b3c1b99000a4d3364";
                }
            }
            else if (this.room.name == "E18S9") {
                //options.memory.controllerID = "59791d3c55e51c000b0bcc26";
                options.memory.controllerID = "59791d3c55e51c000b0bcb47";
            }
            else if (this.room.name == "E19S13") {
                options.memory.controllerID = "59791d3c55e51c000b0bcc18";
            }
            else if (this.room.name == "E18S17") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "59791d3c55e51c000b0bcc0c"; // harvest room
                }
            }
            else if (this.room.name == "E1S13") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "59790a4b833ada000b96f463"; // harvest room
                }
                else {
                    //options.memory.controllerID = "59790a4b833ada000b96f39a";
                    options.memory.controllerID = "59790a4b833ada000b96f397";
                }
            }
            else if (this.room.name == "E2S11") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    //options.memory.controllerID = "59790a4b833ada000b96f45b"; // harvest room
                    //options.memory.controllerID = "598869041a4816000a1a2dd4"; // harvest room
                    options.memory.controllerID = "59790a4b833ada000b96f340"; // harvest room
                }
            }
            else if (this.room.name == "E3S15") {
                options.memory.controllerID = "59790d46833ada000b96f4d6";
            }
            else if (this.room.name == "E7S12") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    options.memory.controllerID = "59790d46833ada000b96f4da"; // harvest room
                }
            }
            let controllerRoom = _.get(Memory.controllers, [options.memory.controllerID, "pos", "roomName"], "");
            if (_.includes(_.get(Memory.rooms, [this.room.name, "harvestRooms"], []), controllerRoom) == true && Game.time < _.get(Memory.rooms, [controllerRoom, "avoidTravelUntil"], 0)) {
                return -10.5; // NOTE: Fake error for when a claimer would just die to an invader in the room they're going to reserve
            }
        }
        else if (roleName == "powerHarvester") {
            options.memory.harvestRoom = { id: this.room.name, x: 25, y: 25 }; // TODO: Populate this automatically
        }
        
        let energyAvaliable = this.room.energyCapacityAvailable;
        if ((Memory.rooms[this.room.name].creepCounts.harvester / Memory.rooms[this.room.name].creepMins.harvester) < 0.5) { // TODO: Allow harvesters to scale gradually instead of jump between lowest to maximum scale
            energyAvaliable = _.max([this.room.energyAvailable, SPAWN_ENERGY_CAPACITY]); // start small if forced to build up from scratch
        }
        
        options.memory.energyAvaliableOnSpawn = energyAvaliable;
        
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
            if (this.room.name == "E8S2"
                || this.room.name == "E18S3"
                || this.room.name == "E18S17"
                || this.room.name == "E1S13"
                || this.room.name == "E2S11"
                || this.room.name == "E7S12") { // these rooms have a source in range of the controller
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
            if (minHarvestingDemolisherCost > energyAvaliable 
                && options.memory.roomSentTo == "") { // these rooms use demolishers that harvest from what they demolish
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
            if ((_.get(Memory.controllers, [options.memory.controllerID, "owner", "username"], "dragoonreas") != "dragoonreas" 
                    || _.get(Memory.controllers, [options.memory.controllerID, "reservation", "username"], "dragoonreas") != "dragoonreas") 
                && _.get(Memory.controllers, [options.memory.controllerID, "unblockedAt"], Game.time) <= Game.time) {
                let downgradesAt = _.get(Memory.controllers, [options.memory.controllerID, "downgradesAt"], (Game.time + CONTROLLER_CLAIM_DOWNGRADE));
                let theTicksToDowngrade = ((downgradesAt - Game.time) > 0) ? (downgradesAt - Game.time) : CONTROLLER_CLAIM_DOWNGRADE;
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * (theTicksToDowngrade / CONTROLLER_CLAIM_DOWNGRADE)) / bodyCost); // rooms using other rooms to harvest send out claimers to take back those harvest rooms and need more claim parts to attack an enemy controller before it can start reserving it again
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
        
        options.memory.spawnTick = Game.time + (body.length * CREEP_SPAWN_TIME) - 1 // -1 because it uses the last tick to leave the spawn
        
		// Worst case (full carry parts) ticks per movement when transversing roads (1), plain terrain (2), or swamp terrain (10)
        options.memory.speeds = {
            ["1"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["2"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["10"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
        };
        
        let nameList = MALE_NAMES;
        let creepName = "";
        let nameExists = true;
        let numGivenNames = 0;
        do {
            nameList = ((Math.random() > 0.5) ? MALE_NAMES : FEMALE_NAMES);
            numGivenNames++;
            creepName = _.sample(nameList, numGivenNames).toString().replace(",", "");
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
