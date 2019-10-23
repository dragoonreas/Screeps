let prototypeController = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    if (StructureController.prototype.memory == undefined) { // NOTE: Must be defined after Room.controllerMem
        Object.defineProperty(StructureController.prototype, "memory", {
            get: function() {
                if (this === StructureController.prototype || this == undefined) { return undefined; }
                return this.room.controllerMem;
            },
            
            set: function(value) {
                this.room.controllerMem = value;
            }
        });
    }
};

module.exports = prototypeController;
