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
var roleScout = require("role.scout");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleRecyclable = require("role.recyclable");

var estSecPerTick = 4; // time between ticks is currently averaging 3-point-something seconds, so round up to 4 seconds

if (Memory.rooms == undefined) {
    Memory.rooms = {};
}
for (let roomID in Game.rooms) {
    var theRoom = Game.rooms[roomID];
    if (theRoom.memory == undefined) {
        theRoom.memory = {};
    }
    if (theRoom.memory.checkForDrops == undefined) {
        theRoom.memory.checkForDrops = true;
    }
    if (theRoom.memory.buildOrderFILO == undefined) {
        theRoom.memory.buildOrderFILO = false
    }
    if (theRoom.memory.hostileCreep == undefined) {
        theRoom.memory.hostileCreep = true;
    }
    // TODO: use lastVisited time and persistant flag variables to manage garbage collection here
}

Memory.rooms["E69N44"].repairerTypeMins = {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
}; // NOTE: This also defines the build priority
Memory.rooms["E68N45"].repairerTypeMins = {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
}; // NOTE: This also defines the build priority

var repairerMins = {
    E69N44: 0
    , E68N45: 0
};
for (let roomID in repairerMins) {
    for (let repairerTypeMin in Memory.rooms[roomID].repairerTypeMins) {
        repairerMins[roomID] += Memory.rooms[roomID].repairerTypeMins[repairerTypeMin];
    }
}

Memory.rooms["E69N44"].creepMins = {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 3
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: repairerMins["E69N44"]
    , builder: 1
}; // NOTE: This also defines the build priority
Memory.rooms["E68N45"].creepMins = {
    attacker: 0
    , harvester: 2
    , powerHarvester: 0
    , upgrader: 2
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: repairerMins["E68N45"]
    , builder: 1
}; // NOTE: This also defines the build priority

if (Memory.E68N44EnergyAvaliable == undefined) {
    Memory.E68N44EnergyAvaliable = 0;
}

module.exports.loop = function () {

    Memory.rooms["E69N44"].creepCounts = {};
    for (let creepType in Memory.rooms["E69N44"].creepMins) {
    	Memory.rooms["E69N44"].creepCounts[creepType] = _.sum(Game.creeps, (c) => c.memory.roomID == "E69N44" 
    	    && c.memory.role == creepType);
    }
    Memory.rooms["E68N45"].creepCounts = {};
    for (let creepType in Memory.rooms["E68N45"].creepMins) {
    	Memory.rooms["E68N45"].creepCounts[creepType] = _.sum(Game.creeps, (c) => c.memory.roomID == "E68N45" 
    	    && c.memory.role == creepType);
    }

    Memory.rooms["E69N44"].repairerTypeCounts = {};
    for (let repairerType in Memory.rooms["E69N44"].repairerTypeMins) {
    	Memory.rooms["E69N44"].repairerTypeCounts[repairerType] = _.sum(Game.creeps, (c) => c.memory.roomID == "E69N44" 
    	    && c.memory.repairerType == repairerType);
    }
    Memory.rooms["E68N45"].repairerTypeCounts = {};
    for (let repairerType in Memory.rooms["E68N45"].repairerTypeMins) {
    	Memory.rooms["E68N45"].repairerTypeCounts[repairerType] = _.sum(Game.creeps, (c) => c.memory.roomID == "E68N45" 
    	    && c.memory.repairerType == repairerType);
    }

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
    var checkingForDrops = false;
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            var creepMemory = Memory.creeps[name];
            if (creepMemory.roomID != "E69N44" && creepMemory.roomID != "E68N45") {
                creepMemory.roomID = "E69N44";
            }
            if (creepMemory.role != undefined && Memory.rooms[creepMemory.roomID].creepCounts[creepMemory.role] != undefined) {
                currentSpawnedRole = Memory.rooms[creepMemory.roomID].creepCounts[creepMemory.role];
                minimumSpawnedRole = Memory.rooms[creepMemory.roomID].creepMins[creepMemory.role];
            }
            console.log("Expired " + creepMemory.roomID + " " + creepMemory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
            delete Memory.creeps[name];
            
            if (checkingForDrops == false) {
                checkingForDrops = true;
            }
        }
    }
    
    for (let roomID in Game.rooms) {
        var theRoom = Game.rooms[roomID];
        if (theRoom.memory == undefined) {
            theRoom.memory = {};
        }
        if (theRoom.memory.checkForDrops == undefined) {
            theRoom.memory.checkForDrops = true;
        }
        if (theRoom.memory.buildOrderFILO == undefined) {
            theRoom.memory.buildOrderFILO = false
        }
        if (theRoom.memory.hostileCreep == undefined) {
            theRoom.memory.hostileCreep = true;
        }
        
        var invaders = theRoom.find(FIND_HOSTILE_CREEPS);
        if (invaders.length > 0) {
            theRoom.memory.hostileCreep = true;
            
			if (roomID == "E68N44" && Memory.E68N44EnergyAvaliable <= Game.time) {
				invaders.sort(function(i0,i1){return i0.ticksToLive - i1.ticksToLive});
                Memory.E68N44EnergyAvaliable = Game.time + invaders[0].ticksToLive;
				console.log("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + roomID + " for " + invaders[0].ticksToLive + " ticks.");
                Game.notify("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + roomID + " for " + invaders[0].ticksToLive + " ticks.", estSecPerTick * invaders[0].ticksToLive);
			}
			
            for (let invader in invaders) {
				// TODO: Find out who's invading the room, if they're CPU or player owned
            }
			// TODO: Store IDs of invader with highest heal part count, or highest attack+work part count in memory for room so towers don't just target the closest one
			
			var theController = theRoom.controller;
			if (theController != undefined 
			    && theController.my == true 
			    && theController.safeMode == false 
			    && theController.safeModeAvaliable > 0) {
				//Game.spawns.Spawn1.room.controller.activateSafeMode();
				//console.log("Activated Safe Mode in: " + roomID);
				//Game.notify("Activated Safe Mode in: " + roomID);
			}
        }
        else {
            if (theRoom.memory.hostileCreep == true) {
                theRoom.memory.checkForDrops = true;
                theRoom.memory.hostileCreep == false;
            }
        }
        
        if (theRoom.memory.checkForDrops == true || checkingForDrops == true) {
            theRoom.memory.checkForDrops = false;
            var droppedResources = theRoom.find(FIND_DROPPED_RESOURCES);
            if (droppedResources.length > 0) {
                droppedResources.sort(function(a,b){return b.amount - a.amount});
                for (let droppedResourceID in droppedResources) {
                    var droppedResource = droppedResources[droppedResourceID];
					var assignedCreeps = theRoom.find(FIND_MY_CREEPS, {
                        filter: (c) => (c.memory.droppedResourceID == droppedResource.id
                    )});
					if (assignedCreeps.length == 0) {
                        var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (c) => (c.spawning == false 
                                && c.memory.droppedResourceID == undefined 
                                && c.memory.speed <= 2
                                && c.memory.role != "attacker" 
                                && c.memory.role != "powerHarvester"
                                && c.memory.role != "adaptable" 
                                && c.memory.role != "scout"
                                && c.memory.role != "claimer" 
                                && c.memory.role != "recyclable" 
                                && c.carryCapacity - _.sum(c.carry) >= droppedResource.amount 
                        )});
                        if (creep == undefined) {
                            var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                                filter: (c) => (c.spawning == false 
                                    && c.memory.droppedResourceID == undefined 
                                    && c.memory.speed <= 2
                                    && c.memory.role != "attacker" 
                                    && c.memory.role != "powerHarvester"
                                    && c.memory.role != "adaptable" 
                                    && c.memory.role != "scout"
                                    && c.memory.role != "claimer" 
                                    && c.memory.role != "recyclable" 
                                    && c.carryCapacity > 0 
                                    && _.sum(c.carry) == 0 
                            )});
                            if (creep == undefined) {
                                var creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                                    filter: (c) => (c.spawning == false 
                                        && c.memory.droppedResourceID == undefined 
                                        && c.memory.speed <= 2
                                        && c.memory.role != "attacker" 
                                        && c.memory.role != "powerHarvester"
                                        && c.memory.role != "adaptable" 
                                        && c.memory.role != "scout"
                                        && c.memory.role != "claimer" 
                                        && c.memory.role != "recyclable" 
                                        && c.carryCapacity > 0 
                                        && _.sum(c.carry) < c.carryCapacity
                                )});
                            }
                        }
                        if (creep != undefined) {
                            creep.memory.droppedResourceID = droppedResource.id;
                            console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + Math.min(droppedResource.amount, creep.carryCapacity - _.sum(creep.carry)) + " of " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + roomID);
                        }
                        else {
                            console.log("No creeps avaliable to pickup " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + roomID);
                            Memory.rooms[roomID].checkForDrops = true;
                    	}
					}
                }
            }
        }
        
		var towers = theRoom.find(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType == STRUCTURE_TOWER
        )});
		for (let towerID in towers) {
            var tower = towers[towerID];
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != undefined) {
        	    tower.attack(target);
        	    console.log("Tower in " + roomID + " attacking hostile from " + target.owner.username);
        	    Game.notify("Tower in " + roomID + " attacking hostile from " + target.owner.username, 30);
            }
        	else {
        	    target = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        	        filter: (s) => (s.hits < s.hitsMax 
        	        	&& s.structureType != STRUCTURE_WALL
        	            && s.structureType != STRUCTURE_ROAD
        	            && s.structureType != STRUCTURE_RAMPART
        	            && s.structureType != STRUCTURE_CONTAINER
        	    )});
        	    if(target != undefined) {
        	        tower.repair(target);
        	    }
        	    else {
        	        target = tower.pos.findClosestByRange(FIND_MY_CREEPS, { 
        	            filter: (c) => (c.hits < c.hitsMax
        	        )});
        	        if (target != undefined) {
        	            tower.heal(target);
        	        }
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
            if (creep.memory.speed == undefined) {
                creep.memory.speed = 2;
            }
            
            if (creep.memory.role == "attacker") {
				roleAttacker.run(creep);
			} // TODO: retreat to nearest tower if hits < hitsMax
            else if (creep.memory.role == "powerHarvester") {
                rolePowerHarvester.run(creep); // NOTE: Runs hoarder role itself, if needed
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
            else if (creep.memory.role == "scout") {
                roleScout.run(creep);
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
    
    for (let spawnID in Game.spawns) {
        var spawn = Game.spawns[spawnID];
        if (spawn.spawning == undefined) {
            var roomID = spawn.room.name;
            var creepMins = Memory.rooms[roomID].creepMins;
            for (let creepType in creepMins) {
                if (Memory.rooms[roomID].creepCounts[creepType] < creepMins[creepType]) {
                    var creepName = spawn.createCustomCreep(creepType);
                    if (creepName < 0 == false) {
                        Memory.rooms[roomID].creepCounts[creepType] += 1;
                        console.log("Spawning " + creepType + " (" + Memory.rooms[roomID].creepCounts[creepType] + "/" + creepMins[creepType] + ") in " + roomID + ": " + creepName);
                    }
                    break;
                }
            }
        }
    }
}
