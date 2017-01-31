let prototypeMemory = function() {
    if (Memory.sources == undefined) {
        let handler = {
            get: function(target, property) {
                if (_.isString(property) == true) {
                    let source = Game.getObjectById(property);
                    if (_.get(source, "room.name", undefined) != undefined) {
                        return _.get(Memory, ["rooms", source.room.name, "sources", property], undefined);
                    }
                    
                    let memorisedRoomIDs = _.filter(_.keys(Memory.rooms), (v) => (Game.rooms[v] == undefined));
                    for (let roomIndex in memorisedRoomIDs) {
                        let sourceMem = _.get(Memory, ["rooms", memorisedRoomIDs[roomIndex], "sources", property], undefined);
                        if (sourceMem != undefined) {
                            return sourceMem;
                        }
                    }
                }
                
                return this[property];
            },
            
            set: function(target, property, value) {
                if (_.isString(property) == true) {
                    let source = Game.getObjectById(property);
                    if (_.get(source, "room.name", undefined) != undefined) {
                        _.set(Memory, ["rooms", source.room.name, "sources", property], value);
                        return true;
                    }
                    
                    let memorisedRoomIDs = _.filter(_.keys(Memory.rooms), (v) => (Game.rooms[v] == undefined));
                    for (let roomIndex in memorisedRoomIDs) {
                        let sourceMem = _.get(Memory, ["rooms", memorisedRoomIDs[roomIndex], "sources", property], undefined);
                        if (sourceMem != undefined) {
                            sourceMem = value;
                            return true;
                        }
                    }
                }
                
                this[property] = value;
                return true;
            }
        };
        let sourceProxy = new Proxy({}, handler);
        
        Object.defineProperty(Memory, "sources", {
            get: function() {
                return sourceProxy;
            },
            
            set: function(value) {
                sourceProxy = value;
            }
        });
        
        Memory.sources[Symbol.iterator] = function*() {
            for (let roomID in Memory.rooms) {
                for (let sourceID in Memory.rooms[roomID].sources) {
                    yield Memory.rooms[roomID].sources[sourceID];
                }
            }
        }
    }
}

module.exports = prototypeMemory;
