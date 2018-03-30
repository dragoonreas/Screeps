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
                    let downgradeAt = ((theController.ticksToDowngrade && (Game.time + theController.ticksToDowngrade)) || undefined);
                    let neutralAt = ((downgradeAt && (downgradeAt + _.get(CUMULATIVE_CONTROLLER_DOWNGRADE, [theController.level - 2], 0))) || undefined);
                    _.set(this.memory, ["controller"], { 
                        id: theController.id 
                        , pos: theController.pos 
                        , owner: theController.owner 
                        , reservation: ((theController.reservation && { username: _.get(theController.reservation, ["username"], ""), endsAt: Game.time + (theController.reservation.ticksToEnd >= 0 ? theController.reservation.ticksToEnd : -1) }) || undefined)
                        , level: theController.level 
                        , downgradeAt: downgradeAt 
                        , neutralAt: neutralAt
                        , unblockedAt: ((theController.upgradeBlocked && (Game.time + theController.upgradeBlocked)) || undefined)
                        , safeModeEndsAt: ((theController.safeMode && (Game.time + theController.safeMode)) || undefined) 
                        , sign: theController.sign
                    });
                    if (theController.my == false 
                        && neutralAt > theRoom.memory.memoryExpiration) {
                        theRoom.memory.memoryExpiration = neutralAt;
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
                    let downgradeAt = ((theController.ticksToDowngrade && (Game.time + theController.ticksToDowngrade)) || undefined);
                    let neutralAt = ((downgradeAt && (downgradeAt + _.get(CUMULATIVE_CONTROLLER_DOWNGRADE, [theController.level - 2], 0))) || undefined);
                    _.set(this.memory, ["controller"], { 
                        id: theController.id 
                        , pos: theController.pos 
                        , owner: theController.owner 
                        , reservation: ((theController.reservation && { username: _.get(theController.reservation, ["username"], ""), endsAt: Game.time + (theController.reservation.ticksToEnd >= 0 ? theController.reservation.ticksToEnd : -1) }) || undefined)
                        , level: theController.level 
                        , downgradeAt: downgradeAt 
                        , neutralAt: neutralAt
                        , unblockedAt: ((theController.upgradeBlocked && (Game.time + theController.upgradeBlocked)) || undefined)
                        , safeModeEndsAt: ((theController.safeMode && (Game.time + theController.safeMode)) || undefined) 
                        , sign: theController.sign
                    });
                    if (theController.my == false 
                        && neutralAt > theRoom.memory.memoryExpiration) {
                        theRoom.memory.memoryExpiration = neutralAt;
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
                if (_.get(this.memory, ["harvestRooms"], undefined) == undefined) {
                    _.set(this.memory, ["harvestRooms"], []);
                }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    return undefined;
                }
                return this.memory.harvestRooms;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["harvestRooms"], undefined) == undefined) {
                    _.set(this.memory, ["harvestRooms"], []);
                }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    throw new Error("Could not set Room.harvestRooms property");
                }
                this.memory.harvestRooms = value;
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
                if (_.get(this.memory, ["checkForDrops"], undefined) == undefined) {
                    _.set(this.memory, ["checkForDrops"], true);
                }
                if (_.isBoolean(this.memory.checkForDrops) == false) {
                    return undefined;
                }
                return this.memory.checkForDrops;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["checkForDrops"], undefined) == undefined) {
                    _.set(this.memory, ["checkForDrops"], true);
                }
                if (_.isBoolean(this.memory.checkForDrops) == false) {
                    throw new Error("Could not set Room.checkForDrops property");
                }
                this.memory.checkForDrops = value;
            }
        });
    }
    
    if (Room.prototype.buildOrderFILO == undefined) {
        Object.defineProperty(Room.prototype, "buildOrderFILO", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["buildOrderFILO"], undefined) == undefined) {
                    _.set(this.memory, ["buildOrderFILO"], false);
                }
                if (_.isBoolean(this.memory.buildOrderFILO) == false) {
                    return undefined;
                }
                return this.memory.buildOrderFILO;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["buildOrderFILO"], undefined) == undefined) {
                    _.set(this.memory, ["buildOrderFILO"], false);
                }
                if (_.isBoolean(this.memory.buildOrderFILO) == false) {
                    throw new Error("Could not set Room.buildOrderFILO property");
                }
                this.memory.buildOrderFILO = value;
            }
        });
    }
    
    if (Room.prototype.hasHostileCreep == undefined) {
        Object.defineProperty(Room.prototype, "hasHostileCreep", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["hasHostileCreep"], undefined) == undefined) {
                    _.set(this.memory, ["hasHostileCreep"], false);
                }
                if (_.isBoolean(this.memory.hasHostileCreep) == false) {
                    return undefined;
                }
                return this.memory.hasHostileCreep;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["hasHostileCreep"], undefined) == undefined) {
                    _.set(this.memory, ["hasHostileCreep"], false);
                }
                if (_.isBoolean(this.memory.hasHostileCreep) == false) {
                    throw new Error("Could not set Room.hasHostileCreep property");
                }
                this.memory.hasHostileCreep = value;
            }
        });
    }
    
    if (Room.prototype.hasHostileTower == undefined) {
        Object.defineProperty(Room.prototype, "hasHostileTower", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["hasHostileTower"], undefined) == undefined) {
                    _.set(this.memory, ["hasHostileTower"], false);
                }
                if (_.isBoolean(this.memory.hasHostileTower) == false) {
                    return undefined;
                }
                return this.memory.hasHostileTower;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["hasHostileTower"], undefined) == undefined) {
                    _.set(this.memory, ["hasHostileTower"], false);
                }
                if (_.isBoolean(this.memory.hasHostileTower) == false) {
                    throw new Error("Could not set Room.hasHostileTower property");
                }
                this.memory.hasHostileTower = value;
            }
        });
    }
    
    if (Room.prototype.priorityTargetID == undefined) {
        Object.defineProperty(Room.prototype, "priorityTargetID", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["priorityTargetID"], undefined) == undefined) {
                    _.set(this.memory, ["priorityTargetID"], "");
                }
                if (_.isString(this.memory.priorityTargetID) == false) {
                    return undefined;
                }
                return this.memory.priorityTargetID;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["priorityTargetID"], undefined) == undefined) {
                    _.set(this.memory, ["priorityTargetID"], "");
                }
                if (_.isString(this.memory.priorityTargetID) == false) {
                    throw new Error("Could not set Room.priorityTargetID property");
                }
                this.memory.priorityTargetID = value;
            }
        });
    }
    
    if (Room.prototype.clearPathCaches == undefined) {
        Object.defineProperty(Room.prototype, "clearPathCaches", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["clearPathCaches"], undefined) == undefined) {
                    _.set(this.memory, ["clearPathCaches"], false);
                }
                if (_.isBoolean(this.memory.clearPathCaches) == false) {
                    return undefined;
                }
                return this.memory.clearPathCaches;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["clearPathCaches"], undefined) == undefined) {
                    _.set(this.memory, ["clearPathCaches"], false);
                }
                if (_.isBoolean(this.memory.clearPathCaches) == false) {
                    throw new Error("Could not set Room.clearPathCaches property");
                }
                this.memory.clearPathCaches = value;
            }
        });
    }
    
    if (Room.prototype.avoidTravelUntil == undefined) {
        Object.defineProperty(Room.prototype, "avoidTravelUntil", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["avoidTravelUntil"], undefined) == undefined) {
                    _.set(this.memory, ["avoidTravelUntil"], 0);
                }
                if (_.isNumber(this.memory.avoidTravelUntil) == false) {
                    return undefined;
                }
                return this.memory.avoidTravelUntil;
            },
            
            set: function(value) {
                if (_.get(this.memory, ["avoidTravelUntil"], undefined) == undefined) {
                    _.set(this.memory, ["avoidTravelUntil"], 0);
                }
                if (_.isNumber(this.memory.avoidTravelUntil) == false) {
                    throw new Error("Could not set Room.avoidTravelUntil property");
                }
                this.memory.avoidTravelUntil = value;
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
    
    if (Room.prototype.beingViewed == undefined) {
        Object.defineProperty(Room.prototype, "beingViewed", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, ["lastViewed"], undefined) == undefined) {
                    _.set(this.memory, ["lastViewed"], 0);
                }
                if (_.isNumber(this.memory.lastViewed) == false) {
                    return false;
                }
                return (this.memory.lastViewed > (Game.time - ROOM_VISUAL_TIMEOUT));
            }/*,
            
            set: function(value) {
                if (_.get(this.memory, ["lastViewed"], undefined) == undefined) {
                    _.set(this.memory, ["lastViewed"], 0);
                }
                if (_.isNumber(this.memory.lastViewed) == false) {
                    throw new Error("Could not set Room.beingViewed property");
                }
                this.memory.lastViewed = ((value == true) ? Game.time : 0);
            }*/
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
