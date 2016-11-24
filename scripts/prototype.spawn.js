module.exports = function() {
    StructureSpawn.prototype.createCustomCreep =
        function(roleName, offRoad, harvesterRatio) {
            
            var moveRatio = 2;
            var bodyCost = 250;
            if (offRoad == false) {
                moveRatio = 1;
                bodyCost = 200;
            }
            if (roleName == 'claimer') {
                moveRatio = 1;
                bodyCost = 650;
            }
            
            var body = [];
            var partMultiplier = Math.floor(this.room.energyCapacityAvailable / bodyCost);
            if (harvesterRatio < 0.5) {
                partMultiplier = 1;
            }
            else if (roleName == 'repairer') {
                partMultiplier = Math.max(Math.floor(this.room.energyCapacityAvailable / bodyCost), 4);
            }
            else if (roleName != 'upgrader') {
                /*
                    Since production peaked with the setup during controller lvl 2, use that energy capacity as the cap for non-upgraders:
                    max # of controller lvl 2 spawns * spawn.maxEnergyCapacity + max # of controller lvl 2 expansions * expansion.maxEnergyCapacity
                    = 1*300 + 10*50 
                    = 800
                */
                partMultiplier = Math.floor(Math.min(this.room.energyCapacityAvailable,800) / bodyCost);
            }
            if (roleName == 'claimer') {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CLAIM);
                }
            }
            else {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(WORK);
                }
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CARRY);
                }
            }
            for (let i = 0; i < partMultiplier * moveRatio; i++) {
                body.push(MOVE);
            }
            
            return this.createCreep(body, undefined, { role: roleName, working: false });
        };
};
