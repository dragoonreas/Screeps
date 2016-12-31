var roleHoarder = require("role.hoarder");
var roleHarvester = require("role.harvester");

// TODO: Creep.say emotes
var rolePowerHarvester = {
    
    run: function(creep) {
        
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry[RESOURCE_POWER] == 0) {
            creep.memory.working = false;
        }
        
        if (creep.memory.working == false) {
            if (creep.memory.harvestRoom != undefined) {
                if (creep.room.name == creep.memory.harvestRoom.id) {
                    var powerBank = creep.room.find(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_POWER_BANK
                        )})[0];
                    if (powerBank != undefined) {
                        if (creep.hitsMax - creep.hits > HEAL_POWER * 4) { // TODO: Get the actual number of heal parts, rather than just assuming it has 4
                            creep.heal(creep);
                        }
                        else if (creep.attack(powerBank) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(powerBank);
                        }
                    }
                    else {
        			    // TODO: Recycle power harvester once power bank depleated
                    }
                }
                else {
                    creep.moveTo(new RoomPosition(creep.memory.harvestRoom.x, creep.memory.harvestRoom.y, creep.memory.harvestRoom.id));
                }
            }
            else {
                if (creep.room.name == creep.memory.roomID) {
                    creep.suicide();
                }
                else {
                    creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
                }
            }
        }
        else {
            if (creep.carry[RESOURCE_POWER] != 0) {
                var powerStorage = Game.getObjectById("5830f0cb5e8515625b0b6ee4");
                if (powerStorage != undefined) {
                    if (creep.room.name != powerStorage.room.name || creep.transfer(powerStroage, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(powerStorage);
                    }
                }
            }
            else {
                if (creep.carry.energy != _.sum(creep.carry)) {
                    roleHoarder.run(creep);
                }
                else if (creep.carry.energy > 0) {
                    roleHarvester.run(creep);
                }
            }
        }
    }
};

module.exports = rolePowerHarvester;
