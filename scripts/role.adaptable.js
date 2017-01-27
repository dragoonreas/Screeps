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
            creep.memory.sourceID = undefined;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.structureID = undefined;
        }
        
        if (creep.memory.roomID == "W53N32") {
            let theStorage = Game.rooms[creep.memory.roomID].storage;
            let theTerminal = Game.rooms[creep.memory.roomID].terminal;
            if (creep.room.name == creep.memory.roomID && _.sum(creep.carry) < creep.carryCapacity && ((theTerminal != undefined && theTerminal.store.energy > 0) || (theStorage != undefined && theStorage.store.energy > 0))) {
                if (theTerminal.store.energy > 0) {
                    let err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFEC", true);
                        creep.moveTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say("\u2B07\uD83C\uDFEC", true);
                    }
                }
                else if (theStorage.store.energy > 0) {
                    let err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say("\u27A1\uD83C\uDFE6", true);
                        creep.moveTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say("\u2B07\uD83C\uDFE6", true);
                    }
                }
            }
            else if (creep.room.name != "W65N17") {
                roleScout.run(creep);
            }
            else {
                creep.memory.roomID = "W65N17";
                if (_.get(Memory, ["rooms", "W65N17", "creepCounts", "builder"], 0) > 0) {
                    let builders = _.filter(Game.creeps, (c) => (
                        c.memory.roomID == "W65N17" 
                        && c.memory.role == "builder"
                    ));
                    _.forEach(builders, function(b) {
                        b.memory.role = "repairer";
                        b.memory.repairerType = "all";
                        console.log(b.name + " in " + b.room.name + " changing from builder to repairer (of type all)"); // TODO: Find out why this doesn't display
                    });
                }
                creep.memory.role = "builder";
                console.log("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
            }
        }
    }
};

module.exports = roleAdaptable;
