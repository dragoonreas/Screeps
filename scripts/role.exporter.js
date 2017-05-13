let roleExporter = {
    run: function(creep) {
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        
        let sentTo = creep.memory.roomSentTo;
        if (_.isString(sentTo) == false) {
            switch (creep.memory.roomID) {
                case "W87N29": sentTo = "W86N29"; break;
                case "W86N29": sentTo = "W85N23"; break;
                case "W85N23": sentTo = "W87N29"; break;
                case "W86N39": sentTo = "W85N38"; break;
                case "W85N38": sentTo = "W86N43"; break;
                case "W86N43": sentTo = "W86N39"; break;
                case "W9N45": sentTo = "W9N45"; break;
                case "W81N29": sentTo = "W81N29"; break;
                case "W72N28": sentTo = "W72N28"; break;
                case "W64N31": sentTo = "W86N29"; break;
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
            if (creep.room.name == sentFrom && _.sum(creep.carry) < creep.carryCapacity && _.get(Memory.rooms, [sentFrom, "creepMins", "exporter"], 0) > 0) {
                if (theStorage != undefined && _.sum(theStorage.store) > 0) {
                    let resourceType = _.max(_.keys(theStorage.store), (r) => (resourceWorth(r)));
                    let err = creep.withdraw(theStorage, resourceType);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                        creep.travelTo(theStorage);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                }
                else if (theTerminal != undefined && _.sum(theTerminal.store) > 0) {
                    let resourceType = _.max(_.keys(theTerminal.store), (r) => (resourceWorth(r)));
                    let err = creep.withdraw(theTerminal, resourceType);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_TERMINAL], true);
                        creep.travelTo(theTerminal);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_TERMINAL], true);
                    }
                }
                else {
                    _.set(Memory.rooms, [sentFrom, "creepMins", "exporter"], 0);
                    if (_.sum(creep.carry) == 0) {
                        creep.memory.role = "recyclable";
                        ROLES["recyclable"].run(creep);
                    }
                }
            }
            else if (creep.room.name != sentTo) {
                if (creep.memory.roomID == sentFrom) {
                    creep.memory.roomID = sentTo;
                    _.set(Memory.rooms, [sentFrom, "creepCounts", "exporter"], _.get(Memory.rooms, [sentFrom, "creepCounts", "exporter"], 1) - 1);
                    _.set(Memory.rooms, [sentTo, "creepCounts", "exporter"], _.get(Memory.rooms, [sentTo, "creepCounts", "exporter"], 0) + 1);
                }
                creep.say(ICONS["moveTo"] + sentTo, true);
                if (sentTo == "W9N45") { // NOTE: Any rooms that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.travelTo(new RoomPosition(25, 25, sentTo));
                }
            }
            else {
                creep.memory.role = "recyclable";
                ROLES["recyclable"].run(creep);
            }
        }
        else {
            creep.say("?", true);
        }
    }
};

module.exports = roleExporter;
