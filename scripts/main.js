require("prototype.spawn")();
var roleAttacker = require("role.attacker");
var rolePickup = require("role.pickup");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleAdaptable = require("role.adaptable");
var roleRepairer = require("role.repairer");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleMason = require("role.mason");
var roleRecycleable = require("role.recycleable");

var defaultCreepMins = {
    attacker: 0
    , harvester: 6
    , upgrader: 3
    , adaptable: 0
    , repairer: 1
    , builder: 1
    , claimer: 0
    , mason: 1
};
if (Memory.creepMins == undefined) {
    Memory.creepMins = defaultCreepMins;
}
else {
    for (let creepMin in Memory.creepMins) {
        var validCreepMin = false;
        for (let creepType in defaultCreepMins) {
            if (creepMin == creepType) {
                validCreepMin = true;
                break;
            }
        }

        if (validCreepMin == false) {
            delete Memory.creepMins[creepMin];
        }
    }

    for (let creepType in defaultCreepMins) {
        if (Memory.creepMins[creepType] == undefined) {
            Memory.creepMins[creepType] = defaultCreepMins[creepType];
        }
    }
}

Memory.creepCounts = {
    attacker: _.sum(Game.creeps, (c) => c.memory.role == "attacker")
    , harvester: _.sum(Game.creeps, (c) => c.memory.role == "harvester")
    , upgrader: _.sum(Game.creeps, (c) => c.memory.role == "upgrader")
    , adaptable: _.sum(Game.creeps, (c) => c.memory.role == "adaptable")
    , repairer: _.sum(Game.creeps, (c) => c.memory.role == "repairer")
    , builder: _.sum(Game.creeps, (c) => c.memory.role == "builder")
    , claimer: _.sum(Game.creeps, (c) => c.memory.role == "claimer")
    , mason: _.sum(Game.creeps, (c) => c.memory.role == "mason")
};

if (Memory.checkForDrops == undefined) {
    Memory.checkForDrops = false;
}

if (Memory.E68N44EnergyAvaliable == undefined) {
    Memory.E68N44EnergyAvaliable = 0;
}

if (Memory.buildOrderFILO == undefined) {
    Memory.buildOrderFILO = false;
}

module.exports.loop = function () {

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            for (let creepType in defaultCreepMins) {
                if (Memory.creeps[name].role == creepType) {
                    currentSpawnedRole = --Memory.creepCounts[creepType];
                    minimumSpawnedRole = Memory.creepMins[creepType];
                    break;
                }
            }
            console.log("Expired " + Memory.creeps[name].role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
            delete Memory.creeps[name];
            Memory.checkForDrops = true;
        }
    }
    
    for (let roomID in Game.rooms) {
        if (Memory.checkForDrops == true) {
            Memory.checkForDrops = false;
            var droppedEnergies = Game.rooms[roomID].find(FIND_DROPPED_ENERGY);
            if (droppedEnergies.length > 0) {
                droppedEnergies.sort(function(a,b){return a.amount - b.amount});
                for (let droppedEnergyID in droppedEnergies) {
                    var droppedEnergy = droppedEnergies[droppedEnergyID];
                    var creep = droppedEnergy.pos.findClosestByRange(FIND_MY_CREEPS, {
                        filter: (c) => (c.spawning == false 
                            && c.memory.droppedEnergyID == undefined 
                            && c.memory.role != "attacker"
                            && c.memory.role != "adaptable"
                            && c.memory.role != "claimer"
                            && c.memory.role != "recycleable"
                            && c.carryCapacity - _.sum(c.carry) >= droppedEnergy.amount 
                    )});
                    if (creep != undefined) {
                        creep.memory.droppedEnergyID = droppedEnergy.id;
                        console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + droppedEnergy.amount + " dropped energy in " + droppedEnergy.room.name);
                    }
                    else {
                        //console.log("Noone avaliable to pickup " + droppedEnergy.amount + " dropped energy in " + droppedEnergy.room.name);
                        Memory.checkForDrops = true;
                    }
                }
            }
        }
        var invaders = Game.rooms[roomID].find(FIND_HOSTILE_CREEPS);
        if (invaders.length > 0) {
            for (let invader in invaders) {

            }
        }
    }
    
    var tower = Game.getObjectById("TOWER_ID");
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    var hostile = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
    if (hostile & !Game.spawns.Spawn1.room.controller.safeMode & Game.spawns.Spawn1.room.controller.safeModeAvailable > 0) {
        Game.spawns.Spawn1.room.controller.activateSafeMode();
        console.log("Activated Safe Mode in: " + Game.spawns.Spawn1.room.name)
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep.spawning) {
            if(creep.memory.droppedEnergyID != undefined) {
                rolePickup.run(creep);
            }
            else if(creep.memory.role == "harvester") {
                roleHarvester.run(creep);
            }
            else if(creep.memory.role == "upgrader") {
                roleUpgrader.run(creep);
            }
            else if(creep.memory.role == "adaptable") {
                roleAdaptable.run(creep);
            }
            else if(creep.memory.role == "builder") {
                roleBuilder.run(creep);
            }
            else if(creep.memory.role == "repairer") {
                roleRepairer.run(creep);
            }
            else if(creep.memory.role == "mason") {
                roleMason.run(creep);
            }
            else if(creep.memory.role == "claimer") {
                roleClaimer.run(creep);
            }
        }
    }

    if (Game.spawns.Spawn1.spawning == undefined) {
        for (let creepType in defaultCreepMins) {
            if (Memory.creepCounts[creepType] < Memory.creepMins[creepType]) {
                var name = Game.spawns.Spawn1.createCustomCreep(creepType);
                if (!(name < 0)) {
                    Memory.creepCounts[creepType] += 1;
                    console.log("Spawning " + Game.creeps[name].memory.role + " (" + Memory.creepCounts[creepType] + "/" + Memory.creepMins[creepType] + "): " + name);
                }
                break;
            }
        }
    }
}
