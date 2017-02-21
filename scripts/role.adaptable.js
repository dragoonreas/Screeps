// role to use when doing ad-hoc stuff
let roleAdaptable = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        
        let destinationRoomName = undefined;
        switch (creep.memory.roomID) {
            case "W87N29": destinationRoomName = "W86N29"; break;
            case "W86N29": destinationRoomName = "W85N23"; break;
            case "W85N23": destinationRoomName = "W87N29"; break;
        }
        
        if (destinationRoomName != undefined) {
            let theStorage = Game.rooms[creep.memory.roomID].storage;
            let theTerminal = Game.rooms[creep.memory.roomID].terminal;
            if (creep.room.name == creep.memory.roomID && _.sum(creep.carry) < creep.carryCapacity && ((theTerminal != undefined && theTerminal.store.energy > 0) || (theStorage != undefined && theStorage.store.energy > 0))) {
                if (theTerminal != undefined && theTerminal.store.energy > 0) {
                    let err = creep.withdraw(theTerminal, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                    }
                }
                else if (theStorage != undefined && theStorage.store.energy > 0) {
                    let err = creep.withdraw(theStorage, RESOURCE_ENERGY);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                }
            }
            else if (creep.room.name != destinationRoomName) {
                ROLES["scout"].run(creep);
            }
            else {
                creep.memory.roomID = destinationRoomName;
                console.log("Adaptable made it to " + creep.room.name + " with " + creep.ticksToLive.toLocaleString() + " ticks to live & " + creep.hits.toLocaleString() + "/" + creep.hitsMax.toLocaleString() + " HP");
                if (_.get(Memory, ["rooms", destinationRoomName, "creepCounts", "builder"], 0) > 0) {
                    let builders = _.filter(Game.creeps, (c) => (
                        c.memory.roomID == destinationRoomName 
                        && c.memory.role == "builder"
                    ));
                    _.forEach(builders, (b) => {
                        b.memory.role = "repairer";
                        b.memory.repairerType = "all";
                        console.log(b.name + " in " + b.room.name + " changing from builder to repairer (of type all)");
                    });
                }
                creep.memory.role = "builder";
                ROLES["builder"].run(creep);
            }
        }
        else {
            creep.say("?", true);
        }
    }
};

module.exports = roleAdaptable;
