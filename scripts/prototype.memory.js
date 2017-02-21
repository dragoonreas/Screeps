let prototypeMemory = function() {
    if (Memory.sources == undefined) { // NOTE: Must be defined after Room.sources
        let handler = {
            get: function(target, property) {
                if (_.isString(property) == true) {
                    let source = Game.getObjectById(property);
                    if (source != undefined) {
                        return _.get(source, ["room", "sources", property], undefined);
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
                    if (source != undefined) {
                        _.set(source, ["room", "sources", property], value);
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
    
    if (Memory.controllers == undefined) { // NOTE: Must be defined after Room.controllerMem
        let handler = {
            get: function(target, property) {
                if (_.isString(property) == true) {
                    let theController = Game.getObjectById(property);
                    if (theController != undefined) {
                        return _.get(theController, ["room", "controllerMem"], undefined);
                    }
                    
                    let memorisedRoomIDs = _.filter(_.keys(Memory.rooms), (v) => (Game.rooms[v] == undefined));
                    for (let roomIndex in memorisedRoomIDs) {
                        let controllerMem = _.get(Memory, ["rooms", memorisedRoomIDs[roomIndex], "controller"], undefined);
                        if (controllerMem != undefined && controllerMem.id == property) {
                            return controllerMem;
                        }
                    }
                }
                
                return this[property];
            },
            
            set: function(target, property, value) {
                if (_.isString(property) == true) {
                    let theController = Game.getObjectById(property);
                    if (theController != undefined) {
                        _.set(theController, ["room", "controllerMem"], value);
                        return true;
                    }
                    
                    let memorisedRoomIDs = _.filter(_.keys(Memory.rooms), (v) => (Game.rooms[v] == undefined));
                    for (let roomIndex in memorisedRoomIDs) {
                        let controllerMem = _.get(Memory, ["rooms", memorisedRoomIDs[roomIndex], "controller"], undefined);
                        if (controllerMem != undefined && controllerMem.id == property) {
                            controllerMem = value;
                            return true;
                        }
                    }
                }
                
                this[property] = value;
                return true;
            }
        };
        let sourceProxy = new Proxy({}, handler);
        
        Object.defineProperty(Memory, "controllers", {
            get: function() {
                return sourceProxy;
            },
            
            set: function(value) {
                sourceProxy = value;
            }
        });
        
        Memory.sources[Symbol.iterator] = function*() {
            for (let roomID in Memory.rooms) {
                yield Memory.rooms[roomID].controller;
            }
        }
    }
}

module.exports = prototypeMemory;
