let roleCollector = {
    run: function(creep) {
        creep.memory.executingRole = "collector";
        
        if (creep.memory.droppedResource != undefined) {
            let droppedResource = Game.getObjectById(creep.memory.droppedResource.id);
            let droppedResourcePos = _.get(creep.memory, ["droppedResource", "pos"], undefined);
            if (droppedResource == undefined) {
                if (creep.room.name != _.get(droppedResourcePos, ["roomName"], creep.room.name)) {
                    creep.travelTo(RoomPositionFromObject(droppedResourcePos));
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
                    creep.travelTo(RoomPositionFromObject(tombstonePos));
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
                if (_.sum(_.get(Game.rooms, [creep.memory.roomID, "recycleContainer", "store"], [CONTAINER_CAPACITY])) >= CONTAINER_CAPACITY 
                    && _.sum(_.get(Game.rooms, [creep.memory.roomID, "storage", "store"], [STORAGE_CAPACITY])) >= STORAGE_CAPACITY 
                    && _.sum(_.get(Game.rooms, [creep.memory.roomID, "terminal", "store"], [TERMINAL_CAPACITY])) >= TERMINAL_CAPACITY) {
                    resourceType = RESOURCE_ENERGY;
                }
                let err = creep.withdraw(tombstone, resourceType);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(tombstone);
                    creep.say(travelToIcons(creep) + ICONS["tombstone"], true);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    console.log(creep.name + " failed to pickup " + resourceType + " from tombstone in " + creep.room.name);
                    creep.memory.tombstone = undefined;
                    Memory.rooms[creep.room.name].checkForDrops = true;
                    creep.say(ICONS["tombstone"] + "?", true);
                }
                else {
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
        else if (creep.memory.ruin != undefined) {
            let ruin = Game.getObjectById(creep.memory.ruin.id);
            let ruinPos = _.get(creep.memory, ["ruin", "pos"], undefined);
            if (ruin == undefined) {
                if (creep.room.name != _.get(ruinPos, ["roomName"], creep.room.name)) {
                    creep.travelTo(RoomPositionFromObject(ruinPos));
                    creep.say(travelToIcons(creep) + ruinPos.roomName, true);
                }
                else {
                    console.log(creep.name + " failed to pickup the resources from ruin in " + creep.room.name);
                    creep.memory.ruin = undefined;
                    Memory.rooms[creep.room.name].checkForDrops = true;
                    creep.say(ICONS["ruin"] + "?", true);
                }
            }
            else {
                let resourceType = _.max(_.keys(ruin.store), (r) => (resourceWorth(r)));
                if (_.sum(_.get(Game.rooms, [creep.memory.roomID, "recycleContainer", "store"], [CONTAINER_CAPACITY])) >= CONTAINER_CAPACITY 
                    && _.sum(_.get(Game.rooms, [creep.memory.roomID, "storage", "store"], [STORAGE_CAPACITY])) >= STORAGE_CAPACITY 
                    && _.sum(_.get(Game.rooms, [creep.memory.roomID, "terminal", "store"], [TERMINAL_CAPACITY])) >= TERMINAL_CAPACITY) {
                    resourceType = RESOURCE_ENERGY;
                }
                let err = creep.withdraw(ruin, resourceType);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.travelTo(ruin);
                    creep.say(travelToIcons(creep) + ICONS["ruin"], true);
                }
                else if (err == ERR_NOT_ENOUGH_RESOURCES) {
                    console.log(creep.name + " failed to pickup " + resourceType + " from ruin in " + creep.room.name);
                    creep.memory.ruin = undefined;
                    Memory.rooms[creep.room.name].checkForDrops = true;
                    creep.say(ICONS["ruin"] + "?", true);
                }
                else {
                    let amountPickedUp = Math.min(ruin.store[resourceType], creep.carryCapacityAvailable);
                    console.log(creep.name + " picked up " + amountPickedUp + " " + resourceType + " of " + _.sum(ruin.store) + " resources from ruin in " + ruin.room.name);
                    creep.say(ICONS["withdraw"] + ICONS["ruin"], true);
                    if (((_.sum(ruin.store) - amountPickedUp) == 0) 
                        || ((creep.carryTotal + amountPickedUp) == creep.carryCapacity)) {
                        creep.memory.ruin = undefined;
                        Memory.rooms[creep.room.name].checkForDrops = true;
                    }
                }
            }
        }
    }
};

module.exports = roleCollector;
