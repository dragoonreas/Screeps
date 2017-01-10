require("prototype.memory")();
require("prototype.room")();
require("prototype.source")();
require("prototype.spawn")();

var roleAttacker = require("role.attacker");
var roleHoarder = require("role.hoarder");
var roleCollector = require("role.collector");
var roleHarvester = require("role.harvester");
var roleMiner = require("role.miner");
var roleHauler = require("role.hauler");
var rolePowerHarvester = require("role.powerHarvester");
var roleUpgrader = require("role.upgrader");
var roleAdaptable = require("role.adaptable");
var roleRepairer = require("role.repairer");
var roleScout = require("role.scout");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleRecyclable = require("role.recyclable");

var estSecPerTick = 3.5; // time between ticks is currently averaging ~3.5 seconds (as of 2016/12/07)
var estTicksPerDay = Math.floor(86400 / estSecPerTick); // 24h * 60m * 60s = 86400s

_.defaultsDeep(Memory, {
    "creeps": {}
    , "rooms": {}
    , "spawns": {}
    , "flags": {}
    , "TooAngleDealings": { // can pay a friend tax to opt into this AIs non-agressive list (wish more people did this...)
        "idiotRating": 0 // stay below 0 to be friendly with this AI (value needs to be entered manually based on what their creep by the controller says)
    }
    , "agressivePlayers": [ // these players attack first and ask questions later (if at all)
        "rysade"
        , "roncli" // turns out they were just using my lower RCL rooms as a low-risk targets to improve their combat code with
    ]
    , "nonAgressivePlayers": [ // nice players that have added "dragoonreas" to their own non-agressive list and which won't be considered 'invaders' when looping through Game.rooms (so turrents won't fire on them)
        "Bovius"
    ]
});

for (let roomID in Game.rooms) {
    let theRoom = Game.rooms[roomID];
    _.defaults(theRoom, {
        "buildOrderFILO": false
        , "checkForDrops": true
        , "hasHostileCreep": true
        , "memoryExpiration": Game.time + estTicksPerDay
    });
    
    let sources = theRoom.find(FIND_SOURCES);
    for (let source of sources) {
        _.defaults(Memory.sources[source.id], {
            pos: source.pos
        });

            if (source.regenAt == undefined) {
                console.log("Couldn't initialise Source.regenAt for source at " + JSON.stringify(source.pos));
            }
            else if (source.energy == 0 && source.regenAt < (Game.time + source.ticksToRegeneration)) {
                source.regenAt = Game.time + source.ticksToRegeneration;
                console.log("Energy source at " + JSON.stringify(source.pos) + " will regen in " + source.ticksToRegeneration + " ticks");
            }
        }
    }
}

/*
    TODO:
    These should be stored in an array instead of an object since their order also defines the build priority.
    Also be sure to use for...of instead of for..in where their order is important
*/
_.set(Memory.rooms, ["E69N44", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
});
_.set(Memory.rooms, ["E68N45", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
});
_.set(Memory.rooms, ["W53N32", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_WALL]: 1
    , "all": 0
});

var repairerMins = {};
for (let roomID in Game.rooms) {
    let theRoom = Game.rooms[roomID];
    if (theRoom.memory.repairerTypeMins != undefined) {
        repairerMins[roomID] = _.reduce(theRoom.memory.repairerTypeMins, (sum, count) => (sum + count), 0);
    }
}

/*
    TODO:
    These should be stored in an array instead of an object since their order also defines the build priority.
    Also be sure to use for...of instead of for..in where their order is important
*/
_.set(Memory.rooms, ["E69N44", "creepMins"], {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 3
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: repairerMins["E69N44"]
    , builder: 1
});
_.set(Memory.rooms, ["E68N45", "creepMins"], {
    attacker: 0
    , harvester: 2
    , powerHarvester: 0
    , upgrader: 2
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: repairerMins["E68N45"]
    , builder: 1
});
_.set(Memory.rooms, ["W53N32", "creepMins"], {
    attacker: 0
    , harvester: 3
    , powerHarvester: 0
    , upgrader: 4
    , adaptable: 0
    , scout: 0
    , claimer: 0
    , repairer: repairerMins["W53N32"]
    , builder: 1
});

_.set(Memory.rooms, ["E69N44", "harvestRooms"], [
    "E68N44"
]);
_.set(Memory.rooms, ["E68N45", "harvestRooms"], [
    "E68N44"
]);
_.set(Memory.rooms, ["W53N32", "harvestRooms"], [
    "W53N33"
]);

module.exports.loop = function () {
    require("prototype.memory")(); // TODO: Try and find a way to make this a prototype of memory so this doesn't have to be done each tick

    for (let roomID in repairerMins) {
        Memory.rooms[roomID].creepCounts = {};
        for (let creepType in Memory.rooms[roomID].creepMins) {
            Memory.rooms[roomID].creepCounts[creepType] = _.sum(Game.creeps, (c) => (
                c.memory.roomID == roomID 
                && c.memory.role == creepType
            ));
        }
    
        Memory.rooms[roomID].repairerTypeCounts = {};
        for (let repairerType in Memory.rooms[roomID].repairerTypeMins) {
            Memory.rooms[roomID].repairerTypeCounts[repairerType] = _.sum(Game.creeps, (c) => (
                c.memory.roomID == roomID 
                && c.memory.repairerType == repairerType
            ));
        }
    }
    
    Memory.TooAngleDealings.isFriendly = (Memory.TooAngleDealings.idiotRating < 0);
    if (
        Memory.TooAngleDealings.isFriendly == false 
        && Memory.TooAngleDealings.lastIdiotRating != Memory.TooAngleDealings.idiotRating
    ) {
        let energySellOrders = Game.market.getAllOrders({
          type: ORDER_SELL
          , resourceType: RESOURCE_ENERGY
        });
        let energyPrice = _.sortBy(energySellOrders, (o) => (
            o.price
        ))[0].price;
        Memory.TooAngleDealings.energyToFriendly = (parseInt(Memory.TooAngleDealings.idiotRating) + 1) / energyPrice;
        Memory.TooAngleDealings.totalCost = Memory.TooAngleDealings.energyToFriendly + Game.market.calcTransactionCost(Memory.TooAngleDealings.energyToFriendly, "E69N44", "E33N15"); // TODO: Make sure the total cost isn't more than what the terminal can hold, and if it is divide it up into multiple transactions
        Memory.TooAngleDealings.lastIdiotRating = Memory.TooAngleDealings.idiotRating;
    }
    
    let dealingsTerminal = Game.rooms["E69N44"].terminal;
    if (Memory.TooAngleDealings.isFriendly == false && dealingsTerminal != undefined && dealingsTerminal.store.energy >= Math.min(dealingsTerminal.storeCapacity, Memory.TooAngleDealings.totalCost)) {
        if (dealingsTerminal.send(RESOURCE_ENERGY, Memory.TooAngleDealings.energyToFriendly, "E33N15", "brain.isFriend('Dragoonreas') == true?") == OK) {
            console.log("Used " + Memory.TooAngleDealings.totalCost + " energy to lose " + Memory.TooAngleDealings.idiotRating + " to be friendly with TooAngle");
            Game.notify("Used " + Memory.TooAngleDealings.totalCost + " energy to lose " + Memory.TooAngleDealings.idiotRating + " to be friendly with TooAngle");
            Memory.TooAngleDealings.idiotRating = -1;
            Memory.TooAngleDealings.lastIdiotRating = Memory.TooAngleDealings.idiotRating;
        }
    }
    
    let currentSpawnedRole = 0;
    let minimumSpawnedRole = 0;
    
    let checkingForDrops = false;
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            let creepMemory = Memory.creeps[name];
            if (creepMemory.roomID != "E69N44" && creepMemory.roomID != "E68N45" && creepMemory.roomID != "E54N9" && creepMemory.roomID != "E39N24" && creepMemory.roomID != "E39N17" && creepMemory.roomID != "E43N18" && creepMemory.roomID != "W53N32") {
                creepMemory.roomID = "E69N44";
            }
            if (creepMemory.role != undefined && Memory.rooms[creepMemory.roomID].creepCounts[creepMemory.role] != undefined) {
                currentSpawnedRole = Memory.rooms[creepMemory.roomID].creepCounts[creepMemory.role];
                minimumSpawnedRole = Memory.rooms[creepMemory.roomID].creepMins[creepMemory.role];
                if (creepMemory.role == "adaptable") { // Currently just using the adapatable role to send reinforcement workers to new rooms and setting their new role when they get there, so none should end up dying with this role unless they fail to make it to their destination
                    console.log("Adaptable from " + creepMemory.roomID + " only made it past waypoint " + _.get(creepMemory, "waypoint", 0));
                    Game.notify("Adaptable from " + creepMemory.roomID + " only made it past waypoint " + _.get(creepMemory, "waypoint", 0));
                }
                else if (creepMemory.role == "scout" && creepMemory.goalReached != true) {
                    console.log("Scout from " + creepMemory.roomID + " only made it past waypoint " + creepMemory.waypoint);
                    Game.notify("Scout from " + creepMemory.roomID + " only made it past waypoint " + creepMemory.waypoint);
                    Memory.rooms[creepMemory.roomID].creepMins[creepMemory.role] = 0;
                }
            }
            console.log("Expired " + creepMemory.roomID + " " + creepMemory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + name);
            delete Memory.creeps[name];
            
            if (checkingForDrops == false) {
                checkingForDrops = true;
            }
        }
    }

    for (let roomID in Memory.rooms) {
        if (Game.rooms[roomID] == undefined 
            && (Memory.rooms[roomID].memoryExpiration || 0) < Game.time) {
            console.log("Running garbage collection on room memory: " + roomID);
            delete Memory.rooms[roomID];
        }
    }
    
    for (let roomID in Game.rooms) {
        let theRoom = Game.rooms[roomID];

        _.defaults(theRoom.memory, {
            "buildOrderFILO": false
            , "checkForDrops": true
            , "hasHostileCreep": true
        });
        theRoom.memory.memoryExpiration = Game.time + estTicksPerDay;
        
        let sources = theRoom.find(FIND_SOURCES);
        for (let sourceID in sources) {
            let source = sources[sourceID];
            _.defaults(Memory.sources[source.id], {
                pos: source.pos
            });

            if (source.regenAt == undefined) {
                console.log("Couldn't initialise Source.regenAt for source at " + JSON.stringify(source.pos));
            }
            else if (source.energy == 0 && source.regenAt < (Game.time + source.ticksToRegeneration)) {
                source.regenAt = Game.time + source.ticksToRegeneration;
                console.log("Energy source at " + JSON.stringify(source.pos) + " will regen in " + source.ticksToRegeneration + " ticks");
            }
        }

        let theController = theRoom.controller;
        let invaders = theRoom.find(FIND_HOSTILE_CREEPS, {
            filter: (i) => (_.includes(Memory.nonAgressivePlayers, i.owner.username) == false
        )});
        if (invaders.length > 0) {
            theRoom.hasHostileCreep = true;
            if (theController == undefined || theController.my == false || theController.safeMode == undefined) {
                theRoom.checkForDrops = false;
            }
            
            // TODO: Spawn attackers to defend instead of evacuating harvesters in harvest rooms
			if (roomID == "E68N44" && theRoom.sources["57ef9ee786f108ae6e6101b6"].regenAt < Game.time) {
				invaders.sort( (i0, i1) => (i0.ticksToLive - i1.ticksToLive) );
                theRoom.sources["57ef9ee786f108ae6e6101b6"].regenAt = Game.time + invaders[0].ticksToLive;
				console.log("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + roomID + " for " + invaders[0].ticksToLive + " ticks.");
                Game.notify("Enemy creep owned by " + invaders[0].owner.username + " shutting down harvesting from " + roomID + " for " + invaders[0].ticksToLive + " ticks.", estSecPerTick * invaders[0].ticksToLive);
			}
			
			let justNPCs = _.every(invaders, (i) => (i.owner.username == "Invader" || i.owner.username == "Source Keeper"));
			
            for (let invader in invaders) {
				// TODO: Find out what type of creeps are invading the room
				
            }
			// TODO: Store IDs of invader with highest heal part count, or highest attack+work part count in memory for room so towers don't just target the closest one
			
            // Only activate safemode when the base is in real trouble, the current definition of which is either a spawn taking damage or an agressive players creep being present
			if (roomID == "W53N32" && justNPCs == false) { // Special rule for this base since there are no nearby bases to rebuild it with
				theController.activateSafeMode();
				console.log("Activated Safe Mode in: " + roomID);
				Game.notify("Activated Safe Mode in: " + roomID);
			}
			else if (theController != undefined 
			    && theController.my == true 
			    && theController.safeMode == undefined 
			    && theController.safeModeAvaliable > 0
			    && (_.some(Game.spawns, (s) => (
			        s.room.name == roomID 
			        && s.hits < s.hitsMax 
			        && s.isActive() == true)) == true
	            || _.some(invaders, (i) => (
	                _.some(Memory.agressivePlayers, (aP) => (
	                    i.owner.username == aP)))) == true)) { // TODO: Check that this is working
				//console.log("Attempting to activate Safe Mode in: " + roomID);
				//Game.notify("Attempting to activate Safe Mode in: " + roomID);
				theController.activateSafeMode();
				console.log("Activated Safe Mode in: " + roomID);
				Game.notify("Activated Safe Mode in: " + roomID);
			}
        }
        else if (theRoom.hasHostileCreep == true) {
            theRoom.hasHostileCreep == false;
            theRoom.checkForDrops = true;
        }
        
        if (theRoom.hasHostileTower == true) {
            theRoom.checkForDrops = false;
        }
        else if (theController != undefined && theController.my == false && theController.level >= _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_TOWER], (maxBuildable) => maxBuildable > 0)) {
            let hostileTowers = theRoom.find(FIND_HOSTILE_STRUCTURES, (s) => s.structureType == STRUCTURE_TOWER);
            if (hostileTowers.length > 0) {
                theRoom.hasHostileTower = true;
                theRoom.checkForDrops = false;
            }
        }

        if (theRoom.checkForDrops == true || (checkingForDrops == true && (theRoom.hasHostileCreep == false || (theController != undefined && theController.my == true && theController.safeMode != undefined)) && theRoom.hasHostileTower == false)) {
            theRoom.checkForDrops = false;
            let droppedResources = theRoom.find(FIND_DROPPED_RESOURCES);
            if (droppedResources.length > 0) {
                droppedResources.sort(function(a,b){return b.amount - a.amount}); // TODO: Prioritise minerals in accending order and then energy in decending order
                for (let droppedResource of droppedResources) {
					let hasAssignedCreep = _.some(Game.creeps, (c) => (
					    c.memory.droppedResourceID == droppedResource.id
                    ));
					if (hasAssignedCreep == false) {
                        let creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (c) => (c.spawning == false 
                                && c.memory.droppedResourceID == undefined 
                                && c.memory.speeds["2"] <= 2 
                                && c.memory.role != "attacker" 
                                && c.memory.role != "powerHarvester"
                                && c.memory.role != "adaptable" 
                                && c.memory.role != "scout"
                                && c.memory.role != "claimer" 
                                && c.memory.role != "recyclable" 
                                && c.carryCapacity - _.sum(c.carry) >= droppedResource.amount 
                        )});
                        if (creep == undefined) {
                            creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                                filter: (c) => (c.spawning == false 
                                    && c.memory.droppedResourceID == undefined 
                                    && c.memory.speeds["2"] <= 2 
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
                                creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                                    filter: (c) => (c.spawning == false 
                                        && c.memory.droppedResourceID == undefined 
                                        && c.memory.speeds["2"] <= 2 
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
        
		let towers = theRoom.find(FIND_MY_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_TOWER 
				&& s.energy > 0 
                && s.isActive() == true
        )});
		for (let towerID in towers) {
            let tower = towers[towerID];

            let target = tower.pos.findClosestByRange(invaders);
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

    for(let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        if (creep.spawning == false) {
            let bodyPartCounts = _.countBy(creep.body);
            _.defaults(creep.memory, {
                role: "harvester"
                , working: false
                , speeds: {
                    ["1"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
                    , ["2"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
                    , ["10"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
                }
            });
            
            let theStorage = Game.rooms[creep.memory.roomID].storage;
            
            if (creep.memory.role == "attacker") {
				roleAttacker.run(creep);
			}
            else if (creep.memory.role == "powerHarvester") {
                rolePowerHarvester.run(creep); // NOTE: Runs hoarder role itself, if needed
            } // TODO: add extra role here to retreat to nearest room with a tower to repair if hits < hitsMax
            else if (creep.memory.droppedResourceID != undefined) {
                roleCollector.run(creep);
            }
            else if (_.sum(creep.carry) > creep.carry.energy 
                && theStorage != undefined 
                && theStorage.my == true 
                && _.sum(theStorage.store) < theStorage.storeCapacity 
                && theStorage.isActive() == true) {
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

    let nothingToSpawn = [];
    for (let spawnID in Game.spawns) {
        let spawn = Game.spawns[spawnID];
        let roomID = spawn.room.name;
        if (spawn.spawning == undefined && _.includes(nothingToSpawn, roomID) == false && spawn.isActive() == true) {
            let creepName = undefined;
            let creepMins = Memory.rooms[roomID].creepMins;
            for (let creepType in creepMins) {
                if (Memory.rooms[roomID].creepCounts[creepType] < creepMins[creepType]) {
                    creepName = spawn.createCustomCreep(creepType);
                    if (_.isString(creepName) == true) {
                        Memory.rooms[roomID].creepCounts[creepType] += 1;
                        console.log("Spawning " + creepType + " (" + Memory.rooms[roomID].creepCounts[creepType] + "/" + creepMins[creepType] + ") in " + roomID + ": " + creepName);
                    }
                    break;
                }
            }

            if (creepName == undefined || creepName == ERR_NOT_ENOUGH_ENERGY || _.isString(creepName) == true) {
                nothingToSpawn.push(roomID);
            }
        }
    }
}
