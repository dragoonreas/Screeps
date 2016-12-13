var prototypeMemory = function() {
    
    Object.defineProperty(Memory.prototype, "sources", {

        get: function() {
            var handler = {
                get: function(target, sourceID) {
                    var source = Game.getObjectById(sourceID);
                    if (source != undefined) {
                        return Memory.rooms[source.room.name].sources[sourceID];
                    }
                    for (roomID in Memory.rooms) {
                        var roomMem = Memory.rooms[roomID].sources;
                        if (roomMem[sourceID] != undefined) {
                            return roomMem[sourceID];
                        }
                    }
                    return undefined;
                },
                
                set: function(target, sourceID, value) {
                    var source = Game.getObjectById(sourceID);
                    if (source != undefined) {
                        Memory.rooms[source.room.name].sources[sourceID] = value;
                        return true;
                    }
                    for (roomID in Memory.rooms) {
                        var roomMem = Memory.rooms[roomID].sources;
                        if (roomMem[sourceID] != undefined) {
                            roomMem[sourceID] = value;
                            return true;
                        }
                    }
                    return false;
                }
            };
            return new Proxy({}, handler);
        },
        
        set: function(value) {
            return false;
        }
    });

}

module.exports = prototypeSource;
