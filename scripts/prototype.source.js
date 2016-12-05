var prototypeSource = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    Object.defineProperty(Source.prototype, "memory", {
        
        get: function() {
            if(this.room.memory.sources == undefined) {
                this.room.memory.sources = {};
            }
            if(_.isObject(this.room.memory.sources) == false) {
                return undefined;
            }
            return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {};
        },
        
        set: function(value) {
            if(this.room.memory.sources == undefined) {
                Memory.sources = {};
            }
            if(_.isObject(this.room.memory.sources) == false) {
                throw new Error('Could not set source memory');
            }
            this.room.memory.sources[this.id] = value;
        }
    });
};

module.exports = prototypeSource;