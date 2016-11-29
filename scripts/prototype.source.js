var prototypeSource = function() {
    
    // Source: http://stackoverflow.com/a/38445167
    Object.defineProperty(Source.prototype, 'memory', {
        get: function() {
            if(_.isUndefined(this.room.memory.sources)) {
                this.room.memory.sources = {};
            }
            if(!_.isObject(this.room.memory.sources)) {
                return undefined;
            }
            return this.room.memory.sources[this.id] = this.room.memory.sources[this.id] || {};
        },
        set: function(value) {
            if(_.isUndefined(this.room.memory.sources)) {
                Memory.sources = {};
            }
            if(!_.isObject(this.room.memory.sources)) {
                throw new Error('Could not set source memory');
            }
            this.room.memory.sources[this.id] = value;
        }
    });

};

module.exports = prototypeSource;
