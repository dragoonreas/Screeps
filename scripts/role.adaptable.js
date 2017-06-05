// role to use when doing ad-hoc stuff
let roleAdaptable = {
    run: function(creep) {
        creep.memory.executingRole = "adaptable";
        
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        
        let sentTo = creep.memory.roomSentTo;
        if (_.isString(sentTo) == false) {
            switch (creep.memory.roomID) {
                //case "W87N29": sentTo = "W86N29"; break; // TODO: Update when bootstrapping network reconfigured
                case "W86N29": sentTo = "W85N23"; break;
                case "W85N23": sentTo = "W86N29"; break;
                case "W86N39": sentTo = "W85N38"; break;
                case "W85N38": sentTo = "W86N43"; break;
                case "W86N43": sentTo = "W86N39"; break;
                case "W9N45": sentTo = "W9N45"; break;
                case "W81N29": sentTo = "W81N29"; break;
                case "W72N28": sentTo = "W72N28"; break;
                case "W64N31": sentTo = "W55N31"; break;
            }
            if (_.isString(sentTo) == true) {
                creep.memory.roomSentTo = sentTo;
            }
        }
        
        let sentFrom = (creep.memory.roomSentFrom || creep.memory.roomID);
        if (_.isString(creep.memory.roomSentFrom) == false) {
            creep.memory.roomSentFrom = sentFrom;
        }
        
        if (_.isString(sentTo) == true) {
            let theStorage = Game.rooms[sentFrom].storage;
            let theTerminal = Game.rooms[sentFrom].terminal;
            if (creep.room.name == sentFrom && _.sum(creep.carry) < creep.carryCapacity && ((theStorage != undefined && theStorage.store.energy > 0) || (theTerminal != undefined && theTerminal.store.energy > 0))) {
                if (theStorage != undefined && theStorage.store.energy > 0) {
                    let err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theStorage);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                }
                else if (theTerminal != undefined && theTerminal.store.energy > 0) {
                    let err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theTerminal);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                    }
                }
            }
            else if (creep.room.name != sentTo) {
                if (creep.memory.roomID == sentFrom) {
                    creep.memory.roomID = sentTo;
                    _.set(Memory.rooms, [sentFrom, "creepCounts", "adaptables"], _.get(Memory.rooms, [sentFrom, "creepCounts", "adaptables"], 1) - 1);
                    _.set(Memory.rooms, [sentTo, "creepCounts", "adaptables"], _.get(Memory.rooms, [sentTo, "creepCounts", "adaptables"], 0) + 1);
                }
                if (sentTo == "W9N45") { // NOTE: Any rooms that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.travelTo(new RoomPosition(25, 25, sentTo));
                    creep.say(travelToIcons(creep) + sentTo, true);
                }
            }
            else {
                console.log("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive.toLocaleString() + " ticks to live & " + creep.hits.toLocaleString() + "/" + creep.hitsMax.toLocaleString() + " HP");
                if (creep.memory.roomID == "W81N29" || creep.memory.roomID == "W72N28" || creep.memory.roomID == "W55N31") { // Allows these creeps to demolish in the room they're sent to
                    creep.memory.roomSentFrom = undefined;
                }
                else if (_.get(Memory, ["rooms", sentTo, "creepCounts", "builder"], 0) >= _.get(Memory, ["rooms", sentTo, "creepMins", "builder"], 0)) {
                    let builders = _.filter(Game.creeps, (c) => (
                        c.memory.roomID == sentTo 
                        && c.memory.role == "builder"
                    ));
                    _.forEach(builders, (b) => {
                        b.memory.role = "repairer";
                        b.memory.repairerType = "all";
                        _.set(Memory.rooms, [sentTo, "creepCounts", "builder"], _.get(Memory.rooms, [sentTo, "creepCounts", "builder"], 1) - 1);
                        _.set(Memory.rooms, [sentTo, "creepCounts", "repairer"], _.get(Memory.rooms, [sentTo, "creepCounts", "repairer"], 0) + 1);
                        _.set(Memory.rooms, [sentTo, "repairerTypeCounts", "all"], _.get(Memory.rooms, [sentTo, "repairerTypeCounts", "all"], 0) + 1);
                        console.log(b.name + " in " + b.memory.roomID + " changing from builder to " + b.memory.role + " (of type " + b.memory.repairerType + ")");
                        if (_.get(Memory.rooms, [sentTo, "creepCounts", "builder"], 0) <= _.get(Memory.rooms, [sentTo, "creepMins", "builder"], 1) - 1) {
                            return false; // break loop
                        }
                    });
                }
                creep.memory.role = "builder";
                _.set(Memory.rooms, [sentTo, "creepCounts", "builder"], _.get(Memory.rooms, [sentTo, "creepCounts", "builder"], 0) + 1);
                ROLES["builder"].run(creep);
            }
        }
        else {
            creep.say("?", true);
        }
    }
};

module.exports = roleAdaptable;
