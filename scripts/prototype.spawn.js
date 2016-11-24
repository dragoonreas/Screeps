var prototypeSpawn = function() {

    StructureSpawn.prototype.createCustomCreep =
        function(roleName) {
            
            var moveRatio = 2;
            var bodyCost = 250;
            if (roleName == "attacker") {
                moveRatio = 1;
                bodyCost = 130;
            }
            else if (roleName == "claimer") {
                moveRatio = 1;
                bodyCost = 650;
            }
            else if (roleName == "upgrader") {
                moveRatio = 1;
                bodyCost = 200;
            }
            
            var body = [];
            var partMultiplier = Math.floor(this.room.energyCapacityAvailable / bodyCost);
            if (roleName == "attacker" 
                || (Memory.creepCounts.harvester / Memory.creepMins.harvester) < 0.5) {
                partMultiplier = 1; // start small if forced to build up from scratch, or if attackers are needed for urgent deployment
            }
            else if (roleName == "harvester" || roleName == "builder") {
                /*
                    Production seemed to peak with the body sizes used during controller lvl 2 and subsiquently fall off at later levels.
                    So, use that energy capacity as the cap for harvesters and builders:
                    max # of controller lvl 2 spawns * spawn.maxEnergyCapacity + max # of controller lvl 2 expansions * expansion.maxEnergyCapacity
                    = 1*300 + 10*50 
                    = 800
                */
                partMultiplier = Math.floor(Math.min(this.room.energyCapacityAvailable,800) / bodyCost);
            }
            for (let i = 0; i < (partMultiplier * moveRatio) - 1; i++) {
                body.push(MOVE);
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
            else {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(WORK);
                }
            }
            body.push(MOVE);
            
            return this.createCreep(body, undefined, { role: roleName, working: false });
        };
};

module.exports = prototypeSpawn;
