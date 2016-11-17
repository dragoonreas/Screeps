var roleHarvester = require('role.harvester');

var roleBuilder = {

    run: function(creep) {

        if(creep.memory.working && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                var targetIndex = 0;
                if (Memory.buildOrderFIFO = false) {
                    targetIndex = targets.length - 1;
                }
                if(creep.build(targets[targetIndex]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targetIndex]);
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
    }
};

module.exports = roleBuilder;
