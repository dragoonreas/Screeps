require("prototype.source")();
require("prototype.spawn")();
var roleAttacker = require("role.attacker");
var roleHoarder = require("role.hoarder");
var roleCollector = require("role.collector");
var roleHarvester = require("role.harvester");
var rolePowerHarvester = require("role.powerHarvester");
var roleUpgrader = require("role.upgrader");
var roleAdaptable = require("role.adaptable");
var roleRepairer = require("role.repairer");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleRecyclable = require("role.recyclable");

var estSecPerTick = 4; // time between ticks is currently averaging 3-point-something seconds, so round up to 4 seconds

Memory.repairerTypeMins = {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 3
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
}; // NOTE: This also defines the build priority

// get repairer minimum
var repairerMin = 0;
for (let repairerTypeMin in Memory.repairerTypeMins) {
    repairerMin += Memory.repairerTypeMins[repairerTypeMin];
}

Memory.creepMins = {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 3
    , adaptable: 0
    , repairer: repairerMin
    , builder: 1
    , claimer: 0
}; // NOTE: This also defines the build priority

// validate check for drops flags
if (Memory.checkForDrops == undefined) {
    Memory.checkForDrops = {};
    for (let roomID in Game.rooms) {
        Memory.checkForDrops[roomID] = true;
    }
}
else {
    for (let roomID in Memory.checkForDrops) {
        if (Game.rooms[roomID] == undefined) {
            delete Memory.checkForDrops[roomID];
        }
    }
    
    for (let roomID in Game.rooms) {
        if (Memory.checkForDrops[roomID] == undefined) {
            Memory.checkForDrops[roomID] = true;
        }
    }
}

// validate time for when E68N44's energy will be avaliable again
if (Memory.E68N44EnergyAvaliable == undefined) {
    Memory.E68N44EnergyAvaliable = 0;
}

Memory.buildOrderFILO = false;

module.exports.loop = function () {

    Memory.creepCounts = {};
    for (let creepType in Memory.creepMins) {
    	Memory.creepCounts[creepType] = _.sum(Game.creeps, (c) => c.memory.role == creepType);
    }
    
    Memory.repairerTypeCounts = {};
    for (let repairerType in Memory.repairerTypeMins) {
    	Memory.repairerTypeCounts[repairerType] = _.sum(Game.creeps, (c) => c.memory.repairerType == repairerType);
    }

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
    var checkingForDrops = false;
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            if (Memory.creeps[name].role != undefined && Memory.creepCounts[Memory.creeps[name].role] != undefined) {
                currentSpawnedRole = Memory.creepCounts[Memory.creeps[name].role];
                minimumSpawnedRole = Memory.creepMins[Memory.creeps[name].role];
            }
            console.log("Expired " + Memory.creeps[name].role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
            delete Memory.creeps[name];
            
            if (checkingForDrops == false) {
                for (let roomID in Game.rooms) {
                    Memory.checkForDrops[roomID] = true;
                }
                checkingForDrops = true;
            }
        }
    }
    
    for (let roomID in Game.rooms) {
        if (Memory.checkForDrops[roomID] == true) {
            Memory.checkForDrops[roomID] = false;
            var droppedResources = Game.rooms[roomID].find(FIND_DROPPED_RESOURCES);
            if (droppedResources.length > 0) {
                droppedResources.sort(function(a,b){return a.amount - b.amount});
                for (let droppedResourceID in droppedResources) {
                    var droppedResource = droppedResources[droppedResourceID];
					var assignedCreeps = Game.rooms[roomID].find(FIND_MY_CREEPS, {
                        filter: (c) => (c.memory.droppedResourceID == droppedResource.id
                    )});
					if (assignedCreeps.length == 0) {
                        var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (c) => (c.spawning == false 
                                && c.memory.droppedResourceID == undefined 
                                && c.memory.role != "attacker" 
                                && c.memory.role != "powerHarvester"
                                && c.memory.role != "adaptable" 
                                && c.memory.role != "claimer" 
                                && c.memory.role != "recyclable" 
                                && c.carryCapacity - _.sum(c.carry) >= droppedResource.amount 
                        )});
                        if (creep == undefined) {
                            var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                                filter: (c) => (c.spawning == false 
                                    && c.memory.droppedResourceID == undefined 
                                    && c.memory.role != "attacker" 
                                    && c.memory.role != "powerHarvester"
                                    && c.memory.role != "adaptable" 
                                    && c.memory.role != "claimer" 
                                    && c.memory.role != "recyclable" 
                                    && c.carryCapacity > 0 
                                    && _.sum(c.carry) == 0 
                            )});
                            if (creep == undefined) {
                                var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                                    filter: (c) => (c.spawning == false 
                                        && c.memory.droppedResourceID == undefined 
                                        && c.memory.role != "attacker" 
                                        && c.memory.role != "powerHarvester"
                                        && c.memory.role != "adaptable" 
                                        && c.memory.role != "claimer" 
                                        && c.memory.role != "recyclable" 
                                        && c.carryCapacity > 0 
                                        && _.sum(c.carry) < c.carryCapacity
                                )});
                            }
                        }
                        if (creep != undefined) {
                            creep.memory.droppedResourceID = droppedResource.id;
                            console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + droppedResource.room.name);
                        }
                        else {
                            console.log("No creeps avaliable to pickup " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + droppedResource.room.name);
                            Memory.checkForDrops[roomID] = true;
                    	}
					}
                }
            }
        }
        
        var invaders = Game.rooms[roomID].find(FIND_HOSTILE_CREEPS);
        if (invaders.length > 0) {
			if (Game.rooms[roomID].name == "E68N44" && Memory.E68N44EnergyAvaliable <= Game.time) {
				invaders.sort(function(i0,i1){return i0.ticksToLive - i1.ticksToLive});
                Memory.E68N44EnergyAvaliable = Game.time + invaders[0].ticksToLive;
				console.log("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + Game.rooms[roomID].name + " for " + invaders[0].ticksToLive + " ticks.");
                Game.notify("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + Game.rooms[roomID].name + " for " + invaders[0].ticksToLive + " ticks.", estSecPerTick * invaders[0].ticksToLive);
			}
            for (let invader in invaders) {
				// TODO: Find out who's invading the room, if they're CPU or player owned
            }
			// TODO: Store IDs of invader with highest heal part count, or highest attack+work part count in memory for room so towers don't just target the closest one
			for (let spawnID in Game.spawns) {
				if (Game.spawns[spawnID].room.name == roomID && Game.spawns[spawnID].room.controller.safeMode == false && Game.spawns[spawnID].room.controller.safeModeAvaliable > 0) {
					//Game.spawns.Spawn1.room.controller.activateSafeMode();
					//console.log("Activated Safe Mode in: " + roomID);
					//Game.notify("Activated Safe Mode in: " + roomID);
				}
			}
        }
        
		var towers = Game.rooms[roomID].find(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_TOWER
        )});
		for (let towerID in towers) {
            var tower = towers[towerID];
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
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!creep.spawning) {
            if (creep.memory.role == undefined) {
                creep.memory.role = "harvester";
            }
            if (creep.memory.working == undefined) {
                creep.memory.working = false;
            }
            
            if (creep.memory.role == "attacker") {
				roleAttacker.run(creep);
			}
            else if (creep.memory.role == "powerHarvester") {
                rolePowerHarvester.run(creep);
            }
            else if (creep.carry != undefined && _.sum(creep.carry) > creep.carry.energy) {
                roleHoarder.run(creep);
            }
            else if (creep.memory.droppedResourceID != undefined) {
                roleCollector.run(creep);
            }
            else if (creep.memory.role == "harvester") {
                roleHarvester.run(creep);
            }
            else if (creep.memory.role == "upgrader") {
                roleUpgrader.run(creep);
            }
            else if (creep.memory.role == "adaptable") {
                roleAdaptable.run(creep);
            }
            else if (creep.memory.role == "repairer") {
                roleRepairer.run(creep);
            }
            else if (creep.memory.role == "builder") {
                roleBuilder.run(creep);
            }
            else if (creep.memory.role == "claimer") {
                roleClaimer.run(creep);
            }
            else if (creep.memory.role == "recyclable") {
                roleRecyclable.run(creep);
            }
        }
    }

    if (Game.spawns.Spawn1.spawning == undefined) {
        for (let creepType in Memory.creepMins) {
            if (Memory.creepCounts[creepType] < Memory.creepMins[creepType]) {
                var name = Game.spawns.Spawn1.createCustomCreep(creepType);
                if (name < 0 == false) {
                    Memory.creepCounts[creepType] += 1;
                    console.log("Spawning " + Game.creeps[name].memory.role + " (" + Memory.creepCounts[creepType] + "/" + Memory.creepMins[creepType] + "): " + name);
                }
                break;
            }
        }
    }
}
