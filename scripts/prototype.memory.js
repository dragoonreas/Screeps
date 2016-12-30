var prototypeMemory = function() {
    
    if (Memory.sources == undefined) {
        Object.defineProperty(Memory, "sources", {
    
            get: function() {
                var handler = {
                    get: function(target, sourceID) {
                        var source = Game.getObjectById(sourceID);
                        if (source != undefined) {
                            return _.get(Memory, ["rooms", source.room.name, "sources", sourceID], undefined);
                        }
                        
                        for (let roomID in Memory.rooms) {
                            var sourceMem = _.get(Memory, ["rooms", roomID, "sources", sourceID], undefined);
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
                        
                        for (let roomID in Memory.rooms) {
                            var sourceMem = _.get(Memory, ["rooms", roomID, "sources", sourceID], undefined);
                            if (sourceMem != undefined) {
                                sourceMem = value;
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

}

module.exports = prototypeMemory;
