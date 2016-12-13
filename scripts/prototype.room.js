var prototypeRoom = function() {
    
    Object.defineProperty(Room.prototype, "sources", {
        
        get: function() {
            if(this.memory.sources == undefined) {
                if (Game.rooms[this.name] != undefined) {
                    this.memory.sources = this.find(FIND_SOURCES);
                }
                else {
                    this.memory.sources = {};
                }
            }
            if(_.isObject(this.memory.sources) == false) {
                return undefined;
            }
            return this.memory.sources;
        },
        
        set: function(value) {
            if(this.memory.sources == undefined) {
                if (Game.rooms[this.name] != undefined) {
                    this.memory.sources = this.find(FIND_SOURCES);
                }
                else {
                    this.memory.sources = {};
                }
            }
            if(_.isObject(this.memory.sources) == false) {
                throw new Error('Could not set sources room property');
            }
            this.memory.sources = value;
        }
    });

    Object.defineProperty(Room.prototype, "checkForDrops", {
        
        get: function() {
            if(this.memory.checkForDrops == undefined) {
                this.memory.checkForDrops = true;
            }
            if(_.isBoolean(this.memory.checkForDrops) == false) {
                return undefined;
            }
            return this.memory.checkForDrops;
        },
        
        set: function(value) {
            if(this.memory.checkForDrops == undefined) {
                this.memory.checkForDrops = true;
            }
            if(_.isBoolean(this.memory.checkForDrops) == false) {
                throw new Error('Could not set checkForDrops room property');
            }
            this.memory.checkForDrops = value;
        }
    });

    Object.defineProperty(Room.prototype, "buildOrderFILO", {
        
        get: function() {
            if(this.memory.buildOrderFILO == undefined) {
                this.memory.buildOrderFILO = false;
            }
            if(_.isBoolean(this.memory.buildOrderFILO) == false) {
                return undefined;
            }
            return this.memory.buildOrderFILO;
        },
        
        set: function(value) {
            if(this.memory.buildOrderFILO == undefined) {
                this.memory.buildOrderFILO = false;
            }
            if(_.isBoolean(this.memory.buildOrderFILO) == false) {
                throw new Error('Could not set buildOrderFILO room property');
            }
            this.memory.buildOrderFILO = value;
        }
    });

    Object.defineProperty(Room.prototype, "hasHostileCreep", {
        
        get: function() {
            if(this.memory.hasHostileCreep == undefined) {
                this.memory.hasHostileCreep = false;
            }
            if(_.isBoolean(this.memory.hasHostileCreep) == false) {
                return undefined;
            }
            return this.memory.hasHostileCreep;
        },
        
        set: function(value) {
            if(this.memory.hasHostileCreep == undefined) {
                this.memory.hasHostileCreep = false;
            }
            if(_.isBoolean(this.memory.hasHostileCreep) == false) {
                throw new Error('Could not set hasHostileCreep room property');
            }
            this.memory.hasHostileCreep = value;
        }
    });

    Object.defineProperty(Room.prototype, "hasHostileTower", {
        
        get: function() {
            if(this.memory.hasHostileTower == undefined) {
                this.memory.hasHostileTower = false;
            }
            if(_.isBoolean(this.memory.hasHostileTower) == false) {
                return undefined;
            }
            return this.memory.hasHostileTower;
        },
        
        set: function(value) {
            if(this.memory.hasHostileTower == undefined) {
                this.memory.hasHostileTower = false;
            }
            if(_.isBoolean(this.memory.hasHostileTower) == false) {
                throw new Error('Could not set hasHostileTower room property');
            }
            this.memory.hasHostileTower = value;
        }
    });
};

module.exports = prototypeRoom;
