let roleRockhound = {
    run: function(creep) {
        creep.memory.executingRole = "rockhound";
        
        if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
            creep.memory.waypoint = 0; // TODO: Ensure waypoints reset when at destination in called roles
        }
        else if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.depositStructureID = undefined; // can be a harvester when working
            creep.memory.waypoint = 0; // TODO: Ensure waypoints reset when at destination in called roles
        }
        
        let sentFrom = (creep.memory.roomSentFrom || creep.memory.roomID);
        if (_.isString(creep.memory.roomSentFrom) == false) {
            creep.memory.roomSentFrom = sentFrom;
        }
        
        let sentTo = (creep.memory.roomSentTo || creep.memory.roomID);
        if (_.isString(creep.memory.roomSentTo) == false) {
            creep.memory.roomSentTo = sentTo;
        }
        
        if (creep.memory.working == false && (sentTo == undefined || _.get(Memory.rooms, [sentTo, "avoidTravelUntil"], 0) < Game.time)) {
            if (sentTo != undefined) {
                let theMineral = Game.getObjectById(_.get(creep.memory, ["mineral", "id"], undefined));
                if (theMineral == undefined 
                    || theMineral.mineralAmount == 0) {
                    
                    let mineralPos = _.get(creep.memory, ["mineral", "pos"], undefined);
                    if (_.isString(_.get(mineralPos, ["roomName"], undefined)) 
                        && (mineralPos.roomName != creep.room.name) 
                        && _.get(theMineral, ["mineralAmount"], 1) > 0) {
                        creep.travelTo(_.create(RoomPosition.prototype, mineralPos));
                        creep.say(travelToIcons(creep) + mineralPos.roomName, true);
                        return;
                    }
                    
                    creep.memory.mineral = undefined;
                    creep.memory.extractor = undefined;
                    
                    if (creep.room.name != sentTo) {
                        if (sentTo == "") { // NOTE: Any rooms that require waypoints to get to should be added here
                            ROLES["scout"].run(creep);
                        }
                        else {
                            creep.travelTo(new RoomPosition(25, 25, sentTo), {
                                range: 23
                            });
                            creep.say(travelToIcons(creep) + sentTo, true);
                        }
                        return;
                    }
                    
                    theMineral = _.first(creep.room.find(FIND_MINERALS, { filter: (m) => (
                        m.mineralAmount > 0
                    )}));
                    
                    if (theMineral != undefined) {
                        creep.memory.mineral = { 
                            id: theMineral.id
                            , pos: theMineral.pos
                        };
                    }
                }
                
                let theExtractor = Game.getObjectById(_.get(creep.memory, ["extractor", "id"], undefined));
                if (theMineral != undefined 
                    && (theExtractor == undefined 
                        || (_.get(theExtractor, ["owner", "username"], undefined) !== undefined 
                            && (_.get(theExtractor, ["room", "controller", "my"], false) == false 
                                || _.get(theExtractor, ["room", "controller", "level"], 0) < _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_EXTRACTOR], (v) => (v > 0)))))) {
                    if (theExtractor != undefined) {
                        if (theMineral.pos.isEqualTo(theExtractor.pos)) {
                            theMineral = undefined;
                        }
                        
                        theExtractor = undefined;
                    }
                    
                    if (theMineral != undefined) {
                        theExtractor = _.first(_.filter(theMineral.pos.lookFor(LOOK_STRUCTURES), (s) => (
                            s.structureType == STRUCTURE_EXTRACTOR 
                            && (_.get(s, ["owner", "username"], undefined) === undefined 
                                || (_.get(s, ["room", "controller", "my"], false) == true 
                                    && _.get(s, ["room", "controller", "level"], 0) >= _.findKey(CONTROLLER_STRUCTURES[STRUCTURE_EXTRACTOR], (v) => (v > 0))))
                        )));
                    }
                    
                    if (theExtractor != undefined) {
                        creep.memory.extractor = { 
                            id: theExtractor.id
                            , pos: theExtractor.pos
                        };
                    }
                }
                
                if (theExtractor != undefined) {
                    if (theExtractor.cooldown == 0) {
                        let err = creep.harvest(theMineral);
                        if(err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(theMineral);
                            creep.say(travelToIcons(creep) + ICONS["harvest"], true);
                        }
                        else if (err == OK) {
                            creep.say(ICONS["harvest"], true);
                        }
                        else {
                            incrementConfusedCreepCount(creep);
                            creep.say("?", true);
                        }
                    }
                    else {
                        incrementIdleCreepCount(creep);
                        switch (creep.saying) {
                            case ICONS["wait0"] + ICONS["harvest"]: creep.say(ICONS["wait1"] + ICONS["harvest"], true); break;
                            case ICONS["wait1"] + ICONS["harvest"]: creep.say(ICONS["wait2"] + ICONS["harvest"], true); break;
                            case ICONS["wait2"] + ICONS["harvest"]: creep.say(ICONS["wait3"] + ICONS["harvest"], true); break;
                            case ICONS["wait3"] + ICONS["harvest"]: creep.say(ICONS["wait4"] + ICONS["harvest"], true); break;
                            case ICONS["wait4"] + ICONS["harvest"]: creep.say(ICONS["wait5"] + ICONS["harvest"], true); break;
                            case ICONS["wait5"] + ICONS["harvest"]: creep.say(ICONS["wait6"] + ICONS["harvest"], true); break;
                            case ICONS["wait6"] + ICONS["harvest"]: creep.say(ICONS["wait7"] + ICONS["harvest"], true); break;
                            case ICONS["wait7"] + ICONS["harvest"]: creep.say(ICONS["wait8"] + ICONS["harvest"], true); break;
                            case ICONS["wait8"] + ICONS["harvest"]: creep.say(ICONS["wait9"] + ICONS["harvest"], true); break;
                            case ICONS["wait9"] + ICONS["harvest"]: creep.say(ICONS["wait10"] + ICONS["harvest"], true); break;
                            case ICONS["wait10"] + ICONS["harvest"]: creep.say(ICONS["wait11"] + ICONS["harvest"], true); break;
                            case ICONS["wait11"] + ICONS["harvest"]: creep.say(ICONS["wait12"] + ICONS["harvest"], true); break;
                            case ICONS["wait12"] + ICONS["harvest"]: creep.say(ICONS["wait13"] + ICONS["harvest"], true); break;
                            case ICONS["wait13"] + ICONS["harvest"]: creep.say(ICONS["wait14"] + ICONS["harvest"], true); break;
                            case ICONS["wait14"] + ICONS["harvest"]: creep.say(ICONS["wait15"] + ICONS["harvest"], true); break;
                            case ICONS["wait15"] + ICONS["harvest"]: creep.say(ICONS["wait16"] + ICONS["harvest"], true); break;
                            case ICONS["wait16"] + ICONS["harvest"]: creep.say(ICONS["wait17"] + ICONS["harvest"], true); break;
                            case ICONS["wait17"] + ICONS["harvest"]: creep.say(ICONS["wait18"] + ICONS["harvest"], true); break;
                            case ICONS["wait18"] + ICONS["harvest"]: creep.say(ICONS["wait19"] + ICONS["harvest"], true); break;
                            case ICONS["wait19"] + ICONS["harvest"]: creep.say(ICONS["wait20"] + ICONS["harvest"], true); break;
                            case ICONS["wait20"] + ICONS["harvest"]: creep.say(ICONS["wait21"] + ICONS["harvest"], true); break;
                            case ICONS["wait21"] + ICONS["harvest"]: creep.say(ICONS["wait22"] + ICONS["harvest"], true); break;
                            case ICONS["wait22"] + ICONS["harvest"]: creep.say(ICONS["wait23"] + ICONS["harvest"], true); break;
                            default: creep.say(ICONS["wait0"] + ICONS["harvest"], true);
                        }
                    }
                }
                else if (creep.memory.role == "rockhound") {
                    creep.say(ICONS["harvest"] + "?", true);
                    _.set(Memory.rooms, [creep.memory.roomID, "creepMins", "rockhound"],  0);
                    creep.memory.role = "harvester";
                }
                else {
                    ROLES["harvester"].run(creep);
                    return;
                }
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say("?", true);
            }
        }
        else {
            if (creep.carry[RESOURCE_ENERGY] != _.sum(creep.carry)) {
                ROLES["hoarder"].run(creep);
            }
            else if (creep.carry[RESOURCE_ENERGY] > 0) {
                ROLES["harvester"].run(creep);
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say("?", true);
            }
        }
    }
};

module.exports = roleRockhound;
