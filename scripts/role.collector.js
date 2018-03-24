let roleCollector = {
    run: function(creep) {
        creep.memory.executingRole = "collector";
        
        if (creep.memory.droppedResource != undefined) {
            let droppedResource = Game.getObjectById(creep.memory.droppedResource.id);
            let droppedResourcePos = _.get(creep.memory, ["droppedResource", "pos"], undefined);
            if (droppedResource == undefined) {
                if (creep.room.name != _.get(droppedResourcePos, ["roomName"], creep.room.name)) {
                    creep.travelTo(_.create(RoomPosition.prototype, droppedResourcePos));
                    creep.say(travelToIcons(creep) + droppedResourcePos.roomName, true);
                }
                else {
                    console.log(creep.name + " failed to pickup the dropped resources in " + creep.room.name);
                    creep.memory.droppedResource = undefined;
                    Memory.rooms[creep.room.name].checkForDrops = true;
                    creep.say(ICONS["resource"] + "?", true);
                }
            }
            else if (creep.pickup(droppedResource) == ERR_NOT_IN_RANGE) {
                creep.travelTo(droppedResource);
                creep.say(travelToIcons(creep) + ICONS["resource"], true);
            }
            else {
                console.log(creep.name + " picked up " + Math.min(droppedResource.amount, creep.carryCapacityAvailable) + " of " + droppedResource.amount + " dropped " + droppedResource.resourceType + " in " + droppedResource.room.name);
                creep.memory.droppedResource = undefined;
                Memory.rooms[creep.room.name].checkForDrops = true;
                creep.say(ICONS["pickup"] + ICONS["resource"], true);
            }
        }
        else if (creep.memory.tombstone != undefined) {
            let tombstone = Game.getObjectById(creep.memory.tombstone.id);
            let tombstonePos = _.get(creep.memory, ["tombstone", "pos"], undefined);
            if (tombstone == undefined) {
                if (creep.room.name != _.get(tombstonePos, ["roomName"], creep.room.name)) {
                    creep.travelTo(_.create(RoomPosition.prototype, tombstonePos));
                    creep.say(travelToIcons(creep) + tombstonePos.roomName, true);
                }
                else {
                    console.log(creep.name + " failed to pickup the resources from tombstone in " + creep.room.name);
                    creep.memory.tombstone = undefined;
                    Memory.rooms[creep.room.name].checkForDrops = true;
                    creep.say(ICONS["tombstone"] + "?", true);
                }
            }
            else {
                let resourceType = _.max(_.keys(tombstone.store), (r) => (resourceWorth(r)));
                if (creep.withdraw(tombstone, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tombstone);
                    creep.say(travelToIcons(creep) + ICONS["tombstone"], true);
                }
                else {
                    toStr(tombstone.store);
                    let amountPickedUp = Math.min(tombstone.store[resourceType], creep.carryCapacityAvailable);
                    console.log(creep.name + " picked up " + amountPickedUp + " " + resourceType + " of " + _.sum(tombstone.store) + " resources from tombstone of " + tombstone.creep.name + " in " + tombstone.room.name);
                    creep.say(ICONS["withdraw"] + ICONS["tombstone"], true);
                    if (((_.sum(tombstone.store) - amountPickedUp) == 0) 
                        || ((creep.carryTotal + amountPickedUp) == creep.carryCapacity)) {
                        creep.memory.tombstone = undefined;
                        Memory.rooms[creep.room.name].checkForDrops = true;
                    }
                }
            }
        }
    }
};

module.exports = roleCollector;
