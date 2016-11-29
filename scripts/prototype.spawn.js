// TODO: Use body part constants to calculate bodyCost varients

var prototypeSpawn = function() {
    
    StructureSpawn.prototype.createCustomCreep =
        function(roleName) {
            
            var moveRatio = 2;
            var bodyCost = 250; // 1 work + 1 carry + 2 move = 1*100 + 1*50 + 2*50 = 250
            if (roleName == "attacker") {
                moveRatio = 1;
                bodyCost = 130; // 1 attack + 1 move = 1*80 + 1*50 = 130
            }
            if (roleName == "powerHarvester") {
                moveRatio = 1;
                bodyCost = 430; // 1 attack + 1 heal + 1 carry + 1 move = 1*80 + 1*250 + 1*50 + 1*50 = 430
            }
            else if (roleName == "upgrader") {
                if (this.room.name == "E68N45") {
                    moveRatio = 0; // source dedicated to upgrading is right next to the controller in this room, and the spawner is very close too, so only need 1 move
                    bodyCost = 150; // 1 work + 1 carry = 1*100 + 1*50 = 150
                }
                else {
                    moveRatio = 1;
                    bodyCost = 200; // 1 work + 1 carry + 1 move = 1*100 + 1*50 + 1*50 = 200
                }
            }
            else if (roleName == "scout") {
                moveRatio = 1;
                bodyCost = 50; // 1 move = 1*50 = 50
            }
            else if (roleName == "claimer") {
                moveRatio = 1;
                bodyCost = 650; // 1 claim + 1 move = 1*600 + 1*50 = 650
            }
            
            var energyAvaliable = this.room.energyCapacityAvailable;
            if (moveRatio == 0) {
                energyAvaliable -= 50; // when move ratio is 0, remove 50 energy from the total avaliable to account for the 1 mandatory move part that will be added that's not included in the body cost
            }
            
            var body = [];
            /*
                Production seemed to peak with the body size used during controller lvl 2 and subsequently fell off at the new couple of higher levels in E69N44.
                So, use that energy capacity as the default cap: 
                max # of controller lvl 2 spawns * spawn.maxEnergyCapacity + max # of controller lvl 2 expansions * expansion.maxEnergyCapacity 
                = 1*300 + 10*50 
                = 800
            */
            var partMultiplier = Math.floor(Math.min(energyAvaliable, 800) / bodyCost);
            if (roleName == "attacker" 
                || roleName == "scout" 
                || (Memory.rooms[this.room.name].creepCounts.harvester / Memory.rooms[this.room.name].creepMins.harvester) < 0.5) {
                partMultiplier = 1; // start small if forced to build up from scratch, or if attackers are needed for urgent deployment, or if it's just a scout
            }
            else if (roleName == "upgrader") {
                /*
                    The upgraders were using almost all the energy in their dedicated source almost right as it refreshed with the body size used during controller lvl 5 in E69N44.
                    So, use that energy capacity as the default cap: 
                    max # of controller lvl 5 spawns * spawn.maxEnergyCapacity + max # of controller lvl 5 expansions * expansion.maxEnergyCapacity 
                    = 1*300 + 30*50 
                    = 1800
                */
                partMultiplier = Math.floor(Math.min(energyAvaliable, 1800) / bodyCost);
            }
            else if (roleName == "powerHarvester") {
                partMultiplier = Math.floor(energyAvaliable / bodyCost); // go all out since the power banks are only avaliable for a limited time
            }
            else if (roleName == "claimer") {
                partMultiplier = Math.floor(Math.min(energyAvaliable, bodyCost * 2) / bodyCost); // prefer 2 claim parts to build reserve, but will make do with 1 when not enough energy is avaliable in the room since it still increases ups sources reserves in the room
            }
            
            for (let i = 0; i < (partMultiplier * moveRatio) - 1; i++) {
                body.push(MOVE); // use all but one move part as first line of defence
            }
            if (roleName == "attacker") {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(ATTACK);
                }
            }
            else if (roleName == "claimer") {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CLAIM);
                }
            }
            else if (roleName == "powerHarvester") {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(ATTACK);
                }
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(HEAL);
                }
            }
            else if (roleName != "scout") {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(WORK);
                }
            }
            body.push(MOVE); // ensures creep is always able to move
            
            var creepMemory = { roomID: this.room.name, role: roleName, working: false };
            
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
                creepMemory.controllerID == "57ef9ee786f108ae6e6101b5";
            }
            else if (roleName == "powerHarvester") {
                creepMemory.harvestRoom = { id: "E70N44", x: 18, y:7 };
            }
            
            var result = this.createCreep(body, undefined, creepMemory);
            
            if (roleName == "repairer" && (result < 0) == false) {
                ++Memory.rooms[creepMemory.roomID].repairerTypeCounts[creepMemory.repairerType];
            }
            
            return result;
        };
};

module.exports = prototypeSpawn;
