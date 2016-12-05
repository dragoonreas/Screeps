var roleAttacker = require("role.attacker");
var roleHoarder = require("role.hoarder");
var roleCollector = require("role.collector");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleRepairer = require("role.repairer");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleRecyclable = require("role.recyclable");

// role to use when doing ad-hoc stuff
var roleAdaptable = {
    
    run: function(creep) {
        
        if(creep.memory.working && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        if(!creep.memory.working && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.room.name != "E68N45") {
            creep.moveTo(new RoomPosition(26, 23, "E68N45"));
        }
        else {
            if (creep.memory.working == false) {
                var source = Game.getObjectById("57ef9ee786f108ae6e6101b2");
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }
    }
};

module.exports = roleAdaptable;
