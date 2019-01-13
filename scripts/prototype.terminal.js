let prototypeTerminal = function() {
    // NOTE: These must be defined after global.defineCachedGetter
    defineCachedGetter(StructureTerminal.prototype, "storeTotal", (t) => (_.sum(t.store)));
    defineCachedGetter(StructureTerminal.prototype, "storeCapacityFree", (t) => (t.storeCapacity - t.storeTotal));
    defineCachedGetter(StructureTerminal.prototype, "energyCapacity", (t) => (Math.min((t.storeCapacity / 2), (t.storeCapacity - (t.storeTotal - t.store[RESOURCE_ENERGY])))));
    defineCachedGetter(StructureTerminal.prototype, "energyCapacityFree", (t) => (Math.max(t.energyCapacity - t.store[RESOURCE_ENERGY], 0)));
    defineCachedGetter(StructureTerminal.prototype, "needsEnergy", (t) => (t.store[RESOURCE_ENERGY] < (t.energyCapacity * 0.9)));
    
    /*if (StructureTerminal.prototype.energyAvaliableOnSpawn == undefined) {
        Object.defineProperty(Creep.prototype, "energyAvaliableOnSpawn", {
            get: function() {
                if (this === Creep.prototype || this == undefined) { return; }
                if (_.get(this.memory, "energyAvaliableOnSpawn", undefined) == undefined) {
                    let bodyCost = _.sum(this.body, (bp) => (BODYPART_COST[bp.type]));
                    _.set(this.memory, "energyAvaliableOnSpawn", _.max(_.get(Game.rooms, [this.memory.roomID, "energyCapacityAvailable"], bodyCost), bodyCost));
                }
                if (_.isNumber(this.memory.energyAvaliableOnSpawn) == false) {
                    return undefined;
                }
                return this.memory.energyAvaliableOnSpawn;
            },
            
            set: function(value) {
                if (_.get(this.memory, "energyAvaliableOnSpawn", undefined) == undefined) {
                    let bodyCost = _.sum(this.body, (bp) => (BODYPART_COST[bp.type]));
                    _.set(this.memory, "energyAvaliableOnSpawn", _.max(_.get(Game.rooms, [this.memory.roomID, "energyCapacityAvailable"], bodyCost), bodyCost));
                }
                if (_.isNumber(this.memory.energyAvaliableOnSpawn) == false) {
                    throw new Error("Could not set Room.energyAvaliableOnSpawn property");
                }
                this.memory.energyAvaliableOnSpawn = value;
            }
        });
    }*/
};

module.exports = prototypeTerminal;
