let roleExporter = {
    run: function(creep) {
        creep.memory.executingRole = "exporter";
        
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        else if (creep.memory.working == true && _.sum(creep.carry) == 0) {
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
                case "W64N31": sentTo = "W64N31"; break;
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
            if (creep.room.name == sentFrom && creep.memory.working == false && _.get(Memory.rooms, [sentFrom, "creepMins", "exporter"], 0) > 0) {
                if (theStorage != undefined && _.sum(theStorage.store) > 0 && theStorage.my == false) {
                    let resourceType = _.max(_.keys(theStorage.store), (r) => (resourceWorth(r)));
                    let err = creep.withdraw(theStorage, resourceType);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theStorage);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                    }
                    else if (err == OK) {
                        creep.say(ICONS["withdraw"] + ICONS[STRUCTURE_STORAGE], true);
                    }
                }
                else if (theTerminal != undefined && _.sum(theTerminal.store) > 0 && theTerminal.my == false) {
                    let resourceType = _.max(_.keys(theTerminal.store), (r) => (resourceWorth(r)));
                    let err = creep.withdraw(theTerminal, resourceType);
                    if (err == ERR_NOT_IN_RANGE) {
                        creep.travelTo(theTerminal);
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
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
                if (sentTo == "W9N45") { // NOTE: Any rooms that require waypoints to get to should be added here
                    ROLES["scout"].run(creep);
                }
                else {
                    creep.say(travelToIcons(creep) + sentTo, true);
                    creep.travelTo(new RoomPosition(25, 25, sentTo));
                }
            }
            else if (sentFrom == sentTo) {
                if (_.sum(creep.carry) > creep.carry.energy) {
                    ROLES["hoarder"].run(creep);
                }
        		else if (_.sum(creep.carry) > 0) { 
                    if (theStorage != undefined 
                        && _.sum(theStorage.store) < theStorage.storeCapacity 
                        && theStorage.my == true) {
                        for (let resourceType in creep.carry) {
                            let err = creep.transfer(theStorage, resourceType, creep.carry[resourceType]);
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(theStorage);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_STORAGE], true);
                                break;
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                                break;
                            }
                        }
                    }
                    else if (theTerminal != undefined 
                        && _.sum(theTerminal.store) < theTerminal.storeCapacity 
                        && theTerminal.my == true) {
                        for (let resourceType in creep.carry) {
                            let err = creep.transfer(theTerminal, resourceType, creep.carry[resourceType]);
                            if (err == ERR_NOT_IN_RANGE) {
                                creep.travelTo(theTerminal);
                                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_TERMINAL], true);
                                break;
                            }
                            else if (err == OK) {
                                creep.say(ICONS["transfer"] + ICONS[STRUCTURE_TERMINAL], true);
                                break;
                            }
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
                else {
                    _.set(Memory.rooms, [sentFrom, "creepMins", "exporter"], 0);
                    if (_.sum(creep.carry) == 0) {
                        creep.memory.role = "recyclable";
                        ROLES["recyclable"].run(creep);
                    }
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
