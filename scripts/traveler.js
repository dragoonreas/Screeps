/**
 * To start using Traveler, require it in main.js:
 *
 * There are 6 options available to pass to the module. Options are passed in the form
 *   of an object with one or more of the following:
 *
 *   exportTraveler:    boolean    Whether the require() should return the Traveler class. Defaults to true.
 *   installTraveler:   boolean    Whether the Traveler class should be stored in `global.Traveler`. Defaults to false.
 *   installPrototype:  boolean    Whether Creep.prototype.travelTo() should be created. Defaults to true.
 *   hostileLocation:   string     Where in Memory a list of hostile rooms can be found. If it can be found in
 *                                   Memory.empire, use 'empire'. Defaults to 'empire'.
 *   maxOps:            integer    The maximum number of operations PathFinder should use. Defaults to 20000
 *   defaultStuckValue: integer    The maximum number of ticks the creep is in the same RoomPosition before it
 *                                   determines it is stuck and repaths.
 *   reportThreshold:   integer    The mimimum CPU used on pathing to console.log() warnings on CPU usage. Defaults to 50
 * 
 * Examples: var Traveler = require('Traveler')();
 *           require('util.traveler')({exportTraveler: false, installTraveler: false, installPrototype: true, defaultStuckValue: 2});
 */
"use strict";
module.exports = function(globalOpts = {}){
    if (globalOpts.visualisePathStyle) {
        globalOpts.visualisePathStyle = _.defaults(globalOpts.visualisePathStyle, {
            fill: "transparent",
            stroke: "#fff",
            lineStyle: "dashed",
            strokeWidth: .15,
            opacity: .1
        });
    }
    const gOpts = _.defaults(globalOpts, {
        exportTraveler:    true,
        installTraveler:   false,
        installPrototype:  true,
        maxOps:            20000,
        defaultStuckValue: 3,
        reportThreshold:   50,
        visualisePathStyle:undefined,
    });
    class Traveler {
        constructor() {
        }
        findAllowedRooms(origin, destination, options = {}) {
            _.defaults(options, { restrictDistance: 16 });
            if (Game.map.getRoomLinearDistance(origin, destination) > options.restrictDistance) {
                return;
            }
            let allowedRooms = { [origin]: true, [destination]: true };
            let ret = Game.map.findRoute(origin, destination, {
                routeCallback: (roomName) => {
                    if (options.routeCallback) {
                        let outcome = options.routeCallback(roomName);
                        if (outcome !== undefined) {
                            return outcome;
                        }
                    }
                    if (Game.map.getRoomLinearDistance(origin, roomName) > options.restrictDistance)
                        return false;
                    let parsed;
                    if (options.preferHighway) {
                        parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                        let isHighway = (parsed[1] % 10 === 0) || (parsed[2] % 10 === 0);
                        if (isHighway) {
                            return 1;
                        }
                    }
                    if (!options.allowSK && !Game.rooms[roomName]) {
                        if (!parsed) {
                            parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                        }
                        let isSK = ((parsed[1] % 10 === 4) || (parsed[1] % 10 === 6)) &&
                            ((parsed[2] % 10 === 4) || (parsed[2] % 10 === 6));
                        if (isSK) {
                            return 10;
                        }
                    }
                    if (!options.allowHostile && _.get(Memory.rooms, [roomName, "avoidTravelUntil"], 0) >= Game.time &&
                        roomName !== destination && roomName !== origin) {
                        return Number.POSITIVE_INFINITY;
                    }
                }
            });
            if (!_.isArray(ret)) {
                console.log("couldn't findRoute to ${destination}");
                return;
            }
            for (let value of ret) {
                allowedRooms[value.room] = true;
            }
            return allowedRooms;
        }
        findTravelPath(origin, destination, options = {}) {
            _.defaults(options, {
                ignoreCreeps: true,
                range: 1,
                obstacles: [],
                maxOps: gOpts.maxOps,
            });
            let origPos = (origin.pos || origin), destPos = (destination.pos || destination);
            let allowedRooms;
            if (options.useFindRoute || (options.useFindRoute === undefined &&
                Game.map.getRoomLinearDistance(origPos.roomName, destPos.roomName) > 2)) {
                allowedRooms = this.findAllowedRooms(origPos.roomName, destPos.roomName, options);
            }
            let callback = (roomName) => {
                if (options.roomCallback) {
                    let outcome = options.roomCallback(roomName, options.ignoreCreeps);
                    if (outcome !== undefined) {
                        return outcome;
                    }
                }
                if (allowedRooms) {
                    if (!allowedRooms[roomName]) {
                        return false;
                    }
                }
                else if (_.get(Memory.rooms, [roomName, "avoidTravelUntil"], 0) >= Game.time && !options.allowHostile) {
                    return false;
                }
                let room = Game.rooms[roomName];
                if (!room)
                    return;
                let matrix;
                if (options.ignoreStructures) {
                    matrix = new PathFinder.CostMatrix();
                    if (!options.ignoreCreeps) {
                        Traveler.addCreepsToMatrix(room, matrix);
                    }
                }
                else if (options.ignoreCreeps || roomName !== origin.pos.roomName) {
                    matrix = this.getStructureMatrix(room);
                }
                else {
                    matrix = this.getCreepMatrix(room);
                }
                for (let obstacle of options.obstacles) {
                    matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
                }
                return matrix;
            };
            return PathFinder.search(origPos, { pos: destPos, range: options.range }, {
                swampCost: options.ignoreRoads ? 5 : 10,
                plainCost: options.ignoreRoads ? 1 : 2,
                maxOps: options.maxOps,
                roomCallback: callback
            });
        }
        travelTo(creep, destination, options = {}) {
            // register hostile rooms entered
            let creepPos = creep.pos, destPos = (destination.pos || destination);
            if (_.get(creep.room, ["controller", "owner"], undefined) && !creep.room.controller.my && !_.includes(Memory.nonAgressivePlayers, creep.room.controller.owner.username)) {
                _.set(Memory.rooms, [creep.room.name, "avoidTravelUntil"], (creep.room.controller.level > 1 ? Game.time + EST_TICKS_PER_DAY : 0));
            }
            // initialize data object
            if (!creep.memory._travel) {
                creep.memory._travel = { stuck: 0, tick: Game.time, cpu: 0, count: 0 };
            }
            let travelData = creep.memory._travel;
            if (creep.fatigue > 0) {
                travelData.tick = Game.time;
                return ERR_BUSY;
            }
            if (!destination) {
                return ERR_INVALID_ARGS;
            }
            // manage case where creep is nearby destination
            let rangeToDestination = creep.pos.getRangeTo(destPos);
            if (rangeToDestination <= 1) {
                let outcome = OK;
                if (rangeToDestination === 1) {
                    outcome = creep.move(creep.pos.getDirectionTo(destPos));
                }
                if (options.returnPosition && outcome === OK) {
                    return destPos;
                }
                else {
                    return outcome;
                }
            }
            // check if creep is stuck
            let hasMoved = true;
            if (travelData.prev) {
                travelData.prev = new RoomPosition(travelData.prev.x, travelData.prev.y, travelData.prev.roomName);
                if (creepPos.inRangeTo(travelData.prev, 0)) {
                    hasMoved = false;
                    travelData.stuck++;
                }
                else {
                    travelData.stuck = 0;
                }
            }
            // handle case where creep is stuck
            if (travelData.stuck >= gOpts.defaultStuckValue) {
                if (options.ignoreStuck) {
                    if (options.returnPosition && travelData.path && travelData.path.length > 0) {
                        let direction = parseInt(travelData.path[0]);
                        return Traveler.positionAtDirection(creepPos, direction);
                    }
                    else {
                        return OK;
                    }
                }
                else {
                    options.ignoreCreeps = false;
                    delete travelData.path;
                }
            }
            // handle case where creep wasn't traveling last tick and may have moved, but destination is still the same
            if (Game.time - travelData.tick > 1 && hasMoved) {
                delete travelData.path;
            }
            travelData.tick = Game.time;
            // delete path cache if destination is different
            if (!travelData.dest || travelData.dest.x !== destPos.x || travelData.dest.y !== destPos.y ||
                travelData.dest.roomName !== destPos.roomName) {
                delete travelData.path;
            }
            // pathfinding
            if (!travelData.path) {
                if (creep.spawning)
                    return ERR_BUSY;
                travelData.dest = destPos;
                travelData.prev = undefined;
                let cpu = Game.cpu.getUsed();
                let ret = this.findTravelPath(creep, destPos, options);
                travelData.cpu += (Game.cpu.getUsed() - cpu);
                travelData.count++;
                if (travelData.cpu > gOpts.reportThreshold) {
                    //console.log(`TRAVELER: heavy cpu use: ${creep.name}, cpu: ${_.round(travelData.cpu, 2)}, pos: ${creep.pos}`);
                }
                if (ret.incomplete) {
                    //console.log(`TRAVELER: incomplete path for ${creep.name}`);
                    if (ret.ops < 2000 && options.useFindRoute === undefined && travelData.stuck < gOpts.defaultStuckValue) {
                        options.useFindRoute = false;
                        ret = this.findTravelPath(creep, destPos, options);
                        //console.log(`attempting path without findRoute was ${ret.incomplete ? "not" : ""} successful`);
                    }
                }
                travelData.path = Traveler.serializePath(creep.pos, ret.path);
                travelData.stuck = 0;
            }
            if (!travelData.path || travelData.path.length === 0) {
                return ERR_NO_PATH;
            }
            // consume path and move
            if (travelData.prev && travelData.stuck === 0) {
                travelData.path = travelData.path.substr(1);
            }
            travelData.prev = creep.pos;
            let nextDirection = parseInt(travelData.path[0]);
            let outcome = creep.move(nextDirection);
            if (!options.returnPosition || outcome !== OK) {
                return outcome;
            }
            else {
                return Traveler.positionAtDirection(creep.pos, nextDirection);
            }
        }
        refreshMatrices() {
            if (Game.time !== this.currentTick) {
                this.currentTick = Game.time;
                this.structureMatrixCache = {};
                this.creepMatrixCache = {};
            }
        }
        getStructureMatrix(room) {
            this.refreshMatrices();
            if (!this.structureMatrixCache[room.name]) {
                let matrix = new PathFinder.CostMatrix();
                this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, matrix, 1);
            }
            return this.structureMatrixCache[room.name];
        }
        static addStructuresToMatrix(room, matrix, roadCost) {
            for (let structure of room.find(FIND_STRUCTURES)) {
                if (structure instanceof StructureRampart) {
                    if (!structure.my) {
                        matrix.set(structure.pos.x, structure.pos.y, 0xff);
                    }
                }
                else if (structure instanceof StructureRoad) {
                    matrix.set(structure.pos.x, structure.pos.y, roadCost);
                }
                else if (structure.structureType !== STRUCTURE_CONTAINER) {
                    // Can't walk through non-walkable buildings
                    matrix.set(structure.pos.x, structure.pos.y, 0xff);
                }
            }
            for (let site of room.find(FIND_CONSTRUCTION_SITES)) {
                if (site.my == true) {
                    matrix.set(site.pos.x, site.pos.y, 0x06);
                }
                else if (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD) {
                    continue;
                }
                else { // TODO: Make hostile construction sites walkable (but not ally ones)
                    matrix.set(site.pos.x, site.pos.y, 0xff);
                }
            }
            return matrix;
        }
        getCreepMatrix(room) {
            this.refreshMatrices();
            if (!this.creepMatrixCache[room.name]) {
                this.creepMatrixCache[room.name] = Traveler.addCreepsToMatrix(room, this.getStructureMatrix(room).clone());
            }
            return this.creepMatrixCache[room.name];
        }
        static addCreepsToMatrix(room, matrix) {
            room.find(FIND_CREEPS).forEach((creep) => matrix.set(creep.pos.x, creep.pos.y, 0xff));
            return matrix;
        }
        static serializePath(startPos, path) {
            let serializedPath = "";
            let lastPosition = startPos;
            for (let position of path) {
                if (position.roomName === lastPosition.roomName) {
                    serializedPath += lastPosition.getDirectionTo(position);
                }
                lastPosition = position;
            }
            return serializedPath;
        }
        static positionAtDirection(origin, direction) {
            let offsetX = [0, 0, 1, 1, 1, 0, -1, -1, -1];
            let offsetY = [0, -1, -1, 0, 1, 1, 1, 0, -1];
            return new RoomPosition(origin.x + offsetX[direction], origin.y + offsetY[direction], origin.roomName);
        }
        visualisePath(creep, pathStyle = {}) {
            // Check that the creep is trying to move this tick
            if (_.get(creep.memory, ["_travel", "tick"], 0) != Game.time) {
                return;
            }
            // Check that the creep has path data
            let pathData = _.get(creep.memory, ["_travel", "path"], undefined);
            if (pathData == undefined || pathData.length <= 0) {
                return;
            }
            // Init the path style
            if (gOpts.visualisePathStyle) {
                pathStyle = _.defaults(pathStyle, gOpts.visualisePathStyle);
            }
            else {
                pathStyle = _.defaults(pathStyle, {
                    fill: "transparent",
                    stroke: "#fff",
                    lineStyle: "dashed",
                    strokeWidth: .15,
                    opacity: .1
                });
            }
            if (pathStyle.lineStyle == "solid") {
                pathStyle.lineStyle = undefined;
            }
            // Get the first step position
            let stepPos = {
                x: _.get(creep.memory, ["_travel", "prev", "x"], creep.pos.x)
                , y: _.get(creep.memory, ["_travel", "prev", "y"], creep.pos.y)
            };
            // Get the path
            let path = [[stepPos.x, stepPos.y]];
            _.each(pathData, (d) => {
                // Get the next step position
                switch (Number(d)) {
                    case TOP_RIGHT: stepPos.y = stepPos.y - 1;
                    case RIGHT: stepPos.x = stepPos.x + 1; break;
                    case BOTTOM_RIGHT: stepPos.x = stepPos.x + 1;
                    case BOTTOM: stepPos.y = stepPos.y + 1; break;
                    case BOTTOM_LEFT: stepPos.y = stepPos.y + 1;
                    case LEFT: stepPos.x = stepPos.x - 1; break;
                    case TOP_LEFT: stepPos.x = stepPos.x - 1;
                    case TOP: stepPos.y = stepPos.y - 1; break;
                    default: console.log(d + " didn't match a direction during path visualisation for: " + creep.name); break;
                }
                // If the path is still in the room, push the next step position onto the path
                if (stepPos.x < 0 || stepPos.x >= 50 || stepPos.y < 0 || stepPos.y >= 50) {
                    return false; // stop the loop if the path goes into a new room
                }
                else {
                    path.push([stepPos.x, stepPos.y]);
                }
            });
            // Draw the path
            creep.room.visual.poly(path, pathStyle);
        }
    }
    
    if(gOpts.installTraveler){
        global.Traveler = Traveler;
        global.traveler = new Traveler();
        global.travelerTick = Game.time;
    }
    
    if(gOpts.installPrototype){
        // prototype requires an instance of traveler be installed in global
        if(!gOpts.installTraveler) {
            global.traveler = new Traveler();
            global.travelerTick = Game.time;
        }
        
        Creep.prototype.travelTo = function (destination, options = {}) {
            if(global.traveler && global.travelerTick !== Game.time){
                global.traveler = new Traveler();
            }
            let outcome = traveler.travelTo(this, destination, options);
            if (options.visualisePathStyle !== false && (options.visualisePathStyle || gOpts.visualisePathStyle)) {
                traveler.visualisePath(this, options.visualisePathStyle);
            }
            return outcome;
        };
    }
    
    if(gOpts.exportTraveler){
        return Traveler;
    }
}
