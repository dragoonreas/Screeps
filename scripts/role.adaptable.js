
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
        
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.constructionSiteID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.room.name == "E35N25" && creep.memory.warped != true) {
            creep.memory.warped = true;
        }
        else if (creep.room.name == "E65N45" && creep.memory.warped == true) {
            creep.memory.warped = false;
        }

        if (creep.memory.roomID == "E68N45") {
            if (creep.room.name != "E35N25" && creep.memory.warped != true) {
                creep.say("➡E65N45", true);
                if (creep.room.name == "E66N45" && creep.pos.x < 20 && creep.pos.x > 4) {
                    creep.moveTo(new RoomPosition(4, 25, "E66N45"));
                }
                else {
                    creep.moveTo(new RoomPosition(13, 9, "E65N45"));
                }
            }
            else if (creep.room.name != "E39N24" && creep.memory.warped == true) {
                /*
                    NOTE:
                    Bovius added "Dragoonreas" to their non-agressive player list, so the code that used to be here to help this creep avoid their two RANGED_ATTACK creeps when exiting the portal is no longer needed.
                    Not sure on the specifics if their non-agressive list though, so to be safe make sure never to bring any creeps with ATTACK or RANGED_ATTACK parts through their territory incase that triggers automatic removal from said list, and don't perform any actions apart from moving.
                */
                creep.say("➡E39N24", true);
                creep.moveTo(new RoomPosition(1, 41, "E39N24"));
            }
            else if (creep.room.name == "E39N24" && creep.memory.roomID != "E39N24") {
                creep.memory.roomID = "E39N24";
                console.log("Adaptable made it to E39N24 with " + (creep.room.hasHostileCreep == true ? "at least 1" : "no") + " hostile creep present");
                Game.notify("Adaptable made it to E39N24 with " + (creep.room.hasHostileCreep == true ? "at least 1" : "no") + " hostile creep present");
            }
        }
        else if (creep.memory.roomID == "E39N24") {
            if (_.sum(creep.carry) < creep.carryCapacity && creep.room.name == "E39N17" && creep.room.hasHostileCreep == false) {
                creep.memory.droppedResourceID = _.get(creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType == RESOURCE_ENERGY}), "id", undefined);
            }
            if (_.sum(creep.carry) < creep.carryCapacity && creep.room.name == "E39N17" && creep.room.hasHostileCreep == false && (creep.room.find(FIND_STRUCTURES, {filter: (s) => s.store != undefined && s.store > 0}).length > 0 || creep.memory.droppedResourceID != undefined)) {
                if (creep.memory.droppedResourceID == undefined) {
                    var structure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.store != undefined && s.store > 0});
                    if (structure != undefined && creep.withdraw(structure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(structure);
                    }
                }
                return;
            }
            else {
                creep.memory.droppedResourceID = undefined;
            }
            
            if (creep.room.name != "E39N17") {
                roleScout.run(creep);
            }
            else {
                creep.memory.roomID = "E39N17";
                if (Memory.rooms["E39N17"].creepCounts.builder > 0) {
                    //_.forEach(_.filter(Game.creeps, (c) => (c.memory.roomID == "E39N17" && c.memory.role == "builder")), function(creep) { creep.memory.role = "harvester"; });
                }
                creep.memory.role = "builder";
                console.log("Adaptable made it to E39N17 with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
                Game.notify("Adaptable made it to E39N17 with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
            }

            if (creep.room.name != "E39N24") {
                creep.memory.roomID = "E39N17";
            }
        }
        else if (creep.memory.roomID == "E39N17") {
            /*
            if (creep.memory.working == false) {
                var source = Game.getObjectById("576a9cd257110ab231d89c70");
                var err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("➡⛏", true);
                    creep.moveTo(source);
                }
                else if (err == OK) {
                    creep.say("⛏", true);
                }
                else {
                    switch (creep.saying) {
                        case "🕛⛏": creep.say("🕧⛏", true); break;
                        case "🕧⛏": creep.say("🕐⛏", true); break;
                        case "🕐⛏": creep.say("🕜⛏", true); break;
                        case "🕜⛏": creep.say("🕑⛏", true); break;
                        case "🕑⛏": creep.say("🕝⛏", true); break;
                        case "🕝⛏": creep.say("🕒⛏", true); break;
                        case "🕒⛏": creep.say("🕞⛏", true); break;
                        case "🕞⛏": creep.say("🕓⛏", true); break;
                        case "🕓⛏": creep.say("🕟⛏", true); break;
                        case "🕟⛏": creep.say("🕔⛏", true); break;
                        case "🕔⛏": creep.say("🕠⛏", true); break;
                        case "🕠⛏": creep.say("🕕⛏", true); break;
                        case "🕕⛏": creep.say("🕡⛏", true); break;
                        case "🕡⛏": creep.say("🕖⛏", true); break;
                        case "🕖⛏": creep.say("🕢⛏", true); break;
                        case "🕢⛏": creep.say("🕗⛏", true); break;
                        case "🕗⛏": creep.say("🕣⛏", true); break;
                        case "🕣⛏": creep.say("🕘⛏", true); break;
                        case "🕘⛏": creep.say("🕤⛏", true); break;
                        case "🕤⛏": creep.say("🕙⛏", true); break;
                        case "🕙⛏": creep.say("🕥⛏", true); break;
                        case "🕥⛏": creep.say("🕚⛏", true); break;
                        case "🕚⛏": creep.say("🕦⛏", true); break;
                        default: creep.say("🕛⛏", true);
                    }
                }
            }
            else {
                roleBuilder.run(creep);
            }
            */
            
            if (creep.room.name != "E43N18") {
                roleScout.run(creep);
            }
            else {
                creep.memory.roomID = "E43N18";
                if (Memory.rooms["E43N18"].creepCounts.builder > 0) {
                    _.forEach(_.filter(Game.creeps, (c) => (c.memory.roomID == "E43N18" && c.memory.role == "builder")), function(creep) { creep.memory.role = "harvester"; });
                }
                creep.memory.role = "builder";
                console.log("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
                Game.notify("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
            }
            
            if (creep.room.name == "E45N18") {
                creep.memory.roomID = "E43N18";
            }
        }
        else if (creep.memory.roomID == "E43N18") {
            /*
            if (creep.memory.working == false) {
                var source = Game.getObjectById("577b94120f9d51615fa490fa");
                var err = creep.harvest(source);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("➡⛏", true);
                    creep.moveTo(source);
                }
                else if (err == OK) {
                    creep.say("⛏", true);
                }
                else {
                    switch (creep.saying) {
                        case "🕛⛏": creep.say("🕧⛏", true); break;
                        case "🕧⛏": creep.say("🕐⛏", true); break;
                        case "🕐⛏": creep.say("🕜⛏", true); break;
                        case "🕜⛏": creep.say("🕑⛏", true); break;
                        case "🕑⛏": creep.say("🕝⛏", true); break;
                        case "🕝⛏": creep.say("🕒⛏", true); break;
                        case "🕒⛏": creep.say("🕞⛏", true); break;
                        case "🕞⛏": creep.say("🕓⛏", true); break;
                        case "🕓⛏": creep.say("🕟⛏", true); break;
                        case "🕟⛏": creep.say("🕔⛏", true); break;
                        case "🕔⛏": creep.say("🕠⛏", true); break;
                        case "🕠⛏": creep.say("🕕⛏", true); break;
                        case "🕕⛏": creep.say("🕡⛏", true); break;
                        case "🕡⛏": creep.say("🕖⛏", true); break;
                        case "🕖⛏": creep.say("🕢⛏", true); break;
                        case "🕢⛏": creep.say("🕗⛏", true); break;
                        case "🕗⛏": creep.say("🕣⛏", true); break;
                        case "🕣⛏": creep.say("🕘⛏", true); break;
                        case "🕘⛏": creep.say("🕤⛏", true); break;
                        case "🕤⛏": creep.say("🕙⛏", true); break;
                        case "🕙⛏": creep.say("🕥⛏", true); break;
                        case "🕥⛏": creep.say("🕚⛏", true); break;
                        case "🕚⛏": creep.say("🕦⛏", true); break;
                        default: creep.say("🕛⛏", true);
                    }
                }
            }
            else {
                roleBuilder.run(creep);
            }
            */
            
            if (creep.room.name != "W53N32") {
                roleScout.run(creep);
            }
            else {
                creep.memory.roomID = "W53N32";
                if (Memory.rooms["W53N32"].creepCounts.builder > 0) {
                    _.forEach(_.filter(Game.creeps, (c) => (c.memory.roomID == "W53N32" && c.memory.role == "builder")), function(creep) { 
                        if (creep.room.memory.creepCounts["builder"] == creep.room.memory.creepMins["builder"]) {
                            creep.memory.role = "harvester";
                            --creep.room.memory.creepCounts["builder"];
                        }
                    });
                }
                creep.memory.role = "builder";
                ++creep.room.memory.creepCounts["builder"];
                console.log("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
                Game.notify("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive + " ticks to live & " + creep.hits + "/" + creep.hitsMax + " HP");
            }
        }
    }
};

module.exports = roleAdaptable;
