var roleAttacker = {
    run: function(creep) {
        if (creep.room.name != creep.memory.roomID) {
            creep.say("\u27A1" + creep.memory.roomID, true);
            creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
            return;
        }
        
        // TODO: Automate based on ramparts with no building under them near attackers
        if (creep.room.name == "W53N32") {
            var entrances = [
                { x: 2, y: 8 } // TODO: Update this position
            ];
            for (let i = 0; i < entrances.length; ++i) {
            	if (creep.pos.isEqualTo(entrances[i].x, entrances[i].y)) {
                    break;
                }
                if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                    creep.say("\u27A1\uD83D\uDEA7", true);
                    creep.moveTo(new RoomPosition(entrances[i].x, entrances[i].y, "W53N32"));
                    return;
                }
            }
        }
        
        var invader = Game.getObjectById(creep.memory.invaderID);
        if (invader == undefined) {
            
            // TODO: Change this to only consider invaders in melee range
            var invaders = _.get(Memory.rooms[creep.room.name], ["invaderWeightings"], undefined);
            if (invaders != undefined) {
                invader = _.sortBy(invaders, (i) => (
                    i.weighting
                ))[invaders.length - 1];
            }
            
            if (invader == undefined) {
                invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS); // TODO: Only include NPCs (since that is the only time this should run, but allies still need to be filtered out)
            }
            
            if (invader != undefined) {
                creep.memory.invaderID = invader.id;
            }
            else {
                creep.memory.invaderID = undefined;
            }
        }
        
        if (invader != undefined) {
            var err = creep.attack(invader);
            if (err == ERR_NOT_IN_RANGE) {
                // NOTE: Shouldn't need to move, just hold ground in the rampart
                //creep.say("\u27A1\uD83D\uDDE1", true);
                //creep.moveTo(invader);
            }
            else if (err == OK) {
                creep.say("\uD83D\uDDE1", true);
            }
        }
        else {
            var structure = Game.getObjectById(creep.memory.structureID);
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
                var err = creep.attack(structure);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say("\u27A1\uD83D\uDDE1", true);
                    creep.moveTo(structure);
                }
                else if (err == OK) {
                    creep.say("\uD83D\uDDE1", true);
                }
            }
            else if (creep.room.name == "W53N32") { // TODO: Automate based on ramparts with no building under them near attackers
                var entrances = [
                    { x: 2, y: 8 } // TODO: Update this position
                ];
                for (let i = 0; i < entrances.length; ++i) {
                	if (creep.pos.isEqualTo(entrances[i].x, entrances[i].y)) {
                        break;
                    }
                    if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                        creep.say("\u27A1\uD83D\uDEA7", true);
                        creep.moveTo(new RoomPosition(entrances[i].x, entrances[i].y, "W53N32"));
                        break;
                    }
                }
            }
            else {
                creep.room.memory.creepMins.attacker = 0;
            }
        }
        
		// TODO: Recycle attacker once threat eliminated
    }
};

module.exports = roleAttacker;
