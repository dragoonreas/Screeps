let roleAttacker = {
    run: function(creep) {
        creep.memory.executingRole = "attacker";
        
        /*if (creep.room.name != creep.memory.roomID) { // TODO: Allow attacker to move in and out of the room if required
            creep.travelTo(new RoomPosition(25, 25, creep.memory.roomID), {
                allowHostile: true
                , ignoreHostileCreeps: true
                , range: 23
            });
            creep.say(travelToIcons(creep) + creep.memory.roomID, true);
            return;
        }*/
        
        // TODO: Automate based on ramparts with no building under them near attackers
        /*
        if (creep.room.name == "W86N29") {
            let entrances = [
                { x: 32, y: 7 } // TODO: Update this position
            ];
            for (let i = 0; i < entrances.length; ++i) {
                if (creep.pos.isEqualTo(entrances[i].x, entrances[i].y)) {
                    break;
                }
                if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                    creep.travelTo(new RoomPosition(entrances[i].x, entrances[i].y, "W86N29"), {
                        allowHostile: true
                        , ignoreHostileCreeps: true
                    });
                    creep.say(travelToIcons(creep) + ICONS[STRUCTURE_RAMPART], true);
                    return;
                }
            }
        }
        */
        let invader = Game.getObjectById(creep.memory.invaderID);
        if (invader == undefined) {
            
            // TODO: Change this to only consider invaders in melee range
            /*let invaders = _.get(Memory.rooms[creep.room.name], ["invaderWeightings"], {});
            if (_.size(invaders) > 0) {
                //invader = _.findKey(invaders, _.max(invaders, "weighting")); // TODO: Check that this works
            }*/
            invader = Game.getObjectById(creep.room.priorityTargetID);
            
            if (invader == undefined) {
                invader = creep.pos.findClosestByRange(FIND_HOSTILE_POWER_CREEPS, {
                    filter: (i) => (_.includes(Memory.nonAgressivePlayers, i.owner.username) == false
                )});
            }
            
            if (invader == undefined) {
                invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
                    filter: (i) => (_.includes(Memory.nonAgressivePlayers, i.owner.username) == false
                )});
            }
            
            if (invader != undefined) {
                creep.memory.invaderID = invader.id;
            }
            else {
                creep.memory.invaderID = undefined;
            }
        }
        
        if (invader != undefined) {
            let err = creep.attack(invader);
            if (err == ERR_NOT_IN_RANGE) { // TODO: Make creep stay in rampart closest to invader
                creep.travelTo(invader, {
                    allowHostile: true
                    , ignoreHostileCreeps: true
                });
                creep.say(travelToIcons(creep) + ICONS["attack"] + ICONS["creep"], true);
            }
            else if (err == OK) {
                creep.say(ICONS["attack"] + ICONS["creep"], true);
            }
            else if (err == ERR_NO_BODYPART) {
                ROLES["recyclable"].run(creep);
            }
        }
        else {
            let structure = Game.getObjectById(creep.memory.structureID);
            if (structure == undefined) {
                structure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                    filter: { structureType: STRUCTURE_INVADER_CORE, level: 0 }
                }); // TODO: Add extra checks for if the stucture has energy or minerals in it
                if (structure != undefined) {
                    creep.memory.structureID = structure.id;
                }
                else {
                    creep.memory.structureID = undefined;
                }
            }
            
            if (structure != undefined) {
                let err = creep.attack(structure);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(structure, {
                        allowHostile: true
                        , ignoreHostileCreeps: true
                    });
                    creep.say(travelToIcons(creep) + ICONS["attack"] + _.get(ICONS, structure.structureType, "?"), true);
                }
                else if (err == OK) {
                    creep.say(ICONS["attack"] + _.get(ICONS, structure.structureType, "?"), true);
                }
                else if (err == ERR_NO_BODYPART) {
                    ROLES["recyclable"].run(creep);
                }
            }/*
            else if (creep.room.name == "W86N29") { // TODO: Automate based on ramparts with no building under them near attackers
                let entrances = [
                    { x: 32, y: 7 } // TODO: Update this position
                ];
                for (let i = 0; i < entrances.length; ++i) {
                    if (creep.pos.isEqualTo(entrances[i].x, entrances[i].y)) {
                        break;
                    }
                    if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                        creep.travelTo(new RoomPosition(entrances[i].x, entrances[i].y, "W86N29"){
                            allowHostile: true
                            , ignoreHostileCreeps: true
                        });
                        creep.say(travelToIcons(creep) + ICONS[STRUCTURE_RAMPART], true);
                        break;
                    }
                }
            }*/
            else {
                let creepMins = _.get(Memory.rooms, [_.get(creep.memory, ["roomID"], creep.room), "creepMins"], undefined);
                if (creepMins != undefined) {
                    _.set(creepMins, ["attacker"], 0);
                }
                //creep.say(ICONS["attack"] + "?", true);
                ROLES["recyclable"].run(creep);
            }
        }
    }
};

module.exports = roleAttacker;
