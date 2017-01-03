var prototypeMemory = function() {
    
    if (Memory.sources == undefined) {
        var handler = {
            get: function(target, sourceID) {
                var source = Game.getObjectById(sourceID);
                if (source != undefined) {
                    return _.get(Memory, ["rooms", source.room.name, "sources", sourceID], undefined);
                }
                
                var memorisedRoomIDs = _.filter(_.keys(Memory.rooms), (v) => (Game.rooms[v] == undefined));
                for (let roomIndex in memorisedRoomIDs) {
                    var sourceMem = _.get(Memory, ["rooms", memorisedRoomIDs[roomIndex], "sources", sourceID], undefined);
                    if (sourceMem != undefined) {
                        return sourceMem;
                    }
                }
                
                return undefined;
            },
            
            set: function(target, sourceID, value) {
                var source = Game.getObjectById(sourceID);
                if (source != undefined) {
                    _.set(Memory, ["rooms", source.room.name, "sources", sourceID], value);
                    return true;
                }
                
                var memorisedRoomIDs = _.filter(_.keys(Memory.rooms), (v) => (Game.rooms[v] == undefined));
                for (let roomIndex in memorisedRoomIDs) {
                    var sourceMem = _.get(Memory, ["rooms", memorisedRoomIDs[roomIndex], "sources", sourceID], undefined);
                    if (sourceMem != undefined) {
                        sourceMem = value;
                        return true;
                    }
                }
                
                return false;
            }
        };
        var sourceProxy = new Proxy({}, handler);
        
        Object.defineProperty(Memory, "sources", {
            get: function() {
                return sourceProxy;
            },
            
            set: function(value) {
                sourceProxy = value;
            }
        });
    }

}

module.exports = prototypeMemory;
