var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallrepairer');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {

    var minimumNumberOfHarvesters = 6;
    var minimumNumberOfUpgraders = 3;
    var minimumNumberOfManuals = 0;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfBuilders = 3;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfClaimers = Memory.minimumNumberOfClaimers;

    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfManuals = _.sum(Game.creeps, (c) => c.memory.role == 'manual');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallrepairer');
    var numberOfClaimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer');

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
    var checkForDrops = false;
    
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            if (Memory.creeps[name].role == 'harvester') {
                currentSpawnedRole = numberOfHarvesters;
                minimumSpawnedRole = minimumNumberOfHarvesters;
            }
            else if (Memory.creeps[name].role == 'upgrader') {
                currentSpawnedRole = numberOfUpgraders;
                minimumSpawnedRole = minimumNumberOfUpgraders;
            }
            else if (Memory.creeps[name].role == 'manual') {
                currentSpawnedRole = numberOfManuals;
                minimumSpawnedRole = minimumNumberOfManuals;
            }
            else if (Memory.creeps[name].role == 'repairer') {
                currentSpawnedRole = numberOfRepairers;
                minimumSpawnedRole = minimumNumberOfRepairers;
            }
            else if (Memory.creeps[name].role == 'builder') {
                currentSpawnedRole = numberOfBuilders;
                minimumSpawnedRole = minimumNumberOfBuilders;
            }
            else if (Memory.creeps[name].role == 'wallrepairer') {
                currentSpawnedRole = numberOfWallRepairers;
                minimumSpawnedRole = minimumNumberOfWallRepairers;
            }
            else if (Memory.creeps[name].role == 'claimer') {
                currentSpawnedRole = numberOfClaimers;
                minimumSpawnedRole = minimumNumberOfClaimers;
            }
            console.log("Expired " + Memory.creeps[name].role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
            delete Memory.creeps[name];
            checkForDrops = true;
        }
    }
    
    if (checkForDrops) {
        for (let roomID in Game.rooms) {
            var droppedEnergies = Game.rooms[roomID].find(FIND_DROPPED_ENERGY);
            if (droppedEnergies.length > 0) {
                for (let droppedEnergyID in droppedEnergies) {
                    var droppedEnergy = droppedEnergies[droppedEnergyID];
                    var creep = droppedEnergy.pos.findClosestByRange(FIND_MY_CREEPS, {
                        filter: (c) => (c.carryCapacity - _.sum(c.carry) >= droppedEnergy.amount) 
                        & c.memory.droppedEnergyID == undefined 
                        & c.spawning == false
                    });
                    if (creep) {
                        creep.memory.droppedEnergyID = droppedEnergy.id;
                        console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + droppedEnergy.amount + " dropped energy in " + droppedEnergy.room.name);
                    }
                    else {
                        console.log("Noone avaliable to pickup " + droppedEnergy.amount + " dropped energy in " + droppedEnergy.room.name);
                    }
                }
            }
        }
    }
    
    var tower = Game.getObjectById('TOWER_ID');
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
        if(creep.memory.droppedEnergyID != undefined) {
            var droppedEnergy = Game.getObjectById(creep.memory.droppedEnergyID);
            if (droppedEnergy == undefined) {
                creep.memory.droppedEnergyID = undefined;
                console.log(creep.name + " failed to pickup the dropped energy in " + creep.room.name);
                creep.say("Aww...");
            }
            else if(creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy);
                creep.say("Mine!");
            }
            else {
                creep.memory.droppedEnergyID = undefined;
                console.log(creep.name + " picked up the dropped energy in " + creep.room.name);
                creep.say("Yay!");
            }
        }
        else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        else if(creep.memory.role == 'wallrepairer') {
            roleWallRepairer.run(creep);
        }
        else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        else if(creep.memory.role == 'manual') {
            if(creep.memory.working && creep.carry.energy == 0) {
                creep.memory.working = false;
            }
            if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
            }

            if(creep.memory.working) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[targets.length-1]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[targets.length-1]);
                    }
                }
                else {
                    roleHarvester.run(creep);
                }
            }
            else {
                var source = Game.getObjectById("57ef9efc86f108ae6e610380");
                if (source == undefined) {
                    source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
                }
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }

    var customCreepBody = [WORK,CARRY,MOVE,MOVE];
    if (numberOfHarvesters > minimumNumberOfHarvesters / 2 & Game.spawns.Spawn1.room.energyCapacityAvailable >= 500) {
        var partMultiplier = Math.floor(Game.spawns.Spawn1.room.energyCapacityAvailable / 250);
        customCreepBody = [];
        for (let i = 0; i < partMultiplier; i++) {
            customCreepBody.push(WORK);
        }
        for (let i = 0; i < partMultiplier; i++) {
            customCreepBody.push(CARRY);
        }
        for (let i = 0; i < partMultiplier * 2; i++) {
            customCreepBody.push(MOVE);
        }
    }
    
    var name = undefined;
    currentSpawnedRole = 0;
    minimumSpawnedRole = 0;
    
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'harvester', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = ++numberOfHarvesters;
            minimumSpawnedRole = minimumNumberOfHarvesters;
        }
    }
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'upgrader', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = ++numberOfUpgraders;
            minimumSpawnedRole = minimumNumberOfUpgraders;
        }
    }
    else if (numberOfManuals < minimumNumberOfManuals) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'manual', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = ++numberOfManuals;
            minimumSpawnedRole = minimumNumberOfManuals;
        }
    }
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'repairer', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = ++numberOfRepairers;
            minimumSpawnedRole = minimumNumberOfRepairers;
        }
    }
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'builder', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = ++numberOfBuilders;
            minimumSpawnedRole = minimumNumberOfBuilders;
        }
    }
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'wallrepairer', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = ++numberOfWallRepairers;
            minimumSpawnedRole = minimumNumberOfWallRepairers;
        }
    }
    else if (numberOfClaimers < minimumNumberOfClaimers) {
        name = Game.spawns.Spawn1.createCreep([CLAIM, MOVE], undefined,
            { role: 'claimer', working: false});
        if (!(name < 0)) {
            Memory.minimumNumberOfClaimers = 0;
            currentSpawnedRole = ++numberOfClaimers;
            minimumSpawnedRole = minimumNumberOfClaimers;
        }
    }

    if (!(name < 0 || name == undefined)) {
        console.log("Spawning " + Game.creeps[name].memory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
    }
}
