if (Memory.MonCPU == true) { console.log("start>init:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }

// Setup globals and prototypes
require("globals")(); // NOTE: All globals not from an external resource should be declared here
require("prototype.creep")(); // NOTE: Must be required after globals.js
require("prototype.room")(); // NOTE: Must be required after globals.js
require("prototype.memory")(); // NOTE: Must be required after prototype.room.js
require("prototype.controller")(); // NOTE: Must be required after prototype.room.js
require("prototype.source")(); // NOTE: Must be required after prototype.room.js
require("prototype.spawn")();
require("traveler")({ 
    exportTraveler: false
    , installPrototype: true
    , visualisePathStyle: { 
        lineStyle: "solid"
        , strokeWidth: .1 
}}); // TODO: Make a custom version of Creep.moveTo and remove this stopgap solution

// Setup constants
const resourcesInfo = require("resources"); // Used by screepsPlus to generate stats
const screepsPlus = require("screepsplus"); // Used to put stats in memory for agent to collect and push to Grafana dashboard
//const visualiser = require("visualiser"); // NOTE: Must be called after globals initialisation

// Make sure all required root memory objects exist
_.defaultsDeep(Memory, { // TODO: Impliment the LOAN alliance import script pinned in the #share-thy-code channel of the Screeps Slack, and use it to help figure out TooAngel AI users, potentual agressive players, potential allies and allies
    "creeps": {}
    , "rooms": {}
    , "spawns": {}
    , "flags": {}
    , "TooAngelDealings": { // can pay a friend tax to opt into this AIs non-agressive list (wish more people did this...)
        "idiotRating": 0 // stay below 0 to be friendly with this AI (value needs to be entered manually based on what their creep by the controller says)
    }
    , "agressivePlayers": [ // these players attack first and ask questions later (if at all)
        "rysade"
        , "roncli" // turns out they were just using my RCL6 and lower rooms as low-risk targets to improve their combat code with
        , "rudykocur"
        , "McGnomington" // open to negotiations
        , "Archangel"
        , "Vultured"
    ]
    , "nonAgressivePlayers": [ // nice players that have added "dragoonreas" to their own non-agressive list and which won't be considered 'invaders' when looping through Game.rooms (so turrents won't fire on them and such)
        "Bovius"
        , "Cade" // PINK alliance
        , "Palle" // PINK alliance
        , "Kendalor" // PINK alliance
        , "InfiniteJoe" // PINK alliance
        , "KermitFrog" // PINK alliance
    ] // TODO: Make new list for high-trust players (like fellow alliance members) to have ramparts on storage/terminal lowered when they're near to allow them to withdraw & deposit freely
});

// Make sure all required room memory objects exist
for (let roomID in Game.rooms) {
    let theRoom = Game.rooms[roomID];
    _.defaults(theRoom, {
        "buildOrderFILO": false
        , "checkForDrops": true
        , "hasHostileCreep": false
        , "memoryExpiration": Game.time + EST_TICKS_PER_DAY
        , "avoidTravelUntil": 0
    }); // TODO: Implement sparse memory storage for rooms (assume a default value for undefined keys)
    
    let theController = theRoom.controller;
    if (theController != undefined) {
        _.defaults(Memory.controllers[theController.id], {
            pos: theController.pos
        });
    }
    
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

// Setup room memory objects for owned rooms
_.set(Memory.rooms, ["W87N29", "harvestRooms"], [
    "W88N29"
    , "W89N29"
]);
_.set(Memory.rooms, ["W86N29", "harvestRooms"], [
    "W86N28"
    , "W85N29"
]);
_.set(Memory.rooms, ["W85N23", "harvestRooms"], [
    "W84N23"
    , "W85N25"
]);
_.set(Memory.rooms, ["W86N39", "harvestRooms"], [
    "W87N39"
    , "W88N39"
]);
_.set(Memory.rooms, ["W85N38", "harvestRooms"], [
    "W86N38"
    , "W85N39"
    , "W84N39"
]);

/*
    TODO:
    These should be stored in an array instead of an object since their order also defines the build priority.
    Also be sure to use for...of instead of for..in where their order is important
*/
_.set(Memory.rooms, ["W87N29", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 1
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_RAMPART]: 0
    , [STRUCTURE_WALL]: 0
    , all: 1
});
_.set(Memory.rooms, ["W86N29", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 1
    , [STRUCTURE_ROAD]: 1
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_WALL]: 0
    , all: 1
});
_.set(Memory.rooms, ["W85N23", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 1
    , [STRUCTURE_ROAD]: 1
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_WALL]: 0
    , all: 1
});
_.set(Memory.rooms, ["W86N39", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_RAMPART]: 2
    , [STRUCTURE_WALL]: 0
    , all: 1
});
_.set(Memory.rooms, ["W85N38", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_ROAD]: 0
    , [STRUCTURE_RAMPART]: 1
    , [STRUCTURE_WALL]: 0
    , all: 1
});

// NOTE: To delete old room memory from console: _.pull(managedRooms, <roomName>); delete Memory.rooms.<roomName>;
let managedRooms = [];
for (let roomID in Memory.rooms) {
    if (Memory.rooms[roomID].repairerTypeMins != undefined) {
        managedRooms.push(roomID);
        Memory.rooms[roomID].memoryExpiration = Game.time + EST_TICKS_PER_DAY;
    }
}

/*
    TODO:
    These should be stored in an array instead of an object since their order also defines the build priority.
    Also be sure to use for...of instead of for..in where their order is important
*/
_.set(Memory.rooms, ["W87N29", "creepMins"], {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 1
    , miner: 0//_.size(_.get(Game.rooms, ["W87N29", "minerSources"], {}))
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: _.reduce(_.get(Memory.rooms, ["W87N29", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0)
    , builder: 1
});
_.set(Memory.rooms, ["W86N29", "creepMins"], {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 2
    , miner: 0//_.size(_.get(Game.rooms, ["W86N29", "minerSources"], {}))
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: _.reduce(_.get(Memory.rooms, ["W86N29", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0)
    , builder: 1
});
_.set(Memory.rooms, ["W85N23", "creepMins"], {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 2
    , miner: 0//_.size(_.get(Game.rooms, ["W85N23", "minerSources"], {}))
    , adaptable: 0
    , scout: 0
    , claimer: 1
    , repairer: _.reduce(_.get(Memory.rooms, ["W85N23", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0)
    , builder: 1
});
_.set(Memory.rooms, ["W86N39", "creepMins"], {
    attacker: 0
    , harvester: 4
    , powerHarvester: 0
    , upgrader: 1
    , miner: 0//_.size(_.get(Game.rooms, ["W86N39", "minerSources"], {}))
    , adaptable: 0
    , scout: 0
    , claimer: 0
    , repairer: _.reduce(_.get(Memory.rooms, ["W86N39", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0)
    , builder: 1
});
_.set(Memory.rooms, ["W85N38", "creepMins"], {
    attacker: 0
    , harvester: 6
    , powerHarvester: 0
    , upgrader: 2
    , miner: 0//_.size(_.get(Game.rooms, ["W85N38", "minerSources"], {}))
    , adaptable: 0
    , scout: 0
    , claimer: 0
    , repairer: _.reduce(_.get(Memory.rooms, ["W85N38", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0)
    , builder: 1
});

if (Memory.MonCPU == true) { console.log("init>loop init:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }

module.exports.loop = function () {
    require("prototype.memory")(); // TODO: Try and find a way to make this a prototype of memory so this doesn't have to be done each tick
    
    if (Memory.MonCPU == true) { console.log("loop init>stats:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    resourcesInfo.summarize_rooms(); // Generate stats for screepsplus to retrieve at end of loop
    
    // Get current creep counts
    for (let roomID of managedRooms) {
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
    
    if (Memory.MonCPU == true) { console.log("stats>ta:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    // Update TooAngel 
    Memory.TooAngelDealings.isFriendly = (Memory.TooAngelDealings.idiotRating < 0); // TODO: Since more than just TooAngel uses this AI, need to setup an array of players to use this with
    if (
        Memory.TooAngelDealings.isFriendly == false 
        && Memory.TooAngelDealings.lastIdiotRating != Memory.TooAngelDealings.idiotRating
    ) {
        let energySellOrders = Game.market.getAllOrders({
          type: ORDER_SELL
          , resourceType: RESOURCE_ENERGY
        });
        let energyPrice = _.get(_.min(energySellOrders, "price"), "price", 0);
        Memory.TooAngelDealings.energyToFriendly = (parseInt(Memory.TooAngelDealings.idiotRating) + 1) / energyPrice;
        Memory.TooAngelDealings.totalCost = Memory.TooAngelDealings.energyToFriendly + Game.market.calcTransactionCost(Memory.TooAngelDealings.energyToFriendly, "W87N29", "E33N15"); // TODO: Make sure the total cost isn't more than what the terminal can hold, and if it is divide it up into multiple transactions
        Memory.TooAngelDealings.lastIdiotRating = Memory.TooAngelDealings.idiotRating;
    }
    
    let dealingsTerminal = Game.rooms["W87N29"].terminal;
    if (dealingsTerminal != undefined && Memory.TooAngelDealings.isFriendly == false && dealingsTerminal != undefined && dealingsTerminal.store.energy >= Math.min(dealingsTerminal.storeCapacity, Memory.TooAngelDealings.totalCost)) {
        if (dealingsTerminal.send(RESOURCE_ENERGY, Memory.TooAngelDealings.energyToFriendly, "E33N15", "brain.isFriend('dragoonreas') == true?") == OK) {
            console.log("Used " + Memory.TooAngelDealings.totalCost.toLocaleString() + " energy to lose " + Memory.TooAngelDealings.idiotRating.toLocaleString() + " to be friendly with TooAngel");
            Game.notify("Used " + Memory.TooAngelDealings.totalCost.toLocaleString() + " energy to lose " + Memory.TooAngelDealings.idiotRating.toLocaleString() + " to be friendly with TooAngel");
            Memory.TooAngelDealings.idiotRating = -1;
            Memory.TooAngelDealings.lastIdiotRating = Memory.TooAngelDealings.idiotRating;
        }
    }
    
    if (Memory.MonCPU == true) { console.log("ta>gc:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    let checkingForDrops = false;
    
    // Garbage collection for creep memory
    for (let creepName in Memory.creeps) {
        if (Game.creeps[creepName] == undefined) {
            let creepMemory = Memory.creeps[creepName];
            let currentSpawnedRole = 0;
            let minimumSpawnedRole = 0;
            if (_.get(Memory.rooms, [creepMemory.roomID, "creepCounts", creepMemory.role], undefined) != undefined) {
                currentSpawnedRole = Memory.rooms[creepMemory.roomID].creepCounts[creepMemory.role];
                minimumSpawnedRole = Memory.rooms[creepMemory.roomID].creepMins[creepMemory.role];
                
                if (creepMemory.role == "scout" && creepMemory.goalReached != true) {
                    console.log("Scout from " + creepMemory.roomID + " only made it past waypoint " + creepMemory.waypoint);
                    Game.notify("Scout from " + creepMemory.roomID + " only made it past waypoint " + creepMemory.waypoint);
                    Memory.rooms[creepMemory.roomID].creepMins[creepMemory.role] = 0;
                }
                else if (creepMemory.role == "miner" && _.get(Memory.sources, [creepMemory.sourceID, "minerName"], undefined) == creepName) {
                    delete Memory.sources[creepMemory.sourceID].miner;
                }
            }
            let ticksSinceBirth = Game.time - (creepMemory.spawnTick || (Game.time - (creepMemory.role == "claimer" ? CREEP_CLAIM_LIFE_TIME : CREEP_LIFE_TIME)));
            console.log("Expired " + ticksSinceBirth.toLocaleString() + " tick, " + creepMemory.roomID + " " + creepMemory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + creepName);
            delete Memory.creeps[creepName];
            
            if (checkingForDrops == false) {
                checkingForDrops = true;
            }
        }
    }
    
    // Garbage collection for room memory
    for (let roomID in Memory.rooms) {
        if (Game.rooms[roomID] == undefined 
            && (Memory.rooms[roomID].memoryExpiration || 0) < Game.time) {
            console.log("Running garbage collection on room memory: " + roomID);
            delete Memory.rooms[roomID];
        }
        else if (_.size(_.get(Memory.rooms[roomID], "invaderWeightings", {})) > 0) {
            
            // Garbage collection for invader weightings
            for (let invaderID in Memory.rooms[roomID].invaderWeightings) {
                if ((Memory.rooms[roomID].invaderWeightings[invaderID].expiresAt || 0) < Game.time) {
                    //console.log("Running garbage collection on invaderWeightings for " + invaderID + " in room memory: " + roomID);
                    delete Memory.rooms[roomID].invaderWeightings[invaderID];
                }
            }
        }
        
        // Garbage collection for dangerZones
        if (Game.rooms[roomID] != undefined) {
            Game.rooms[roomID].dangerZones = [];
        }
    }
    
    if (Memory.MonCPU == true) { console.log("gc>room:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    let ramparts = _.filter(Game.structures, (s) => (s.structureType == STRUCTURE_RAMPART));
    let privateRamparts = {};
    
    // Manage rooms and run towers
    for (let roomID in Game.rooms) {
        let theRoom = Game.rooms[roomID];
        
        // Make sure all required room memory objects exist
        _.defaults(theRoom.memory, {
            "buildOrderFILO": false
            , "checkForDrops": true
            , "hasHostileCreep": false
            , "avoidTravelUntil": 0
        });
        theRoom.memory.memoryExpiration = Game.time + EST_TICKS_PER_DAY; // Update scheduled time for room memory garbage collection
        
        let theController = theRoom.controller;
        if (theController != undefined) {
            _.defaults(Memory.controllers[theController.id], {
                pos: theController.pos
            });
        }
        
        // Make sure source memory exists and is up-to-date
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
        
        // TODO: Check for nukes and make sure only 1 notification is sent (for the lifetime of that nuke) when the nuke is found
		
        let mayHaveRamparts = (_.get(theRoom, ["controller", "level"], 0) < _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_RAMPART], (v) => (v > 0)) == false);
        
        let justNPCs = undefined;
        
        let priorityTargets = undefined;
        let priorityTarget = undefined;
        
        // Get invader info
        let invaders = theRoom.find(FIND_HOSTILE_CREEPS, {
            filter: (i) => (_.includes(Memory.nonAgressivePlayers, i.owner.username) == false
        )});
        if (invaders.length > 0) {
            theRoom.hasHostileCreep = true;
            if (theController == undefined || theController.my == false || theController.safeMode == undefined) {
                theRoom.checkForDrops = false; // TODO: Change this to flag only checking for drops inside the base when under attack (no path between drop and invaders when considering ramparts an obsticle)
            }
			
			justNPCs = _.every(invaders, (i) => (i.owner.username == "Invader" || i.owner.username == "Source Keeper"));
			
            /*
                NOTE:
                Don't attack player targets blinking on the borders as this is a common strat to drain towers.
                This should be safe to do since you can't build walls/ramparts close enough to exits for creeps with ATTACK/WORK parts to damage them while blinking.
                Creeps with RANGED_ATTACK/HEAL parts (hopefully) shouldn't do enough ranged damage/healing to worry about while blinking.
            */
            priorityTargets = _.filter(invaders, (i) => (
                i.owner.username == "Invader" 
                || i.owner.username == "Source Keeper" 
                || (i.pos.x % 49 != 0 
                && i.pos.y % 49 != 0)
            ));
            
            let rampartsToUse = []; // Ramparts for melee creeps (role.attacker) to sit in to attack invaders
            
            // Deal with priority targets
            let priorityTargetID = undefined;
            let highestTargetWeighting = -1;
            for (let aPriorityTarget of priorityTargets) {
                
                // Apply target weightings to the invaders
                let targetWeighting = 0;
                let bodyPartCounts = _.countBy(aPriorityTarget.body, "type");
                if (aPriorityTarget.owner.username != "Invader" && aPriorityTarget.owner.username != "Source Keeper") { // TODO: Allow NPC weightings but make sure player creeps are prioritised first
                    targetWeighting = _.get(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "weighting"], undefined);
                    if (targetWeighting == undefined) {
                        targetWeighting = 0 + (
                            (bodyPartCounts[ATTACK] || 0) * 5 
                            + (bodyPartCounts[RANGED_ATTACK] || 0) * 4 
                            + (bodyPartCounts[WORK] || 0) * 3 
                            + (bodyPartCounts[CLAIM] || 0) * 2 
                            + (bodyPartCounts[HEAL] || 0) * 1
                        ); // TODO: Take into account boosted parts
                        
                        _.set(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id], {
                            weighting: targetWeighting
                            , expiresAt: (Game.time + aPriorityTarget.ticksToLive)
                        }); // TODO: Store the weightings somewhere else since weighting data is duplicated for each room an invader enters
                    }
                }
                
                // Save ID of new highest target if applicable
                if (targetWeighting > highestTargetWeighting) {
                    highestTargetWeighting = targetWeighting;
                    priorityTargetID = aPriorityTarget.id;
                }
                
                // Record positions targets can attack within the next tick (TODO: but not during safemode)
                let avoidanceRange = 0;
                if ((bodyPartCounts[RANGED_ATTACK] || 0) > 0) {
                    avoidanceRange = 4; // 3 range + 1 incase it moves closer this tick
                }
                else if ((bodyPartCounts[ATTACK] || 0) > 0) {
                    avoidanceRange = 2; // 1 range + 1 incase it moves closer this tick
                }
                if (aPriorityTarget.owner.username == "Source Keeper" || aPriorityTarget.fatigue > 0) { // TODO: Check if the source keeper is next to a source or mineral before assuming they won't move
                    --avoidanceRange;
                }
                if (avoidanceRange > 0) {
                    let topRange = _.max([aPriorityTarget.pos.y - avoidanceRange, 0]);
                    let leftRange = _.max([aPriorityTarget.pos.x - avoidanceRange, 0]);
                    let bottomRange = _.min([aPriorityTarget.pos.y + avoidanceRange, 49]);
                    let rightRange = _.min([aPriorityTarget.pos.x + avoidanceRange, 49]);
                    let theWalls = _.filter(theRoom.lookForAtArea(LOOK_TERRAIN, topRange, leftRange, bottomRange, rightRange, true), (t) => (
                        t.terrain == "wall"
                    ));
                    let theRamparts = [];
                    if (mayHaveRamparts == true) {
                        theRamparts = _.filter(theRoom.lookForAtArea(LOOK_STRUCTURES, topRange, leftRange, bottomRange, rightRange, true), (s) => (
                            s.structure.structureType == STRUCTURE_RAMPART 
                            && (s.structure.my == true 
                            || (_.includes(Memory.nonAgressivePlayers, s.structure.owner.username) == true 
                                && s.structure.isPublic == true))
                        ));
                    }
                    for (let yPos = topRange; yPos <= bottomRange; ++yPos) {
                        for (let xPos = leftRange; xPos <= rightRange; ++xPos) {
                            let thePos = {
                                x: xPos
                                , y: yPos
                            };
                            if (_.some(theRoom.dangerZones, thePos) == false && (theRamparts.length == 0 || _.some(theRamparts, thePos) == false) && (theWalls.length == 0 || _.some(theWalls, thePos) == false)) { // TODO: Filter all other non-walkable objects from dangerzones (maybe after all dangerzones have been created)
                                theRoom.dangerZones.push(thePos);
                                //theRoom.visual.rect(thePos.x - 0.5, thePos.y - 0.5, 1, 1, { fill: "red" });
                            }
                        }
                    }
                }
                
                // Get ramparts near target
                if (mayHaveRamparts == true) {
                    let rampartsNearInvader = aPriorityTarget.pos.findInRange(FIND_MY_STRUCTURES, 2, (s) => (
                        s.structureType == STRUCTURE_RAMPART 
                        && s.my == true
                    )); // TODO: Filter theRamparts variable above if avaliable instead
                    _.forEach(rampartsNearInvader, (rni) => {
                        privateRamparts[rni.id] = true; // Make ramparts near priority target private
                        if (targetWeighting > 0 && rni.isNearTo(aPriorityTarget) == true && _.some(rampartsToUse, rni.id) == false) {
                            rampartsToUse.push(rni.id); // Save ID of ramparts in melee range of target
                        }
                    });
                }
            }
            
            // Deal with non-priority targets
            let nonPriorityTargets = _.difference(invaders, priorityTargets);
            for (let aNonPriorityTarget of nonPriorityTargets) {
                
                //  Record positions targets can attack within the next tick
                let bodyPartCounts = _.countBy(aNonPriorityTarget.body, 'type');
                let avoidanceRange = 0;
                if ((bodyPartCounts[RANGED_ATTACK] || 0) > 0) {
                    avoidanceRange = 4; // 3 range + 1 incase it moves closer this tick
                }
                else if ((bodyPartCounts[ATTACK] || 0) > 0) {
                    avoidanceRange = 2; // 1 range + 1 incase it moves closer this tick
                }
                if (aNonPriorityTarget.owner.username == "Source Keeper" || aNonPriorityTarget.fatigue > 0) { // TODO: Check if the source keeper is next to a source or mineral before assuming they won't move
                    --avoidanceRange;
                }
                if (avoidanceRange > 0) {
                    let topRange = _.max([aNonPriorityTarget.pos.y - avoidanceRange, 0]);
                    let leftRange = _.max([aNonPriorityTarget.pos.x - avoidanceRange, 0]);
                    let bottomRange = _.min([aNonPriorityTarget.pos.y + avoidanceRange, 49]);
                    let rightRange = _.min([aNonPriorityTarget.pos.x + avoidanceRange, 49]);
                    let theRamparts = [];
                    if (mayHaveRamparts == true) {
                        theRamparts = _.filter(theRoom.lookForAtArea(LOOK_STRUCTURES, topRange, leftRange, bottomRange, rightRange, true), (s) => (
                            s.structure.structureType == STRUCTURE_RAMPART 
                            && (s.structure.my == true 
                            || (_.includes(Memory.nonAgressivePlayers, s.structure.owner.username) == true 
                                && s.structure.isPublic == true))
                        ));
                    }
                    for (let yPos = topRange; yPos <= bottomRange; ++yPos) {
                        for (let xPos = leftRange; xPos <= rightRange; ++xPos) {
                            let thePos = {
                                x: xPos
                                , y: yPos
                            };
                            if (_.some(theRoom.dangerZones, thePos) == false && (theRamparts.length == 0 || _.some(theRamparts, thePos) == false)) {
                                theRoom.dangerZones.push(thePos);
                                //theRoom.visual.rect(thePos.x - 0.5, thePos.y - 0.5, 1, 1, { fill: "red" });
                            }
                        }
                    }
                }
                
                // Make ramparts near non priority targets private
                if (mayHaveRamparts == true) {
                    let rampartsNearInvader = aNonPriorityTarget.pos.findInRange(FIND_MY_STRUCTURES, 2, (s) => (
                        s.structureType == STRUCTURE_RAMPART 
                        && s.my == true
                    )); // TODO: Filter theRamparts variable above if avaliable instead
                    _.forEach(rampartsNearInvader, (rni) => {
                        privateRamparts[rni.id] = true;
                    });
                }
            }
            
            priorityTarget = Game.getObjectById(priorityTargetID); // This target will be focused on by towers and attacker creeps
            
            // Spawn one melee attacker per rampart in melee range of a priority target
            if (theRoom.memory.creepMins != undefined) {
                theRoom.memory.creepMins.attacker = rampartsToUse.length;
            }
            
            // Only activate safemode when the base is in real trouble, the current definition of which is either a spawn taking damage or an agressive players creep being present
			if (theController != undefined 
                && theController.my == true 
                && theController.safeMode == undefined 
                && theController.safeModeCooldown == undefined 
                && theController.safeModeAvaliable > 0
                && (theController.level < 3 
                || _.some(Game.spawns, (s) => (
                    s.room.name == roomID 
                    && s.hits < s.hitsMax 
                    && s.isActive() == true)) == true // TODO: Calculate the maximum damage output of hostile creeps within range a spawn, and activate safemode if the combined HP of the spawn and rampart covering it is <= x2 the damage output calculated (x2 to account for damage taken this turn if their attacks get run before our safemode)
                || _.some(invaders, (i) => (
                    _.some(Memory.agressivePlayers, (aP) => (
                        i.owner.username == aP)))) == true)) { // TODO: Check that this is all working
				//console.log("Attempting to activate Safe Mode in: " + roomID);
				//Game.notify("Attempting to activate Safe Mode in: " + roomID, 30);
				let err = theController.activateSafeMode();
				if (err == OK) {
                    console.log("Activated Safe Mode in: " + roomID);
                    Game.notify("Activated Safe Mode in: " + roomID);
				}
			}
			else if (_.get(theRoom, ["controller", "my"], false) == true && justNPCs == false && highestTargetWeighting > 0) { // TODO: Remove after defences have been properly tested
				let err = theController.activateSafeMode();
				if (err == OK) {
				    console.log("Activated (backup) Safe Mode in: " + roomID);
				    Game.notify("Activated (backup) Safe Mode in: " + roomID);
				}
			}
        }
        else if (theRoom.hasHostileCreep == true) {
            theRoom.hasHostileCreep = false;
            theRoom.checkForDrops = true; // TODO: If the invaders were players, consider drops near the exits as suspisious as they may just be trying to lure creeps outside walls/ramparts to attack them
            
            // Make sure we're not spawning attacker creeps needlessly
            if (theRoom.memory.creepMins != undefined) {
                theRoom.memory.creepMins.attacker = 0;
            }
        }
        
        let dangerousToCreeps = (theRoom.dangerZones.length > 0) ? true : false;
        
        // TODO: Spawn attackers to defend instead of evacuating harvesters in harvest rooms
		if (dangerousToCreeps == true && theRoom.isHarvestRoom == true) {
			let youngestInvader = _.max(invaders, "ticksToLive");
            if (theRoom.avoidTravelUntil < Game.time) {
                _.each(Game.creeps, (c) => {
                    if (c.memory.role != "miner") {
                        c.memory.sourceID = undefined;
                    }
                    c.memory._travel = undefined;
                    c.memory._move = undefined;
                });
                theRoom.avoidTravelUntil = Game.time + (youngestInvader.ticksToLive || 0);
                console.log("Enemy creep owned by " + _.get(youngestInvader, ["owner", "username"], "Invader(?)") + " restricting travel to room " + roomID + " for " + (youngestInvader.ticksToLive || 0) + " ticks.");
            }
            
            if (_.some(_.get(theRoom, "sources", {"000000000000000000000000": { regenAt: Game.time + (youngestInvader.ticksToLive || 0) } }), (s) => (s.regenAt < Game.time + (youngestInvader.ticksToLive || 0)))) {
                _.forEach(theRoom.sources, (s,sID) => {
                    if (s.regenAt < Game.time + (youngestInvader.ticksToLive || 0)) {
                        s.regenAt = Game.time + (youngestInvader.ticksToLive || 0);
                    }
                    let assignedCreeps = _.filter(Game.creeps, (c) => (
                        _.get(c.memory, "sourceID", undefined) == sID
                    ));
                    // TODO: Do something with assigned creeps
                });
                console.log("Enemy creep owned by " + _.get(youngestInvader, ["owner", "username"], "Invader(?)") + " shutting down harvesting from " + roomID + " for " + (youngestInvader.ticksToLive || 0) + " ticks.");
                if (justNPCs == false) {
                    Game.notify("Enemy creep owned by " + _.get(youngestInvader, ["owner", "username"], "Invader(?)") + " shutting down harvesting from " + roomID + " for " + (youngestInvader.ticksToLive || 0) + " ticks.", youngestInvader.ticksToLive / EST_TICKS_PER_MIN);
                }
            }
            
            // TODO: Stop claimers being spawned to reserve this harvest room
		}
		
        if (theRoom.hasHostileTower == true) { // TODO: Add a check to see if the towers are still there if a creep is in the room, instead of just waiting for it to be reset after a day due to the room memory garbage collection being run on it
            theRoom.checkForDrops = false;
        }
        else if (theController != undefined && theController.my == false && theController.level >= _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_TOWER], (maxBuildable) => maxBuildable > 0)) {
            let hostileTowers = theRoom.find(FIND_HOSTILE_STRUCTURES, (s) => s.structureType == STRUCTURE_TOWER && _.includes(Memory.nonAgressivePlayers, s.owner.username) == false); // TODO: Figure out if it's also worth checking if the towers are empty or not
            if (hostileTowers.length > 0) {
                theRoom.hasHostileTower = true;
                theRoom.checkForDrops = false;
            }
        }
        
        // TODO: Set theRoom.memory.avoidTravel based on the check for if it's safe to assign dropped energy for creeps to pickup
        
        if (theRoom.checkForDrops == true || (checkingForDrops == true && (theRoom.hasHostileCreep == false || (theController != undefined && theController.my == true && theController.safeMode != undefined)) && theRoom.hasHostileTower == false)) {
            theRoom.checkForDrops = false;
            let droppedResources = theRoom.find(FIND_DROPPED_RESOURCES);
            if (droppedResources.length > 0) {
                _.sortByOrder(droppedResources, (dr) => {
                    switch (dr.resourceType) {
                        case RESOURCE_ENERGY:
                        default: return dr.amount; // amount * 10^0
                        case RESOURCE_HYDROGEN:
                        case RESOURCE_OXYGEN:
                        case RESOURCE_UTRIUM:
                        case RESOURCE_LEMERGIUM:
                        case RESOURCE_KEANIUM:
                        case RESOURCE_ZYNTHIUM:
                        case RESOURCE_CATALYST: return dr.amount * 10; // amount * 10^1
                        case RESOURCE_HYDROXIDE:
                        case RESOURCE_ZYNTHIUM_KEANITE:
                        case RESOURCE_UTRIUM_LEMERGITE: return dr.amount * 100; // amount * 10^2
                        case RESOURCE_UTRIUM_HYDRIDE:
                        case RESOURCE_UTRIUM_OXIDE:
                        case RESOURCE_KEANIUM_HYDRIDE:
                        case RESOURCE_KEANIUM_OXIDE:
                        case RESOURCE_LEMERGIUM_HYDRIDE:
                        case RESOURCE_LEMERGIUM_OXIDE:
                        case RESOURCE_ZYNTHIUM_HYDRIDE:
                        case RESOURCE_ZYNTHIUM_OXIDE:
                        case RESOURCE_GHODIUM_HYDRIDE:
                        case RESOURCE_GHODIUM_OXIDE: return dr.amount * 1000; // amount * 10^3
                        case RESOURCE_UTRIUM_ACID:
                        case RESOURCE_UTRIUM_ALKALIDE:
                        case RESOURCE_KEANIUM_ACID:
                        case RESOURCE_KEANIUM_ALKALIDE:
                        case RESOURCE_LEMERGIUM_ACID:
                        case RESOURCE_LEMERGIUM_ALKALIDE:
                        case RESOURCE_ZYNTHIUM_ACID:
                        case RESOURCE_ZYNTHIUM_ALKALIDE:
                        case RESOURCE_GHODIUM_ACID:
                        case RESOURCE_GHODIUM_ALKALIDE: return dr.amount * 10000; // amount * 10^4
                        case RESOURCE_CATALYZED_UTRIUM_ACID:
                        case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
                        case RESOURCE_CATALYZED_KEANIUM_ACID:
                        case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
                        case RESOURCE_CATALYZED_LEMERGIUM_ACID:
                        case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
                        case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
                        case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
                        case RESOURCE_CATALYZED_GHODIUM_ACID:
                        case RESOURCE_CATALYZED_GHODIUM_ALKALIDE: return dr.amount * 100000; // amount * 10^5
                        case RESOURCE_POWER: return dr.amount * 1000000; // amount * 10^6
                    }}, "desc");
                for (let droppedResource of droppedResources) {
					let hasAssignedCreep = _.some(Game.creeps, (c) => (
					    c.memory.droppedResourceID == droppedResource.id
                    ));
					if (hasAssignedCreep == false) {
                        let creep = droppedResource.pos.findClosestByRange(FIND_MY_CREEPS, {
                            filter: (c) => (c.spawning == false 
                                && c.memory.droppedResourceID == undefined 
                                && c.hits == c.hitsMax 
                                && c.memory.speeds["2"] <= 2 
                                && c.memory.role != "miner" 
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
                                    && c.hits == c.hitsMax 
                                    && c.memory.speeds["2"] <= 2 
                                    && c.memory.role != "miner" 
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
                                        && c.hits == c.hitsMax 
                                        && c.memory.speeds["2"] <= 2 
                                        && c.memory.role != "miner" 
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
                            //console.log("No creeps avaliable to pickup " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + roomID); // TODO: Put this back in after adding a check to make sure it's only displayed once per drop instead of each tick
                            theRoom.checkForDrops = true;
                    	}
					}
                }
            }
        }
        // TODO: Else case for unassigning dropped resources from creeps in a room when it's unsafe to try and collect them
        
        // Run towers in the room
		let towers = theRoom.find(FIND_MY_STRUCTURES, {
            filter: (s) => (
                s.structureType == STRUCTURE_TOWER 
				&& s.energy >= TOWER_ENERGY_COST 
                && s.isActive() == true
        )});
		for (let towerID in towers) {
            let tower = towers[towerID];
            
            let target = priorityTarget;
            /*
            // TODO: Maybe group PC and NPC targets seperatly so the same weightings can be applied to each, rather than the NPCs having no weighting
            if (target == undefined && priorityTargets != undefined) {
                target = tower.pos.findClosestByRange(priorityTargets);
            }
            */
            
            if (target != undefined) { // Attack a creep if needed
                tower.attack(target);
                console.log("Tower in " + roomID + " attacking hostile from " + target.owner.username); // TODO: 
                if (justNPCs == false) {
                    Game.notify("Tower in " + roomID + " attacking hostile from " + target.owner.username, target.ticksToLive / EST_TICKS_PER_MIN);
                }
            }
            else { // Else repair a structure if needed
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
                else { // Else heal a creep if needed
                    target = tower.pos.findClosestByRange(FIND_MY_CREEPS, { 
                        filter: (c) => (c.hits < c.hitsMax
                    )}); // TODO: Also heal ally creeps
                    if (target != undefined) {
                        tower.heal(target);
                    }
                }
            }
		}
    }
    
    if (Memory.MonCPU == true) { console.log("room>creeps:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    // Run creeps
    for(let creepName in Game.creeps) {
        let creep = Game.creeps[creepName];
        
        if (creep.spawning == true) { continue; } // can't do anything if it's still spawning
        
        // Ensure basic memory elements exist
        let bodyPartCounts = _.countBy(creep.body);
        _.defaults(creep.memory, {
            role: "harvester"
            , working: false
            , speeds: {
                ["1"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
                , ["2"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
                , ["10"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
            } // TODO: Add default for closest active spawn room to be set as creep.memory.roomID, and also set energyAvaliableOnSpawn & spawnTick to a default like in the creep garbage collection
        });
        
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined); // Get home room storage if avaliable
        
        // Run a role that's not stored in creep.memory.role
        let runningRole = false;
        // TODO: If a creep is damaged, check that it still has enough active body parts to run it's role, and if not go back home to either repair via a tower or recycle if no tower is avaliable
        if (creep.memory.role != "attacker" && creep.memory.role != "powerHarvester") {
            if (creep.hits < creep.hitsMax && creep.memory.role != "adaptable") {
                creep.memory.droppedResourceID = undefined;
                ROLES["recyclable"].run(creep);
                runningRole = true;
            }
            else if (creep.memory.droppedResourceID != undefined) {
                ROLES["collector"].run(creep);
                runningRole = true;
            }
            else if (_.sum(creep.carry) > creep.carry.energy 
                && theStorage != undefined 
                && theStorage.my == true 
                && _.sum(theStorage.store) < theStorage.storeCapacity 
                && theStorage.isActive() == true) {
                ROLES["hoarder"].run(creep);
                runningRole = true;
            }
        }
        
        // If not already running another role, run the role assigned in creep.memory.role
        if (runningRole == false) {
            if (_.some(ROLES, (v,k) => (k == creep.memory.role)) == true) {
                ROLES[creep.memory.role].run(creep); // NOTE: Roles may branch to one another internally based on what does or doesn't need doing, this is just the branch the creep's been set to start on
            }
            else {
                console.log(creep.name + " has unknown role: " + creep.memory.role);
            }
        }
        
        // Make sure ramparts near the creep are supplying cover to both it's current position and anywhere it may end up at the start of the next tick
        let rampartsNearCreep = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, (s) => (
            s.structureType == STRUCTURE_RAMPART 
        ));
        _.forEach(rampartsNearCreep, (rnc) => {
            privateRamparts[rnc.id] = true;
        });
    }
    
    if (Memory.MonCPU == true) { console.log("creeps>spawn:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    Memory.rooms.W87N29.creepMins.adaptable = (((Memory.rooms.W86N29.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0) || (Memory.rooms.W85N23.creepCounts.builder == 0 && Memory.rooms.W85N23.creepCounts.adaptable == 0) || (Memory.rooms.W85N38.creepCounts.builder == 0 && Memory.rooms.W85N38.creepCounts.adaptable == 0)) ? 1 : 0); // TODO: Incorporate this into propper bootstrapping code
    Memory.rooms.W86N29.creepMins.adaptable = (((Memory.rooms.W87N29.creepCounts.builder == 0 && Memory.rooms.W87N29.creepCounts.adaptable == 0) || (Memory.rooms.W85N23.creepCounts.builder == 0 && Memory.rooms.W85N23.creepCounts.adaptable == 0) || (Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N39.creepCounts.adaptable == 0)) ? 1 : 0); // TODO: Incorporate this into propper bootstrapping code
    Memory.rooms.W85N23.creepMins.adaptable = (((Memory.rooms.W87N29.creepCounts.builder == 0 && Memory.rooms.W87N29.creepCounts.adaptable == 0) || (Memory.rooms.W86N29.creepCounts.builder == 0 && Memory.rooms.W86N29.creepCounts.adaptable == 0)) ? 1 : 0); // TODO: Incorporate this into propper bootstrapping code
    Memory.rooms.W86N39.creepMins.adaptable = ((Memory.rooms.W85N38.creepCounts.builder == 0 && Memory.rooms.W85N38.creepCounts.adaptable == 0) ? 1 : 0); // TODO: Incorporate this into propper bootstrapping code
    Memory.rooms.W85N38.creepMins.adaptable = ((Memory.rooms.W86N39.creepCounts.builder == 0 && Memory.rooms.W86N39.creepCounts.adaptable == 0) ? 1 : 0); // TODO: Incorporate this into propper bootstrapping code
    
    // Spawn or renew creeps
    let nothingToSpawn = [];
    for (let spawnID in Game.spawns) {
        let spawn = Game.spawns[spawnID];
        let roomID = spawn.room.name;
        if (spawn.spawning == undefined) {
            if (spawn.isActive() == true) {
                let creepName = undefined;
                if (_.includes(nothingToSpawn, roomID) == false) {
                    let creepMins = Memory.rooms[roomID].creepMins; // TODO: Check if this needs existance validation
                    for (let creepType in creepMins) {
                        if (Memory.rooms[roomID].creepCounts[creepType] < creepMins[creepType]) {
                            creepName = spawn.createCustomCreep(creepType);
                            if (_.isString(creepName) == true) {
                                Memory.rooms[roomID].creepCounts[creepType] += 1;
                                console.log("Spawning " + creepType + " (" + Memory.rooms[roomID].creepCounts[creepType] + "/" + creepMins[creepType] + ") in " + roomID + ": " + creepName);
                            }
                            break; // NOTE: Need to either wait till the creep can start spawning or be spawned, so no need to check the rest
                        }
                    }
                    
                    // Keep track of rooms that don't have anything to spawn so we don't check them again if they have another spawn
                    if (creepName == undefined || creepName == ERR_NOT_ENOUGH_ENERGY || _.isString(creepName) == true) { // TODO: Override Room.energyAvaliable so it can be updated if a spawn starts spawning a creep so we don't need to skip other spawns in the room this tick, them remove the isString check from this if case
                        nothingToSpawn.push(roomID);
                    }
                }
                
                if (_.isString(creepName) == false) {
                    let creep = _.min(spawn.pos.findInRange(FIND_MY_CREEPS, 1, { filter: (c) => (
                        c.energyAvaliableOnSpawn >= _.get(Game.rooms, [c.memory.roomID, "energyCapacityAvailable"], spawn.room.energyCapacityAvailable) // NOTE: Don't renew creeps when better ones might be spawned to replace them
                        && c.memory.role != "claimer" 
                        && _.some(c.body, "boost") == false
                    )}), "ticksToLive");
                    if (creep instanceof Creep) { // make sure Infinity wasn't returned from min instead of a creep
                        spawn.renewCreep(creep);
                    }
                }
            }
        }
        else if (_.get(spawn, ["spawning", "remainingTime"], 0) == 1) {
            
            // Make sure ramparts are supplying cover to anywhere the spawning creep may end up at the start of the next tick
            let rampartsNearSpawn = spawn.pos.findInRange(FIND_MY_STRUCTURES, 1, (s) => (
                s.structureType == STRUCTURE_RAMPART 
            ));
            _.forEach(rampartsNearSpawn, (rnc) => {
                privateRamparts[rnc.id] = true;
            });
        }
    }
    
    if (Memory.MonCPU == true) { console.log("spawn>ramparts:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    // Update ramparts public/private state
    _.forEach(ramparts, (r) => {
        if (_.get(CONTROLLER_STRUCTURES[STRUCTURE_RAMPART], r.room.controller.level, 0) == 0) { return; } // NOTE: This should use less than the 0.2 CPU that a Rampart.isActive() check uses
        
        // If the rampart is protecting a structure, it should always be private
        let privateState = privateRamparts[r.id] || false;
        if (privateState == false && _.filter(r.pos.lookFor(LOOK_STRUCTURES), (s) => (
            s.structureType != STRUCTURE_RAMPART 
            && s.structureType != STRUCTURE_ROAD
        )).length > 0) {
            privateState = true;
        }
        
        // Set the rampart to the new state if it's not already
        if (r.isPublic == privateState) {
            r.setPublic(privateState == false);
        }
    });
    
    if (Memory.MonCPU == true) { console.log("ramparts>screepsPlus:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    screepsPlus.collect_stats(); // Put stats generated at start of loop in memory for agent to collect and push to Grafana dashboard
    
    // For Screeps Visual: https://github.com/screepers/screeps-visual
    //visualiser.movePaths();
    //RawVisual.commit();
    
    if (Memory.MonCPU == true) { console.log("screepsPlus>end:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
}
