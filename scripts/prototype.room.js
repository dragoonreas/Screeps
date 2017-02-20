let prototypeRoom = function() {
    Room.prototype.dangerZones = []; // TODO: Define this property properly
    
    if (Room.prototype.sources == undefined) {
        Object.defineProperty(Room.prototype, "sources", { // NOTE: Must be defined after Memory.source
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, "sources", undefined) == undefined) {
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
                if (_.get(this.memory, "sources", undefined) == undefined) {
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
    
    if (Room.prototype.harvestRooms == undefined) {
        Object.defineProperty(Room.prototype, "harvestRooms", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, "harvestRooms", undefined) == undefined) {
                    _.set(this.memory, "harvestRooms", []);
                }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    return undefined;
                }
                return this.memory.harvestRooms;
            },
            
            set: function(value) {
                if (_.get(this.memory, "harvestRooms", undefined) == undefined) {
                    _.set(this.memory, "harvestRooms", []);
                }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    throw new Error("Could not set Room.harvestRooms property");
                }
                this.memory.harvestRooms = value;
            }
        });
    }
    
    if (Room.prototype.minerSources == undefined) {
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
    
    if (Room.prototype.checkForDrops == undefined) {
        Object.defineProperty(Room.prototype, "checkForDrops", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, "checkForDrops", undefined) == undefined) {
                    _.set(this.memory, "checkForDrops", true);
                }
                if (_.isBoolean(this.memory.checkForDrops) == false) {
                    return undefined;
                }
                return this.memory.checkForDrops;
            },
            
            set: function(value) {
                if (_.get(this.memory, "checkForDrops", undefined) == undefined) {
                    _.set(this.memory, "checkForDrops", true);
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
                if (_.get(this.memory, "buildOrderFILO", undefined) == undefined) {
                    _.set(this.memory, "buildOrderFILO", false);
                }
                if (_.isBoolean(this.memory.buildOrderFILO) == false) {
                    return undefined;
                }
                return this.memory.buildOrderFILO;
            },
            
            set: function(value) {
                if (_.get(this.memory, "buildOrderFILO", undefined) == undefined) {
                    _.set(this.memory, "buildOrderFILO", false);
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
                if (_.get(this.memory, "hasHostileCreep", undefined) == undefined) {
                    _.set(this.memory, "hasHostileCreep", false);
                }
                if (_.isBoolean(this.memory.hasHostileCreep) == false) {
                    return undefined;
                }
                return this.memory.hasHostileCreep;
            },
            
            set: function(value) {
                if (_.get(this.memory, "hasHostileCreep", undefined) == undefined) {
                    _.set(this.memory, "hasHostileCreep", false);
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
                if (_.get(this.memory, "hasHostileTower", undefined) == undefined) {
                    _.set(this.memory, "hasHostileTower", false);
                }
                if (_.isBoolean(this.memory.hasHostileTower) == false) {
                    return undefined;
                }
                return this.memory.hasHostileTower;
            },
            
            set: function(value) {
                if (_.get(this.memory, "hasHostileTower", undefined) == undefined) {
                    _.set(this.memory, "hasHostileTower", false);
                }
                if (_.isBoolean(this.memory.hasHostileTower) == false) {
                    throw new Error("Could not set Room.hasHostileTower property");
                }
                this.memory.hasHostileTower = value;
            }
        });
    }
    
    if (Room.prototype.avoidTravelUntil == undefined) {
        Object.defineProperty(Room.prototype, "avoidTravelUntil", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, "avoidTravelUntil", undefined) == undefined) {
                    _.set(this.memory, "avoidTravelUntil", 0);
                }
                if (_.isNumber(this.memory.avoidTravelUntil) == false) {
                    return undefined;
                }
                return this.memory.avoidTravelUntil;
            },
            
            set: function(value) {
                if (_.get(this.memory, "avoidTravelUntil", undefined) == undefined) {
                    _.set(this.memory, "avoidTravelUntil", 0);
                }
                if (_.isNumber(this.memory.avoidTravelUntil) == false) {
                    throw new Error("Could not set Room.avoidTravelUntil property");
                }
                this.memory.avoidTravelUntil = value;
            }
        });
    }
    
    if (Room.prototype.isHarvestRoom == undefined) {
        defineCachedGetter(Room.prototype, 'isHarvestRoom', (r) => {
            return (_.some(Memory.rooms, (rm) => {
                let harvestRooms = _.get(rm, "harvestRooms", undefined);
                if (harvestRooms == undefined) { return false; }
                return (_.includes(harvestRooms, r.name) == true);
            }) == true);
        });
    }
    
    if (Room.prototype.memoryExpiration == undefined) {
        Object.defineProperty(Room.prototype, "memoryExpiration", {
            get: function() {
                if (this === Room.prototype || this == undefined) { return; }
                if (_.get(this.memory, "memoryExpiration", undefined) == undefined) {
                    _.set(this.memory, "memoryExpiration", 0);
                }
                if (_.isNumber(this.memory.memoryExpiration) == false) {
                    return undefined;
                }
                return this.memory.memoryExpiration;
            },
            
            set: function(value) {
                if (_.get(this.memory, "memoryExpiration", undefined) == undefined) {
                    _.set(this.memory, "memoryExpiration", 0);
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
