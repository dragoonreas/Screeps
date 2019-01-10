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
        maxOps:            20000, // 50 * 50 * 64 / 8 (tiles in room * max rooms / adjacent tiles)
        defaultStuckValue: 3,
        reportThreshold:   2000,
        visualisePathStyle:undefined,
        endOnBorder:       false
    });
    class Traveler {
        constructor() {
        }
        findAllowedRooms(origin, destination, options = {}) {
            _.defaults(options, { restrictDistance: 64 });
            if (Game.map.getRoomLinearDistance(origin, destination) > options.restrictDistance) {
                return;
            }
            let allowedRooms = { [origin]: true, [destination]: true };
            let ret = Game.map.findRoute(origin, destination, {
                routeCallback: (roomName) => {
                    if (Game.map.isRoomAvailable(roomName) == false) {
                        return Infinity;
                    }
                    if (options.routeCallback) {
                        let outcome = options.routeCallback(roomName);
                        if (outcome !== undefined) {
                            return outcome;
                        }
                    }
                    if (Game.map.getRoomLinearDistance(origin, roomName) > options.restrictDistance) {
                        return Infinity;
                    }
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
                        let fMod = parsed[1] % 10;
                        let sMod = parsed[2] % 10;
                        let isSK = !(fMod === 5 && sMod === 5) &&
                        ((fMod >= 4) && (fMod <= 6)) &&
                        ((sMod >= 4) && (sMod <= 6));
                        if (isSK) {
                            return 10;
                        }
                    }
                    if (!options.allowHostile && _.get(Memory.rooms, [roomName, "avoidTravelUntil"], 0) >= Game.time &&
                        roomName !== destination && roomName !== origin) {
                        return Number.POSITIVE_INFINITY;
                    }
                    return 2.5;
                }
            });
            if (!_.isArray(ret)) {
                console.log("TRAVELER: No route from " + origin + " to " + destination);
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
                endOnBorder: gOpts.endOnBorder,
                maxOps: gOpts.maxOps,
                obstacles: []
            });
            let origPos = (origin.pos || origin), destPos = (destination.pos || destination);
            let allowedRooms;
            if (options.useFindRoute || (options.useFindRoute === undefined && Game.map.getRoomLinearDistance(origPos.roomName, destPos.roomName) > 2)) {
                allowedRooms = this.findAllowedRooms(origPos.roomName, destPos.roomName, options);
            }
            let lowBorder = ((options.endOnBorder == false) ? 1 : 0);
            let highBorder = ((options.endOnBorder == false) ? 48 : 49);
            let newRange = _.min([options.range, Math.max(0, destPos.x - lowBorder), Math.max(0, highBorder - destPos.x), Math.max(0, destPos.y - lowBorder), Math.max(0, highBorder - destPos.y)]);
            let goals = [];
            if (newRange != options.range) { // TODO: Find algorithm to fill the goal area with the least number of square goals (positions with ranges) instead of this block
                if (newRange >= 0 && newRange <= 3) {
                    let top = destPos.y - _.min([options.range, Math.max(0, destPos.y - lowBorder)]);
                    let bottom = destPos.y + _.min([options.range, Math.max(0, highBorder - destPos.y)]);
                    let left = destPos.x - _.min([options.range, Math.max(0, destPos.x - lowBorder)]);
                    let right = destPos.x + _.min([options.range, Math.max(0, highBorder - destPos.x)]);
                    let areaWidth = right - left;
                    let yOffset = bottom - destPos.y; // TODO: Figure out what this was/is for
                    for (let y = top; y <= bottom; ++y) {
                        for (let x = left; x <= right; x += (((y == top) || (y == bottom)) ? 1 : areaWidth)) { // NOTE: This actually makes a rectangular ring of goals around the target, not a filled in rectangle
                            goals.push({ pos: new RoomPosition(x, y, destPos.roomName), range: 0 });
                        }
                    }
                }
                else {
                    options.range = newRange;
                }
            }
            if (goals.length == 0) {
                goals.push({ pos: destPos, range: options.range });
            }
            /*
            // Room visuals to display goals for creeps
            let origRoomPos = _.create(RoomPosition.prototype, origPos);
            let executingRole = _.get(_.first(_.filter(Game.creeps, (c) => (c.pos.isEqualTo(origRoomPos)))), ["memory", "executingRole"], undefined);
            if (executingRole != undefined) {
                let theRoomVisual = new RoomVisual(destPos.roomName);
                let goalStyle = {
                    opacity: 0.1
                };
                switch (executingRole) {
                    case "adaptable": goalStyle.fill = "#99440a"; break;
                    case "attacker": goalStyle.fill = "#e24d42"; break;
                    case "builder": goalStyle.fill = "#1f78c1"; break;
                    case "claimer": goalStyle.fill = "#ba43a9"; break;
                    case "collector": goalStyle.fill = "#fff"; break;
                    case "demolisher": goalStyle.fill = "#052b51"; break;
                    case "exporter": goalStyle.fill = "#f9ba8f"; break;
                    case "harvester": goalStyle.fill = "#eab839"; break;
                    case "hauler": goalStyle.fill = "#ef843c"; break;
                    case "healer": goalStyle.fill = "#7eb26d"; break;
                    case "hoarder": goalStyle.fill = "#fff"; break;
                    case "miner": goalStyle.fill = "#967302"; break;
                    case "powerHarvester": goalStyle.fill = "#58140c"; break;
                    case "recyclable": goalStyle.fill = "#3f6833"; break;
                    case "repairer": goalStyle.fill = "#6ed0e0"; break;
                    case "scout": goalStyle.fill = "#dedaf7"; break;
                    case "upgrader": goalStyle.fill = "#511749"; break;
                    default: goalStyle.fill = "#fff"; break;
                }
                _.forEach(goals, (g) => {
                    theRoomVisual.rect(
                        g.pos.x - (g.range + 0.5)
                        , g.pos.y - (g.range + 0.5)
                        , g.range * 2 + 1
                        , g.range * 2 + 1
                        , goalStyle
                    );
                });
            }
            */
            let callback = (roomName) => {
                if (Game.map.isRoomAvailable(roomName) == false) {
                    return false;
                }
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
                else if (_.get(Memory.rooms, [roomName, "avoidTravelUntil"], 0) >= Game.time && !options.allowHostile && origPos.roomName != roomName && destPos.roomName != roomName) {
                    return false;
                }
                let room = Game.rooms[roomName];
                if (!room) {
                    return;
                }
                let matrix;
                if (options.ignoreStructures) {
                    matrix = this.getBorderMatrix(room).clone();
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
                if (room.hasHostileCreep == true && !options.ignoreHostileCreeps) {
                    for (let dangerZone of room.dangerZones) {
                        if (matrix.get(dangerZone.x, dangerZone.y) < 0xfe) {
                            matrix.set(dangerZone.x, dangerZone.y, 0xfe); // NOTE: Don't use 0xff since that stops creeps trying to escape when they're surrounded by danger zones
                        }
                    }
                }
                for (let obstacle of options.obstacles) {
                    matrix.set(obstacle.pos.x, obstacle.pos.y, 0xff);
                }
                if (roomName == "W86N39" && destPos.roomName == "W86N39" && destPos.isEqualTo(19, 20) == false) { // stop blocking only access to source at [19,20] in room W86N39 when not harvesting it
                    matrix.set(20, 21, 0xff);
                }
                if (roomName == "W82N39" && destPos.roomName == "W82N39" && destPos.isEqualTo(15, 25) == false) { // stop blocking only access to source at [15,25] in room W82N39 when not harvesting it
                    matrix.set(14, 26, 0xff);
                }
                return matrix;
            };
            return PathFinder.search(origPos, goals, {
                maxOps: options.maxOps,
                plainCost: options.ignoreRoads ? 1 : 2,
                roomCallback: callback,
                swampCost: options.ignoreRoads ? 5 : 10
            });
        }
        travelTo(creep, destination, options = {}) {
            if (creep.spawning) {
                return ERR_BUSY;
            }
            // register hostile rooms entered
            let creepPos = creep.pos, destPos = (destination.pos || destination);
            if (_.get(creep.room, ["controller", "owner", "username"], undefined) && !creep.room.controller.my && !_.includes(_.difference(Memory.nonAgressivePlayers, ["InfiniteJoe", "Cade", "KermitFrog"]), creep.room.controller.owner.username)) {
                if (_.get(Memory.rooms, [creep.room.name, "avoidTravelUntil"], 0) < Game.time && creep.room.controller.level >= 1) {
                    console.log("Restricting travel to RCL" + creep.room.controller.level + " room " + creep.room.name + " owned by " + creep.room.controller.owner.username);
                    Game.notify("Restricting travel to RCL" + creep.room.controller.level + " room " + creep.room.name + " owned by " + creep.room.controller.owner.username);
                }
                _.set(Memory.rooms, [creep.room.name, "avoidTravelUntil"], _.get(creep.room, ["controllerMem", "neutralAt"], 0));
            }
            // initialize data object
            if (!creep.memory._travel) {
                creep.memory._travel = { stuck: 0, tick: Game.time, cpu: 0, count: 0 };
            }
            let travelData = creep.memory._travel;
            if (creep.fatigue > 0) {
                travelData.tick = Game.time;
                return ERR_TIRED;
            }
            if (!destination) {
                return ERR_INVALID_ARGS;
            }
            _.defaults(options, {
                endOnBorder: gOpts.endOnBorder,
                range: 1
            });
            // manage case where creep is nearby destination
            let rangeToDestination = creepPos.getRangeTo(destPos); // NOTE: Range is Infinity when in a different room from the destination
            if (rangeToDestination <= options.range && (options.endOnBorder === true || (creep.pos.x != 0 && creep.pos.x != 49 && creep.pos.y != 0 && creep.pos.y != 49))) {
                if (rangeToDestination === 1 && options.range === 1) {
                    if (options.returnData) {
                        options.returnData.nextPos = destPos;
                    }
                    return creep.move(creepPos.getDirectionTo(destPos));
                }
                return OK;
            }
            let creepRoomID = _.get(creep.memory, ["roomID"], creep.room.name);
            let creepRole = _.get(creep.memory, ["role"], "noRole");
            if (_.get(global, ["summarized_rooms", creepRoomID, "traveler", creepRole, "count"], 0) == 0) {
                _.set(global, ["summarized_rooms", creepRoomID, "traveler", creepRole, "count"], 1); // NOTE: global.summarized_rooms is reset each tick near the beginning of the game loop
            }
            else {
                ++global.summarized_rooms[creepRoomID].traveler[creepRole].count;
            }
            // check if creep is stuck
            let hasMoved = true;
            if (travelData.prev) { // TODO: Account for border hoping
                travelData.prev = Traveler.initPosition(travelData.prev);
                if (creepPos.inRangeTo(travelData.prev, 0)) {
                    hasMoved = false;
                    travelData.stuck++;
                    global.summarized_rooms[creepRoomID].traveler[creepRole].collision = (global.summarized_rooms[creepRoomID].traveler[creepRole].collision || 0) + 1;
                }
                else {
                    travelData.stuck = 0;
                }
            }
            // handle case where creep is stuck
            if (travelData.stuck >= gOpts.defaultStuckValue && !options.ignoreStuck) {
                options.ignoreCreeps = false;
                delete travelData.path; // TODO: Try and find a path around the blockage instead and back to the path instead
                global.summarized_rooms[creepRoomID].traveler[creepRole].stuck = (global.summarized_rooms[creepRoomID].traveler[creepRole].stuck || 0) + 1;
            }
            // handle case where creep wasn't traveling last tick and may have moved, but destination is still the same
            if (Game.time - (travelData.tick || Game.time) > 1 && hasMoved) {
                if (travelData.path != undefined) {
                    delete travelData.path;
                    global.summarized_rooms[creepRoomID].traveler[creepRole].offCourse = (global.summarized_rooms[creepRoomID].traveler[creepRole].offCourse || 0) + 1;
                }
            }
            travelData.tick = Game.time;
            // delete path cache if destination is different
            if (!travelData.dest || travelData.dest.x !== destPos.x || travelData.dest.y !== destPos.y ||
                travelData.dest.roomName !== destPos.roomName) {
                if (travelData.path != undefined) {
                    delete travelData.path;
                    global.summarized_rooms[creepRoomID].traveler[creepRole].newDestination = (global.summarized_rooms[creepRoomID].traveler[creepRole].newDestination || 0) + 1;
                }
            }
            if (creep.room.clearPathCaches == true && !options.ignoreHostileCreeps) { // TODO: Seperate the clear path cache flag from the ignoreHostileCreeps flag
                options.ignoreCreeps = false; // TODO: Find a way to use stuck detection while resetting the path each tick and ignoring creeps
                if (travelData.path != undefined) {
                    delete travelData.path;
                    global.summarized_rooms[creepRoomID].traveler[creepRole].forceRepath = (global.summarized_rooms[creepRoomID].traveler[creepRole].forceRepath || 0) + 1;
                }
            }
            let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(creepPos.roomName);
            let isPortalRoom = ((parsed[1] % 10 === 5) && (parsed[2] % 10 === 5));// || ((parsed[1] % 10 === 0) && (parsed[2] % 10 === 0)); // TODO: Fix highway portal checks
            if (isPortalRoom && _.get(travelData, ["start", "roomName"], undefined) != creepPos.roomName) { // TODO: Cache portals
                let portals = creep.room.find(FIND_STRUCTURES, (s) => (
                    s.structureType == STRUCTURE_PORTAL
                ));
                let destIsPortal = _.some(portals, (p) => (
                    p.pos.isEqualTo(destPos) == true
                ));
                if (portals.length > 0 && destIsPortal == false && travelData.path != undefined) {
                    delete travelData.path;
                    global.summarized_rooms[creepRoomID].traveler[creepRole].portalCheck = (global.summarized_rooms[creepRoomID].traveler[creepRole].portalCheck || 0) + 1;
                }
            }
            // pathfinding
            if (!travelData.path) {
                travelData.start = creepPos;
                travelData.dest = destPos;
                travelData.prev = undefined;
                global.summarized_rooms[creepRoomID].traveler[creepRole].pathfinding = (global.summarized_rooms[creepRoomID].traveler[creepRole].pathfinding || 0) + 1;
                if (Game.map.isRoomAvailable(destPos.roomName) == true) {
                    let cpu = Game.cpu.getUsed();
                    let ret = this.findTravelPath(creep, destPos, options);
                    travelData.cpu += (Game.cpu.getUsed() - cpu);
                    global.summarized_rooms[creepRoomID].traveler[creepRole].cpu = (global.summarized_rooms[creepRoomID].traveler[creepRole].cpu || 0) + (Game.cpu.getUsed() - cpu);;
                    travelData.count++;
                    /*if (travelData.cpu > gOpts.reportThreshold) {
                        console.log(`TRAVELER: heavy cpu use: ${creep.name}, cpu: ${_.round(travelData.cpu, 2)}, origin: ${creepPos}, dest: ${destination.pos}`);
                    }*/
                    if (ret.incomplete) {
                        //console.log(toStr(_.last(ret.path)));
                        //console.log(`TRAVELER: incomplete path for ${creep.name}`);
                        global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath = (global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath || 0) + 1;
                        if (options.useFindRoute === undefined 
                            && travelData.stuck < gOpts.defaultStuckValue) {
                            if (Game.map.getRoomLinearDistance(creepPos.roomName, destPos.roomName) > 2) {
                                options.useFindRoute = false;
                            }
                            else {
                                options.useFindRoute = true;
                            }
                            cpu = Game.cpu.getUsed();
                            ret = this.findTravelPath(creep, destPos, options);
                            global.summarized_rooms[creepRoomID].traveler[creepRole].cpu += (Game.cpu.getUsed() - cpu);
                            if (ret.incomplete) {
                                global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath = (global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath || 0) + 1;
                                //console.log(toStr(_.last(ret.path)));
                            }
                            //console.log(`attempting path with ${options.useFindRoute ? "" : "out"} findRoute was ${ret.incomplete ? "not" : ""} successful`);
                            options.useFindRoute = undefined;
                        }
                        if (ret.incomplete 
                            && travelData.stuck < gOpts.defaultStuckValue 
                            && creep.room.hasHostileCreep == true) {
                            options.ignoreHostileCreeps = true;
                            cpu = Game.cpu.getUsed();
                            ret = this.findTravelPath(creep, destPos, options);
                            global.summarized_rooms[creepRoomID].traveler[creepRole].cpu += (Game.cpu.getUsed() - cpu);
                            if (ret.incomplete) {
                                global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath = (global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath || 0) + 1;
                                //console.log(toStr(_.last(ret.path)));
                            }
                            //console.log(`attempting path ignoring hostile creeps was ${ret.incomplete ? "not" : ""} successful`);
                        }
                        if (ret.incomplete 
                            && creepPos.roomName != destPos.roomName 
                            && options.range != 25) {
                            let roomCentre = Traveler.initPosition(destPos);
                            roomCentre.x = 25;
                            roomCentre.y = 25;
                            options.range = 25;
                            cpu = Game.cpu.getUsed();
                            ret = this.findTravelPath(creep, roomCentre, options);
                            global.summarized_rooms[creepRoomID].traveler[creepRole].cpu += (Game.cpu.getUsed() - cpu);
                            if (ret.incomplete) {
                                global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath = (global.summarized_rooms[creepRoomID].traveler[creepRole].incompletePath || 0) + 1;
                                //console.log(toStr(_.last(ret.path)));
                            }
                            //console.log(`attempting path to room was ${ret.incomplete ? "not" : ""} successful`);
                        }
                    }
                    //if (ret.incomplete != true) {
                        travelData.path = Traveler.serializePath(creepPos, ret.path);
                    //}
                }
                travelData.stuck = 0;
            }
            if (!travelData.path || travelData.path.length === 0) {
                global.summarized_rooms[creepRoomID].traveler[creepRole].noPath = (global.summarized_rooms[creepRoomID].traveler[creepRole].noPath || 0) + 1;
                console.log("TRAVELER: No path for " + creep.name + " (" + creep.memory.roomID + " " + creep.memory.role + ") from " + creepPos.toString() + " to " + destPos.toString());
                return ERR_NO_PATH;
            }
            // consume path and move
            if (travelData.prev && travelData.stuck === 0) {
                travelData.path = travelData.path.substr(1);
            }
            travelData.prev = creepPos;
            let nextDirection = parseInt(travelData.path[0], 10);
            if (options.returnData) {
                options.returnData.nextPos = Traveler.positionAtDirection(creepPos, nextDirection);
            }
            return creep.move(nextDirection);
        }
        getStructureMatrix(room) {
            this.refreshMatrices();
            if (!this.structureMatrixCache[room.name]) {
                this.structureMatrixCache[room.name] = Traveler.addStructuresToMatrix(room, this.getBorderMatrix(room).clone(), 1);
            }
            return this.structureMatrixCache[room.name];
        }
        static initPosition(pos) {
            return _.create(RoomPosition.prototype, pos);
        }
        static addStructuresToMatrix(room, matrix, roadCost) {
            for (let structure of room.find(FIND_STRUCTURES)) {
                if (structure instanceof StructureRampart) {
                    if (structure.my == false && (structure.isPublic == false || _.includes(Memory.nonAgressivePlayers, structure.owner.username) == true)) {
                        matrix.set(structure.pos.x, structure.pos.y, 0xff);
                    }
                }
                else if (structure instanceof StructureRoad && matrix.get(structure.pos.x, structure.pos.y) < roadCost) {
                    matrix.set(structure.pos.x, structure.pos.y, roadCost);
                }
                else if (structure instanceof StructurePortal && matrix.get(structure.pos.x, structure.pos.y) < 0xfe) { // Only go through portals if we absolutly must (i.e. if the destination is set to it)
                    matrix.set(structure.pos.x, structure.pos.y, 0xfe);
                }
                else if (structure.structureType !== STRUCTURE_CONTAINER) {
                    // Can't walk through non-walkable buildings
                    matrix.set(structure.pos.x, structure.pos.y, 0xff);
                }
            }
            for (let site of room.find(FIND_CONSTRUCTION_SITES)) {
                if (site.my == false && (site.structureType === STRUCTURE_CONTAINER || site.structureType === STRUCTURE_ROAD) && matrix.get(site.pos.x, site.pos.y) < 0xfe) { // try not to step on possible ally construction site
                    matrix.set(site.pos.x, site.pos.y, 0xfe);
                }
                else if ((site.my == true && _.includes(OBSTACLE_OBJECT_TYPES, site.structureType) == true) || _.includes(_.difference(Memory.nonAgressivePlayers, [SYSTEM_USERNAME]), site.owner.username)) { // ensure we don't step on an ally construction site and don't block our own construction site
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
        getBorderMatrix(room) {
            if (_.get(this, ["borderMatrixCache", room.name], undefined) == undefined) {
                let matrix = new PathFinder.CostMatrix();
                _.set(this, ["borderMatrixCache", room.name], Traveler.addBorderToMatrix(room, matrix));
            }
            return this.borderMatrixCache[room.name];
        }
        static addBorderToMatrix(room, matrix) {
            let exits = Game.map.describeExits(room.name);
            if (exits == undefined) {
                return matrix;
            }
            const terrain = Game.map.getRoomTerrain(room.name);
            let top = ((_.get(exits, TOP, undefined) == undefined) ? 1 : 0);
            let right = ((_.get(exits, RIGHT, undefined) == undefined) ? 48 : 49);
            let bottom = ((_.get(exits, BOTTOM, undefined) == undefined) ? 48 : 49);
            let left = ((_.get(exits, LEFT, undefined) == undefined) ? 1 : 0);
            for (let y = top; y <= bottom; ++y) {
                for (let x = left; x <= right; x += ((y % 49 == 0) ? 1 : (49 - left))) {
                    if (matrix.get(x, y) < 0x03 && (terrain.get(x, y) & TERRAIN_MASK_WALL) == false) {
                        matrix.set(x, y, 0x03);
                    }
                }
            }
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
        refreshMatrices() {
            if (Game.time !== this.currentTick) {
                this.currentTick = Game.time;
                this.structureMatrixCache = {};
                this.creepMatrixCache = {};
            }
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
            if (pathStyle.stroke == undefined) {
                switch (creep.memory.executingRole) {
                    case "adaptable": pathStyle.stroke = "#99440a"; break;
                    case "attacker": pathStyle.stroke = "#e24d42"; break;
                    case "builder": pathStyle.stroke = "#1f78c1"; break;
                    case "claimer": pathStyle.stroke = "#ba43a9"; break;
                    case "collector": pathStyle.stroke = "#fceaca"; break;
                    case "demolisher": pathStyle.stroke = "#052b51"; break;
                    case "exporter": pathStyle.stroke = "#f9ba8f"; break;
                    case "harvester": pathStyle.stroke = "#eab839"; break;
                    case "hauler": pathStyle.stroke = "#ef843c"; break;
                    case "healer": pathStyle.stroke = "#7eb26d"; break;
                    case "hoarder": pathStyle.stroke = "#f9e2d2"; break;
                    case "miner": pathStyle.stroke = "#967302"; break;
                    case "powerHarvester": pathStyle.stroke = "#58140c"; break;
                    case "recyclable": pathStyle.stroke = "#3f6833"; break;
                    case "repairer": pathStyle.stroke = "#6ed0e0"; break;
                    case "rockhound": pathStyle.stroke = "#2f575e"; break;
                    case "scout": pathStyle.stroke = "#dedaf7"; break;
                    case "upgrader": pathStyle.stroke = "#511749"; break;
                    default: pathStyle.stroke = "#fff"; break;
                }
            }
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
            // Draw line to target
            if (pathData.length == (path.length - 1)) {
                let goal = _.create(RoomPosition.prototype, {
                    x: _.get(creep.memory, ["_travel", "dest", "x"], _.last(path)[0])
                    , y: _.get(creep.memory, ["_travel", "dest", "y"], _.last(path)[1])
                    , roomName: _.get(creep.memory, ["_travel", "dest", "roomName"], creep.room.name)
                });
                let dest = _.create(RoomPosition.prototype, {
                    x: _.last(path)[0]
                    , y: _.last(path)[1]
                    , roomName: _.get(creep.memory, ["_travel", "dest", "roomName"], creep.room.name)
                });
                if (dest.getRangeTo(goal) > 0) {
                    pathStyle.width = pathStyle.strokeWidth;
                    pathStyle.color = pathStyle.stroke;
                    pathStyle.lineStyle = "dotted";
                    creep.room.visual.line(dest, goal, pathStyle);
                }
            }
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
            if (options.visualisePathStyle !== false 
                && (options.visualisePathStyle || gOpts.visualisePathStyle)
                /*&& this.room.beingViewed == true*/) {
                traveler.visualisePath(this, options.visualisePathStyle);
            }
            return outcome;
        };
    }
    
    if(gOpts.exportTraveler){
        return Traveler;
    }
}
