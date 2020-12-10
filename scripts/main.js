if (Memory.MonCPU == true) { console.log("globalStart>init:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }

// Setup globals and prototypes
global.NODE_USAGE = { 
    first: Game.time
    , last: Game.time
    , total: 0
    , codeVersion: require.timestamp
}; // NOTE: Can't put this in the global file since the require caches can be reset outside of a global reset
function globalStats() { "use strict";
    const meta_key = "__globalStats__";
    const stats = _.reduce(global, (acc,obj,key) => {
        if(key !== meta_key) {
            try {
                acc[key] = JSON.stringify(obj).length;
            } catch(e) {
                acc[key] = 0;
            }
        }
        return acc;
    }, {});
    
    return { meta_key, stats };
}
//require("data." + Game.shard.name)();
require("globals")(); // NOTE: All globals not from an external resource should be declared here
require("prototype.creep")(); // NOTE: Must be required after globals.js
require("prototype.terminal")(); // NOTE: Must be required after globals.js
require("prototype.room")(); // NOTE: Must be required after globals.js
require("prototype.memory")(); // NOTE: Must be required after prototype.room.js
require("prototype.controller")(); // NOTE: Must be required after prototype.room.js
require("prototype.source")(); // NOTE: Must be required after prototype.room.js
require("prototype.spawn")(); // NOTE: Must be required after prototype.room.js
require("traveler")({ 
    exportTraveler: false
    , installPrototype: true
    , visualisePathStyle: { 
        lineStyle: "solid"
        , strokeWidth: .1
        , opacity: .25
}}); // TODO: Make a custom version of Creep.moveTo and remove this stopgap solution
require("injectBirthday");

// Setup constants
/*
    Used by screepsPlus to generate stats
    NOTE: Must be called after globals initialisation
*/
const resourcesInfo = require("resources");
const screepsPlus = require("screepsplus"); // Used to put stats in memory/segment for agent to collect and push to Grafana dashboard
//const visualiser = require("visualiser"); // NOTE: Must be called after globals initialisation

// TODO: Only do all the following memory initialisation on code commits instead of global resets

// Make sure all required root memory objects exist
_.defaultsDeep(Memory, { // TODO: Implement the LOAN alliance import script pinned in the #share-thy-code channel of the Screeps Slack, and use it to help figure out TooAngel AI users, potentual agressive players, potential allies and allies
    "creeps": {}
    , "rooms": {}
    , "spawns": {}
    , "flags": {}
    , "MonCPU": false
    , "MonGlobal": false
    , "refillBucket": false
    , "aggressivePlayers": [ // these players attack first and ask questions later (if at all)
        "rysade"
        , "roncli" // uses players with no RCL 8 rooms as testing grounds to improve their combat code with
        , "rudykocur" // uses nukes
        , "McGnomington" // open to negotiations
        , "Archangel"
        , "Vultured"
        , "vrs" // open to negotiations
        , "a2coder" // indiscriminately aggressive towards PINK alliance members
        , "GiantDwarf" // uses nukes, open to negotiations
    ]
    , "nonAggressivePlayers": [ // alliance members or nice players that have added "dragoonreas" to their own non-aggressive list and which won't be considered 'invaders' when looping through Game.rooms (so turrents won't fire on them and such)
        SYSTEM_USERNAME
    ] // TODO: Make new list for high-trust players (like fellow alliance members) to have ramparts on storage/terminal lowered when they're near to allow them to withdraw & deposit freely
}); // TODO: Get alliance data from user "LeagueOfAutomatedNations" public segment every 6hrs

// Make sure all required room memory objects exist
for (let roomID in Game.rooms) {
    let theRoom = Game.rooms[roomID];
    _.defaults(theRoom, {
         "memoryExpiration": getRoomMemoryExpiration(roomID) // TODO: Don't let harvest rooms expire
        , "clearPathCaches": true
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
            //console.log("Energy source at " + JSON.stringify(source.pos) + " will regen in " + source.ticksToRegeneration + " ticks");
        }
    }
}

// Setup room memory objects for owned rooms
_.set(Memory.rooms, ["W28N5", "harvestRooms"], [
    "W27N5"
    , "W29N5"
    , "W28N6"
]);
_.set(Memory.rooms, ["W12S26", "harvestRooms"], [
    "W12S27"
    , "W13S26"
]);
/*
    Future Expansion Candidates:
    From W28N5:
        - W12S26
*/

/*
    TODO:
    These should be stored in an array instead of an object since their order also defines the build priority.
    Also be sure to use for...of instead of for..in where their order is important
*/
_.set(Memory.rooms, ["W28N5", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_ROAD]: 1
    , [STRUCTURE_RAMPART]: 0
    , [STRUCTURE_WALL]: 0
    , all: 1
});
_.set(Memory.rooms, ["W12S26", "repairerTypeMins"], {
    [STRUCTURE_CONTAINER]: 0
    , [STRUCTURE_ROAD]: 1
    , [STRUCTURE_RAMPART]: 0
    , [STRUCTURE_WALL]: 0
    , all: 1
});

/*
    NOTE:
    To delete old room memory from console:
    _.pull(managedRooms, <roomName>); delete Memory.rooms.<roomName>;
*/
let managedRooms = [];
for (let roomID in Memory.rooms) {
    if (Memory.rooms[roomID].repairerTypeMins != undefined) {
        managedRooms.push(roomID);
        Memory.rooms[roomID].memoryExpiration = getRoomMemoryExpiration(roomID);
    }
}

/*
    TODO:
    These should be stored in an array instead of an object since their order also defines the build priority.
    Also be sure to use for...of instead of for..in where their order is important
*/
_.set(Memory.rooms, ["W28N5", "creepMins"], {
    attacker: 0
    , harvester: 4
    , powerHarvester: 0
    , upgrader: 1
    , miner: 0//_.size(_.get(Game.rooms, ["W28N5", "minerSources"], {}))
    , adaptable: 0
    , demolisher: _.parseInt(_.reduce(_.get(Game.rooms, ["W28N5", "demolishersToSpawn"], [ { count: 0 } ]), (sum, dTS) => (sum + dTS.count), 0))
    , scout: 0
    , claimer: 1
    , repairer: _.parseInt(_.reduce(_.get(Memory.rooms, ["W28N5", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0))
    , builder: 1
    , exporter: _.parseInt(_.reduce(_.get(Game.rooms, ["W28N5", "exportersToSpawn"], [ { count: 0 } ]), (sum, eTS) => (sum + eTS.count), 0))
    , rockhound: (_.get(Game.rooms, ["W28N5", "canHarvestMineral"], false) ? 1 : 0)
});
_.set(Memory.rooms, ["W12S26", "creepMins"], {
    attacker: 0
    , harvester: 4
    , powerHarvester: 0
    , upgrader: 1
    , miner: 0//_.size(_.get(Game.rooms, ["W12S26", "minerSources"], {}))
    , adaptable: 0
    , demolisher: _.parseInt(_.reduce(_.get(Game.rooms, ["W12S26", "demolishersToSpawn"], [ { count: 0 } ]), (sum, dTS) => (sum + dTS.count), 0))
    , scout: 0
    , claimer: 1
    , repairer: _.parseInt(_.reduce(_.get(Memory.rooms, ["W12S26", "repairerTypeMins"], { all:0 }), (sum, count) => (sum + count), 0))
    , builder: 1
    , exporter: _.parseInt(_.reduce(_.get(Game.rooms, ["W12S26", "exportersToSpawn"], [ { count: 0 } ]), (sum, eTS) => (sum + eTS.count), 0))
    , rockhound: (_.get(Game.rooms, ["W12S26", "canHarvestMineral"], false) ? 1 : 0)
});

if (Memory.MonCPU == true) { console.log("init>loopStart:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }

module.exports.loop = function () {
    
    let loopStartCPUUsed = Game.cpu.getUsed();
    
    if (global.LastMemory 
        && NODE_USAGE.last == (Game.time - 1) 
        && NODE_USAGE.codeVersion == require.timestamp) {
        delete global.Memory;
        global.Memory = global.LastMemory;
        RawMemory._parsed = global.LastMemory;
    }
    else {
        Memory;
        global.LastMemory = RawMemory._parsed;
    }
    
    if (Memory.MonCPU == true) { console.log("loopStart>memory:",loopStartCPUUsed.toFixed(2).toLocaleString()); }
    
    require("prototype.memory")(); // TODO: Try and find a way to make this a prototype of memory so this doesn't have to be done each tick
    
    if (Memory.MonCPU == true) { console.log("memory>stats:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    require("prototype.game.market")();
    
    if (NODE_USAGE.first == NODE_USAGE.last) {
        _.set(Memory, ["stats", "node", "hasReset"], 1);
    }
    else {
        _.set(Memory, ["stats", "node", "hasReset"], 0);
    }
    NODE_USAGE.total += 1;
    _.set(Memory.stats.node, ["totalTicksUsed"], NODE_USAGE.total);
    if (NODE_USAGE.last != (Game.time - 1)) {
        _.set(Memory.stats.node, ["hasSwapped"], 1);
    }
    else {
        _.set(Memory.stats.node, ["hasSwapped"], 0);
    }
    NODE_USAGE.last = Game.time;
    
    if (_.size(Game.spawns) == 0 && _.size(Game.constructionSites) == 0 && _.size(Game.structures) == 0) {
        _.invoke(Game.creeps, "suicide");
        if (NODE_USAGE.total == 1) {
            console.log(_.get(Game, ["shard", "name"], "shard?") + " discovered.")
        }
        return;
    }
    
    resourcesInfo.summarize_rooms(); // Generate stats for screepsplus to retrieve at end of loop
    
    if (_.get(Memory, ["refillBucket"], false) == true || Game.cpu.tickLimit < 500) { // Update stats and sleep everything else to refill bucket a bit if needed
        console.log("Refilling bucket: " + Game.cpu.bucket);
        _.forEach(Game.creeps, (c) => {
            if (c.spawning == false) {
                c.memory.executingRole = "sleep";
                c.say(ICONS["sleep"], true);
            }
        });
        if (Game.cpu.bucket >= 7500 || CAN_REFILL_BUCKET === false) {
            _.set(Memory, ["refillBucket"], false);
        }
        else if (Game.cpu.tickLimit < 500 && CAN_REFILL_BUCKET === true) {
            _.set(Memory, ["refillBucket"], true);
        }
        screepsPlus.collect_stats(); // Put stats generated at start of loop in memory for agent to collect and push to Grafana dashboard
        Memory.stats.tickSlept = 1;
        Memory.stats.cpu.used = Game.cpu.getUsed();
        let statsStr = JSON.stringify(Memory.stats);
        let statsSize = statsStr.length;
        if (statsSize <= MAX_SEGMENT_LENGTH) {
            RawMemory.segments[70] = statsStr;
        }
        else {
            console.log("Stats " + (statsSize - MAX_SEGMENT_LENGTH) + " characters too long to save in segment.")
        }
        return;
    }
    else {
        Memory.stats.tickSlept = 0;
    }
    
    // Get current creep counts
    for (let roomID of managedRooms) {
        _.set(Memory, ["rooms", roomID, "creepCounts"], {});
        for (let creepType in Memory.rooms[roomID].creepMins) {
            Memory.rooms[roomID].creepCounts[creepType] = _.sum(Game.creeps, (c) => (
                c.memory.roomID == roomID 
                && c.memory.role == creepType
            ));
        }
        
        _.set(Memory, ["rooms", roomID, "repairerTypeCounts"], {});
        for (let repairerType in Memory.rooms[roomID].repairerTypeMins) {
            Memory.rooms[roomID].repairerTypeCounts[repairerType] = _.sum(Game.creeps, (c) => (
                c.memory.roomID == roomID 
                && c.memory.repairerType == repairerType
            ));
        }
    }
    
    if (Memory.MonCPU == true) { console.log("stats>gc:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }

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
            if (ticksSinceBirth < 0) {
                console.log("Failed to spawn " + creepMemory.roomID + " " + creepMemory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + creepName);
            }
            else {
                console.log("Expired " + ticksSinceBirth.toLocaleString() + " tick, " + creepMemory.roomID + " " + creepMemory.role + " (" + currentSpawnedRole + "/" + minimumSpawnedRole + "): " + creepName);
                if (checkingForDrops == false) {
                    checkingForDrops = true;
                }
            }
            delete Memory.creeps[creepName];
        }
    }
    
    // Garbage collection for room memory
    for (let roomID in Memory.rooms) {
        if (Game.rooms[roomID] == undefined 
            && (Memory.rooms[roomID].memoryExpiration || 0) < Game.time) {
            if ((Memory.rooms[roomID].lastViewed || 0) > (Game.time - ROOM_VISUAL_TIMEOUT)) {
                Memory.rooms[roomID].memoryExpiration = (Memory.rooms[roomID].lastViewed + ROOM_VISUAL_TIMEOUT);
            }
            else {
                console.log("Running garbage collection on room memory: " + roomID);
                delete Memory.rooms[roomID];
                continue;
            }
        }

        // Garbage collection for invader cores
        if (_.get(Game.rooms, ["roomID", "invaderCore"], undefined) == undefined 
            && _.get(Memory.rooms, ["roomID", "invaderCore", "collapsesAt"], 0) < Game.time) {
            Memory.rooms[roomID].invaderCoreMem = undefined;
        }
        
        // Garbage collection for invader weightings
        if (_.size(_.get(Memory.rooms[roomID], "invaderWeightings", {})) > 0) {
            for (let invaderID in Memory.rooms[roomID].invaderWeightings) {
                if ((Memory.rooms[roomID].invaderWeightings[invaderID].expiresAt || 0) < Game.time) {
                    //console.log("Running garbage collection on invaderWeightings for " + invaderID + " in room memory: " + roomID);
                    delete Memory.rooms[roomID].invaderWeightings[invaderID];
                }
            }
        }
        if (_.size(_.get(Memory.rooms[roomID], "invaderWeightings", {})) > 0) {
            let priorityTarget = _.max(_.get(Memory.rooms[roomID], "invaderWeightings", {}), (iW) => (iW.weighting));
            let priorityTargetWeighting = _.get(priorityTarget, ["weighting"], 0);
            if (_.get(Memory.rooms, [roomID, "invaderWeightings", _.get(Memory.rooms, [roomID, "priorityTargetID"], ""), "weighting"], 0) < priorityTargetWeighting) {
                let priorityTargetID = _.findKey(_.get(Memory.rooms[roomID], "invaderWeightings", {}), (iW) => (iW.weighting = priorityTargetWeighting)) || undefined;
                _.set(Memory.rooms, [roomID, "priorityTargetID"], priorityTargetID);
            }
        }
        else {
            Memory.rooms[roomID].invaderWeightings = undefined;
            Memory.rooms[roomID].priorityTargetID = undefined;
        }

        // Garbage collection for danger zones
        if (Game.rooms[roomID] != undefined) {
            Game.rooms[roomID].dangerZones = [];
        }
        
        if (_.get(Memory.rooms, [roomID, "clearPathCaches"], false) == false) {
            Memory.rooms[roomID].clearPathCaches = undefined;
        }
    }
    
    // Garbage collection for orders
    let roomResourceOrders = _.groupBy(Game.market.orders, (o) => (o.roomName + o.type + o.resourceType));
    _.forEach(roomResourceOrders, (rROs) => {
        if ((_.get(_.first(rROs), "type", "") == ORDER_SELL 
                && _.get(Game.rooms, [_.first(rROs).roomName, "terminal", "store", _.first(rROs).resourceType], 0) == 0) 
            || (_.get(_.first(rROs), "type", "") == ORDER_BUY 
                && _.get(_.first(rROs), "remainingAmount", 0) == 0)) {
            _.forEach(rROs, (rRO) => { Game.market.cancelOrder(rRO.id); });
            console.log("Running garbage collection on " + _.first(rROs).type + " order of " + _.first(rROs).resourceType + " from " + _.first(rROs).roomName);
        }
        else if (rROs.length > 1) {
            rROs = _.sortBy(rROs, "created");
            let firstID = _.first(rROs).id;
            _.forEach(rROs, function(rRO) {
                if (rRO.id != firstID) {
                    Game.market.cancelOrder(rRO.id);
                }
            });
            console.log("Running garbage collection on " + (rROs.length - 1) + " extra " + _.first(rROs).type + " order(s) of " + _.first(rROs).resourceType + " from " + _.first(rROs).roomName);
        }
    });
    
    if (Memory.MonCPU == true) { console.log("gc>room:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    let ramparts = _.filter(Game.structures, (s) => (s.structureType == STRUCTURE_RAMPART));
    let privateRamparts = {};
    
    let ignoredRooms = [
    ];
    
    let balancedResources = [];
    
    let latestEnergyHistory = _.max(Game.market.getHistory(RESOURCE_ENERGY), (h) => { return new Date(h.date).getTime(); });
    let estEnergyPrice = _.get(latestEnergyHistory, ["avgPrice"], 0.001);
    
    // Manage rooms and run structures (except spawns)
    for (let roomID in Game.rooms) {
        if (_.includes(ignoredRooms, roomID) == true) { continue; }
        
        let theRoom = Game.rooms[roomID];
        
        // Make sure all required room memory objects exist
        theRoom.memoryExpiration = getRoomMemoryExpiration(roomID); // Update scheduled time for room memory garbage collection
        _.defaults(theRoom, {
            "checkForDrops": false
            , "hasHostileCreep": false
            , "clearPathCaches": false
            , "avoidTravelUntil": 0
            , "buildOrderFILO": false
        });
        
        let theController = theRoom.controller;
        if (theController != undefined) {
            /*
            _.defaults(Memory.controllers[theController.id], {
                pos: theController.pos
            });
            */
            let downgradesAt = ((theController.ticksToDowngrade && (Game.time + theController.ticksToDowngrade)) || (theController.reservation && (Game.time + (theController.reservation.ticksToEnd >= 0 ? theController.reservation.ticksToEnd : -1))) || undefined);
            let neutralAt = ((downgradesAt && (downgradesAt + _.get(CUMULATIVE_CONTROLLER_DOWNGRADE, [theController.level - 2], 0))) || undefined);
            _.set(theRoom, ["controllerMem"], { 
                id: theController.id
                , pos: theController.pos
                , owner: theController.owner
                , reservation: ((theController.reservation && { username: _.get(theController.reservation, ["username"], ""), endsAt: Game.time + (theController.reservation.ticksToEnd >= 0 ? theController.reservation.ticksToEnd : -1) }) || undefined)
                , level: theController.level
                , downgradesAt: downgradesAt
                , neutralAt: neutralAt
                , unblockedAt: ((theController.upgradeBlocked && (Game.time + theController.upgradeBlocked)) || undefined)
                , safeModeEndsAt: ((theController.safeMode && (Game.time + theController.safeMode)) || undefined)
                , sign: theController.sign
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
                //console.log("Energy source at " + JSON.stringify(source.pos) + " will regen in " + source.ticksToRegeneration + " ticks");
            }
        }
        
        // TODO: Check for nukes and make sure only 1 notification is sent (for the lifetime of that nuke) when the nuke is found
        
        let towers = theRoom.myActiveTowers;
        
        let mayHaveRamparts = (_.get(theRoom, ["controller", "level"], 0) < _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_RAMPART], (v) => (v > 0)) == false);
        
        // Get ramparts near controller
        if (_.get(theController, ["my"], false) == true 
            && mayHaveRamparts == true) {
            let rampartsNearController = theController.pos.findInRange(FIND_MY_STRUCTURES, 1, (s) => (
                s.structureType == STRUCTURE_RAMPART 
                && s.my == true
            ));
            _.forEach(rampartsNearController, (rnc) => {
                privateRamparts[rnc.id] = true; // Make ramparts near controller private
            });
        }
        
        let theInvaderCore = theRoom.invaderCore;
        if (theInvaderCore != undefined) {
            let collapseTimer = _.get(_.find(_.get(theInvaderCore, ["effects"], []), "effect", EFFECT_COLLAPSE_TIMER), ["ticksRemaining"], INVADER_CORE_ACTIVE_TIME);
            let deploysAt = Game.time + _.get(theInvaderCore, ["ticksToDeploy"], 0);
            let collapsesAt = (deploysAt + collapseTimer);
            _.set(theRoom.memory, ["invaderCore"], { 
                id: theInvaderCore.id 
                , pos: theInvaderCore.pos 
                , level: theInvaderCore.level 
                , deploysAt: deploysAt 
                , collapsesAt: collapsesAt
            });
            if (collapsesAt > theRoom.memory.memoryExpiration) {
                theRoom.memory.memoryExpiration = collapsesAt;
            }
            if (_.get(theRoom.memory.invaderCore, ["level"], 0) > 0 
                && _.get(theRoom.memory.invaderCore, ["deploysAt"], 0) < (Game.time + 50) 
                && collapsesAt > theRoom.avoidTravelUntil) {
                theRoom.avoidTravelUntil = collapsesAt;
            }
        }
        
        let justNPCs = undefined;
        let noHealers = undefined;
        
        let priorityTargets = undefined;
        let priorityTarget = undefined;
        
        // Get invader info
        let invaders = theRoom.find(FIND_HOSTILE_CREEPS, {
            filter: (i) => (_.includes(_.difference(Memory.nonAggressivePlayers, [SYSTEM_USERNAME]), i.owner.username) == false)
        });
        let powerfulInvaders = theRoom.find(FIND_HOSTILE_POWER_CREEPS, {
            filter: (i) => (_.includes(_.difference(Memory.nonAggressivePlayers, [SYSTEM_USERNAME]), i.owner.username) == false)
        });
        if (invaders.length > 0 
            || powerfulInvaders.length > 0) {
            theRoom.hasHostileCreep = true;
            if (theController == undefined || theController.my == false || theController.safeMode == undefined) {
                theRoom.checkForDrops = false; // TODO: Change this to flag only checking for drops inside the base when under attack (no path between drop and invaders when considering ramparts an obsticle)
            }
            
            justNPCs = _.every(invaders, (i) => (i.owner.username == "Invader" || i.owner.username == "Source Keeper"));
            noHealers = (_.any(invaders, (c) => (c.getActiveBodyparts(HEAL) > 0)) == false);
            
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
            
            let clearPathCaches = false;
            
            // Deal with priority targets
            theRoom.priorityTargetID = "";
            let highestTargetWeighting = -1;
            for (let aPriorityTarget of priorityTargets) {
                
                // Apply target weightings to the invaders
                let targetWeighting = 0;
                let bodyPartCounts = _.countBy(aPriorityTarget.body, "type");
                if (justNPCs == true || (aPriorityTarget.owner.username != "Invader" && aPriorityTarget.owner.username != "Source Keeper")) { // Only give NPCs a weighting of more than 0 if they're the only hostiles in the room
                    targetWeighting = _.get(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "weighting"], undefined);
                    if (targetWeighting == undefined) {
                        targetWeighting = 0 + (
                            (bodyPartCounts[ATTACK] || 0) * 4 
                            + (bodyPartCounts[RANGED_ATTACK] || 0) * 3 
                            + (bodyPartCounts[WORK] || 0) * 2 
                            + (bodyPartCounts[CLAIM] || 0) * 1
                        ); // TODO: Take into account boosted parts
                        if (targetWeighting == 0) {
                            targetWeighting = (bodyPartCounts[HEAL] || 0) * -1;
                        } // TODO: Take into account boosted parts
                        
                        _.set(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id], {
                            weighting: targetWeighting
                            , expiresAt: (Game.time + aPriorityTarget.ticksToLive)
                        }); // TODO: Store the weightings somewhere else since weighting data is duplicated for each room an invader enters
                    }
                }
                
                // Save ID of new highest target if applicable
                if (targetWeighting > highestTargetWeighting) {
                    highestTargetWeighting = targetWeighting;
                    theRoom.priorityTargetID = aPriorityTarget.id;
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
                    let oldPos = _.get(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "pos"], undefined);
                    let oldAvoidanceRange = _.get(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "avoidanceRange"], undefined);
                    let oldDangerZones = _.get(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "dangerZones"], []);
                    if (oldPos != undefined && aPriorityTarget.pos.isEqualTo(oldPos.x, oldPos.y) && oldAvoidanceRange != undefined && oldAvoidanceRange == avoidanceRange) {
                        for (let oldDangerZone of oldDangerZones) {
                            if (_.some(theRoom.dangerZones, oldDangerZone) == false) {
                                theRoom.dangerZones.push(oldDangerZone);
                                //theRoom.visual.rect(oldDangerZone.x - 0.5, oldDangerZone.y - 0.5, 1, 1, { fill: "red" });
                            }
                        }
                    }
                    else {
                        clearPathCaches = true;
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
                                || (_.includes(Memory.nonAggressivePlayers, s.structure.owner.username) == true 
                                    && s.structure.isPublic == true))
                            ));
                        }
                        _.set(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "pos"], aPriorityTarget.pos);
                        _.set(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "avoidanceRange"], avoidanceRange);
                        _.set(Memory.rooms[aPriorityTarget.room.name], ["invaderWeightings", aPriorityTarget.id, "dangerZones"], []);
                        for (let yPos = topRange; yPos <= bottomRange; ++yPos) {
                            for (let xPos = leftRange; xPos <= rightRange; ++xPos) {
                                let thePos = {
                                    x: xPos
                                    , y: yPos
                                };
                                if ((theRamparts.length == 0 || _.some(theRamparts, thePos) == false) && (theWalls.length == 0 || _.some(theWalls, thePos) == false)) { // TODO: Filter all other non-walkable objects from dangerzones (maybe after all dangerzones have been created)
                                    Memory.rooms[aPriorityTarget.room.name].invaderWeightings[aPriorityTarget.id].dangerZones.push(thePos);
                                    if (_.some(theRoom.dangerZones, thePos) == false) {
                                        theRoom.dangerZones.push(thePos);
                                        //theRoom.visual.rect(thePos.x - 0.5, thePos.y - 0.5, 1, 1, { fill: "red" });
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Get ramparts near target
                if (mayHaveRamparts == true) {
                    let rampartsNearInvader = aPriorityTarget.pos.findInRange(FIND_MY_STRUCTURES, 2, (s) => (
                        s.structureType == STRUCTURE_RAMPART 
                        && s.my == true
                    )); // TODO: Filter theRamparts variable above if available instead
                    _.forEach(rampartsNearInvader, (rni) => {
                        privateRamparts[rni.id] = true; // Make ramparts near priority target private
                        if (targetWeighting > 0 && rni.pos.isNearTo(aPriorityTarget) == true && _.some(rampartsToUse, rni.id) == false) {
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
                    let oldPos = _.get(Memory.rooms[aNonPriorityTarget.room.name], ["invaderWeightings", aNonPriorityTarget.id, "pos"], undefined);
                    let oldAvoidanceRange = _.get(Memory.rooms[aNonPriorityTarget.room.name], ["invaderWeightings", aNonPriorityTarget.id, "avoidanceRange"], undefined);
                    let oldDangerZones = _.get(Memory.rooms[aNonPriorityTarget.room.name], ["invaderWeightings", aNonPriorityTarget.id, "dangerZones"], []);
                    if (oldPos != undefined && aNonPriorityTarget.pos.isEqualTo(oldPos.x, oldPos.y) && oldAvoidanceRange != undefined && oldAvoidanceRange == avoidanceRange) {
                        for (let oldDangerZone of oldDangerZones) {
                            if (_.some(theRoom.dangerZones, oldDangerZone) == false) {
                                theRoom.dangerZones.push(oldDangerZone);
                                //theRoom.visual.rect(oldDangerZone.x - 0.5, oldDangerZone.y - 0.5, 1, 1, { fill: "red" });
                            }
                        }
                    }
                    else {
                        clearPathCaches = true;
                        let topRange = _.max([aNonPriorityTarget.pos.y - avoidanceRange, 0]);
                        let leftRange = _.max([aNonPriorityTarget.pos.x - avoidanceRange, 0]);
                        let bottomRange = _.min([aNonPriorityTarget.pos.y + avoidanceRange, 49]);
                        let rightRange = _.min([aNonPriorityTarget.pos.x + avoidanceRange, 49]);
                        let theRamparts = [];
                        if (mayHaveRamparts == true) {
                            theRamparts = _.filter(theRoom.lookForAtArea(LOOK_STRUCTURES, topRange, leftRange, bottomRange, rightRange, true), (s) => (
                                s.structure.structureType == STRUCTURE_RAMPART 
                                && (s.structure.my == true 
                                || (_.includes(Memory.nonAggressivePlayers, s.structure.owner.username) == true 
                                    && s.structure.isPublic == true))
                            ));
                        }
                        _.set(Memory.rooms[aNonPriorityTarget.room.name], ["invaderWeightings", aNonPriorityTarget.id, "pos"], aNonPriorityTarget.pos);
                        _.set(Memory.rooms[aNonPriorityTarget.room.name], ["invaderWeightings", aNonPriorityTarget.id, "avoidanceRange"], avoidanceRange);
                        _.set(Memory.rooms[aNonPriorityTarget.room.name], ["invaderWeightings", aNonPriorityTarget.id, "dangerZones"], []);
                        for (let yPos = topRange; yPos <= bottomRange; ++yPos) {
                            for (let xPos = leftRange; xPos <= rightRange; ++xPos) {
                                let thePos = {
                                    x: xPos
                                    , y: yPos
                                };
                                if ((theRamparts.length == 0 || _.some(theRamparts, thePos) == false)) {
                                    Memory.rooms[aNonPriorityTarget.room.name].invaderWeightings[aNonPriorityTarget.id].dangerZones.push(thePos);
                                    if (_.some(theRoom.dangerZones, thePos) == false) {
                                        theRoom.dangerZones.push(thePos);
                                        //theRoom.visual.rect(thePos.x - 0.5, thePos.y - 0.5, 1, 1, { fill: "red" });
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Make ramparts near non priority targets private
                if (mayHaveRamparts == true) {
                    let rampartsNearInvader = aNonPriorityTarget.pos.findInRange(FIND_MY_STRUCTURES, 2, (s) => (
                        s.structureType == STRUCTURE_RAMPART 
                        && s.my == true
                    )); // TODO: Filter theRamparts variable above if available instead
                    _.forEach(rampartsNearInvader, (rni) => {
                        privateRamparts[rni.id] = true;
                    });
                }
            }
            
            // Deal with powerful targets
            for (let aPowerfulTarget of powerfulInvaders) {
                
                // Apply target weightings to the invaders
                let targetWeighting = 0;
                targetWeighting = _.get(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "weighting"], undefined);
                if (targetWeighting == undefined) {
                    targetWeighting = 5; // TODO: Take into account powers
                    
                    _.set(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id], {
                        weighting: targetWeighting
                        , expiresAt: (Game.time + aPowerfulTarget.ticksToLive)
                    }); // TODO: Store the weightings somewhere else since weighting data is duplicated for each room an invader enters
                }

                // Save ID of new highest target if applicable
                if (targetWeighting > highestTargetWeighting) {
                    highestTargetWeighting = targetWeighting;
                    theRoom.priorityTargetID = aPowerfulTarget.id;
                }
                
                // Record positions targets can attack within the next tick (TODO: but not during safemode)
                let avoidanceRange = 4; // TODO: Base this on powers
                if (avoidanceRange > 0) {
                    let oldPos = _.get(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "pos"], undefined);
                    let oldAvoidanceRange = _.get(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "avoidanceRange"], undefined);
                    let oldDangerZones = _.get(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "dangerZones"], []);
                    if (oldPos != undefined && aPowerfulTarget.pos.isEqualTo(oldPos.x, oldPos.y) && oldAvoidanceRange != undefined && oldAvoidanceRange == avoidanceRange) {
                        for (let oldDangerZone of oldDangerZones) {
                            if (_.some(theRoom.dangerZones, oldDangerZone) == false) {
                                theRoom.dangerZones.push(oldDangerZone);
                                //theRoom.visual.rect(oldDangerZone.x - 0.5, oldDangerZone.y - 0.5, 1, 1, { fill: "red" });
                            }
                        }
                    }
                    else {
                        clearPathCaches = true;
                        let topRange = _.max([aPowerfulTarget.pos.y - avoidanceRange, 0]);
                        let leftRange = _.max([aPowerfulTarget.pos.x - avoidanceRange, 0]);
                        let bottomRange = _.min([aPowerfulTarget.pos.y + avoidanceRange, 49]);
                        let rightRange = _.min([aPowerfulTarget.pos.x + avoidanceRange, 49]);
                        let theWalls = _.filter(theRoom.lookForAtArea(LOOK_TERRAIN, topRange, leftRange, bottomRange, rightRange, true), (t) => (
                            t.terrain == "wall"
                        ));
                        let theRamparts = [];
                        if (mayHaveRamparts == true) {
                            theRamparts = _.filter(theRoom.lookForAtArea(LOOK_STRUCTURES, topRange, leftRange, bottomRange, rightRange, true), (s) => (
                                s.structure.structureType == STRUCTURE_RAMPART 
                                && (s.structure.my == true 
                                || (_.includes(Memory.nonAggressivePlayers, s.structure.owner.username) == true 
                                    && s.structure.isPublic == true))
                            ));
                        }
                        _.set(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "pos"], aPowerfulTarget.pos);
                        _.set(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "avoidanceRange"], avoidanceRange);
                        _.set(Memory.rooms[aPowerfulTarget.room.name], ["invaderWeightings", aPowerfulTarget.id, "dangerZones"], []);
                        for (let yPos = topRange; yPos <= bottomRange; ++yPos) {
                            for (let xPos = leftRange; xPos <= rightRange; ++xPos) {
                                let thePos = {
                                    x: xPos
                                    , y: yPos
                                };
                                if ((theRamparts.length == 0 || _.some(theRamparts, thePos) == false) && (theWalls.length == 0 || _.some(theWalls, thePos) == false)) { // TODO: Filter all other non-walkable objects from dangerzones (maybe after all dangerzones have been created)
                                    Memory.rooms[aPowerfulTarget.room.name].invaderWeightings[aPowerfulTarget.id].dangerZones.push(thePos);
                                    if (_.some(theRoom.dangerZones, thePos) == false) {
                                        theRoom.dangerZones.push(thePos);
                                        //theRoom.visual.rect(thePos.x - 0.5, thePos.y - 0.5, 1, 1, { fill: "red" });
                                    }
                                }
                            }
                        }
                    }
                }
                
                // Get ramparts near target
                if (mayHaveRamparts == true) {
                    let rampartsNearInvader = aPowerfulTarget.pos.findInRange(FIND_MY_STRUCTURES, 2, (s) => (
                        s.structureType == STRUCTURE_RAMPART 
                        && s.my == true
                    )); // TODO: Filter theRamparts variable above if available instead
                    _.forEach(rampartsNearInvader, (rni) => {
                        privateRamparts[rni.id] = true; // Make ramparts near priority target private
                        if (targetWeighting > 0 && rni.pos.isNearTo(aPowerfulTarget) == true && _.some(rampartsToUse, rni.id) == false) {
                            rampartsToUse.push(rni.id); // Save ID of ramparts in melee range of target
                        }
                    });
                }
            }
            
            theRoom.clearPathCaches = clearPathCaches;
            
            priorityTarget = Game.getObjectById(theRoom.priorityTargetID); // This target will be focused on by towers and attacker creeps
            
            // Spawn one melee attacker per rampart in melee range of a priority target, if the towers may not be able to handle it
            if (theRoom.memory.creepMins != undefined) {
                if (noHealers == false || towers.length == 0) {
                    theRoom.memory.creepMins.attacker = rampartsToUse.length || 1;
                }
                else {
                    theRoom.memory.creepMins.attacker = 0;
                }
            }
            
            // Only activate safemode when the base is in real trouble, the current definition of which is either a spawn taking damage or an aggressive players creep being present
            if (theController != undefined 
                && theController.my == true 
                && theController.safeMode == undefined 
                && theController.safeModeCooldown == undefined 
                && theController.safeModeAvaliable > 0 
                && theController.upgradeBlocked == undefined 
                && theController.ticksToDowngrade > ((CONTROLLER_DOWNGRADE[theController.level] / 2) - CONTROLLER_DOWNGRADE_SAFEMODE_THRESHOLD) 
                && (theController.level < 3 
                    || _.some(Game.spawns, (s) => (
                        s.room.name == roomID 
                        && s.hits < s.hitsMax 
                        && s.isActive() == true)) == true // TODO: Calculate the maximum damage output of hostile creeps within range a spawn, and activate safemode if the combined HP of the spawn and rampart covering it is <= x2 the damage output calculated (x2 to account for damage taken this turn if their attacks get run before our safemode)
                    || _.some(invaders, (i) => (
                        _.some(Memory.aggressivePlayers, (aP) => (
                            i.owner.username == aP)))) == true)) { // TODO: Check that this is all working
                //console.log("Attempting to activate Safe Mode in: " + roomID);
                //Game.notify("Attempting to activate Safe Mode in: " + roomID, 30);
                let err = theController.activateSafeMode();
                if (err == OK) {
                    console.log("Activated Safe Mode in: " + roomID);
                    Game.notify("Activated Safe Mode in: " + roomID);
                }
            }
            else if (_.get(theRoom, ["controller", "my"], false) == true && justNPCs == false && highestTargetWeighting > 0) { // TODO: Remove after defenses have been properly tested
                //console.log("Attempting to activate (backup) Safe Mode in: " + roomID);
                //Game.notify("Attempting to activate (backup) Safe Mode in: " + roomID, 30);
                let err = theController.activateSafeMode();
                if (err == OK) {
                    console.log("Activated (backup) Safe Mode in: " + roomID);
                    Game.notify("Activated (backup) Safe Mode in: " + roomID);
                }
            }
        }
        else if (theRoom.hasHostileCreep == true) {
            theRoom.clearPathCaches = false;
            theRoom.hasHostileCreep = false;
            theRoom.checkForDrops = true; // TODO: If the invaders were players, consider drops near the exits as suspicious as they may just be trying to lure creeps outside walls/ramparts to attack them
            
            // Make sure we're not spawning attacker creeps needlessly
            if (theRoom.memory.creepMins != undefined) {
                theRoom.memory.creepMins.attacker = 0;
            }
        }
        else {
            theRoom.clearPathCaches = false;
        }
        
        let dangerousToCreeps = (theRoom.dangerZones.length > 0) ? true : false;
        
        // TODO: Spawn attackers to defend instead of evacuating harvesters in harvest rooms
        if (dangerousToCreeps == true && theRoom.isHarvestRoom == true) {
            let youngestInvader = _.max(invaders, "ticksToLive"); // TODO: Include Power Creeps here
            if (theRoom.avoidTravelUntil < Game.time) {
                _.each(Game.creeps, (c) => {
                    if (c.memory.role != "miner") {
                        c.memory.sourceID = undefined;
                    }
                    c.room.clearPathCaches = true;
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
                let PCInvaders = _.filter(invaders, (i) => (_.includes(NPCOwnerNames, _.get(i, ["owner", "username"], "Invader(?)")) == false));
                let youngestPCInvader = _.max(PCInvaders, "ticksToLive");
                if (justNPCs == false) {
                    Game.notify("Enemy creep owned by " + _.get(youngestPCInvader, ["owner", "username"], "PCInvader(?)") + " shutting down harvesting from " + roomID + " for " + _.get(youngestPCInvader, "ticksToLive", 0) + " ticks.", _.get(youngestPCInvader, "ticksToLive", 0) / EST_TICKS_PER_MIN);
                }
            }
            
            // TODO: Stop claimers being spawned to reserve this harvest room properly from this point, rather than in the spawn and claimer logic
        }
        
        if (theRoom.hasHostileTower == true) { // TODO: Add a check to see if the towers are still there if a creep is in the room, instead of just waiting for it to be reset after a day due to the room memory garbage collection being run on it
            theRoom.checkForDrops = false;
        }
        else if ((theController == undefined) // NOTE: Invader Strongholds don't require a controller
            || (theController.my == false 
                && theController.level >= _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_TOWER], (maxBuildable) => maxBuildable > 0))) {
            let hostileTowers = theRoom.find(FIND_HOSTILE_STRUCTURES, (s) => s.structureType == STRUCTURE_TOWER && _.includes(Memory.nonAggressivePlayers, s.owner.username) == false); // TODO: Figure out if it's also worth checking if the towers are empty or not
            if (hostileTowers.length > 0) {
                theRoom.hasHostileTower = true;
                theRoom.checkForDrops = false;
            }
        } // TODO: Don't check for drops in rooms owned/reserved by allies
        
        // TODO: Set theRoom.memory.avoidTravel based on the check for if it's safe to assign dropped energy for creeps to pickup
        
        // Make sure dynamic creep minimums are kept up-to-date
        if (_.get(Memory, ["rooms", roomID, "creepMins", "demolisher"], -1) >= 0) {
            _.set(Memory, ["rooms", roomID, "creepMins", "demolisher"], _.parseInt(_.reduce(_.get(Game.rooms, [roomID, "demolishersToSpawn"], [ { count: 0 } ]), (sum, dTS) => (sum + dTS.count), 0)));
        }
        if (_.get(Memory, ["rooms", roomID, "creepMins", "exporter"], -1) >= 0) {
            _.set(Memory, ["rooms", roomID, "creepMins", "exporter"], _.parseInt(_.reduce(_.get(Game.rooms, [roomID, "exportersToSpawn"], [ { count: 0 } ]), (sum, eTS) => (sum + eTS.count), 0)));
        }
        if (_.get(Memory, ["rooms", roomID, "creepMins", "rockhound"], -1) == 0) {
            _.set(Memory, ["rooms", roomID, "creepMins", "rockhound"], (_.get(Game.rooms, [roomID, "canHarvestMineral"], false) ? 1 : 0));
        }
        
        let scoreContainers = theRoom.find(FIND_SCORE_CONTAINERS, {
                filter: (sc) => (
                    _.sum(sc.store) > 0
            )});
        if (theRoom.checkForDrops == true || ((scoreContainers.length > 0 || checkingForDrops == true) && (dangerousToCreeps == false || (theController != undefined && theController.my == true && theController.safeMode != undefined)) && theRoom.hasHostileTower == false)) { // TODO: Check that we're not in someone elses room
            theRoom.checkForDrops = false;
            let recycleContainer = _.get(Game.rooms, [roomID, "recycleContainer"], undefined);
            let droppedResources = theRoom.find(FIND_DROPPED_RESOURCES, {
                filter: (dr) => (
                    (recycleContainer == undefined) 
                    || (dr.pos.isEqualTo(recycleContainer) != true)
            )});
            let tombstones = theRoom.find(FIND_TOMBSTONES, { 
                filter: (t) => (
                    _.sum(t.store) > 0
            )});
            let ruins = theRoom.find(FIND_RUINS, {
                filter: (r) => (
                    _.sum(r.store) > 0
            )});
            if (scoreContainers.length > 0 || droppedResources.length > 0 || tombstones.length > 0 || ruins.length > 0) {
                let collectorCreeps = theRoom.find(FIND_MY_CREEPS, {
                    filter: (c) => (
                        c.spawning == false 
                        && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                        && c.hits == c.hitsMax 
                        && c.memory.speeds["2"] <= 2 
                        && c.memory.role != "miner" 
                        && c.memory.role != "attacker" 
                        && c.memory.role != "powerHarvester"
                        && c.memory.role != "adaptable" 
                        && c.memory.role != "scout"
                        && c.memory.role != "claimer" 
                        && c.memory.role != "recyclable" 
                        && c.carryCapacityAvailable > 0
                )});
                
                if (scoreContainers.length > 0) {
                    scoreContainers = _.sortByOrder(scoreContainers, (t) => (_.sum(t.store, (a, r) => (resourceWorth(r) * a))), "desc");
                    toStr(scoreContainers);
                    for (let scoreContainer of scoreContainers) {
                        let hasAssignedCreep = _.some(Game.creeps, (c) => (
                            _.get(c.memory, ["scoreContainer", "id"], undefined) == scoreContainer.id
                        ));
                        if (hasAssignedCreep == false) {
                            let creep = scoreContainer.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                    _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                    && c.carryCapacityAvailable >= _.sum(scoreContainer.store)
                                    && c.pos.inRangeTo(scoreContainer.pos, scoreContainer.ticksToDecay + _.max(scoreContainer.store))
                            )});
                            if (creep == undefined) {
                                creep = scoreContainer.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                        _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                        && c.carryTotal == 0
                                        && c.pos.inRangeTo(scoreContainer.pos, scoreContainer.ticksToDecay + _.max(scoreContainer.store))
                                )});
                                if (creep == undefined) {
                                    creep = scoreContainer.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                            _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                            && c.pos.inRangeTo(scoreContainer.pos, scoreContainer.ticksToDecay + _.max(scoreContainer.store))
                                    )});
                                }
                            }
                            if (creep != undefined) {
                                creep.memory.scoreContainer = {
                                    id: scoreContainer.id
                                    , pos: scoreContainer.pos
                                };
                                console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + Math.min(_.sum(scoreContainer.store), creep.carryCapacityAvailable) + " resources from score container in " + roomID);
                            }
                            else {
                                //console.log("No creeps available to pickup " + _.sum(scoreContainer.store) + " resources from score container in " + roomID); // TODO: Put this back in after adding a check to make sure it's only displayed once per drop instead of each tick
                                theRoom.checkForDrops = true;
                            }
                        }
                    }
                }
                
                if (droppedResources.length > 0) {
                    droppedResources = _.sortByOrder(droppedResources, (dr) => (resourceWorth(dr.resourceType) * dr.amount), "desc");
                    for (let droppedResource of droppedResources) {
                        let hasAssignedCreep = _.some(Game.creeps, (c) => (
                            _.get(c.memory, ["droppedResource", "id"], undefined) == droppedResource.id
                        ));
                        if (hasAssignedCreep == false) {
                            let creep = droppedResource.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                    _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                    && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                    && c.carryCapacityAvailable >= droppedResource.amount
                                    && c.pos.inRangeTo(droppedResource.pos, droppedResource.amount)
                            )});
                            if (creep == undefined) {
                                creep = droppedResource.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                        _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                        && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                        && c.carryTotal == 0
                                        && c.pos.inRangeTo(droppedResource.pos, droppedResource.amount)
                                )});
                                if (creep == undefined) {
                                    creep = droppedResource.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                            _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                            && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                            && c.pos.inRangeTo(droppedResource.pos, droppedResource.amount)
                                    )});
                                }
                            }
                            if (creep != undefined) {
                                creep.memory.droppedResource = {
                                    id: droppedResource.id
                                    , pos: droppedResource.pos
                                };
                                console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + Math.min(droppedResource.amount, creep.carryCapacityAvailable) + " of " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + roomID);
                            }
                            else {
                                //console.log("No creeps available to pickup " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + roomID); // TODO: Put this back in after adding a check to make sure it's only displayed once per drop instead of each tick
                                theRoom.checkForDrops = true;
                            }
                        }
                    }
                }
                
                if (tombstones.length > 0) {
                    tombstones = _.sortByOrder(tombstones, (t) => (_.sum(t.store, (a, r) => (resourceWorth(r) * a))), "desc");
                    toStr(tombstones);
                    for (let tombstone of tombstones) {
                        let hasAssignedCreep = _.some(Game.creeps, (c) => (
                            _.get(c.memory, ["tombstone", "id"], undefined) == tombstone.id
                        ));
                        if (hasAssignedCreep == false) {
                            let creep = tombstone.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                    _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                    && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                    && _.get(c.memory, ["tombstone", "id"], undefined) == undefined 
                                    && c.carryCapacityAvailable >= _.sum(tombstone.store)
                                    && c.pos.inRangeTo(tombstone.pos, tombstone.ticksToDecay + _.max(tombstone.store))
                            )});
                            if (creep == undefined) {
                                creep = tombstone.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                        _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                        && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                        && _.get(c.memory, ["tombstone", "id"], undefined) == undefined 
                                        && c.carryTotal == 0
                                        && c.pos.inRangeTo(tombstone.pos, tombstone.ticksToDecay + _.max(tombstone.store))
                                )});
                                if (creep == undefined) {
                                    creep = tombstone.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                            _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                            && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                            && _.get(c.memory, ["tombstone", "id"], undefined) == undefined 
                                            && c.pos.inRangeTo(tombstone.pos, tombstone.ticksToDecay + _.max(tombstone.store))
                                    )});
                                }
                            }
                            if (creep != undefined) {
                                creep.memory.tombstone = {
                                    id: tombstone.id
                                    , pos: tombstone.pos
                                };
                                console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + Math.min(_.sum(tombstone.store), creep.carryCapacityAvailable) + " resources from tombstone of " + tombstone.creep.name + " in " + roomID);
                            }
                            else {
                                //console.log("No creeps available to pickup " + _.sum(tombstone.store) + " resources from tombstone of " + tombstone.creep.name + " in " + roomID); // TODO: Put this back in after adding a check to make sure it's only displayed once per drop instead of each tick
                                theRoom.checkForDrops = true;
                            }
                        }
                    }
                }
                
                if (ruins.length > 0) {
                    ruins = _.sortByOrder(ruins, (t) => (_.sum(t.store, (a, r) => (resourceWorth(r) * a))), "desc");
                    toStr(ruins);
                    for (let ruin of ruins) {
                        let hasAssignedCreep = _.some(Game.creeps, (c) => (
                            _.get(c.memory, ["ruin", "id"], undefined) == ruin.id
                        ));
                        if (hasAssignedCreep == false) {
                            let creep = ruin.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                    _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                    && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                    && _.get(c.memory, ["tombstone", "id"], undefined) == undefined 
                                    && _.get(c.memory, ["ruin", "id"], undefined) == undefined 
                                    && c.carryCapacityAvailable >= _.sum(ruin.store)
                                    && c.pos.inRangeTo(ruin.pos, ruin.ticksToDecay + _.max(ruin.store))
                            )});
                            if (creep == undefined) {
                                creep = ruin.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                        _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                        && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                        && _.get(c.memory, ["tombstone", "id"], undefined) == undefined 
                                        && _.get(c.memory, ["ruin", "id"], undefined) == undefined 
                                        && c.carryTotal == 0
                                        && c.pos.inRangeTo(ruin.pos, ruin.ticksToDecay + _.max(ruin.store))
                                )});
                                if (creep == undefined) {
                                    creep = ruin.pos.findClosestByRange(collectorCreeps, { filter: (c) => (
                                            _.get(c.memory, ["scoreContainer", "id"], undefined) == undefined 
                                            && _.get(c.memory, ["droppedResource", "id"], undefined) == undefined 
                                            && _.get(c.memory, ["tombstone", "id"], undefined) == undefined 
                                            && _.get(c.memory, ["ruin", "id"], undefined) == undefined 
                                            && c.pos.inRangeTo(ruin.pos, ruin.ticksToDecay + _.max(ruin.store))
                                    )});
                                }
                            }
                            if (creep != undefined) {
                                creep.memory.ruin = {
                                    id: ruin.id
                                    , pos: ruin.pos
                                };
                                console.log("Sending " + creep.name + " (" + creep.memory.role + ") to pickup " + Math.min(_.sum(ruin.store), creep.carryCapacityAvailable) + " resources from ruin in " + roomID);
                            }
                            else {
                                //console.log("No creeps available to pickup " + _.sum(ruin.store) + " resources from ruin in " + roomID); // TODO: Put this back in after adding a check to make sure it's only displayed once per drop instead of each tick
                                theRoom.checkForDrops = true;
                            }
                        }
                    }
                }
            }
        }
        // TODO: Else case for unassigned dropped resources and tombstones from creeps in a room when it's unsafe to try and collect them
        
        // Run towers in the room
        let towerTargets = [];
        for (let towerID in towers) {
            let tower = towers[towerID];
            
            let target = priorityTarget;
            /*
            // TODO: Maybe group PC and NPC targets separately so the same weightings can be applied to each, rather than the NPCs having no weighting
            if (target == undefined && priorityTargets != undefined) {
                target = tower.pos.findClosestByRange(priorityTargets);
            }
            */
            
            if (target != undefined) { // Attack a creep if needed
                tower.attack(target);
                towerTargets.push(target.owner.username);
                if (justNPCs == false) {
                    Game.notify("Tower in " + roomID + " attacking hostile from " + target.owner.username, target.ticksToLive / EST_TICKS_PER_MIN);
                }
            }
            else { // Else heal a creep if needed
                target = tower.pos.findClosestByRange(FIND_MY_POWER_CREEPS, { 
                    filter: (c) => (c.hits < c.hitsMax
                )}); // TODO: Also heal ally power creeps
                if (target == undefined) {
                    target = tower.pos.findClosestByRange(FIND_MY_CREEPS, { 
                        filter: (c) => (c.hits < c.hitsMax
                    )}); // TODO: Also heal ally creeps
                }
                if (target != undefined) {
                    tower.heal(target);
                }
                else { // Else repair a non-decaying structure if needed
                    target = tower.pos.findClosestByRange(theRoom.towerRepairStructures);
                    if(target != undefined) {
                        tower.repair(target);
                    }
                    else {
                        break;
                    }
                }
            }
        }
        let targetCounts = _.countBy(towerTargets);
        _.forEach(targetCounts, (c,t) => (
            console.log(c + " tower(s) in " + roomID + " attacking hostile from " + t)
        ));
        
        if (_.get(theRoom, ["controller", "my"], false) == true && _.get(theRoom, ["controller", "level"], 0) == 8) {
            let observer = _.first(theRoom.find(FIND_MY_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_OBSERVER) })); // TODO: Store this structure id in room memory
            if (false && observer != undefined && Game.cpu.bucket >= 2500) { // TODO: Turn this back on once sparse room memory has been implemented and room positions are stored as world position strings instead of objects in memory
                let roomCoord = parseRoomName(roomID);
                if (roomCoord != undefined) {
                    let westCoord = _.max([(roomCoord.xx - OBSERVER_RANGE), 1]);
                    let eastCoord = _.min([(roomCoord.xx + OBSERVER_RANGE), WORLD_WIDTH]);
                    let northCoord = _.max([(roomCoord.yy - OBSERVER_RANGE), 1]);
                    let southCoord = _.min([(roomCoord.yy + OBSERVER_RANGE), WORLD_HEIGHT]);
                    let observableRoomCount = Math.abs(eastCoord - westCoord) * Math.abs(southCoord - northCoord);
                    let roomMemExpirations = {};
                    for (let yRoomCoord = northCoord; yRoomCoord <= southCoord; ++yRoomCoord) {
                        for (let xRoomCoord = westCoord; xRoomCoord <= eastCoord; ++xRoomCoord) {
                            let theRoomName = generateRoomName(xRoomCoord, yRoomCoord);
                            if (theRoomName == undefined) {
                                continue;
                            }
                            let roomMemExpiration = _.get(Memory.rooms, [theRoomName, "memoryExpiration"], 0);
                            if (roomMemExpiration < _.max([theRoom.memory.memoryExpiration, (Game.time + observableRoomCount)])) {
                                roomMemExpirations[theRoomName] = roomMemExpiration;
                            }
                        }
                    }
                    let nextRoomMemExpiration = _.min(roomMemExpirations);
                    if (nextRoomMemExpiration < theRoom.memory.memoryExpiration) {
                        let roomToObserve = _.findKey(roomMemExpirations, (v) => (v == nextRoomMemExpiration));
                        observer.observeRoom(roomToObserve);
                        _.set(Memory.rooms, [roomToObserve, "memoryExpiration"], theRoom.memory.memoryExpiration);
                        console.log("Observing " + roomToObserve + " from " + roomID + " next tick");
                    }
                }
            }
            
            let thePowerSpawn = theRoom.powerSpawn;
            if (_.get(thePowerSpawn, ["my"], false) == true 
                && thePowerSpawn.energy >= POWER_SPAWN_ENERGY_RATIO 
                && thePowerSpawn.power > 0) {
                thePowerSpawn.processPower();
            }
        }
        
        // TODO: Make this a prototype for terminals
        //let amount = Math.floor(totalEnergy/(2-Math.exp(-distance/30))); // Get max amount of energy to send
        // Get max amount of non-energy to send
        
        if (_.get(theRoom, ["controller", "my"], false) == true 
            && _.get(theRoom, ["controller", "level"], 0) >= 6 
            && _.get(theRoom, ["terminal", "my"], false) == true) {
            let theTerminal = theRoom.terminal;
            let terminalEnergy = _.get(theTerminal.store, [RESOURCE_ENERGY], 0);
            let madeTransaction = false;
            if (Game.cpu.bucket >= 2500) {
                const MAX_RESOURCE_PRICE = 5;
                for (let resourceName in theTerminal.store) {
                    let resourceCount = theTerminal.store[resourceName];
                    if (resourceCount <= 0 
                        || resourceName == RESOURCE_ENERGY 
                        || resourceName == RESOURCE_POWER 
                        || resourceName == RESOURCE_SCORE) {
                        continue;
                    }
                    if ((madeTransaction == false) 
                        && (_.includes(balancedResources, resourceName) == false)) {
                        if (theRoom.terminal.cooldown == 0) {
                            if (resourceCount < (TERMINAL_CAPACITY / 3) 
                                || (resourceCount - (TERMINAL_CAPACITY / 3)) > 0) {
                                let balanceAmount = (resourceCount > (TERMINAL_CAPACITY / 3)) ? (resourceCount - (TERMINAL_CAPACITY / 3)) : resourceCount;
                                let storeRoom = { 
                                    roomID: roomID
                                    , amount: Math.min(theTerminal.store[resourceName], (TERMINAL_CAPACITY / 3))
                                    , free: theTerminal.storeCapacityFree
                                };
                                //console.log("Starting rebalance of " + balanceAmount + " " + resourceName + " in " + roomID);
                                _.forEach(Game.rooms, (r, rn) => {
                                    if (rn != storeRoom.roomID 
                                        && _.get(r, ["controller", "my"], false) == true 
                                        && _.get(r, ["controller", "level"], 0) >= 6 
                                        && _.get(r, ["terminal", "my"], false) == true 
                                        && _.get(r.memory, ["isShuttingDown"], false) == false
                                        && _.get(r, ["terminal", "store", resourceName], 0) < (TERMINAL_CAPACITY / 3) 
                                        && ((TERMINAL_CAPACITY / 3) - _.get(r, ["terminal", "store", resourceName], 0)) > 0 
                                        && _.get(r, ["terminal", "storeCapacityFree"], 0) > 0) {
                                        if (_.get(r, ["terminal", "store", resourceName], 0) > storeRoom.amount 
                                            || (_.get(r, ["terminal", "store", resourceName], 0) == storeRoom.amount 
                                                && _.get(r, ["terminal", "storeCapacityFree"], 0) > storeRoom.free) 
                                            || _.get(Memory.rooms, [storeRoom.roomID, "isShuttingDown"], false) == true 
                                            || storeRoom.amount == (TERMINAL_CAPACITY / 3)) {
                                            storeRoom = { 
                                                roomID: rn
                                                , amount: _.get(r, ["terminal", "store", resourceName], 0)
                                                , free: _.get(r, ["terminal", "storeCapacityFree"], 0)
                                            };
                                            //console.log("\tConsidering " + rn + " with " + storeRoom.amount + " " + resourceName + " and " + storeRoom.free + " free space");
                                        }
                                    }
                                });
                                if (storeRoom.roomID != roomID) {
                                    let sendAmount = Math.min(balanceAmount, ((TERMINAL_CAPACITY / 3) - storeRoom.amount, storeRoom.free));
                                    let energyCost = Game.market.calcTransactionCost(sendAmount, roomID, storeRoom.roomID);
                                    if (energyCost <= terminalEnergy) {
                                        let err = theTerminal.send(resourceName, sendAmount, storeRoom.roomID, "Balance " + resourceName);
                                        if (err == OK) {
                                            balancedResources.push(resourceName);
                                            madeTransaction = true;
                                            console.log("Sent " + sendAmount + " " + resourceName + " from " + roomID + " to " + storeRoom.roomID + " using " + energyCost + " " + RESOURCE_ENERGY + " to balance terminal resources");
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            let requiredPower = theRoom.requiredPower;
            if (madeTransaction == false 
                && requiredPower > 0 
                && theTerminal.storeCapacityFree > 0) {
                let powerRoomID = roomID;
                let excessPower = 0;
                for (let managedRoomID of managedRooms) {
                    if (managedRoomID == roomID) {
                        continue;
                    }
                    if (_.get(Game.rooms, [managedRoomID, "excessPower"], 0) > excessPower 
                        && _.get(Game.rooms, [managedRoomID, "terminal", "store", RESOURCE_POWER], 0) > excessPower) {
                        powerRoomID = managedRoomID;
                        excessPower = Math.min(requiredPower, _.get(Game.rooms, [managedRoomID, "terminal", "store", RESOURCE_POWER], 0));
                        if (excessPower == requiredPower) {
                            break;
                        }
                    }
                }

                if (powerRoomID != roomID
                    && theTerminal.storeCapacityFree > 0) {
                    let sendAmount = Math.min(excessPower, theTerminal.storeCapacityFree);
                    let energyCost = Game.market.calcTransactionCost(sendAmount, powerRoomID, roomID);
                    let powerRoomTerminal = _.get(Game.rooms, [powerRoomID, "terminal"], undefined);
                    if (powerRoomTerminal != undefined 
                        && energyCost <= _.get(powerRoomTerminal, ["store", "energy"], 0)) {
                        let err = powerRoomTerminal.send(RESOURCE_POWER, sendAmount, roomID, "Power Supply");
                        if (err == OK) {
                            console.log("Sent " + sendAmount + " " + RESOURCE_POWER + " from " + powerRoomID + " to " + roomID + " using " + energyCost + " " + RESOURCE_ENERGY + " to supply Power Spawn");
                        }
                    }
                }
            }
            
            if ((terminalEnergy - ((TERMINAL_CAPACITY / 2) * 1.1)) >= 100) { // NOTE: Don't send Energy in transfers of less than 100
                let balanceAmount = terminalEnergy - (TERMINAL_CAPACITY / 2);
                let storeRoom = { 
                    roomID: roomID
                    , amount: (TERMINAL_CAPACITY / 2)
                    , free: 0
                };
                //console.log("Starting rebalance of " + balanceAmount + " " + RESOURCE_ENERGY + " in " + roomID);
                _.forEach(Game.rooms, (r, rn) => {
                    if (rn != storeRoom.roomID 
                        && _.get(r, ["controller", "my"], false) == true 
                        && _.get(r, ["controller", "level"], 0) >= 6 
                        && _.get(r, ["terminal", "my"], false) == true 
                        && _.get(r.memory, ["isShuttingDown"], false) == false
                        && _.get(r, ["terminal", "store", RESOURCE_ENERGY], 0) < (TERMINAL_CAPACITY / 2) 
                        && ((TERMINAL_CAPACITY / 2) - _.get(r, ["terminal", "store", RESOURCE_ENERGY], 0)) >= 100 
                        && _.get(r, ["terminal", "energyCapacityFree"], 0) >= 100) {
                        if (_.get(r, ["terminal", "store", RESOURCE_ENERGY], 0) < storeRoom.amount 
                            || (_.get(r, ["terminal", "store", RESOURCE_ENERGY], 0) == storeRoom.amount 
                                && _.get(r, ["terminal", "energyCapacityFree"], 0) > storeRoom.free) 
                            || _.get(Memory.rooms, [storeRoom.roomID, "isShuttingDown"], false) == true 
                            || storeRoom.amount == (TERMINAL_CAPACITY / 2)) {
                            storeRoom = { 
                                roomID: rn
                                , amount: _.get(r, ["terminal", "store", RESOURCE_ENERGY], 0)
                                , free: _.get(r, ["terminal", "energyCapacityFree"], 0)
                            };
                            //console.log("\tConsidering " + rn + " with " + storeRoom.amount + " " + RESOURCE_ENERGY + " and " + storeRoom.free + " free space");
                        }
                    }
                });
                if (storeRoom.roomID != roomID) {
                    let sendAmount = Math.min(balanceAmount, ((TERMINAL_CAPACITY / 2) - storeRoom.amount, storeRoom.free));
                    let energyCost = Game.market.calcTransactionCost(sendAmount, roomID, storeRoom.roomID);
                    if (energyCost <= (terminalEnergy + sendAmount)) {
                        let err = theTerminal.send(RESOURCE_ENERGY, sendAmount, storeRoom.roomID, "Balance " + RESOURCE_ENERGY);
                        if (err == OK) {
                            console.log("Sent " + sendAmount + " " + RESOURCE_ENERGY + " from " + roomID + " to " + storeRoom.roomID + " using " + energyCost + " " + RESOURCE_ENERGY + " to balance terminal resources");
                            madeTransaction = true;
                        }
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
            role: "harvester" // TODO: Set role based on body parts
            , working: false
            , speeds: {
                ["1"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 1) / (bodyPartCounts[MOVE] * 2)), 1)
                , ["2"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 2) / (bodyPartCounts[MOVE] * 2)), 1)
                , ["10"]: Math.max(Math.ceil(((creep.body.length - bodyPartCounts[MOVE]) * 10) / (bodyPartCounts[MOVE] * 2)), 1)
            } // TODO: Add default for closest active spawn/room to be set as creep.memory.spawnID/creep.memory.roomID, and also set energyAvaliableOnSpawn & spawnTick to a default like in the creep garbage collection
        });
        
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined); // Get home room storage if available
        let theTerminal = _.get(Game.rooms, [creep.memory.roomID, "terminal"], undefined); // Get home room terminal if available
        let recycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined); // Get home room recycle container if avaliable
        
        // Run a role that's not stored in creep.memory.role
        let runningRole = false;
        // TODO: If a creep is damaged, check that it still has enough active body parts to run it's role, and if not go back home to either repair via a tower or recycle if no tower is avaliable
        if (creep.memory.role != "attacker" 
            && creep.memory.role != "powerHarvester") {
            if (creep.hits < creep.hitsMax 
                && creep.memory.role != "healer") { // TODO: Check if creep has active heal parts instead
                creep.heal(creep);
                if (creep.memory.role != "adaptable") {
                    creep.memory.scoreContainer = undefined;
                    creep.memory.droppedResource = undefined;
                    creep.memory.tombstone = undefined;
                    creep.memory.ruin = undefined;
                    ROLES["recyclable"].run(creep);
                    runningRole = true;
                }
            }
            else if (creep.carryCapacityAvailable > 0
                && (_.get(creep.memory, ["scoreContainer", "id"], undefined) != undefined 
                    || _.get(creep.memory, ["droppedResource", "id"], undefined) != undefined 
                    || _.get(creep.memory, ["tombstone", "id"], undefined) != undefined 
                    || _.get(creep.memory, ["ruin", "id"], undefined) != undefined)) {
                ROLES["collector"].run(creep);
                runningRole = true;
            }
            else if (creep.carryTotal > creep.carry[RESOURCE_ENERGY] 
                && creep.memory.role != "exporter" 
                && creep.memory.role != "rockhound" 
                && (creep.memory.role != "builder" 
                    || ((creep.carryTotal - (creep.carry[RESOURCE_POWER] || 0)) > creep.carry[RESOURCE_ENERGY]))
                && ((theStorage != undefined 
                        && theStorage.my == true 
                        && _.sum(theStorage.store) < theStorage.storeCapacity) 
                    || (theTerminal != undefined 
                        && theTerminal.my == true 
                        && theTerminal.storeCapacityFree > 0) 
                    || (recycleContainer != undefined))) {
                ROLES["hoarder"].run(creep);
                runningRole = true;
            }
            else if (creep.memory.role == "healer") { // TODO: Make this a proper role
                creep.memory.executingRole = "healer";
                let target = creep.pos.findClosestByRange(FIND_MY_POWER_CREEPS, {
                    filter: (c) => (c.hits < c.hitsMax
                )}); // TODO: Also heal ally power creeps
                if (target == undefined) {
                    target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                        filter: (c) => (c.hits < c.hitsMax
                    )}); // TODO: Also heal ally creeps
                }
                if (target != undefined) {
                    let err = creep.heal(target);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.rangedHeal(target);
                        creep.travelTo(target);
                        creep.say(travelToIcons(creep) + ICONS["rangeHeal"] + ICONS["creep"], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["heal"] + ICONS["creep"], true);
                    }
                    else {
                        creep.rangedHeal(target);
                        creep.say(ICONS["rangeheal"] + ICONS["creep"], true);
                    }
                }
                else {
                    creep.memory.role = "recyclable";
                    ROLES["recyclable"].run(creep);
                }
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
    }
    
    if (Memory.MonCPU == true) { console.log("creeps>spawn:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    // Spawn or renew creeps
    let nothingToSpawn = [];
    for (let spawnID in Game.spawns) {
        let spawn = Game.spawns[spawnID];
        let roomID = spawn.room.name;
        if (spawn.spawning == undefined) {
            if (spawn.isActive() == true) {
                let creepName = undefined;
                if (_.includes(nothingToSpawn, roomID) == false) {
                    let creepMins = _.get(Memory.rooms, [roomID, "creepMins"], {});
                    for (let creepType in creepMins) {
                        if (Memory.rooms[roomID].creepCounts[creepType] >= creepMins[creepType]) {
                            /*let creepCount = _.sum(Game.creeps, (c) => (
                                c.memory.roomID == roomID 
                                && c.memory.role == creepType 
                                && (c.ticksToLive > (c.body.length * CREEP_SPAWN_TIME) 
                                    || c.spawning == true)
                            ));
                            if (creepCount >= creepMins[creepType]) {*/
                                continue;
                            //}
                        }
                        creepName = spawn.spawnCustomCreep(creepType);
                        if (_.isString(creepName) == true) {
                            console.log("Spawning " + creepType + " (" + Memory.rooms[roomID].creepCounts[creepType] + "/" + creepMins[creepType] + ") in " + roomID + ": " + creepName);
                        }
                        else if (creepName == -6.5 || creepName == -10.5) { // TODO: Just check for -#.5
                            continue;
                        }
                        break; // NOTE: Need to either wait till the creep can start spawning or be spawned, so no need to check the rest
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
                        && c.memory.role != "recyclable" 
                        && _.some(c.body, "boost") == false
                    )}), "ticksToLive");
                    if (creep instanceof Creep) { // make sure Infinity wasn't returned from min instead of a creep
                        spawn.renewCreep(creep);
                    }
                }
            }
        }
    }
    
    /*
        TODO: Incorporate this into proper bootstrapping code
    */
    _.set(Memory.rooms, ["W28N5", "creepMins", "adaptable"], ((
        (_.get(Memory.rooms, ["W28N5", "creepCounts", "builder"], -1) == 0 && _.get(Memory.rooms, ["W28N5", "creepCounts", "adaptable"], -1) == 0) 
        || (_.get(Memory.rooms, ["W12S26", "creepCounts", "builder"], -1) == 0 && _.get(Memory.rooms, ["W12S26", "creepCounts", "adaptable"], -1) == 0)
    ) ? 1 : 0));
    _.set(Memory.rooms, ["W12S26", "creepMins", "adaptable"], ((
        (_.get(Memory.rooms, ["W12S26", "creepCounts", "builder"], -1) == 0 && _.get(Memory.rooms, ["W12S26", "creepCounts", "adaptable"], -1) == 0)
        || (_.get(Memory.rooms, ["W28N5", "creepCounts", "builder"], -1) == 0 && _.get(Memory.rooms, ["W28N5", "creepCounts", "adaptable"], -1) == 0)
    ) ? 1 : 0));
    
    if (Memory.MonCPU == true) { console.log("spawn>ramparts:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    // Update ramparts public/private state
    _.forEach(ramparts, (r) => {
        if (_.get(CONTROLLER_STRUCTURES[STRUCTURE_RAMPART], r.room.controller.level, 0) == 0) { return; } // NOTE: This should use less than the 0.2 CPU that a Rampart.isActive() check uses
        
        // If the rampart is protecting a structure, it should always be private
        let privateState = privateRamparts[r.id] || false;
        if (privateState == false && _.filter(r.pos.lookFor(LOOK_STRUCTURES), (s) => (
            s.structureType != STRUCTURE_RAMPART 
            && s.structureType != STRUCTURE_ROAD
        )).length > 0) { // TODO: Allow members of alliance to withdraw from storage/terminal/etc...
            privateState = true;
        }
        
        // Set the rampart to the new state if it's not already
        if (r.isPublic == privateState) {
            r.setPublic(privateState == false);
        }
    });
    
    // For Screeps Visual: https://github.com/screepers/screeps-visual
    //visualiser.movePaths();
    //RawVisual.commit();
    
    if (Memory.MonCPU == true) { console.log("ramparts>screepsPlus:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
    
    screepsPlus.collect_stats(); // Put stats generated at start of loop in memory for agent to collect and push to Grafana dashboard
    if (Memory.MonGlobal == true) {
        const new_stats = globalStats();
        const old_stats = global[new_stats.meta_key];
        if (!old_stats) {
            console.log("<<< GLOBAL RESET >>>");
        } else {
            const diff = _.reduce(new_stats.stats, (acc,size,key) => {
                const old_val = old_stats[key] || 0;
                if (old_val) {
                    const delta = size - old_val;
                    if (delta !== 0)
                        acc[key] = delta;
                }
                return acc;
            }, {});
            console.log(JSON.stringify(diff));
        }
        global[new_stats.meta_key] = new_stats.stats;
    }
    if (typeof Game.cpu.getHeapStatistics === "function") {
        Memory.stats.heap = Game.cpu.getHeapStatistics();
    }
    else {
        Memory.stats.heap = undefined;
    }
    Memory.stats.cpu.used = Game.cpu.getUsed();
    let statsStr = JSON.stringify(Memory.stats);
    let statsSize = statsStr.length;
    if (statsSize <= MAX_SEGMENT_LENGTH) {
        RawMemory.segments[70] = statsStr;
    }
    else {
        console.log("Stats " + (statsSize - MAX_SEGMENT_LENGTH) + " characters too long to save in segment.")
    }
    
    if (Memory.MonCPU == true) { console.log("screepsPlus>end:",Game.cpu.getUsed().toFixed(2).toLocaleString()); }
}
