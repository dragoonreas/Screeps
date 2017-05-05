let roleAttacker = {
    run: function(creep) {
        if (creep.room.name != creep.memory.roomID) { // TODO: Allow attacker to move in and out of the room if required
            creep.say(ICONS["moveTo"] + creep.memory.roomID, true);
            creep.travelTo(new RoomPosition(25, 25, creep.memory.roomID), {
                allowHostile: true
                , ignoreHostileCreeps: true
            });
            return;
        }
        
        // TODO: Automate based on ramparts with no building under them near attackers
        /*
        if (creep.room.name == "W87N29") {
            let entrances = [
                { x: 32, y: 7 } // TODO: Update this position
            ];
            for (let i = 0; i < entrances.length; ++i) {
            	if (creep.pos.isEqualTo(entrances[i].x, entrances[i].y)) {
                    break;
                }
                if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_RAMPART], true);
                    creep.travelTo(new RoomPosition(entrances[i].x, entrances[i].y, "W87N29"), {
                        allowHostile: true
                        , ignoreHostileCreeps: true
                    });
                    return;
                }
            }
        }
        */
        let invader = Game.getObjectById(creep.memory.invaderID);
        if (invader == undefined) {
            
            // TODO: Change this to only consider invaders in melee range
            let invaders = _.get(Memory.rooms[creep.room.name], ["invaderWeightings"], {});
            if (_.size(invaders) > 0) {
                //invader = _.findKey(invaders, _.max(invaders, "weighting")); // TODO: Check that this works
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
                creep.say(ICONS["moveTo"] + ICONS["attack"] + ICONS["creep"], true);
                creep.travelTo(invader, {
                    allowHostile: true
                    , ignoreHostileCreeps: true
                });
            }
            else if (err == OK) {
                creep.say(ICONS["attack"] + ICONS["creep"], true);
            }
        }
        else {
            let structure = Game.getObjectById(creep.memory.structureID);
            if (structure == undefined) {
                structure = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
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
                    creep.say(ICONS["moveTo"] + ICONS["attack"] + _.get(ICONS, structure.structureType, "?"), true);
                    creep.travelTo(structure, {
                        allowHostile: true
                        , ignoreHostileCreeps: true
                    });
                }
                else if (err == OK) {
                    creep.say(ICONS["attack"] + _.get(ICONS, structure.structureType, "?"), true);
                }
            }/*
            else if (creep.room.name == "W87N29") { // TODO: Automate based on ramparts with no building under them near attackers
                let entrances = [
                    { x: 32, y: 7 } // TODO: Update this position
                ];
                for (let i = 0; i < entrances.length; ++i) {
                	if (creep.pos.isEqualTo(entrances[i].x, entrances[i].y)) {
                        break;
                    }
                    if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                        creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_RAMPART], true);
                        creep.travelTo(new RoomPosition(entrances[i].x, entrances[i].y, "W87N29"){
                            allowHostile: true
                            , ignoreHostileCreeps: true
                        });
                        break;
                    }
                }
            }*/
            else {
                creep.room.memory.creepMins.attacker = 0;
                //creep.say(ICONS["attack"] + "?", true);
                ROLES["recyclable"].run(creep);
            }
        }
    }
};

module.exports = roleAttacker;
