let prototypeSource = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    if (Source.prototype.memory == undefined) { // NOTE: Must be defined after Room.sources and Memory.source
        Object.defineProperty(Source.prototype, "memory", {
            get: function() {
    			if (this === Source.prototype || this == undefined) { return; }
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
    			if (this === Source.prototype || this == undefined) { return; }
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
    
    // TODO: In claimed rooms with two sources, automatically set the source with the closest path to the controller (with goal range set to 3). All other sources in the room should be set to false.
    if (Source.prototype.upgraderOnly == undefined) {
        Object.defineProperty(Source.prototype, "upgraderOnly", {
            get: function() {
    			if (this === Source.prototype || this == undefined) { return; }
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
            get: function() { // TODO: Clear miners that have less ticks to live than the time it took them to get to the source
    			if (this === Source.prototype || this == undefined) { return; }
                if (_.isString(this.memory.minerName) == false) {
                    return undefined;
                }
                return Game.creeps[this.memory.minerName];
            },
            
            set: function(value) {
                if (_.isString(_.get(value, "name", undefined)) == true 
                    && Game.creeps[value.name] != undefined) {
                    this.memory.minerName = value.name;
                }
                else if (_.isString(value) == true 
                    && Game.creeps[value.name] != undefined) {
                    this.memory.minerName = value;
                }
                else {
                    throw new Error("Could not set Source.miner property");
                }
            }
        });
    }
    
    // NOTE: Can be either a construction site or a structure
    if (Source.prototype.container == undefined) { // TODO: Add checks to make sure container is beside source
        Object.defineProperty(Source.prototype, "container", {
            get: function() { // TODO: If no container is found, look near the source to try and assign one
    			if (this === Source.prototype || this == undefined) { return; }
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
    
    // NOTE: Can be either a construction site or a structure
    if (Source.prototype.link == undefined) { // TODO: Add checks to make sure link is placed correctly (the links tile should be beside a tile beside the source that doesn't block new miners from accessing that tile beside the source)
        Object.defineProperty(Source.prototype, "link", {
            get: function() { // TODO: If no link is found, look around the source to try and assign one
    			if (this === Source.prototype || this == undefined) { return; }
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
