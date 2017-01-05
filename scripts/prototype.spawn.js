var prototypeSpawn = function() {
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
        var moveRatio = 1;
        
        /*
            The body template describes the smallest version of the body the creep will have, minus move parts
            Move parts are placed at set intervals behind all other parts to maintain a constant speed based on the speedRatio
            Tough parts are always placed infront non-move parts
            All other parts are placed in the order of the first occurance of that part
            All parts are added in ratios relative to the rest of the parts that appear in the body template
        */
        var bodyTemplate = [WORK, CARRY];
        if (roleName == "attacker") {
            bodyTemplate = [ATTACK];
        }
        else if (roleName == "miner") {
            moveRatio = 0;
            bodyTemplate = [WORK, WORK, WORK, WORK, WORK, CARRY];
        }
        else if (roleName == "powerHarvester") {
            bodyTemplate = [ATTACK, HEAL, CARRY];
        }
        else if (roleName == "upgrader") {
            if (this.room.name == "E68N45") {
                moveRatio = 0; // source dedicated to upgrading is right next to the controller in this room, and the spawner is very close too, so only need 1 move part
            }
            else {
                moveRatio = 0.5; // should really be 1, but their current travel times make it so that in combination with the rest of the parameters being used right now they just happen to deplete their source right around the time it refreshes
            }
        }
        else if (roleName == "scout") {
            bodyTemplate = []; // moveRatio is set automatically when an empty body template is used, so no use setting it here
        }
        else if (roleName == "claimer") {
            moveRatio = 0.5;
            bodyTemplate = [CLAIM];
        }
        
        if (bodyTemplate.length == 0) {
            moveRatio = 5; // since only using move parts will allow movement each tick no matter the terrain the moveRatio is automatically set to 5, mainly to ensure that the moveRatio == 0 sections aren't run accidently
            bodyTemplate = [MOVE];
        }
        else if (moveRatio > 0) {
            var moveInterval = ((moveRatio == 0.5) ? 2 : 1); // move parts will be added at the apropriate intervales to maintain the move ratio
            var numOfMoveParts = Math.ceil(bodyTemplate.length / moveInterval) * Math.ceil(moveRatio)
            var moveTemplate = _.fill(Array(numOfMoveParts), MOVE);
            bodyTemplate.push(moveTemplate);
            bodyTemplate = _.flattenDeep(bodyTemplate);
        }
        
        var bodyCost = 0;
        for (let bodyPart of bodyTemplate) {
            bodyCost += BODYPART_COST[bodyPart];
        }
        
        var energyAvaliable = this.room.energyCapacityAvailable;
        if (moveRatio == 0) {
            energyAvaliable -= BODYPART_COST[MOVE]; // when move ratio is 0, remove energy from the total avaliable to account for the 1 mandatory move part that will be added that's not included in the body cost
        }
        
        /*
            Production seemed to peak with the body size used during controller lvl 3 and subsequently fell off at the new couple of higher levels in E69N44.
            So, use that energy capacity as the default cap: 
            CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][3] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][3] * EXTENSION_ENERGY_CAPACITY[3] 
            = 1*300 + 10*50 
            = 800
        */
        var partMultiplier = Math.floor(Math.min(energyAvaliable, 800) / bodyCost);
        if (roleName == "attacker" 
            || roleName == "miner" 
            || roleName == "scout" 
            || (Memory.rooms[this.room.name].creepCounts.harvester / Memory.rooms[this.room.name].creepMins.harvester) < 0.5) {
            partMultiplier = 1; // start small if forced to build up from scratch, or if the creep doesn't scale with energy avaliable
        }
        else if (roleName == "upgrader") {
            /*
                The upgraders were using almost all the energy in their dedicated source almost right as it refreshed with the body size used during controller lvl 5 in E69N44.
                So, use that energy capacity as the default cap: 
                CONTROLLER_STRUCTURES[STRUCTURE_SPAWN][5] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][5] * EXTENSION_ENERGY_CAPACITY[5] 
                = 1*300 + 30*50 
                = 1800
            */
            partMultiplier = Math.floor(Math.min(energyAvaliable, 1800) / bodyCost);
        }
        else if (roleName == "powerHarvester"
            || roleName == "adaptable") {
            partMultiplier = Math.min(Math.floor(energyAvaliable / bodyCost), Math.floor(MAX_CREEP_SIZE / (bodyTemplate.length + ((bodyTemplate.length * moveRatio > 0) ? (bodyTemplate.length * moveRatio) : 1)))); // go all out since the power banks are only avaliable for a limited time, and adaptables usually carry out high priority tasks that need to be completed quickly
        }
        
        var bodyPartCounts = _.countBy(bodyTemplate);
        
        var body = [];
        for (let i = 0; i < (partMultiplier * (bodyPartCounts[TOUGH] || 0)); i++) { // add any tough parts first
            body.push(TOUGH);
        }
        for (let bodyPart in bodyPartCounts) { // add any remaining (non-move) parts in the order they first occured
            if (bodyPart != TOUGH && bodyPart != MOVE) {
                for (let i = 0; i < (partMultiplier * bodyPartCounts[bodyPart]); i++) {
                    body.push(bodyPart);
                }
            }
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
            var chunckSize = ((moveRatio == 0.5) ? 2 : 1); // move parts will be added at the apropriate intervales to maintain the move ratio
            body = _.chunk(body.reverse(), chunckSize).reverse(); // since we want the execess chunks at the front, we need to reverse the array before and after creating the chuncks
            var moveTemplate = _.fill(Array(Math.ceil(moveRatio)), MOVE);
            for (let bodyChunk of body) {
                bodyChunk.push(moveTemplate);
            }
            body = _.flattenDeep(body);
        }
        
        bodyPartCounts = _.countBy(body);
        
		// Worst case (full carry parts & HP) ticks per movement when transversing roads (1), plain terrain (2), or swamp terrain (10)
        var moveSpeeds = {
            ["1"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["2"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
            , ["10"]: Math.max(Math.ceil(((body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
        };
        
        var creepMemory = { roomID: this.room.name, speeds: moveSpeeds, role: roleName, working: false }; // TODO: Only apply the working property to creeps with carry parts
        
        if (roleName == "repairer") {
            for (let repairerType in Memory.rooms[this.room.name].repairerTypeMins) {
                if (Memory.rooms[this.room.name].repairerTypeCounts[repairerType] < Memory.rooms[this.room.name].repairerTypeMins[repairerType] 
                    || repairerType == "all") {
                    creepMemory.repairerType = repairerType;
                    break;
                }
            }
        }
        else if (roleName == "claimer") {
            if (this.room.name == "E69N44" || this.room.name == "E68N45") {
                creepMemory.controllerID = "57ef9ee786f108ae6e6101b5";
            }
        }
        else if (roleName == "powerHarvester") {
            creepMemory.harvestRoom = { id: "E70N44", x: 18, y:7 };
        }
        
        var result = this.createCreep(body, undefined, creepMemory); // TODO: Work out a custom naming scheme
        
        if (roleName == "repairer" && _.isString(result) == true) {
            ++Memory.rooms[creepMemory.roomID].repairerTypeCounts[creepMemory.repairerType];
        }
        
        return result;
    };
};

module.exports = prototypeSpawn;
