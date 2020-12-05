let roleDemolisher = {
    run: function(creep) {
        creep.memory.executingRole = "demolisher";
        
        if (creep.memory.working == false && creep.carryTotal == (creep.carryCapacity || -1)) {
            creep.memory.working = true;
            creep.memory.demolishStructure = undefined;
            creep.memory.waypoint = 0; // TODO: Ensure waypoints reset when at destination in called roles
        }
        else if (creep.memory.working == true && creep.carry[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.memory.depositStructureID = undefined; // can be a harvester when working
            creep.memory.waypoint = 0; // TODO: Ensure waypoints reset when at destination in called roles
        }
        
        let sentTo = creep.memory.roomSentTo;
        if (_.isString(sentTo) == false 
            || creep.memory.roomSentFrom != undefined) {
            creep.memory.roomSentFrom = undefined;
            sentTo = _.get(Memory.rooms, [creep.memory.roomID, "harvestRooms", 0], undefined);
            if (_.isString(sentTo) == true) {
                creep.memory.roomSentTo = sentTo;
            }
            else {
                sentTo = undefined;
            }
        }
        
        if (creep.memory.working == false 
            && (sentTo == undefined 
                || _.get(Memory.rooms, [sentTo, "avoidTravelUntil"], 0) < Game.time)) {
            if (sentTo != undefined) {
                let demoTarget = Game.getObjectById(_.get(creep.memory, ["demolishStructure", "id"], undefined));
                let demolishStructurePos = _.get(creep.memory, ["demolishStructure", "pos"], undefined);
                if (demoTarget == undefined 
                    || creep.room.name != sentTo) {
                    if (_.isString(_.get(demolishStructurePos, ["roomName"], undefined)) 
                        && (demolishStructurePos.roomName != creep.room.name)) {
                        creep.travelTo(RoomPositionFromObject(demolishStructurePos));
                        creep.say(travelToIcons(creep) + demolishStructurePos.roomName, true);
                        return;
                    }
                    
                    if (creep.room.name != sentTo) {
                        if (false) { // NOTE: Any rooms that require waypoints to get to should be added here
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
                    
                    creep.room.checkForDrops = (creep.room.dangerZones.length > 0) ? true : false;
                    
                    if (demoTarget == undefined) {
                        if (_.isString(_.get(creep.memory.demolishStructure, "id", undefined)) == true) {
                            let err = _.invoke(Game.rooms[sentTo].find(FIND_FLAGS, { filter: (f) => (
                                f.color == COLOR_BLUE 
                                && (f.secondaryColor == COLOR_RED 
                                    || f.secondaryColor == COLOR_YELLOW) 
                                && _.get(f.name.split("_"), 2, undefined) === creep.memory.demolishStructure.id
                            ) }), function() {
                                _.set(Memory.rooms, [_.first(this.name.split("_")), "creepMins", "demolisher"], 0);
                                return this.remove();
                            });
                            if (_.any(err, (e) => (e === 0)) == true) {
                                console.log("Finished demolishing " + creep.memory.demolishStructure.id + " in " + sentTo);
                                Game.notify("Finished demolishing " + creep.memory.demolishStructure.id + " in " + sentTo, 60);
                            }
                        }
                        creep.memory.demolishStructure = undefined;
                        
                        demoTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, { filter: (cs) => (
                            _.get(cs, "my", false) == false 
                            && _.some(_.difference(Memory.nonAggressivePlayers, [SYSTEM_USERNAME]), _.get(cs, ["owner", "username"], "")) == false 
                            && cs.structureType != STRUCTURE_ROAD 
                            && cs.structureType != STRUCTURE_CONTAINER
                        )});
                    }
                    
                    if (demoTarget == undefined) {
                        demoTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => (
                            _.get(s, "my", false) == false 
                            && _.some(_.difference(Memory.nonAggressivePlayers, [SYSTEM_USERNAME]), _.get(s, ["owner", "username"], "")) == false 
                            && s.structureType != STRUCTURE_ROAD 
                            && s.structureType != STRUCTURE_CONTAINER
                            && s.structureType != STRUCTURE_PORTAL 
                            && s.structureType != STRUCTURE_CONTROLLER 
                            && s.structureType != STRUCTURE_KEEPER_LAIR 
                            && s.structureType != STRUCTURE_POWER_BANK 
                            && (s.structureType != STRUCTURE_RAMPART 
                                || s.isPublic == false)
                            && _.sum(_.get(s, ["store"], { [RESOURCE_ENERGY]: 0 })) == 0 
                            && _.get(s, ["energy"], 0) == 0
                            && _.get(s, ["hits"], 0) > 0
                        )});
                    }
                    
                    if (demoTarget != undefined) {
                        creep.memory.demolishStructure = { 
                            id: demoTarget.id
                            , pos: demoTarget.pos
                        };
                    }
                } else if (demolishStructurePos == undefined 
                    && creep.room.name == sentTo) {
                    creep.memory.demolishStructure = { 
                        id: demoTarget.id
                        , pos: demoTarget.pos
                    };
                }
                
                if (demoTarget != undefined) {
                    if (demoTarget instanceof ConstructionSite) {
                        creep.travelTo(demoTarget, { range: 0 });
                        creep.say(travelToIcons(creep) + ICONS["dismantle"] + ICONS["constructionSite"], true);
                    }
                    else {
                        let err = creep.dismantle(demoTarget);
                        if(err == ERR_NOT_IN_RANGE) {
                            creep.travelTo(demoTarget);
                            creep.say(travelToIcons(creep) + ICONS["dismantle"] + ICONS[demoTarget.structureType], true);
                        }
                        else if (err == OK) {
                            creep.say(ICONS["dismantle"] + ICONS[demoTarget.structureType], true);
                        }
                    }
                }
                else if (creep.memory.role == "demolisher") {
                    creep.say(ICONS["dismantle"] + "?", true);
                    _.invoke(Game.rooms[sentTo].find(FIND_FLAGS, { filter: (f) => (
                        f.color == COLOR_BLUE 
                        && (f.secondaryColor == COLOR_RED 
                            || f.secondaryColor == COLOR_YELLOW)
                    ) }), function() {
                        _.set(Memory.rooms, [_.first(this.name.split("_")), "creepMins", "demolisher"], 0);
                        return this.remove();
                    });
                    console.log("Finished demolishing " + sentTo);
                    Game.notify("Finished demolishing " + sentTo, 60);
                    if (creep.carryCapacity > 0) {
                        creep.memory.role = "harvester";
                    }
                    else {
                        creep.memory.role = "recyclable";
                    }
                }
                else {
                    if (creep.carryCapacity > 0) {
                        ROLES["harvester"].run(creep);
                    }
                    else {
                        incrementConfusedCreepCount(creep);
                        creep.say(ICONS["dismantle"] + "?", true);
                    }
                    return;
                }
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say("?", true);
            }
        }
        else {
            if (creep.room.name != creep.memory.roomID 
                && false) {
                ROLES["scout"].run(creep);
            }
            else if (creep.carryCapacity > 0) {
                ROLES["harvester"].run(creep);
            }
            else if (Game.time < _.get(Memory.rooms, [sentTo, "avoidTravelUntil"], 0)) {
                ROLES["recyclable"].run(creep);
                creep.memory.role = "recyclable";
            }
            else {
                incrementConfusedCreepCount(creep);
                creep.say(ICONS["dismantle"] + "?", true);
            }
        }
    }
};

module.exports = roleDemolisher;
