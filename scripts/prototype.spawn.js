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
*/
const UPGRADER_RCL_SCALING_CAP = 5;
const UPGRADER_ENERGY_CAP = CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][UPGRADER_RCL_SCALING_CAP] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][UPGRADER_RCL_SCALING_CAP] * EXTENSION_ENERGY_CAPACITY[UPGRADER_RCL_SCALING_CAP];

const RESERVE_CLAIM_PART_CAP = 2;

let prototypeSpawn = function() {
    StructureSpawn.prototype.createCustomCreep =
        function(roleName) {
        
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
        else if (roleName == "hauler") {
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
            if (this.room.name == "W86N39" || this.room.name == "W85N38") { // these rooms have a source in range of the controller
                moveRatio = 0;
            }
            else {
                moveRatio = 0.5; // should really be 1, but their current travel times make it so that in combination with the rest of the parameters being used right now they just happen to deplete their source right around the time it refreshes
            }
        }
        else if (roleName == "scout") {
            bodyTemplate = []; // moveRatio is set automatically when an empty body template is used, so no use setting it here
        }
        else if (roleName == "claimer") {
            bodyTemplate = [CLAIM];
        }
        
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
        
        let energyAvaliable = this.room.energyCapacityAvailable;
        if ((Memory.rooms[this.room.name].creepCounts.harvester / Memory.rooms[this.room.name].creepMins.harvester) < 0.5) {
            energyAvaliable = SPAWN_ENERGY_CAPACITY; // start small if forced to build up from scratch
        }
        
        let energyAvaliableOnSpawn = energyAvaliable; // to save in creep.memory.energyAvaliableOnSpawn
        
        if (moveRatio == 0) {
            energyAvaliable -= BODYPART_COST[MOVE]; // when move ratio is 0, remove energy from the total avaliable to account for the 1 mandatory move part that will be added that's not included in the body cost
        }
        if (roleName == "hauler") {
            energyAvaliable -= BODYPART_COST[WORK]; // accounts for the single work part haulers have that doesn't get multiplied dynamically with avaliable energy
        }
        else if (roleName == "miner") {
            energyAvaliable -= BODYPART_COST[CARRY]; // accounts for the single carry part miners have that doesn't get multiplied dynamically with avaliable energy
        }
        
        const GENERAL_WORKER_CARRY_PART_CAP = (EXTENSION_ENERGY_CAPACITY[this.room.controller.level] / CARRY_CAPACITY) * 3; // Base general worker size off capacity to fill 3 extentions from a single haul
        
        let partMultiplier = Math.min(Math.floor(energyAvaliable / bodyCost), GENERAL_WORKER_CARRY_PART_CAP);
        if (roleName == "miner") {
            partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * MINER_WORK_PART_CAP) / bodyCost);
        }
        else if (roleName == "hauler" 
            || roleName == "adaptable" 
            || roleName == "attacker" 
            || roleName == "powerHarvester") {
            partMultiplier = Math.min(Math.floor(energyAvaliable / bodyCost), Math.floor((MAX_CREEP_SIZE - ((moveRatio == 0) ? 1 : 0)) / bodyTemplate.length)); // go all out if we're under attack, going after a power bank or doing some ad-hoc stuff
        }
        else if (roleName == "upgrader") {
            partMultiplier = Math.floor(Math.min(energyAvaliable, UPGRADER_ENERGY_CAP) / bodyCost);
        }
        else if (roleName == "claimer" 
            && _.get(Memory.rooms[this.room.name], "harvestRooms", undefined) != undefined 
            && _.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) {
            partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * RESERVE_CLAIM_PART_CAP) / bodyCost); // rooms using other rooms to harvest send out claimers to reserve those harvest rooms and need up to two claim parts to keep the room reservation up
        }
        else if (roleName == "scout" 
            || roleName =="claimer") {
            partMultiplier = 1; // for creeps that don't scale with energy avaliable
        }
        
        let bodyPartCounts = _.countBy(bodyTemplate);
        
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
        bodyPartCounts = _.countBy(body);
        
		// Worst case (full carry parts) ticks per movement when transversing roads (1), plain terrain (2), or swamp terrain (10)
        let moveSpeeds = {
            ["1"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["2"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["10"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
        };
        
        let creepMemory = {
            roomID: this.room.name 
            , energyAvaliableOnSpawn: energyAvaliableOnSpawn 
            , spawnTick: Game.time + (body.length * CREEP_SPAWN_TIME) - 1 // -1 because it uses the last tick to leave the spawn
            , speeds: moveSpeeds 
            , role: roleName 
            , working: false
        }; // TODO: Only apply the working property to creeps with carry parts
        
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
            if (this.room.name == "W87N29") {
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
            else if (this.room.name == "W86N29") {
                if (Memory.rooms.W85N23.creepCounts.builder == 0 && Memory.rooms.W85N23.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N23";
                }
                else if (Memory.rooms.W85N23.creepCounts.builder == 0 && Memory.rooms.W85N23.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N23";
                }
                else if (Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N39.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N39";
                }
            }
            else if (this.room.name == "W85N23") {
                if (Memory.rooms.W87N29.creepCounts.builder == 0 && Memory.rooms.W87N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W87N29";
                }
                else if (Memory.rooms.W86N29.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N29";
                }
            }
            else if (this.room.name == "W86N39") {
                if (Memory.rooms.W85N38.creepCounts.builder == 0 && Memory.rooms.W85N38.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W85N38";
                }
            }
            else if (this.room.name == "W85N38") {
                if (Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) {
                    creepMemory.roomSentTo = "W86N39";
                }
            }
        }
        else if (roleName == "claimer") {
            if (this.room.name == "W87N29") {
                creepMemory.controllerID = "5873bb7f11e3e4361b4d5f13";
            }
            else if (this.room.name == "W86N29") {
                if (_.get(Memory.rooms, [this.room.name, "creepCounts", "claimer"], 0) < _.get(Memory.rooms, [this.room.name, "creepMins", "claimer"], 0)) { // NOTE: Allows for easy, one time spawning of new claimer for a new room from console without distrupting claimers used for reserving
                    creepMemory.controllerID = "5873bbab11e3e4361b4d6401";
                }
                else {
                    creepMemory.controllerID = "5873bbdf11e3e4361b4d6a75";
                }
            }
            else if (this.room.name == "W85N23") {
                creepMemory.controllerID = "5873bbe111e3e4361b4d6ac5";
            }
            else if (this.room.name == "W84N37") {
                //creepMemory.controllerID = "5873bbaa11e3e4361b4d63cd";
                creepMemory.controllerID = "5873bbc711e3e4361b4d6732";
            }
        }
        else if (roleName == "powerHarvester") {
            creepMemory.harvestRoom = { id: "W53N32", x: 25, y: 25 }; // TODO: Populate this automatically
        }
        
        let result = this.createCreep(body, undefined, creepMemory); // TODO: Work out a custom naming scheme
        
        if (roleName == "repairer" && _.isString(result) == true) {
            ++Memory.rooms[creepMemory.roomID].repairerTypeCounts[creepMemory.repairerType];
        }
        
        return result;
    };
};

module.exports = prototypeSpawn;
