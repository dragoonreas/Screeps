var roleHarvester = require('role.harvester');

var rolecustom = {
    
    run: function(creep) {
        
        if(creep.memory.working && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }
        if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
            if(creep.memory.working) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[targets.length-1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[targets.length-1]);
                }
            }
            else {
                roleHarvester.run(creep);
            }
        }
        else {
            var source = Game.getObjectById("57ef9efc86f108ae6e610380");
            if (source == undefined) {
                source = creep.room.find(FIND_SOURCES_ACTIVE)[0];
            }
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = rolecustom;
