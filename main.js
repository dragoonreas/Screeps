var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleWallRepairer = require('role.wallrepairer');
var roleClaimer = require('role.claimer');

module.exports.loop = function () {

    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            console.log(Memory.creeps[name].role + " " + name + " expired");
            delete Memory.creeps[name];
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
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
        if(creep.memory.role == 'wallrepairer') {
            roleWallRepairer.run(creep);
        }
        if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
        }
        if(creep.memory.role == 'manual') {
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

    var minimumNumberOfHarvesters = 6;
    var minimumNumberOfUpgraders = 3;
    var minimumNumberOfManuals = 0;
    var minimumNumberOfBuilders = 3;
    var minimumNumberOfRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfClaimers = Memory.minimumNumberOfClaimers;

    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfManuals = _.sum(Game.creeps, (c) => c.memory.role == 'manual');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallrepairer');
    var numberOfClaimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer');
    var name = undefined;
    
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

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'harvester', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = numberOfHarvesters + 1;
            minimumSpawnedRole = minimumNumberOfHarvesters;
        }
    }
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'upgrader', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = numberOfUpgraders + 1;
            minimumSpawnedRole = minimumNumberOfUpgraders;
        }
    }
    else if (numberOfManuals < minimumNumberOfManuals) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'manual', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = numberOfManuals + 1;
            minimumSpawnedRole = minimumNumberOfManuals;
        }
    }
    else if (numberOfRepairers < minimumNumberOfRepairers) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'repairer', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = numberOfRepairers + 1;
            minimumSpawnedRole = minimumNumberOfRepairers;
        }
    }
    else if (numberOfBuilders < minimumNumberOfBuilders) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'builder', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = numberOfBuilders + 1;
            minimumSpawnedRole = minimumNumberOfBuilders;
        }
    }
    else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
        name = Game.spawns.Spawn1.createCreep(customCreepBody, undefined,
            { role: 'wallrepairer', working: false});
        if (!(name < 0)) {
            currentSpawnedRole = numberOfWallRepairers + 1;
            minimumSpawnedRole = minimumNumberOfWallRepairers;
        }
    }
    else if (numberOfClaimers < minimumNumberOfClaimers) {
        name = Game.spawns.Spawn1.createCreep([CLAIM, MOVE], undefined,
            { role: 'claimer', working: false});
        if (!(name < 0)) {
            Memory.minimumNumberOfClaimers = 0;
            currentSpawnedRole = numberOfClaimers + 1;
            minimumSpawnedRole = minimumNumberOfClaimers;
        }
    }

    if (!(name < 0 || name == undefined)) {
        console.log("Spawned " + currentSpawnedRole + "/" + minimumSpawnedRole + " " + Game.creeps[name].memory.role + "s: " + name);
    }
}
