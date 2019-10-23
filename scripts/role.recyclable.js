let roleRecyclable = {
    run: function(creep) {
        creep.memory.executingRole = "recyclable";
        
        let theStorage = _.get(Game.rooms, [creep.memory.roomID, "storage"], undefined);
        let recycleContainer = _.get(Game.rooms, [creep.memory.roomID, "recycleContainer"], undefined);
        let theSpawn = Game.getObjectById(creep.memory.recycleSpawnID);
        if (theSpawn == undefined) {
            let theSpawns = _.filter(Game.spawns, (s) => (
                s.room.name == _.get(Game.rooms, [creep.memory.roomID], creep.room).name
            ));
            if (recycleContainer != undefined) {
                theSpawn = _.first(recycleContainer.pos.findInRange(theSpawns, 1));
            }
            if (theSpawn == undefined) {
                theSpawn = creep.pos.findClosestByRange(theSpawns);
            }
            if (theSpawn != undefined) {
                creep.memory.recycleSpawnID = theSpawn.id;
            }
        }
        
        if (creep.carryTotal > 0 
            && theStorage != undefined 
            && _.sum(theStorage.store) < theStorage.storeCapacity 
            && theStorage.my == true 
            && _.get(Memory.rooms, [creep.memory.roomID, "isShuttingDown"], false) == false) {
            for (let resourceType in creep.carry) {
                let err = creep.transfer(theStorage, resourceType, Math.min(creep.carry[resourceType], (theStorage.storeCapacity - _.sum(theStorage.store))));
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
        else if (recycleContainer != undefined 
            && theSpawn != undefined 
            && recycleContainer.pos.isNearTo(theSpawn) 
            && creep.pos.isEqualTo(recycleContainer) == false) {
            creep.travelTo(recycleContainer);
            creep.say(travelToIcons(creep) + ICONS[STRUCTURE_CONTAINER], true);
        }
        else if (theSpawn != undefined) {
            let err = theSpawn.recycleCreep(creep);
            if (err == ERR_NOT_IN_RANGE) {
                creep.travelTo(theSpawn);
                creep.say(travelToIcons(creep) + ICONS[STRUCTURE_SPAWN], true);
            }
            else if (err == OK) {
                creep.say(ICONS["recycle"], true);
                Memory.rooms[creep.room.name].checkForDrops = true;
            }
        }
        else {
            incrementConfusedCreepCount(creep);
            creep.say(ICONS[STRUCTURE_SPAWN] + "?", true);
            creep.suicide();
        }
    }
};

module.exports = roleRecyclable;
