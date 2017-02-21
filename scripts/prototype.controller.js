let prototypeController = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    if (StructureController.prototype.memory == undefined) { // NOTE: Must be defined after Room.controllerMem
        Object.defineProperty(StructureController.prototype, "memory", {
            get: function() {
    			if (this === StructureController.prototype || this == undefined) { return; }
                if (_.isObject(this.room.controllerMem) == false) {
                    return undefined;
                }
                return this.room.controllerMem[this.id];
            },
            
            set: function(value) {
                if (_.isObject(this.room.controllerMem) == false) {
                    throw new Error("Could not set StructureController.memory property");
                }
                this.room.controllerMem[this.id] = value;
            }
        });
    }
};

module.exports = prototypeController;
