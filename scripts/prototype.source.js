var prototypeSource = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    if (Source.prototype.memory == undefined) {
        Object.defineProperty(Source.prototype, "memory", {
            
            get: function() {
                if(this.room.memory.sources == undefined) {
                    this.room.memory.sources = {};
                }
                if(_.isObject(this.room.memory.sources) == false) {
                    return undefined;
                }
                return this.room.memory.sources[this.id];
            },
            
            set: function(value) {
                if(this.room.memory.sources == undefined) {
                    this.room.memory.sources = {};
                }
                if(_.isObject(this.room.memory.sources) == false) {
                    throw new Error('Could not set memory source property');
                }
                this.room.memory.sources[this.id] = value;
            }
        });
    }

    if (Source.prototype.activeAt == undefined) {
        Object.defineProperty(Source.prototype, "activeAt", {
    
            get: function() {
                if(this.memory.activeAt == undefined) {
                    this.memory.activeAt = 0;
                }
                if(_.isNumber(this.memory.activeAt) == false) {
                    return undefined;
                }
                return this.memory.activeAt;
            },
            
            set: function(value) {
                if(this.memory.activeAt == undefined) {
                    this.memory.activeAt = 0;
                }
                if(_.isNumber(this.memory.activeAt) == false) {
                    throw new Error('Could not set activeAt source property');
                }
                this.memory.activeAt = value;
            }
        });
    }
};

module.exports = prototypeSource;
