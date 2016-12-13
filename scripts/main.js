require("prototype.memory")();
require("prototype.room")();
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

var estSecPerTick = 3.5; // time between ticks is currently averaging ~3.5 seconds (as of 2016/12/07)
var estTicksPerDay = (86400 / estSecPerTick); // 24h * 60m * 60s = 86400s

_.defaults(Memory, {
    "creeps": {}
    , "rooms": {}
    , "spawns": {}
    , "flags": {}
});

for (let roomID in Game.rooms) {
    var theRoom = Game.rooms[roomID];
    _.defaults(theRoom, {
        "buildOrderFILO": false
        , "checkForDrops": true
        , "hasHostileCreep": true
        , "memoryExpiration": Game.time + estTicksPerDay
    });
    if (theRoom.controller != undefined 
        && (theRoom.controller.my == true 
        || theRoom.controller.reservation != undefined 
        && theRoom.controller.reservation.username == "dragoonreas" 
        || theRoom.controller.reservation == undefined 
        && theRoom.controller.level == 0)) {
        var sources = theRoom.find(FIND_SOURCES);
        for (sourceID in sources) {
            var source = sources[sourceID];
            Memory.sources[source.id] = {
                roomID: source.room.name
                , pos: source.pos
                , regenAt: Game.time + source.ticksToRegeneration
            }
        }
    }
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
Memory.rooms["E54N9"].repairerTypeMins = {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
}; // NOTE: This also defines the build priority

var repairerMins = {};
for (roomID in Game.rooms) {
    var theRoom = Game.rooms[roomID];
    if (theRoom.memory.repairerTypeMins != undefined) {
        repairerMins[roomID] = _.reduce(theRoom.memory.repairerTypeMins, (sum, count) => (sum + count), 0);
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
Memory.rooms["E54N9"].creepMins = {
    attacker: 0
    , harvester: 4
    , powerHarvester: 0
    , upgrader: 2
    , adaptable: 0
    , scout: 0
    , claimer: 0
    , repairer: repairerMins["E54N9"]
    , builder: 1
}; // NOTE: This also defines the build priority

if (Memory.E68N44EnergyAvaliable == undefined) {
    Memory.E68N44EnergyAvaliable = 0;
}

module.exports.loop = function () {

    for (roomID in repairerMins) {
        Memory.rooms[roomID].creepCounts = {};
        for (let creepType in Memory.rooms[roomID].creepMins) {
        	Memory.rooms[roomID].creepCounts[creepType] = _.sum(Game.creeps, (c) => c.memory.roomID == roomID 
        	    && c.memory.role == creepType);
        }
    
        Memory.rooms[roomID].repairerTypeCounts = {};
        for (let repairerType in Memory.rooms[roomID].repairerTypeMins) {
        	Memory.rooms[roomID].repairerTypeCounts[repairerType] = _.sum(Game.creeps, (c) => c.memory.roomID == roomID 
        	    && c.memory.repairerType == repairerType);
        }
    }

    var currentSpawnedRole = 0;
    var minimumSpawnedRole = 0;
    
    var checkingForDrops = false;
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            var creepMemory = Memory.creeps[name];
            if (creepMemory.roomID != "E69N44" && creepMemory.roomID != "E68N45" && creepMemory.roomID != "E54N9") {
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

    for (let roomID in Memory.rooms) {
        if (Game.rooms[roomID] == undefined && Memory.rooms[roomID].memoryExpiration < Game.time) {
            console.log("Running garbage collection on room memory: " + roomID);
            delete Memory.rooms[roomID];
        }
    }
    
    for (let roomID in Game.rooms) {
        var theRoom = Game.rooms[roomID];

        _.defaults(theRoom.memory, {
            "buildOrderFILO": false
            , "checkForDrops": true
            , "hasHostileCreep": true
        });
        theRoom.memory.memoryExpiration = Game.time + estTicksPerDay;

        var theController = theRoom.controller;
        var invaders = theRoom.find(FIND_HOSTILE_CREEPS);
        if (invaders.length > 0) {
            theRoom.hasHostileCreep = true;
            theRoom.checkForDrops = false;
            
			if (roomID == "E68N44" && theRoom.sources["57ef9ee786f108ae6e6101b6"].regenAt <= Game.time) {
				invaders.sort(function(i0,i1){return i0.ticksToLive - i1.ticksToLive});
                theRoom.sources["57ef9ee786f108ae6e6101b6"].regenAt = Game.time + invaders[0].ticksToLive;
				console.log("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + roomID + " for " + invaders[0].ticksToLive + " ticks.");
                Game.notify("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + roomID + " for " + invaders[0].ticksToLive + " ticks.", estSecPerTick * invaders[0].ticksToLive);
			}
			
            for (let invader in invaders) {
				// TODO: Find out who's invading the room, if they're CPU or player owned
            }
			// TODO: Store IDs of invader with highest heal part count, or highest attack+work part count in memory for room so towers don't just target the closest one
			
			if (theController != undefined 
			    && theController.my == true 
			    && theController.safeMode == false 
			    && theController.safeModeAvaliable > 0) {
                // Only activate safemode when we're in real trouble... still need to define that though, so don't do anything in the mean time to avoid wasting charges
				//Game.spawns.Spawn1.room.controller.activateSafeMode();
				//console.log("Activated Safe Mode in: " + roomID);
				//Game.notify("Activated Safe Mode in: " + roomID);
			}
        }
        else if (theRoom.hasHostileCreep == true) {
            theRoom.hasHostileCreep == false;
            theRoom.checkForDrops = true;
        }
        
        if (theRoom.hasHostileTower == true) {
            theRoom.checkForDrops = false;
        }
        else if (theController != undefined && theController.my == false && theController.level > _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_TOWER], (maxBuildable) => maxBuildable > 0)) {
            var hostileTowers = theRoom.find(FIND_HOSTILE_STRUCTURES, (s) => s.structureType == STRUCTURE_TOWER);
            if (hostileTowers.length > 0) {
                theRoom.hasHostileTower = true;
                theRoom.checkForDrops = false;
            }
        }

        if (theRoom.checkForDrops == true || (checkingForDrops == true && theRoom.hasHostileCreep == false && theRoom.hasHostileTower == 0)) {
            theRoom.checkForDrops = false;
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
                            theRoom.checkForDrops = true;
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
			}
            else if (creep.memory.role == "powerHarvester") {
                rolePowerHarvester.run(creep); // NOTE: Runs hoarder role itself, if needed
            } // TODO: add extra role here to retreat to nearest room with a tower to repair if hits < hitsMax
            else if (creep.memory.droppedResourceID != undefined) {
                roleCollector.run(creep);
            }
            else if (_.sum(creep.carry) > creep.carry.energy) {
                roleHoarder.run(creep);
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
