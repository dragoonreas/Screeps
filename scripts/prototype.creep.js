let prototypeCreep = function() {
    /*
        Cached dynamic properties: Usage examples
        By warinternal, from the Screeps Slack
    */
    defineCachedGetter(Creep.prototype, 'carryTotal', c => _.sum(c.carry));
    defineCachedGetter(Creep.prototype, 'carryCapacityAvailable', c => c.carryCapacity - c.carryTotal);
    
    if (Creep.prototype.energyAvaliableOnSpawn == undefined) {
        Object.defineProperty(Creep.prototype, "energyAvaliableOnSpawn", {
            get: function() {
                if (this === Creep.prototype || this == undefined) { return; }
                if (_.get(this.memory, "energyAvaliableOnSpawn", undefined) == undefined) {
                    _.set(this.memory, "energyAvaliableOnSpawn", _.max(_.get(Game.rooms, [this.memory.roomID, "energyCapacityAvailable"], _.sum(this.body, (bp) => (BODYPART_COST[bp.type]))), _.sum(this.body, (bp) => (BODYPART_COST[bp.type]))));
                }
                if (_.isNumber(this.memory.energyAvaliableOnSpawn) == false) {
                    return undefined;
                }
                return this.memory.energyAvaliableOnSpawn;
            },
            
            set: function(value) {
                if (_.get(this.memory, "energyAvaliableOnSpawn", undefined) == undefined) {
                    _.set(this.memory, "energyAvaliableOnSpawn", _.max(_.get(Game.rooms, [this.memory.roomID, "energyCapacityAvailable"], _.sum(this.body, (bp) => (BODYPART_COST[bp.type]))), _.sum(this.body, (bp) => (BODYPART_COST[bp.type]))));
                }
                if (_.isNumber(this.memory.energyAvaliableOnSpawn) == false) {
                    throw new Error("Could not set Room.energyAvaliableOnSpawn property");
                }
                this.memory.energyAvaliableOnSpawn = value;
            }
        });
    }
};

module.exports = prototypeCreep;
