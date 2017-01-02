var roleAttacker = require("role.attacker");
var roleHoarder = require("role.hoarder");
var roleCollector = require("role.collector");
var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleRepairer = require("role.repairer");
var roleBuilder = require("role.builder");
var roleClaimer = require("role.claimer");
var roleRecyclable = require("role.recyclable");
var roleScout = require("role.scout");

// role to use when doing ad-hoc stuff
var roleAdaptable = {
    
    run: function(creep) {
        
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
    }
};

module.exports = roleAdaptable;
