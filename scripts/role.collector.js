let roleCollector = {
    run: function(creep) {
        creep.memory.executingRole = "collector";
        
        if (creep.memory.scoreContainer != undefined) {
            let scoreContainer = Game.getObjectById(creep.memory.scoreContainer.id);
            let scoreContainerPos = _.get(creep.memory, ["scoreContainer", "pos"], undefined);
            if (scoreContainer == undefined) {
                if (creep.room.name != _.get(scoreContainerPos, ["roomName"], creep.room.name)) {
                    creep.travelTo(RoomPositionFromObject(scoreContainerPos));
                    creep.say(travelToIcons(creep) + scoreContainerPos.roomName, true);
                }
                else {
                    console.log(creep.name + " failed to pickup the resources from score container in " + creep.room.name);
                    creep.memory.scoreContainer = undefined;
                    Memory.rooms[creep.room.name].checkForDrops = true;
                    creep.say(ICONS["scoreContainer"] + "?", true);
                }
            }
            else {
                let resourceType = _.max(_.keys(scoreContainer.store), (r) => (resourceWorth(r)));
                if (creep.withdraw(scoreContainer, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(scoreContainer);
                    creep.say(travelToIcons(creep) + ICONS["scoreContainer"], true);
                }
                else {
                    toStr(scoreContainer.store);
                    let amountPickedUp = Math.min(scoreContainer.store[resourceType], creep.carryCapacityAvailable);
                    console.log(creep.name + " picked up " + amountPickedUp + " " + resourceType + " of " + _.sum(scoreContainer.store) + " resources from score container in " + scoreContainer.room.name);
                    creep.say(ICONS["withdraw"] + ICONS["scoreContainer"], true);
                    if (((_.sum(scoreContainer.store) - amountPickedUp) == 0) 
                        || ((creep.carryTotal + amountPickedUp) == creep.carryCapacity)) {
                        creep.memory.scoreContainer = undefined;
                        Memory.rooms[creep.room.name].checkForDrops = true;
                    }
                }
            }
        }
        else if (creep.memory.droppedResource != undefined) {
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
                if (creep.withdraw(ruin, resourceType) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(ruin);
                    creep.say(travelToIcons(creep) + ICONS["ruin"], true);
                }
                else {
                    toStr(ruin.store);
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
