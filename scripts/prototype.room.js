var prototypeRoom = function() {
    if (Room.prototype.sources == undefined) {
        Object.defineProperty(Room.prototype, "sources", {
            get: function() {
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
                if (_.get(this.memory, "harvestRooms", unedfined) == undefined) {
                    _set(this.memory, "harvestRooms", []);
                }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    return undefined;
                }
                return this.memory.harvestRooms;
            },
            
            set: function(value) {
                if (_.get(this.memory, "harvestRooms", unedfined) == undefined) {
                    _set(this.memory, "harvestRooms", []);
                }
                if (_.isArray(this.memory.harvestRooms) == false) {
                    throw new Error("Could not set Room.harvestRooms property");
                }
                this.memory.harvestRooms = value;
            }
        });
    }

    if (Room.prototype.checkForDrops == undefined) {
        Object.defineProperty(Room.prototype, "checkForDrops", {
            get: function() {
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
};

module.exports = prototypeRoom;
