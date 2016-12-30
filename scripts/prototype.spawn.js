// TODO: Use body part constants to calculate bodyCost varients

var prototypeSpawn = function() {
    
    StructureSpawn.prototype.createCustomCreep =
        function(roleName) {
        
        /*
            The move ratio is the ratio of move parts to the total of all the other types of parts in the body of the creep.
            It should only need to be set to one of the following values:
            5.0: To maintain a speed of 1 per tick over swamp terrain
            2.5: To maintain a speed of 1 per tick over swamp terrain (assuming half non-move parts are empty carry parts)
            1.0: To maintain a speed of 1 per tick over plain terrain
            0.5: To maintain a speed of 1 per tick over roads
            0.0: To maintain the slowest speed, using only a single move part
        */
        var moveRatio = 1;

        /*
            The body template describes the smallest version of the body the creep will have, minus move parts
            Except for tough parts and move parts, which are always placed at the front of the creep (except for the last move part, which is placed at the end), parts are placed in the order of the first occurance of that part and in ratios relative to the rest of the parts
        */
        var bodyTemplate = [WORK, CARRY];
        if (roleName == "attacker") {
            moveRatio = 0.5;
            bodyTemplate = [ATTACK];
        }
        else if (roleName == "miner") {
            moveRatio = 0;
            bodyTemplate = [WORK, WORK, WORK, WORK, WORK, CARRY];
        }
        else if (roleName == "powerHarvester") {
            moveRatio = 0.5;
            bodyTemplate = [ATTACK, HEAL, CARRY];
        }
        else if (roleName == "upgrader") {
            if (this.room.name == "E68N45") {
                moveRatio = 0; // source dedicated to upgrading is right next to the controller in this room, and the spawner is very close too, so only need 1 move part
            }
            else {
                moveRatio = 0.5; // should really be 2, but their current travel times make it so that in combination with the rest of the parameters being used right now they just happen to deplete their source right around the time it refreshes
            }
        }
        else if (roleName == "scout") {
            moveRatio = 0.5;
            bodyTemplate = [];
        }
        else if (roleName == "claimer") {
            moveRatio = 0.5;
            bodyTemplate = [CLAIM];
        }

        var bodyCost = 0;
        for (let partIndex in bodyTemplate) {
            bodyCost += BODYPART_COST[bodyTemplate[partIndex]];
        }
        bodyCost += Math.ceil(bodyTemplate.length * moveRatio) * BODYPART_COST[MOVE];

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
            partMultiplier = Math.min(Math.floor(energyAvaliable / bodyCost), Math.floor(MAX_CREEP_SIZE / (bodyTemplate.length + bodyTemplate.length * moveRatio))); // go all out since the power banks are only avaliable for a limited time, and adaptables usually carry out high priority tasks that need to be completed quickly
        }
        
        var bodyPartCounts = _.countBy(bodyTemplate);
        
        // TODO: Change body way MOVE parts are placed so that as creep loses parts the move speed stays the same (except for when moveRatio=0)
        var body = [];
        for (let i = 0; i < (partMultiplier * (bodyPartCounts[TOUGH] || 0)); i++) { // add any tough parts first
            body.push(TOUGH);
        }
        for (let i = 0; i < Math.ceil(bodyTemplate.length * partMultiplier * moveRatio) - 1; i++) { // use all but one move part as first line of defence, after any tough parts
            body.push(MOVE);
        }
        for (let bodyPart in bodyPartCounts) { // add any remaining parts in the order they first occured
            if (bodyPart != TOUGH) {
                for (let i = 0; i < (partMultiplier * bodyPartCounts[bodyPart]); i++) {
                    body.push(bodyPart);
                }
            }
        }
        body.push(MOVE); // ensures creep is always able to move
        
        /*
			Get number of ticks it takes to move (assuming travelling over plain terrain with a full load and no speed limit)
			TODO: Put a generally applicable algorithm here instead
		*/
        var moveSpeed = undefined;
        if (moveRatio == 1 || body.length == 1) {
            moveSpeed = 1;
        }
        else if (moveRatio == 0.5) {
            moveSpeed = 2;
        }
        else if (moveRatio == 5) {
            moveSpeed = 0.2;
        }
        else if (moveRatio == 2.5) {
            moveSpeed = 0.4;
        }
        else { // moveRatio == 0
            moveSpeed = (body.length - 2) / 2;
        }
        
        var creepMemory = { roomID: this.room.name, speed: moveSpeed, role: roleName, working: false }; // TODO: Only apply the working property to creeps with carry parts
        
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
            else if (this.room.name == "E39N24") {
                creepMemory.controllerID = "576a9cd357110ab231d89c85";
            }
            else if (this.room.name == "E39N17") {
                creepMemory.controllerID = "577b94120f9d51615fa490f9";
            }
            else if (this.room.name == "E43N18") {
                creepMemory.controllerID = "579fa8b50700be0674d2e295";
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
