let prototypeCreep = function() {
    /*
        Cached dynamic properties: Usage examples
        By warinternal, from the Screeps Slack
    */
    defineCachedGetter(Creep.prototype, 'carryTotal', c => _.sum(c.carry));
    defineCachedGetter(Creep.prototype, 'carryCapacityAvailable', c => c.carryCapacity - c.carryTotal);
};

module.exports = prototypeCreep;
