let prototypeSource = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    if (Source.prototype.memory == undefined) {
        Object.defineProperty(Source.prototype, "memory", {
            get: function() {
    			if(this === Source.prototype || this == undefined) { return; }
                if (_.isObject(this.room.sources) == false) {
                    return undefined;
                }
                return this.room.sources[this.id];
            },
            
            set: function(value) {
                if (_.isObject(this.room.sources) == false) {
                    throw new Error("Could not set Source.memory property");
                }
                this.room.sources[this.id] = value;
            }
        });
    }
    
    if (Source.prototype.regenAt == undefined) {
        Object.defineProperty(Source.prototype, "regenAt", {
            get: function() {
    			if(this === Source.prototype || this == undefined) { return; }
                if (_.get(this.memory, "regenAt", undefined) == undefined) {
                    _.set(this.memory, "regenAt", Game.time + (this.energy == 0 ? this.ticksToRegeneration : 0));
                }
                if (_.isNumber(this.memory.regenAt) == false) {
                    return undefined;
                }
                return this.memory.regenAt;
            },
            
            set: function(value) {
                if (_.get(this.memory, "regenAt", undefined) == undefined) {
                    _.set(this.memory, "regenAt", Game.time + (this.energy == 0 ? this.ticksToRegeneration : 0));
                }
                if (_.isNumber(this.memory.regenAt) == false) {
                    throw new Error("Could not set Source.regenAt property");
                }
                this.memory.regenAt = value;
            }
        });
    }
    
    // TODO: In claimed rooms with two sources, automatically set the source with the closest path to the controller. All other sources should be set to false.
    if (Source.prototype.upgraderOnly == undefined) {
        Object.defineProperty(Source.prototype, "upgraderOnly", {
            get: function() {
    			if(this === Source.prototype || this == undefined) { return; }
                if (_.get(this.memory, "upgraderOnly", undefined) == undefined) {
                    _.set(this.memory, "upgraderOnly", false);
                }
                if (_.isBoolean(this.memory.upgraderOnly) == false) {
                    return undefined;
                }
                return this.memory.upgraderOnly;
            },
            
            set: function(value) {
                if (_.get(this.memory, "upgraderOnly", undefined) == undefined) {
                    _.set(this.memory, "upgraderOnly", false);
                }
                if (_.isBoolean(this.memory.upgraderOnly) == false) {
                    throw new Error("Could not set Source.upgraderOnly property");
                }
                this.memory.upgraderOnly = value;
            }
        });
    }
    
    if (Source.prototype.miner == undefined) {
        Object.defineProperty(Source.prototype, "miner", {
            get: function() {
    			if(this === Source.prototype || this == undefined) { return; }
                if (_.isString(this.memory.minerName) == false) {
                    return undefined;
                }
                return Game.creeps[this.memory.minerName];
            },
            
            set: function(value) {
                if (_.isString(_.get(value, "name", undefined)) == true 
                    && Game.creeps[value.name] != undefined) {
                    this.memory.miner = value.name;
                }
                else if (_.isString(value) == true 
                    && Game.creeps[value.name] != undefined) {
                    this.memory.miner = value;
                }
                else {
                    throw new Error("Could not set Source.miner property");
                }
            }
        });
    }

    if (Source.prototype.container == undefined) {
        Object.defineProperty(Source.prototype, "container", {
            get: function() {
    			if(this === Source.prototype || this == undefined) { return; }
                if (_.isString(this.memory.containerID) == false) {
                    return undefined;
                }
                return Game.getObjectById(this.memory.containerID);
            },
            
            set: function(value) {
                if (_.isString(_.get(value, "id", undefined)) == true 
                    && _.get(Game.getObjectById(value.id), "structureType", undefined) == STRUCTURE_CONTAINER) {
                    this.memory.containerID = value.id;
                }
                else if (_.isString(value) == true 
                    && _.get(Game.getObjectById(value), "structureType", undefined) == STRUCTURE_CONTAINER) {
                    this.memory.containerID = value;
                }
                else {
                    throw new Error("Could not set Source.container property");
                }
            }
        });
    }

    if (Source.prototype.link == undefined) {
        Object.defineProperty(Source.prototype, "link", {
            get: function() {
    			if(this === Source.prototype || this == undefined) { return; }
                if (_.isString(this.memory.linkID) == false) {
                    return undefined;
                }
                return Game.getObjectById(this.memory.linkID);
            },
            
            set: function(value) {
                if (_.isString(_.get(value, "id", undefined)) == true 
                    && _.get(Game.getObjectById(value.id), "structureType", undefined) == STRUCTURE_LINK) {
                    this.memory.linkID = value.id;
                }
                else if (_.isString(value) == true 
                    && _.get(Game.getObjectById(value.id), "structureType", undefined) == STRUCTURE_LINK) {
                    this.memory.linkID = value;
                }
                else {
                    throw new Error("Could not set Source.link property");
                }
            }
        });
    }
};

module.exports = prototypeSource;
