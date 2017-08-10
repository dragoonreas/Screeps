let prototypeController = function() {
    
    // Based off: http://stackoverflow.com/a/38445167
    if (StructureController.prototype.memory == undefined) { // NOTE: Must be defined after Room.controllerMem
        Object.defineProperty(StructureController.prototype, "memory", {
            get: function() {
    			if (this === StructureController.prototype || this == undefined) { return undefined; }
                if (_.isObject(_.get(this.room.controllerMem, [this.id, "pos"], undefined)) == false) {
                    this.room.memory.controller = undefined;
                    console.log("Regenerating controller for " + this.room.name);
                }
                if (_.isObject(this.room.controllerMem) == false) {
                    return undefined;
                }
                return this.room.controllerMem[this.id];
            },
            
            set: function(value) {
                if (_.isObject(_.get(this.room.controllerMem, [this.id, "pos"], undefined)) == false) {
                    this.room.memory.controller = undefined;
                    console.log("Regenerating controller for " + this.room.name);
                }
                if (_.isObject(this.room.controllerMem) == false) {
                    throw new Error("Could not set StructureController.memory property");
                }
                this.room.controllerMem[this.id] = value;
            }
        });
    }
};

module.exports = prototypeController;
