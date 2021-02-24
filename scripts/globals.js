let globals = function() {
    global.ROLES = {
        attacker: require("role.attacker")
        , hoarder: require("role.hoarder")
        , collector: require("role.collector")
        , harvester: require("role.harvester")
        , miner: require("role.miner")
        , hauler: require("role.hauler")
        , powerHarvester: require("role.powerHarvester")
        , upgrader: require("role.upgrader")
        , adaptable: require("role.adaptable")
        , demolisher: require("role.demolisher")
        , repairer: require("role.repairer")
        , scout: require("role.scout")
        , builder: require("role.builder")
        , claimer: require("role.claimer")
        , exporter: require("role.exporter")
        , rockhound: require("role.rockhound")
        , recyclable: require("role.recyclable")
    };
    
    global.ICONS = {
        [STRUCTURE_CONTROLLER]: "\uD83C\uDFF0" // castle
        , [STRUCTURE_SPAWN]: "\uD83C\uDFE5" // hospital
        , [STRUCTURE_EXTENSION]: "\uD83C\uDFEA" // convenience store
        , [STRUCTURE_CONTAINER]: "\uD83D\uDCE4" // outbox tray
        , [STRUCTURE_STORAGE]: "\uD83C\uDFE6" // bank
        , [STRUCTURE_RAMPART]: "\uD83D\uDEA7" // construction
        , [STRUCTURE_WALL]: "\u26F0" // moutain
        , [STRUCTURE_TOWER]: "\uD83D\uDD2B" // pistol
        , [STRUCTURE_ROAD]: "\uD83D\uDEE3" // motorway
        , [STRUCTURE_LINK]: "\uD83D\uDCEE" // postbox
        , [STRUCTURE_EXTRACTOR]: "\uD83C\uDFED" // factory
        , [STRUCTURE_LAB]: "\u2697" // alembic
        , [STRUCTURE_TERMINAL]: "\uD83C\uDFEC" // department store
        , [STRUCTURE_OBSERVER]: "\uD83D\uDCE1" // satellite antenna
        , [STRUCTURE_POWER_SPAWN]: "\u2668" // hot springs
        , [STRUCTURE_NUKER]: "\u2622" // radioactive
        , [STRUCTURE_KEEPER_LAIR]: "\uD83D\uDD73" // hole
        , [STRUCTURE_PORTAL]: "\uD83C\uDF00" // cyclone
        , [STRUCTURE_POWER_BANK]: "\uD83C\uDF0B" // volcano
        , tombstone: "\u26b1" // funeral urn
        , ruin: "\uD83C\uDFDB" // classical building
        , scoreContainer: "\u2736" // six pointed black star
        , scoreCollector: "\uD83D\uDFCC" // heavy six pointed black star
        , source: "\uD83C\uDF04" // sunrise over mountains
        , constructionSite: "\uD83C\uDFD7" // building construction
        , resource: "\uD83D\uDEE2" // oil drum
        , creep: "\uD83E\uDD16" // robot face
        , moveTo: "\u27A1" // right arrow NOTE: Same as move3
        , ["move" + TOP]: "\u2B06" // up arrow
        , ["move" + TOP_RIGHT]: "\u2197" // up-right arrow
        , ["move" + RIGHT]: "\u27A1" // right arrow NOTE: Same as moveTo
        , ["move" + BOTTOM_RIGHT]: "\u2198" // down-right arrow
        , ["move" + BOTTOM]: "\u2B07" // down arrow
        , ["move" + BOTTOM_LEFT]: "\u2199" // down-left arrow
        , ["move" + LEFT]: "\u2B05" // left arrow
        , ["move" + TOP_LEFT]: "\u2196" // up-left arrow
        , attack: "\uD83D\uDDE1" // dagger NOTE: Same as attackController
        , heal: "\uD83D\uDD27" // wrench
        , rangeHeal: "\uD83C\uDFF9\uD83D\uDD27" // bow and arrow + wrench
        , rangedAttack: "\uD83C\uDFF9\uD83D\uDDE1" // bow and arrow + dagger
        , rangedMassAttack: "\uD83C\uDFF9\u2694" // bow and arrow + crossed swords
        , build: "\uD83D\uDD28" // hammer
        , repair: "\uD83D\uDEE0" // hammer and wrench
        , dismantle: "\u2692" // hammer and pick
        , harvest: "\u26CF" // pick
        , pickup: "\uD83D\uDD3B" // red triangle pointed down NOTE: Same as withdraw
        , withdraw: "\uD83D\uDD3B" // red triangle pointed down NOTE: Same as pickup
        , drop: "\uD83D\uDD3A" // red triangle pointed up NOTE: Same as transfer & upgradeController
        , transfer: "\uD83D\uDD3A" // red triangle pointed up NOTE: Same as drop & upgradeController
        , upgradeController: "\uD83D\uDD3A" // red triangle pointed up NOTE: Same as drop & transfer
        , claimController: "\uD83D\uDDDD" // old key
        , reserveController: "\uD83D\uDD12" // locked
        , attackController: "\uD83D\uDDE1" // dagger NOTE: Same as attack
        , signController: "\uD83D\uDCDD" // memo
        , recycle: "\u267B" // recycling symbol
        , tired: "\uD83D\uDCA6" // sweat droplets
        , stuck0: "\uD83D\uDCA5" // collision
        , stuck1: "\uD83D\uDCAB" // dizzy
        , stuck2: "\uD83D\uDCA2" // anger symbol
        , wait00: "\uD83D\uDD5B" // 12:00
        , wait01: "\uD83D\uDD67" // 12:30
        , wait02: "\uD83D\uDD50" // 01:00
        , wait03: "\uD83D\uDD5C" // 01:30
        , wait04: "\uD83D\uDD51" // 02:00
        , wait05: "\uD83D\uDD5D" // 02:30
        , wait06: "\uD83D\uDD52" // 03:00
        , wait07: "\uD83D\uDD5E" // 03:30
        , wait08: "\uD83D\uDD53" // 04:00
        , wait09: "\uD83D\uDD5F" // 04:30
        , wait10: "\uD83D\uDD54" // 05:00
        , wait11: "\uD83D\uDD60" // 05:30
        , wait12: "\uD83D\uDD55" // 06:00
        , wait13: "\uD83D\uDD61" // 06:30
        , wait14: "\uD83D\uDD56" // 07:00
        , wait15: "\uD83D\uDD62" // 07:30
        , wait16: "\uD83D\uDD57" // 08:00
        , wait17: "\uD83D\uDD63" // 08:30
        , wait18: "\uD83D\uDD58" // 09:00
        , wait19: "\uD83D\uDD64" // 09:30
        , wait20: "\uD83D\uDD59" // 10:00
        , wait21: "\uD83D\uDD65" // 10:30
        , wait22: "\uD83D\uDD5A" // 11:00
        , wait23: "\uD83D\uDD66" // 11:30
        , sleep: "\uD83D\uDCA4" // zzz NOTE: Used for when script is terminated early to refill bucket
        , testPassed: "\uD83C\uDF89" // party popper NOTE: Used for when scout reaches its goal location
        , testFinished: "\uD83C\uDFC1" // chequered flag NOTE: Used for when scout has finished its test run
        , emoji: "\uFE0F" // Variation Selector-16 NOTE: Append when proceding character defaults to text instead of emoji representation (e.g. move1 to move8)
    };
    
    global.DIRECTIONS = [
        TOP
        , TOP_RIGHT
        , RIGHT
        , BOTTOM_RIGHT
        , BOTTOM
        , BOTTOM_LEFT
        , LEFT
        , TOP_LEFT
    ];
    
    global.travelToIcons = function(creep) {
        let travelStatusIcon = "";
        if (creep != undefined) {
            if (creep.fatigue > 0) {
                travelStatusIcon = ICONS["tired"];
            } else {
                let stuckCount = _.get(creep.memory, ["_travel", "stuck"], 0);
                travelStatusIcon = _.get(ICONS, ["stuck" + (stuckCount - 1)], "");
            }
        }
        let travelDirection = parseInt(_.get(creep.memory, ["_travel", "path", 0], 0), 10);
        let travelDirectionIcon = ICONS["moveTo"];
        if (_.includes(DIRECTIONS, travelDirection)) {
            travelDirectionIcon = ICONS["move" + travelDirection] + ICONS["emoji"];
        }
        return (travelStatusIcon + travelDirectionIcon);
    };
    
    global.incrementConfusedCreepCount = function(creep) {
        if (creep instanceof Creep) {
            let creepRoomID = _.get(creep.memory, ["roomID"], creep.room.name);
            let creepRole = _.get(creep.memory, ["role"], "noRole");
            if (_.get(global, ["summarized_rooms", creepRoomID, "creep_confusion_counts", creepRole], 0) <= 0) {
                _.set(global, ["summarized_rooms", creepRoomID, "creep_confusion_counts", creepRole], 1); // NOTE: global.summarized_rooms is reset each tick near the beginning of the game loop
            }
            else {
                ++global.summarized_rooms[creepRoomID].creep_confusion_counts[creepRole];
            }
            let creepExecutedRole = _.get(creep.memory, ["executingRole"], "noRole");
            console.log(creep.name + " (" +  creepRoomID + " " + creepRole + ") at " + creep.pos.toString() + " is confused being a " + creepExecutedRole);
        }
    };
    
    global.incrementIdleCreepCount = function(creep) {
        if (creep instanceof Creep) {
            let creepRoomID = _.get(creep.memory, ["roomID"], creep.room.name);
            let creepRole = _.get(creep.memory, ["role"], "noRole");
            if (_.get(global, ["summarized_rooms", creepRoomID, "creep_idle_counts", creepRole], 0) <= 0) {
                _.set(global, ["summarized_rooms", creepRoomID, "creep_idle_counts", creepRole], 1); // NOTE: global.summarized_rooms is reset each tick near the beginning of the game loop
            }
            else {
                ++global.summarized_rooms[creepRoomID].creep_idle_counts[creepRole];
            }
        }
    };
    
    global.resourceWorth = function(resourceType) {
        switch (resourceType) {
            case RESOURCE_POWER: return 10000000; // 10^7
            case RESOURCE_CATALYZED_UTRIUM_ACID:
            case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
            case RESOURCE_CATALYZED_KEANIUM_ACID:
            case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
            case RESOURCE_CATALYZED_LEMERGIUM_ACID:
            case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
            case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
            case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
            case RESOURCE_CATALYZED_GHODIUM_ACID:
            case RESOURCE_CATALYZED_GHODIUM_ALKALIDE: return 1000000; // 10^6
            case RESOURCE_UTRIUM_ACID:
            case RESOURCE_UTRIUM_ALKALIDE:
            case RESOURCE_KEANIUM_ACID:
            case RESOURCE_KEANIUM_ALKALIDE:
            case RESOURCE_LEMERGIUM_ACID:
            case RESOURCE_LEMERGIUM_ALKALIDE:
            case RESOURCE_ZYNTHIUM_ACID:
            case RESOURCE_ZYNTHIUM_ALKALIDE:
            case RESOURCE_GHODIUM_ACID:
            case RESOURCE_GHODIUM_ALKALIDE: return 100000; // 10^5
            case RESOURCE_UTRIUM_HYDRIDE:
            case RESOURCE_UTRIUM_OXIDE:
            case RESOURCE_KEANIUM_HYDRIDE:
            case RESOURCE_KEANIUM_OXIDE:
            case RESOURCE_LEMERGIUM_HYDRIDE:
            case RESOURCE_LEMERGIUM_OXIDE:
            case RESOURCE_ZYNTHIUM_HYDRIDE:
            case RESOURCE_ZYNTHIUM_OXIDE:
            case RESOURCE_GHODIUM_HYDRIDE:
            case RESOURCE_GHODIUM_OXIDE: return 10000; // 10^4
            case RESOURCE_GHODIUM: return 1000; // 10^3
            case RESOURCE_HYDROXIDE:
            case RESOURCE_ZYNTHIUM_KEANITE:
            case RESOURCE_UTRIUM_LEMERGITE: return 100; // 10^2
            case RESOURCE_HYDROGEN:
            case RESOURCE_OXYGEN:
            case RESOURCE_UTRIUM:
            case RESOURCE_LEMERGIUM:
            case RESOURCE_KEANIUM:
            case RESOURCE_ZYNTHIUM:
            case RESOURCE_CATALYST: return 10; // 10^1
            case RESOURCE_ENERGY:
            default: return 1; // 10^0
        }
    };
    
    global.NPCOwnerNames = [
        "Invader"
        , "Source Keeper"
        , SYSTEM_USERNAME
        , "Invader(?)"
    ];
    
    global.CUMULATIVE_CONTROLLER_DOWNGRADE = _.map(CONTROLLER_DOWNGRADE, (v1,k1,c1) => (_.reduce(c1, (a,v2,k2,c2) => (a + ((k2 <= k1) ? v2 : 0)), 0)));
    
    global.EST_SEC_PER_TICK = 5.44; // time between ticks is currently averaging ~5.44 seconds (as of 2021/02/23)
    global.EST_TICKS_PER_MIN = Math.ceil(60 / EST_SEC_PER_TICK); // 60s
    global.EST_TICKS_PER_DAY = Math.ceil(86400 / EST_SEC_PER_TICK); // 24h * 60m * 60s = 86400s
    
    global.MAX_SEGMENT_LENGTH = 100 * 1024;

    global.INVADER_CORE_ACTIVE_TIME = 80000;

    global.toStr = (obj) => JSON.stringify(obj, null, 2); // shortcut to stringify an object (idea credit: warinternal, from the Screeps Slack)
    
    global.objGenDate = function(objID) {
        let d = new Date(0);
        d.setUTCSeconds(parseInt(objID.substring(0, 8), 16));
        return d.toLocaleString();
    }
    
    global.setStronghold = function(roomID, ticksRemaining) {
        _.set(Memory.rooms, [roomID, "memoryExpiration"], Math.max(_.get(Memory.rooms, [roomID, "memoryExpiration"], Game.time - 1), Game.time + ticksRemaining));
        _.set(Memory.rooms, [roomID, "avoidTravelUntil"], Math.max(_.get(Memory.rooms, [roomID, "avoidTravelUntil"], Game.time - 1), Game.time + ticksRemaining));
    }
    
    global.listCreepAge = function() {
        _.forEach(Game.creeps, (c) => {
            console.log(`${c.name} (${c.room.name} ${c.memory.role}) started spawning at ${objGenDate(c.id)}, ${(Game.time - c.memory.spawnTick + (c.body.length * CREEP_SPAWN_TIME) - 1).toLocaleString()} ticks ago`);
        });
    }
    
    global.listSafeModeAvailability = function() {
        console.log("Safe Mode Availability:");
        _.chain(Game.rooms)
            .filter((r) => (_.get(r, ["controller", "my"], false) == true))
            .forEach((r) => { console.log(r.name + ": " + _.get(r, ["controller", "safeModeAvailable"], 0) + "/" + Math.max(0, _.get(r, ["controller", "level"], 0) - 1)); })
            .run();
    };
    
    global.listStorageContents = function() {
        _.forEach(Game.rooms, (r, rn) => {
            if (_.get(r, ["storage", "my"], false) == true) {
                console.log(rn + " storage: ");
                _.forEach(_.get(r, ["storage", "store"], { RESOURCE_ENERGY: 0 }), (q, rt) => (
                    console.log("\t" + rt + ": " + q))
                );
            }
        });
    };
    
    global.listTerminalContents = function() {
        _.forEach(Game.rooms, (r, rn) => {
            if (_.get(r, ["terminal", "my"], false) == true) {
                console.log(rn + " terminal: ");
                _.forEach(_.get(r, ["terminal", "store"], { RESOURCE_ENERGY: 0 }), (q, rt) => (
                    console.log("\t" + rt + ": " + q))
                );
            }
        });
    };
    
    global.listRoomContents = function() {
        listStorageContents();
        listTerminalContents();
    };
    
    global.canMakeTrip = function(creepName) {
        if (_.get(Game.creeps, [creepName], undefined) == undefined) {
            console.log("Creep " + creepName + " doesn't exist");
        }
        else if (_.get(Memory.creeps, [creepName, "_travel", "path", "length"], 0) == 0) {
            console.log("Creep " + creepName + " isn't on a trip");
        }
        else if (_.get(Game.creeps, [creepName, "ticksToLive"], -1) >= _.get(Memory.creeps, [creepName, "_travel", "path", "length"], 0)) {
            console.log("Creep " + creepName + " will make the trip with " + (_.get(Game.creeps, [creepName, "ticksToLive"], -1) - _.get(Memory.creeps, [creepName, "_travel", "path", "length"], 0)) + " ticks to spare");
        }
        else {
            console.log("Creep " + creepName + " will fail to make the trip by " + (_.get(Memory.creeps, [creepName, "_travel", "path", "length"], 0) - _.get(Game.creeps, [creepName, "ticksToLive"], -1)) + " ticks");
        }
    }
    
    global.relocateRoom = function(fromRoomName, toRoomName) {
        // TODO: Add room name validation
        let theController = _.get(Game.rooms, [fromRoomName, "controller"], undefined);
        if (theController != undefined && theController.my == true) {
            let theMarketOrders = _.find(Game.market.orders, (o) => (o.roomName == fromRoomName));
            _.forEach(theMarketOrders, (o) => (Game.market.cancelOrder(o.id)));
            let theConstructionSites = theController.room.find(FIND_CONSTRUCTION_SITES);
            _.invoke(theConstructionSites, "remove");
            let theStructures = theController.room.find(FIND_STRUCTURES);
            _.invoke(theStructures, "notifyWhenAttacked", false);
            let theRamparts = _.filter(theStructures, (s) => (s.structureType == STRUCTURE_RAMPART));
            _.invoke(theRamparts, "setPublic", true);
            theController.unclaim();
            console.log("Unclaimed room " + fromRoomName);
        }
        _.forEach(Game.creeps, (c) => {
            if (c.memory.roomID == fromRoomName) {
                c.memory.roomID = toRoomName;
                console.log(c.name + " home room set from " + fromRoomName + " to " + toRoomName);
            }
        });
    };
    
    global.getRoomMemoryExpiration = function(roomName) {
        let currentExpiration = _.get(Memory.rooms, [roomName, "memoryExpiration"], 0);
        let defaultExpiration = Game.time + EST_TICKS_PER_DAY;
        let roomVisualExpiration = Game.time + (ROOM_VISUAL_TIMEOUT || Memory.roomVisualTimeout || 5);
        let controllerNeutralAt = Game.time - 1;
        let theController = _.get(Game.rooms, [roomName, "controller"], undefined);
        let theControllerMem = _.get(Memory.rooms, [roomName, "controller"], undefined);
        if (_.get(theController, ["my"], true) != true) {
            let downgradesAt = ((theController.ticksToDowngrade && (Game.time + theController.ticksToDowngrade)) || undefined);
            controllerNeutralAt = ((downgradesAt && (downgradesAt + _.get(CUMULATIVE_CONTROLLER_DOWNGRADE, [theController.level - 2], 0))) || controllerNeutralAt);
        } else if (_.get(theControllerMem, ["neutralAt"], controllerNeutralAt) > Game.time) {
            controllerNeutralAt = theControllerMem.neutralAt;
        }
        let theInvaderCoreMem = _.get(Game.rooms, [roomName, "invaderCoreMem"], undefined);
        let invaderCoreCollapasesAt = Game.time - 1;
        if (theInvaderCoreMem == undefined) {
            theInvaderCoreMem = _.get(Memory.rooms, [roomName, "invaderCore"], undefined);
        }
        if (_.get(theInvaderCoreMem, ["collapsesAt"], invaderCoreCollapasesAt) > Game.time) {
            invaderCoreCollapasesAt = theInvaderCoreMem.collapsesAt;
        }
        let avoidTravelUntil = _.get(Memory.rooms, [roomName, "avoidTravelUntil"], Game.time - 1);
        return Math.max(currentExpiration, defaultExpiration, roomVisualExpiration, controllerNeutralAt, invaderCoreCollapasesAt, avoidTravelUntil);
    }
    
    /*
        Cached dynamic properties: Declaration
        By warinternal, from the Screeps Slack
        NOTES:
            - This function is easiest to use when declared as a global
            - See prototype.creep for usage examples
    */
    global.defineCachedGetter = function(proto, propertyName, fn) {
        Object.defineProperty(proto, propertyName, {
            get: function() { 
                if(this === proto || this == undefined)
                    return;
                let result = fn.call(this,this);
                Object.defineProperty(this, propertyName, {
                    value: result,
                    configurable: true,
                    enumerable: false
                });
                return result;
            },
            configurable: true,
            enumerable: false
        });
    };
    
    /*
        The following is copied from the path finder in the screeps driver at:
        https://github.com/screeps/driver/blob/master/lib/path-finder.js
    */
    const MAX_WORLD_SIZE = 255; // Talk to marcel before growing world larger than W127N127 :: E127S127
    // Convert a room name to/from usable coordinates ("E1N1" -> { xx: 129, yy: 126 })
    global.parseRoomName = function(roomName) {
        let room = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
        if (!room) {
            return; //throw new Error("Invalid room name " + roomName);
        }
        let rx = (MAX_WORLD_SIZE >> 1) + ((room[1] === "W") ? (-Number(room[2])) : (Number(room[2]) + 1));
        let ry = (MAX_WORLD_SIZE >> 1) + ((room[3] === "N") ? (-Number(room[4])) : (Number(room[4]) + 1));
        if (((rx > 0) && (rx <= MAX_WORLD_SIZE) && (ry > 0) && (ry <= MAX_WORLD_SIZE)) == false) {
            return; //throw new Error("Invalid room name " + roomName);
        }
        return { xx: rx, yy: ry };
    };
    // Converts return value of 'parseRoomName' back into a normal room name
    global.generateRoomName = function(xx, yy) {
        return (
            ((xx <= (MAX_WORLD_SIZE >> 1)) ? ("W" + ((MAX_WORLD_SIZE >> 1) - xx)) : ("E" + (xx - (MAX_WORLD_SIZE >> 1) - 1))) 
            + ((yy <= (MAX_WORLD_SIZE >> 1)) ? ("N" + ((MAX_WORLD_SIZE >> 1) - yy)) : ("S" + (yy - (MAX_WORLD_SIZE >> 1) - 1)))
        );
    };
    // Helper function to convert RoomPosition objects into global coordinate objects
    global.toWorldPosition = function(rp) {
        let xx = (rp.x | 0), yy = (rp.y | 0);
        if (((xx >= 0) && (xx < 50) && (yy >= 0) && (yy < 50)) == false) {
            return; //throw new Error("Invalid room position");
        }
        let offset = parseRoomName(rp.roomName);
        return {
            xx: (xx + offset.xx * 50)
            , yy: (yy + offset.yy * 50)
        };
    };
    // Converts back to a RoomPosition
    global.fromWorldPosition = function(wp) {
        return new RoomPosition(
            wp[0] % 50
            , wp[1] % 50
            , generateRoomName(Math.floor(wp[0] / 50), Math.floor(wp[1] / 50))
        );
    };
    
    global.RoomPositionFromObject = function(obj) {
        return new RoomPosition(
            _.get(obj, ["x"], 0)
            , _.get(obj, ["y"], 0)
            , _.get(obj, ["roomName"], "S0E0")
        );
    };
    
    /*
        For tracking viewed rooms to display room visuals in: https://github.com/Esryok/screeps-browser-ext
        NOTE: Run "loadVisableRoomTracker();" from the command line to see visuals in viewed rooms when opening a new tab / steam client window.
    */
    global.setRoomVisualTimeout = function(timeout) {
        Memory.roomVisualTimeout = timeout || 5;
        global.ROOM_VISUAL_TIMEOUT = Memory.roomVisualTimeout
    }
    setRoomVisualTimeout(Memory.roomVisualTimeout);
    global.getClientVisibleRooms = function (age) {
        let since = Game.time - ((age !== undefined)
            ? age
            : ROOM_VISUAL_TIMEOUT);
        let visibleRooms = [];
        
        for (let roomName in Memory.rooms) {
            let roomData = Memory.rooms[roomName];
            if (roomData && roomData.lastViewed > since) {
                visibleRooms.push(roomName);
            }
        }
        
        return visibleRooms;
    }
    global.loadVisableRoomTracker = function() {
        return console.log('<script>' + 
            'if(!window.jqueryLoaded){' + 
            '  $.getScript("http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js");' + 
            '  window.jqueryLoaded = true;' + 
            '}' + 
            'if(!window.screepsBrowserCoreLoaded){' + 
            '  $.getScript("https://github.com/Esryok/screeps-browser-ext/raw/master/screeps-browser-core.js");' + 
            '  window.screepsBrowserCoreLoaded = true;' + 
            '}' + 
            'if(!window.visibleRoomTrackerLoaded){' + 
            '  $.getScript("https://github.com/Esryok/screeps-browser-ext/raw/master/visible-room-tracker.user.js");' + 
            '  window.visibleRoomTrackerLoaded = true;' + 
            '}' + 
        '</script>');
    };
    
    /*
        For Screeps Visual: https://github.com/screepers/screeps-visual
        NOTE: Run "loadVisual();" from the command line to see visuals when opening a new tab / steam client window.
    */
    /*
    global.Visual = require('visual');
    global.loadVisual = function() {
        return console.log('<script>' + 
            'if(!window.visualLoaded){' + 
            '  $.getScript("https://screepers.github.io/screeps-visual/src/visual.screeps.user.js");' + 
            '  window.visualLoaded = true;' + 
            '}</script>'
        );
    };
    */
};

module.exports = globals;
