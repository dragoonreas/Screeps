require('prototype.spawn')();
var roleStore = require('role.store');
var rolePickup = require('role.pickup');
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleCustom = require('role.custom');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleRampartRepairer = require('role.rampartrepairer');
var roleWallRepairer = require('role.wallrepairer');
var roleClaimer = require('role.claimer');
var roleRecycle = require('role.recycle');

module.exports.loop = function () {

    var minimumNumberOfHarvesters = 6;
    var minimumNumberOfUpgraders = 3;
    var minimumNumberOfCustoms = 0;
    var minimumNumberOfRepairers = Memory.minimumNumberOfRepairers;
    var minimumNumberOfBuilders = 2;
    var minimumNumberOfRampartRepairers = 1;
    var minimumNumberOfWallRepairers = 1;
    var minimumNumberOfClaimers = Memory.minimumNumberOfClaimers;

    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfCustoms = _.sum(Game.creeps, (c) => c.memory.role == 'custom');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRampartRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'rampartrepairer');
    var numberOfWallRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'wallrepairer');
    var numberOfClaimers = _.sum(Game.creeps, (c) => c.memory.role == 'claimer');

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
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
            else if (Memory.creeps[name].role == 'custom') {
                currentSpawnedRole = numberOfCustoms;
                minimumSpawnedRole = minimumNumberOfCustoms;
            }
            else if (Memory.creeps[name].role == 'repairer') {
                currentSpawnedRole = numberOfRepairers;
                minimumSpawnedRole = minimumNumberOfRepairers;
            }
            else if (Memory.creeps[name].role == 'builder') {
                currentSpawnedRole = numberOfBuilders;
                minimumSpawnedRole = minimumNumberOfBuilders;
            }
            else if (Memory.creeps[name].role == 'rampartrepairer') {
                currentSpawnedRole = numberOfRampartRepairers;
                minimumSpawnedRole = minimumNumberOfRampartRepairers;
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
            Memory.checkForDrops = true;
        }
    }
    
    if (Memory.checkForDrops == true) {
        Memory.checkForDrops = false;
        for (let roomID in Game.rooms) {
            var droppedResources = Game.rooms[roomID].find(FIND_DROPPED_RESOURCES);
            if (droppedResources.length > 0) {
                for (let droppedResourceID in droppedResources) {
                    var droppedResource = droppedResources[droppedResourceID];
                    var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                        filter: (c) => (c.carryCapacity - _.sum(c.carry) >= droppedResource.amount 
                                     && c.memory.droppedResourceID == undefined 
                                     && c.memory.role != 'custom'
                                     && c.spawning == false
                    )});
                    if (creep == undefined) {
                        var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (c) => (_.sum(c.carry) == 0
                                         && c.memory.droppedResourceID == undefined 
                                         && c.memory.role != 'custom'
                                         && c.spawning == false
                        )});
                    }
                    if (creep != undefined) {
                        creep.memory.droppedResourceID = droppedResource.id;
                        console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + droppedResource.amount + " dropped resources in " + droppedResource.room.name);
                    }
                    else {
                        console.log("Noone avaliable to pickup " + droppedResource.amount + " dropped resources in " + droppedResource.room.name);
                        Memory.checkForDrops = true;
                    }
                }
            }
        }
    }
    
    var tower = Game.getObjectById("582cd1c7c25b7e6b34d7c3e5");
    if(tower != undefined) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile != undefined) {
            tower.attack(closestHostile);
            Game.notify("Tower attacking hostile.", 30);
        }
        else {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.hits < s.hitsMax 
                        && s.structureType != STRUCTURE_WALL
                        && s.structureType != STRUCTURE_RAMPART
                        && s.structureType != STRUCTURE_ROAD
            )});
            if(closestDamagedStructure != undefined) {
                tower.repair(closestDamagedStructure);
            }
        }
    }
    
    var hostiles = Game.spawns.Spawn1.room.find(FIND_HOSTILE_CREEPS);
    if (hostiles.length > 0 
        && Game.spawns.Spawn1.room.controller.safeMode == false 
        && Game.spawns.Spawn1.room.controller.safeModeAvailable > 0) {
        Game.spawns.Spawn1.room.controller.activateSafeMode();
        console.log("Activated Safe Mode in: " + Game.spawns.Spawn1.room.name);
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep.spawning) {
            if(_.sum(creep.carry) > creep.carry.energy) {
                roleStore.run(creep);
            }
            else if(creep.memory.droppedResourceID != undefined) {
                rolePickup.run(creep);
            }
            else if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            else if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            else if(creep.memory.role == 'custom') {
                roleCustom.run(creep);
            }
            else if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            else if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            else if(creep.memory.role == 'rampartrepairer') {
                roleRampartRepairer.run(creep);
            }
            else if(creep.memory.role == 'wallrepairer') {
                roleWallRepairer.run(creep);
            }
            else if(creep.memory.role == 'claimer') {
                roleClaimer.run(creep);
            }
            else if(creep.memory.role == 'recycle') {
                roleRecycle.run(creep);
            }
        }
    }

    if (Game.spawns.Spawn1.spawning == undefined) {
        var name = undefined;
        var harvesterRatio = numberOfHarvesters / minimumNumberOfHarvesters;
        currentSpawnedRole = 0;
        minimumSpawnedRole = 0;
        
        if (numberOfHarvesters < minimumNumberOfHarvesters) {
            name = Game.spawns.Spawn1.createCustomCreep('harvester', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfHarvesters;
                minimumSpawnedRole = minimumNumberOfHarvesters;
            }
        }
        else if (numberOfUpgraders < minimumNumberOfUpgraders) {
            name = Game.spawns.Spawn1.createCustomCreep('upgrader', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfUpgraders;
                minimumSpawnedRole = minimumNumberOfUpgraders;
            }
        }
        else if (numberOfCustoms < minimumNumberOfCustoms) {
            name = Game.spawns.Spawn1.createCustomCreep('custom', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfCustoms;
                minimumSpawnedRole = minimumNumberOfCustoms;
            }
        }
        else if (numberOfRepairers < minimumNumberOfRepairers) {
            name = Game.spawns.Spawn1.createCustomCreep('repairer', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfRepairers;
                minimumSpawnedRole = minimumNumberOfRepairers;
            }
        }
        else if (numberOfBuilders < minimumNumberOfBuilders) {
            name = Game.spawns.Spawn1.createCustomCreep('builder', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfBuilders;
                minimumSpawnedRole = minimumNumberOfBuilders;
            }
        }
        else if (numberOfRampartRepairers < minimumNumberOfRampartRepairers) {
            name = Game.spawns.Spawn1.createCustomCreep('rampartrepairer', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfRampartRepairers;
                minimumSpawnedRole = minimumNumberOfRampartRepairers;
            }
        }
        else if (numberOfWallRepairers < minimumNumberOfWallRepairers) {
            name = Game.spawns.Spawn1.createCustomCreep('wallrepairer', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfWallRepairers;
                minimumSpawnedRole = minimumNumberOfWallRepairers;
            }
        }
        else if (numberOfClaimers < minimumNumberOfClaimers) {
            name = Game.spawns.Spawn1.createCustomCreep('claimer', true, harvesterRatio);
            if (!(name < 0)) {
                currentSpawnedRole = ++numberOfClaimers;
                minimumSpawnedRole = minimumNumberOfClaimers;
            }
        }
    
        if (!(name < 0 || name == undefined)) {
            console.log("Spawning " + Game.creeps[name].memory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
        }
    }
}
