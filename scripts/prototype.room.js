const TICKS_TO_VIEW = 5;

let prototypeRoom = function() {
    Room.prototype.dangerZones = []; // TODO: Define this property properly
    
    if (Room.prototype.sources == undefined) {
        Object.defineProperty(Room.prototype, "sources", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["sources"], undefined) == undefined) {
                    _.forEach(this.find(FIND_SOURCES), (source) => (_.set(this.memory, ["sources", source.id], { 
                        pos: source.pos
                        , regenAt: Game.time + (source.energy == 0 ? source.ticksToRegeneration : 0) 
                    })));
                }
                if (_.isObject(this.memory.sources) == false) {
                    return undefined;
                }
                return this.memory.sources;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["sources"], undefined) == undefined) {
                    _.forEach(this.find(FIND_SOURCES), (source) => (_.set(this.memory, ["sources", source.id], { 
                        pos: source.pos
                        , regenAt: Game.time + (source.energy == 0 ? source.ticksToRegeneration : 0) 
                    })));
                }
                if (_.isObject(this.memory.sources) == false) {
                    throw new Error("Could not set Room.sources property");
                }
                this.memory.sources = value;
            }
        });
    }
    
    if (Room.prototype.controllerMem == undefined) {
        Object.defineProperty(Room.prototype, "controllerMem", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["controller"], undefined) == undefined && this.controller != undefined) {
                    let theController = this.controller;
                    let downgradesAt = ((theController.ticksToDowngrade && (Game.time + theController.ticksToDowngrade)) || (theController.reservation && (Game.time + (theController.reservation.ticksToEnd >= 0 ? theController.reservation.ticksToEnd : -1))) || undefined);
                    let neutralAt = ((downgradesAt && (downgradesAt + _.get(CUMULATIVE_CONTROLLER_DOWNGRADE, [theController.level - 2], 0))) || undefined);
                    _.set(this.memory, ["controller"], { 
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
                    if (theController.my == false 
                        && neutralAt > this.memory.memoryExpiration) {
                        this.memory.memoryExpiration = neutralAt;
                    }
                }
                if (_.isObject(this.memory.controller) == false) {
                    return undefined;
                }
                return this.memory.controller;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["controller"], undefined) == undefined && this.controller != undefined) {
                    let theController = this.controller;
                    let downgradesAt = ((theController.ticksToDowngrade && (Game.time + theController.ticksToDowngrade)) || undefined);
                    let neutralAt = ((downgradesAt && (downgradesAt + _.get(CUMULATIVE_CONTROLLER_DOWNGRADE, [theController.level - 2], 0))) || undefined);
                    _.set(this.memory, ["controller"], { 
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
                    if (theController.my == false 
                        && neutralAt > this.memory.memoryExpiration) {
                        this.memory.memoryExpiration = neutralAt;
                    }
                }
                if (_.isObject(this.memory.controller) == false && this.controller != undefined) {
                    throw new Error("Could not set Room.controllerMem property");
                }
                this.memory.controller = value;
            }
        });
    }
    
    if (Room.prototype.harvestRooms == undefined) {
        Object.defineProperty(Room.prototype, "harvestRooms", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    _.set(this.memory, ["harvestRooms"], []);
                }
                return this.memory.harvestRooms;
            },
            
            set: function(value) {
                if (_.isArray(this.memory.harvestRooms) == false) {
                    _.set(this.memory, ["harvestRooms"], []);
                }
                if (_.isArray(value) == false) {
                    _.set(this.memory, ["harvestRooms"], []);
                }
                else {
                    this.memory.harvestRooms = value;
                }
            }
        });
    }
    
    if (Room.prototype.minerSources == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, 'minerSources', (r) => {
            let sources = r.sources;
            _.each(r.harvestRooms, (hr) => {
                _.each(_.get(Memory.rooms, [hr, "sources"], {}), (hrs, sID) => {
                    sources[sID] = hrs;
                });
            });
            return sources;
        });
    }
    
    if (Room.prototype.recycleContainer == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, 'recycleContainer', (r) => {
            let containers = [];
            let theSpawns = r.find(FIND_MY_SPAWNS);
            _.each(theSpawns, (sp) => {
                containers.push(sp.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => (
                    s.structureType == STRUCTURE_CONTAINER
                )}));
            });
            containers = _.flattenDeep(containers);
            return _.first(containers);
        });
    }
    
    if (Room.prototype.powerSpawn == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, "powerSpawn", (r) => {
            if (r.controller == undefined) { return undefined; }
            let powerSpawns = r.find(FIND_STRUCTURES, { filter: (s) => (
                s.structureType == STRUCTURE_POWER_SPAWN
            )});
            return _.first(powerSpawns);
        });
    }

    if (Room.prototype.ownedPower == undefined) { // NOTE: Must be defined after Room.powerSpawn
        defineCachedGetter(Room.prototype, "ownedPower", (r) => {
            let powerSpawnPower = _.get(r, ["powerSpawn", "power"], 0);
            let terminalPower = _.get(r, ["terminal", "store", RESOURCE_POWER], 0);
            let storagePower = _.get(r, ["storage", "store", RESOURCE_POWER], 0);
            let creepPower = _.sum(Game.creeps, (c) => (c.memory.roomID == r.name ? _.get(c, ["carry", RESOURCE_POWER], 0) : 0));
            // TODO: Check for power in containers
            return (powerSpawnPower + terminalPower + storagePower + creepPower);
        });
    }
    
    if (Room.prototype.requiredPower == undefined) { // NOTE: Must be defined after Room.powerSpawn
        defineCachedGetter(Room.prototype, "requiredPower", (r) => {
            if (_.get(r, ["controller", "my"], false) == false 
                || _.get(r, ["controller", "level"], 0) < 8 
                || _.get(r, ["powerSpawn", "my"], false) == false 
                || _.get(r, ["powerSpawn", "energy"], 0) < POWER_SPAWN_ENERGY_RATIO) {
                return 0;
            }
            return Math.floor(r.powerSpawn.energy / POWER_SPAWN_ENERGY_RATIO);
        });
    }
    
    if (Room.prototype.powerDeficit == undefined) { // NOTE: Must be defined after Room.ownedPower and Room.requiredPower
        defineCachedGetter(Room.prototype, "powerDeficit", (r) => {
            return Math.max(r.requiredPower - r.ownedPower, 0);
        });
    }
    
    if (Room.prototype.excessPower == undefined) { // NOTE: Must be defined after Room.ownedPower and Room.requiredPower
        defineCachedGetter(Room.prototype, "excessPower", (r) => {
            return Math.max(r.ownedPower - r.requiredPower, 0);
        });
    }
    
    if (Room.prototype.myActiveTowers == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, "myActiveTowers", (r) => {
            if (r.controller == undefined) { return []; }
            let towers = r.find(FIND_STRUCTURES, { filter: (s) => (
                s.structureType == STRUCTURE_TOWER
            )});
            let someTowersInactive = (_.get(r, ["controller", "level"], 0) < _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_TOWER], (v) => (v >= towers.length)));
            return _.filter(towers, (t) => (
                t.my == true 
                && t.energy >= TOWER_ENERGY_COST 
                && (someTowersInactive == false 
                    || t.isActive() == true)
            ));
        });
    }
    
    if (Room.prototype.towerRepairStructures == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, "towerRepairStructures", (r) => {
            let numRoadRepairers = _.get(Memory.rooms, [r.name, "repairerTypeCounts", STRUCTURE_ROAD], 0);
            return r.find(FIND_STRUCTURES, {
                filter: (s) => (s.hits < s.hitsMax 
                    && s.structureType != STRUCTURE_WALL
                    && (s.structureType != STRUCTURE_RAMPART
                        || s.hits <= RAMPART_DECAY_AMOUNT)
                    && (s.structureType != STRUCTURE_CONTAINER
                        || s.hits <= CONTAINER_DECAY)
                    && (s.structureType != STRUCTURE_ROAD
                        || numRoadRepairers == 0
                        || s.hits <= (ROAD_DECAY_AMOUNT * ((s.hitsMax == ROAD_HITS) ? 1 : CONSTRUCTION_COST_ROAD_SWAMP_RATIO)))
            )});
        });
    }
    
    // TODO: Distance from controller to closest source
    
    if (Room.prototype.canHarvestMineral == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, "canHarvestMineral", (r) => {
            let theMineral = _.first(r.find(FIND_MINERALS, { filter: (m) => (
                        m.mineralAmount > 0
            )}));
            if (theMineral == undefined) { return false; }
            let theExtractor = _.first(_.filter(theMineral.pos.lookFor(LOOK_STRUCTURES), (s) => (
                            s.structureType == STRUCTURE_EXTRACTOR 
                            && (_.get(s, ["owner", "username"], undefined) === undefined 
                                || (_.get(s, ["room", "controller", "my"], false) == true 
                                    && _.get(s, ["room", "controller", "level"], 0) >= _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_EXTRACTOR], (v) => (v > 0))))
            )));
            return (theExtractor != undefined);
        });
    }
    
    if (Room.prototype.checkForDrops == undefined) {
        Object.defineProperty(Room.prototype, "checkForDrops", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["checkForDrops"], false) == true) {
                    _.set(this.memory, ["checkForDrops"], true);
                }
                else {
                    this.memory.checkForDrops = undefined;
                }
                return _.get(this.memory, ["checkForDrops"], false);
            },
            
            set: function(value) {
                if (value == true) {
                    _.set(this.memory, ["checkForDrops"], true);
                }
                else {
                    this.memory.checkForDrops = undefined;
                }
            }
        });
    }
    
    if (Room.prototype.buildOrderFILO == undefined) {
        Object.defineProperty(Room.prototype, "buildOrderFILO", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["buildOrderFILO"], false) == true) {
                    _.set(this.memory, ["buildOrderFILO"], true);
                }
                else {
                    this.memory.buildOrderFILO = undefined;
                }
                return _.get(this.memory, ["buildOrderFILO"], false);
            },
            
            set: function(value) {
                if (value == true) {
                    _.set(this.memory, ["buildOrderFILO"], true);
                }
                else {
                    this.memory.buildOrderFILO = undefined;
                }
            }
        });
    }
    
    if (Room.prototype.hasHostileCreep == undefined) {
        Object.defineProperty(Room.prototype, "hasHostileCreep", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["hasHostileCreep"], false) == true) {
                    _.set(this.memory, ["hasHostileCreep"], true);
                }
                else {
                    this.memory.hasHostileCreep = undefined;
                }
                return _.get(this.memory, ["hasHostileCreep"], false);
            },
            
            set: function(value) {
                if (value == true) {
                    _.set(this.memory, ["hasHostileCreep"], true);
                }
                else {
                    this.memory.hasHostileCreep = undefined;
                }
            }
        });
    }
    
    if (Room.prototype.hostileTowers == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, "hostileTowers", (r) => {
            let towers = r.find(FIND_STRUCTURES, { filter: (s) => (
                s.structureType == STRUCTURE_TOWER
            )});
            let someTowersInactive = ((r.controller != undefined) && (_.get(r, ["controller", "level"], 0) < _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_TOWER], (v) => (v >= towers.length))));
            return _.filter(towers, (t) => (
                t.my == false 
                && _.includes(_.difference(Memory.nonAgressivePlayers, ["InfiniteJoe", "Cade", "KermitFrog"]), t.owner) == false 
                && (someTowersInactive == false 
                    || t.isActive() == true)
            ));
        });
    }
    
    if (Room.prototype.hasHostileTower == undefined) { // NOTE: Must be defined after Room.hostileTowers
        Object.defineProperty(Room.prototype, "hasHostileTower", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this, ["hostileTowers", "length"], 0) > 0) {
                    _.set(this.memory, ["hasHostileTower"], true);
                }
                else {
                    this.memory.hasHostileTower = undefined;
                }
                return _.get(this.memory, ["hasHostileTower"], false);
            },
            
            set: function(value) {
                if (_.get(this, ["hostileTowers", "length"], 0) > 0) {
                    _.set(this.memory, ["hasHostileTower"], true);
                }
                else {
                    this.memory.hasHostileTower = undefined;
                }
            }
        });
    }
    
    if (Room.prototype.hostileActiveTowers == undefined) { // NOTE: Must be defined after Room.hostileTowers
        defineCachedGetter(Room.prototype, "hostileActiveTowers", (r) => {
            let towers = r.hostileTowers;
            return _.filter(r.hostileTowers, (t) => (
                t.energy >= TOWER_ENERGY_COST 
            ));
        });
    }
    
    if (Room.prototype.hasHostileActiveTower == undefined) { // NOTE: Must be defined after Room.hostileActiveTowers
        Object.defineProperty(Room.prototype, "hasHostileActiveTower", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this, ["hostileActiveTowers", "length"], 0) > 0) {
                    _.set(this.memory, ["hasHostileActiveTower"], true);
                }
                else {
                    this.memory.hasHostileActiveTower = undefined;
                }
                return _.get(this.memory, ["hasHostileActiveTower"], false);
            },
            
            set: function(value) {
                if (_.get(this, ["hostileActiveTowers", "length"], 0) > 0) {
                    _.set(this.memory, ["hasHostileActiveTower"], true);
                }
                else {
                    this.memory.hasHostileActiveTower = undefined;
                }
            }
        });
    }
    
    if (Room.prototype.invaderCore == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, "invaderCore", (r) => {
            let invaderCores = r.find(FIND_HOSTILE_STRUCTURES, { filter: (s) => (
                s.structureType == STRUCTURE_INVADER_CORE
            )});
            return _.first(invaderCores);
        });
    }
    
    if (Room.prototype.invaderCoreMem == undefined) { // NOTE: Must be defined after global.invaderCore
        Object.defineProperty(Room.prototype, "invaderCoreMem", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                let collapsesAt = 0;
                if (_.get(this.memory, ["invaderCore"], undefined) == undefined && this.invaderCore != undefined) {
                    let theInvaderCore = this.invaderCore;
                    let collapseTimer = _.get(_.find(_.get(theInvaderCore, ["effects"], []), "effect", EFFECT_COLLAPSE_TIMER), ["ticksRemaining"], INVADER_CORE_ACTIVE_TIME);
                    let deploysAt = Game.time + _.get(theInvaderCore, ["ticksToDeploy"], 0);
                    collapsesAt = (deploysAt + collapseTimer);
                    _.set(this.memory, ["invaderCore"], { 
                        id: theInvaderCore.id 
                        , pos: theInvaderCore.pos 
                        , level: theInvaderCore.level 
                        , deploysAt: deploysAt 
                        , collapsesAt: collapsesAt
                    });
                }
                else if (this.invaderCore == undefined) {
                    this.memory.invaderCore = undefined;
                }
                if (_.isObject(this.memory.invaderCore) == false) {
                    return undefined;
                }
                collapsesAt = _.get(this.memory.invaderCore, ["collapsesAt"], 0);
                if (collapsesAt > this.memory.memoryExpiration) {
                    this.memory.memoryExpiration = collapsesAt;
                }
                if (_.get(this.memory.invaderCore, ["level"], 0) > 0 
                    && _.get(this.memory.invaderCore, ["deploysAt"], 0) < (Game.time + 50) 
                    && collapsesAt > this.memory.avoidTravelUntil) {
                    this.memory.avoidTravelUntil = collapsesAt;
                }
                return this.memory.invaderCore;
            },
            
            set: function(value) {
                let collapsesAt = 0;
                if (_.get(this.memory, ["invaderCore"], undefined) == undefined && this.invaderCore != undefined) {
                    let theInvaderCore = this.invaderCore;
                    let collapseTimer = _.get(_.find(_.get(theInvaderCore, ["effects"], []), "effect", EFFECT_COLLAPSE_TIMER), ["ticksRemaining"], INVADER_CORE_ACTIVE_TIME);
                    let deploysAt = Game.time + _.get(theInvaderCore, ["ticksToDeploy"], 0);
                    collapsesAt = (deploysAt + collapseTimer);
                    _.set(this.memory, ["invaderCore"], { 
                        id: theInvaderCore.id 
                        , pos: theInvaderCore.pos 
                        , level: theInvaderCore.level 
                        , deploysAt: deploysAt 
                        , collapsesAt: collapsesAt
                    });
                }
                if (_.isObject(this.memory.invaderCore) == false && this.invaderCore != undefined) {
                    throw new Error("Could not set Room.invaderCoreMem property");
                }
                collapsesAt = _.get(this.memory.invaderCore, ["collapsesAt"], 0);
                if (collapsesAt > this.memory.memoryExpiration) {
                    this.memory.memoryExpiration = collapsesAt;
                }
                if (_.get(this.memory.invaderCore, ["level"], 0) > 0 
                    && _.get(this.memory.invaderCore, ["deploysAt"], 0) < (Game.time + 50) 
                    && collapsesAt > this.memory.avoidTravelUntil) {
                    this.memory.avoidTravelUntil = collapsesAt;
                }
                this.memory.invaderCore = value;
            }
        });
    }
    
    if (Room.prototype.priorityTargetID == undefined) {
        Object.defineProperty(Room.prototype, "priorityTargetID", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.isString(this.memory.priorityTargetID) == false 
                    || _.get(this.memory, ["priorityTargetID"], "") == "") {
                    this.memory.priorityTargetID = undefined;
                }
                return _.get(this.memory, ["priorityTargetID"], "");
            },
            
            set: function(value) {
                if (_.isString(value) == true 
                    && value != "") {
                    _.set(this.memory, ["priorityTargetID"], value);
                }
                else if (_.isString(_.get(value, ["id"], undefined)) == true 
                    && _.get(value, ["id"], "") != "") {
                    _.set(this.memory, ["priorityTargetID"], _.get(value, ["id"], ""));
                }
                else {
                    this.memory.priorityTargetID = undefined;
                }
            }
        });
    }
    
    if (Room.prototype.clearPathCaches == undefined) {
        Object.defineProperty(Room.prototype, "clearPathCaches", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["clearPathCaches"], true) == true) {
                    _.set(this.memory, ["clearPathCaches"], true);
                }
                else {
                    _.set(this.memory, ["clearPathCaches"], false);
                }
                return _.get(this.memory, ["clearPathCaches"], true);
            },
            
            set: function(value) {
                if (value == true) {
                    _.set(this.memory, ["clearPathCaches"], true);
                }
                else {
                    _.set(this.memory, ["clearPathCaches"], false);
                }
            }
        });
    }
    
    if (Room.prototype.avoidTravelUntil == undefined) {
        Object.defineProperty(Room.prototype, "avoidTravelUntil", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.isNumber(this.memory.avoidTravelUntil) == false 
                    || _.get(this.memory, ["avoidTravelUntil"], 0) < Game.time) {
                    this.memory.avoidTravelUntil = undefined;
                }
                return _.get(this.memory, ["avoidTravelUntil"], 0);
            },
            
            set: function(value) {
                if (_.isNumber(value) == false 
                    || value < Game.time) {
                    this.memory.avoidTravelUntil = undefined;
                }
                else {
                    _.set(this.memory, ["avoidTravelUntil"], value);
                }
            }
        });
    }
    
    if (Room.prototype.isHarvestRoom == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, 'isHarvestRoom', (r) => {
            return (_.some(Memory.rooms, (rm) => {
                let harvestRooms = _.get(rm, ["harvestRooms"], undefined);
                if (harvestRooms == undefined) { return false; }
                return (_.includes(harvestRooms, r.name) == true);
            }) == true);
        });
    }
    
    if (Room.prototype.exporterInfo == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, 'exporterInfo', (r) => {
            return _.chain(Game.flags)
                .filter((f) => (
                    f.color == COLOR_ORANGE 
                    && _.startsWith(f.name, r.name)))
                .map((f) => { 
                    let nameInfo = f.name.split('_'); 
                    return { 
                        priority: _.parseInt(_.get(nameInfo, 1, 0))
                        , count: _.parseInt(_.get(nameInfo, 2, 1))
                        , from: _.get(nameInfo, 3, f.pos.roomName)
                        , to: _.get(nameInfo, 4, _.get(nameInfo, 0, r.name)) 
                    }; })
                .value();
        });
    }
    
    if (Room.prototype.exportersToSpawn == undefined) { // NOTE: Must be defined after Room.exporterInfo
        defineCachedGetter(Room.prototype, 'exportersToSpawn', (r) => {
            if (r.exporterInfo.length == 0) { return []; }
            return _.chain(r.exporterInfo)
                .filter((eI) => (
                    _.get(Memory.rooms, [eI.from, "avoidTravelUntil"], 0) < Game.time))
                .groupBy("priority")
                .min((eI, p) => (p))
                .value();
        });
    }
    
    if (Room.prototype.nextExporter == undefined) { // NOTE: Must be defined after Room.exportersToSpawn
        defineCachedGetter(Room.prototype, 'nextExporter', (r) => {
            if (r.exportersToSpawn.length == 0) { return []; }
            let exporterCounts = _.chain(Memory.creeps)
                .filter((c) => (
                    c.roomID == r.name 
                    && c.role == "exporter"))
                .countBy((c) => (
                    _.get(c, "roomSentFrom", "") + _.get(c, "roomSentTo", "")))
                .value();
            return _.chain(r.exportersToSpawn)
                .filter((eTS) => (_.get(exporterCounts, (eTS.from + eTS.to), 0) < eTS.count))
                .first()
                .value();
        });
    }
    
    if (Room.prototype.demolisherInfo == undefined) { // NOTE: Must be defined after global.defineCachedGetter
        defineCachedGetter(Room.prototype, 'demolisherInfo', (r) => {
            return _.chain(Game.flags)
                .filter((f) => (
                    f.color == COLOR_BLUE 
                    && (f.secondaryColor == COLOR_RED 
                        || f.secondaryColor == COLOR_YELLOW)
                    && _.startsWith(f.name, r.name)))
                .map((f) => { 
                    let nameInfo = f.name.split('_');
                    let demoTarget = _.get(nameInfo, 2, "") != "" ? { id: _.get(nameInfo, 2, ""), pos: f.pos } : undefined; // NOTE: Assumes flag was placed on target structure
                    return { 
                        priority: _.parseInt(_.get(nameInfo, 1, 0))
                        , type: f.secondaryColor == COLOR_YELLOW ? "H" : "D" // NOTE: COLOR_YELLOW = Harvest (H), COLOR_RED = Demolish (D)
                        , target: demoTarget
                        , count: _.parseInt(_.get(nameInfo, 3, 1))
                        , to: _.get(nameInfo, 4, f.pos.roomName)
                        , from: _.get(nameInfo, 5, _.get(nameInfo, 0, r.name))
                    }; })
                .value();
        });
    }
    
    if (Room.prototype.demolishersToSpawn == undefined) { // NOTE: Must be defined after Room.demolisherInfo
        defineCachedGetter(Room.prototype, 'demolishersToSpawn', (r) => {
            if (r.demolisherInfo.length == 0) { return []; }
            return _.chain(r.demolisherInfo)
                .filter((dI) => (
                    _.get(Memory.rooms, [dI.from, "avoidTravelUntil"], 0) < Game.time))
                .groupBy("priority")
                .min((dI, p) => (p))
                .value();
        });
    }
    
    if (Room.prototype.nextDemolisher == undefined) { // NOTE: Must be defined after Room.demolishersToSpawn
        defineCachedGetter(Room.prototype, 'nextDemolisher', (r) => {
            if (r.demolishersToSpawn.length == 0) { return []; }
            let demolisherCounts = _.chain(Memory.creeps)
                .filter((c) => (
                    c.roomID == r.name 
                    && c.role == "demolisher"))
                .countBy((c) => (
                    _.get(c, "roomSentFrom", "") + _.get(c, "roomSentTo", "") + _.get(c, ["target", "id"], "")))
                .value();
            return _.chain(r.demolishersToSpawn)
                .filter((dTS) => (_.get(demolisherCounts, _.get(dTS, "from", "") + _.get(dTS, "to", "") + _.get(dTS, ["target", "id"], ""), 0) < dTS.count))
                .first()
                .value();
        });
    }
    
    if (Room.prototype.beingViewed == undefined) {
        Object.defineProperty(Room.prototype, "beingViewed", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["lastViewed"], 0) < (Game.time - ROOM_VISUAL_TIMEOUT)) {
                    this.memory.lastViewed = undefined;
                }
                return (_.get(this.memory, ["lastViewed"], 0) >= (Game.time - ROOM_VISUAL_TIMEOUT));
            },
            
            set: function(value) {
                this.memory.lastViewed = ((value == true) ? Game.time : undefined);
            }
        });
    }
    
    if (Room.prototype.memoryExpiration == undefined) {
        Object.defineProperty(Room.prototype, "memoryExpiration", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["memoryExpiration"], undefined) == undefined) {
                    _.set(this.memory, ["memoryExpiration"], 0);
                }
                if (_.isNumber(this.memory.memoryExpiration) == false) {
                    return undefined;
                }
                return this.memory.memoryExpiration;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["memoryExpiration"], undefined) == undefined) {
                    _.set(this.memory, ["memoryExpiration"], 0);
                }
                if (_.isNumber(this.memory.memoryExpiration) == false) {
                    throw new Error("Could not set Room.memoryExpiration property");
                }
                this.memory.memoryExpiration = value;
            }
        });
    }
};

module.exports = prototypeRoom;
