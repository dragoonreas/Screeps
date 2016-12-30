// TODO: Add emoji speech for this creep role
var roleAttacker = {
    
    run: function(creep) {
        if (creep.room.name != creep.memory.roomID) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.roomID));
            return;
        }
        
        // TODO: Get hostile info from global memory, after main loop has been setup to supply it
        var invader = Game.getObjectById(creep.memory.invaderID);
        if (invader == undefined) {
            invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
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
                creep.say("\u27A1\1F5E1");
                creep.moveTo(invader);
            }
            else if (err == OK) {
                creep.say("\1F5E1");
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
                    creep.say("\u27A1\1F5E1");
                    creep.moveTo(structure);
                }
                else if (err == OK) {
                    creep.say("\1F5E1");
                }
            }
            else if (creep.room.name == "E68N45") {
                var entrances = [
					{ x: 12, y: 30 }
                    , { x: 25, y: 5 }
                    , { x: 36, y: 5 }
                    , { x: 45, y: 7 }
                    , { x: 39, y: 27 }
                ];
                for (let i = 0; i < entrances.length; ++i) {
                	if (creep.pos.x == entrances[i].x && creep.pos.y == entrances[i].y) {
                        break;
                    }
                    if (creep.room.lookForAt(LOOK_CREEPS, entrances[i].x, entrances[i].y).length == 0) {
                        creep.say("\u27A1\u1f6a7");
                        creep.moveTo(new RoomPosition(entrances[i].x, entrances[i].y, "E68N45"));
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
