let roleRecyclable = {
    run: function(creep) {
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
        let recycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
        let theSpawn = Game.getObjectById(creep.memory.recycleSpawnID);
        if (theSpawn == undefined) {
            let theSpawns = _.filter(Game.spawns, (s) => (
                s.room.name == _.get(Game.rooms, creep.memory.roomID, creep.room).name
            ));
            theSpawn = creep.pos.findClosestByRange(theSpawns);
            if (theSpawn != undefined) {
                creep.memory.recycleSpawnID = theSpawn.id;
            }
        }
        
		if (_.sum(creep.carry) > 0 && theStorage != undefined) {
            for (let resourceType in creep.carry) {
                let err = creep.transfer(theStorage, resourceType, creep.carry[resourceType]);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_STORAGE], true);
                    creep.travelTo(theStorage);
                }
                else if (err == OK) {
                    creep.say(ICONS["transfer"] + ICONS[STRUCTURE_STORAGE], true);
                }
                break;
            }
        }
        else if (recycleContainer != undefined && creep.pos.isEqualTo(recycleContainer) == false) {
            creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_CONTAINER], true);
            creep.travelTo(recycleContainer);
		}
		else if (theSpawn != undefined) {
            let err = theSpawn.recycleCreep(creep);
            if (err == ERR_NOT_IN_RANGE) {
                creep.say(ICONS["moveTo"] + ICONS[STRUCTURE_SPAWN], true);
                creep.travelTo(theSpawn);
            }
            else if (err == OK) {
                creep.say(ICONS["recycle"], true);
                Memory.rooms[creep.room.name].checkForDrops = true;
            }
		}
		else {
            creep.say(ICONS[STRUCTURE_SPAWN] + "?", true);
            creep.suicide();
		}
    }
};

module.exports = roleRecyclable;
