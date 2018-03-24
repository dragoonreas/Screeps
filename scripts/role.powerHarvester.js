// TODO: Creep.say emotes
let rolePowerHarvester = {
    run: function(creep) {
        creep.memory.executingRole = "powerHarvester";
        
        if (creep.memory.working == false 
            && creep.carryCapacityAvailable == 0) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry[RESOURCE_POWER] == 0) {
            creep.memory.working = false;
            creep.memory.depositStructure = undefined; // can be a harvester when working
        }
        
        if (creep.memory.working == false) {
            if (creep.memory.harvestRoom != undefined) {
                if (creep.room.name == creep.memory.harvestRoom.id) {
                    let powerBank = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_POWER_BANK
                        )})[0];
                    if (powerBank != undefined) {
                        if (creep.hitsMax - creep.hits > HEAL_POWER * 4) { // TODO: Get the actual number of heal parts, rather than just assuming it has 4
                            creep.heal(creep);
                        }
                        else if (creep.attack(powerBank) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(powerBank);
                        }
                    }
                    else {
        			    // TODO: Recycle power harvester once power bank depleated
                    }
                }
                else {
                    creep.travelTo(new RoomPosition(creep.memory.harvestRoom.x, creep.memory.harvestRoom.y, creep.memory.harvestRoom.id));
                }
            }
            else {
                if (creep.room.name == creep.memory.roomID) {
                    creep.suicide();
                }
                else {
                    creep.travelTo(new RoomPosition(25, 25, creep.memory.roomID), {
                        range: 23
                    });
                }
            }
        }
        else {
            if (creep.carry[RESOURCE_POWER] != 0) {
                let powerStorage = Game.getObjectById(""); // TODO: Replace with room.find
                if (powerStorage != undefined) {
                    if (creep.room.name != powerStorage.room.name || creep.transfer(powerStroage, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(powerStorage);
                    }
                }
            }
            else {
                if (creep.carry[RESOURCE_ENERGY] != creep.carryTotal) {
                    ROLES["hoarder"].run(creep);
                }
                else if (creep.carry[RESOURCE_ENERGY] > 0) {
                    ROLES["harvester"].run(creep);
                }
            }
        }
    }
};

module.exports = rolePowerHarvester;
