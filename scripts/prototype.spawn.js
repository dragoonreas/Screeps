// TODO: Use body part constants to calculate bodyCost varients
    
var repairerStructureTypes = [
    STRUCTURE_RAMPART
    , STRUCTURE_ROAD
    , STRUCTURE_WALL
];

var repairerStructureTypeIndex = 0;

var prototypeSpawn = function() {
    
    StructureSpawn.prototype.createCustomCreep =
        function(roleName) {
            
            var moveRatio = 2;
            var bodyCost = 250; // 1 work + 1 carry + 2 move = 1*100 + 1*50 + 2*50 = 250
            if (roleName == "attacker") {
                moveRatio = 1;
                bodyCost = 130; // 1 attack + 1 move = 1*80 + 1*50 = 130
            }
            else if (roleName == "claimer") {
                moveRatio = 1;
                bodyCost = 650; // 1 claim + 1 move = 1*600 + 1*50 = 650
            }
            else if (roleName == "upgrader") {
                moveRatio = 1;
                bodyCost = 200; // 1 work + 1 carry + 1 move = 1*100 + 1*50 + 1*50 = 200
            }
            
            var body = [];
            /*
                Production seemed to peak with the body sizes used during controller lvl 2 and subsequently fell off at the new couple of higher levels.
                So, use that energy capacity as the default cap: 
                max # of controller lvl 2 spawns * spawn.maxEnergyCapacity + max # of controller lvl 2 expansions * expansion.maxEnergyCapacity 
                = 1*300 + 10*50 
                = 800
            */
            var partMultiplier = Math.floor(Math.min(this.room.energyCapacityAvailable,800) / bodyCost);
            if (roleName == "attacker" 
                || (Memory.creepCounts.harvester / Memory.creepMins.harvester) < 0.5) {
                partMultiplier = 1; // start small if forced to build up from scratch, or if attackers are needed for urgent deployment
            }
            else if (roleName == "upgrader") {
                partMultiplier = Math.floor(this.room.energyCapacityAvailable / bodyCost); // upgraders don't have any roles to fall back to, so should be the safest to get the maximum amount of efficiency out of using the largest body possible
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
            else {
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(CARRY);
                }
                for (let i = 0; i < partMultiplier; i++) {
                    body.push(WORK);
                }
            }
            body.push(MOVE); // ensures creep is always able to move
            
            if (roleName == "repairer") {
                var repairerStructureType = undefined;
                if (repairerStructureTypeIndex < repairerStructureTypes.length) {
                    repairerStructureType = repairerStructureTypes[repairerStructureTypeIndex];
                    ++repairerStructureTypeIndex;
                }
                else {
                    repairerStructureTypeIndex = 0;
                }
                return this.createCreep(body, undefined, { role: roleName, working: false, structureType: repairerStructureType });
            }
            else {
                return this.createCreep(body, undefined, { "role": roleName, "working": false });
            }
        };
};

module.exports = prototypeSpawn;
