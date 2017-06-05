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
        , recyclable: require("role.recyclable")
    }
    
    global.ICONS = {
        [STRUCTURE_CONTROLLER]: "\uD83C\uDFF0"
        , [STRUCTURE_SPAWN]: "\uD83C\uDFE5"
        , [STRUCTURE_EXTENSION]: "\uD83C\uDFEA"
        , [STRUCTURE_CONTAINER]: "\uD83D\uDCE4"
        , [STRUCTURE_STORAGE]: "\uD83C\uDFE6"
        , [STRUCTURE_RAMPART]: "\uD83D\uDEA7"
        , [STRUCTURE_WALL]: "\u26F0"
        , [STRUCTURE_TOWER]: "\uD83D\uDD2B"
        , [STRUCTURE_ROAD]: "\uD83D\uDEE3"
        , [STRUCTURE_LINK]: "\uD83D\uDCEE"
        , [STRUCTURE_EXTRACTOR]: "\uD83C\uDFED"
        , [STRUCTURE_LAB]: "\u2697"
        , [STRUCTURE_TERMINAL]: "\uD83C\uDFEC"
        , [STRUCTURE_OBSERVER]: "\uD83D\uDCE1"
        , [STRUCTURE_POWER_SPAWN]: "\uD83C\uDFDB"
        , [STRUCTURE_NUKER]: "\u2622"
        , [STRUCTURE_KEEPER_LAIR]: "" // TODO: Add icon for keeper lair
        , [STRUCTURE_PORTAL]: "" // TODO: Add icon for portal
        , [STRUCTURE_POWER_BANK]: "" // TODO: Add icon for power bank
        , source: "" // TODO: Add icon for source
        , constructionSite: "\uD83C\uDFD7"
        , resource: "\uD83D\uDEE2"
        , creep: "" // TODO: Add icon for creep
        , moveTo: "\u27A1"
        , attack: "\uD83D\uDDE1" // NOTE: Same as attackController
        , build: "\uD83D\uDD28"
        , repair: "\uD83D\uDD27"
        , dismantle: "\u2692"
        , harvest: "\u26CF"
        , pickup: "\u2B07" // NOTE: Same as withdraw
        , withdraw: "\u2B07" // NOTE: Same as pickup
        , transfer: "\u2B06" // NOTE: Same as upgradeController
        , upgradeController: "\u2B06" // NOTE: Same as transfer
        , claimController: "\uD83D\uDDDD"
        , reserveController: "\uD83D\uDD12"
        , attackController: "\uD83D\uDDE1" // NOTE: Same as attack
        , recycle: "\u267B"
        , tired: "\uD83D\uDCA6"
        , stuck0: "\uD83D\uDCA5"
        , stuck1: "\uD83D\uDCAB"
        , stuck2: "\uD83D\uDCA2"
        , wait0: "\uD83D\uDD5B" // 12:00
        , wait1: "\uD83D\uDD67" // 12:30
        , wait2: "\uD83D\uDD50" // 01:00
        , wait3: "\uD83D\uDD5C" // 01:30
        , wait4: "\uD83D\uDD51" // 02:00
        , wait5: "\uD83D\uDD5D" // 02:30
        , wait6: "\uD83D\uDD52" // 03:00
        , wait7: "\uD83D\uDD5E" // 03:30
        , wait8: "\uD83D\uDD53" // 04:00
        , wait9: "\uD83D\uDD5F" // 04:30
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
        , sleep: "\uD83D\uDCA4" // for when script is terminated early to refill bucket
        , testPassed: "\uD83C\uDF89" // for when scout reaches its goal location
        , testFinished: "\uD83C\uDFC1" // for when scout has finished its test run
    }
    
    global.travelToIcons = function(creep) {
        let travelStatusIcon = "";
        if (creep != undefined) {
            if (creep.fatigue > 0) {
                travelStatusIcon = ICONS["tired"];
            } else {
                let stuckCount = _.get(creep, ["memory", "_travel", "stuck"], 0);
                travelStatusIcon = _.get(ICONS, ["stuck" + (stuckCount - 1)], "");
            }
        }
        return (travelStatusIcon + ICONS["moveTo"]);
    }
    
    global.CUMULATIVE_CONTROLLER_DOWNGRADE = _.map(CONTROLLER_DOWNGRADE, (v1,k1,c1) => (_.reduce(c1, (a,v2,k2,c2) => (a + ((k2 <= k1) ? v2 : 0)), 0)));
    
    global.resourceWorth = function(resourceType) {
        switch (resourceType) {
            case RESOURCE_ENERGY:
            default: return 1; // 10^0
            case RESOURCE_HYDROGEN:
            case RESOURCE_OXYGEN:
            case RESOURCE_UTRIUM:
            case RESOURCE_LEMERGIUM:
            case RESOURCE_KEANIUM:
            case RESOURCE_ZYNTHIUM:
            case RESOURCE_CATALYST: return 10; // 10^1
            case RESOURCE_HYDROXIDE:
            case RESOURCE_ZYNTHIUM_KEANITE:
            case RESOURCE_UTRIUM_LEMERGITE: return 100; // 10^2
            case RESOURCE_UTRIUM_HYDRIDE:
            case RESOURCE_UTRIUM_OXIDE:
            case RESOURCE_KEANIUM_HYDRIDE:
            case RESOURCE_KEANIUM_OXIDE:
            case RESOURCE_LEMERGIUM_HYDRIDE:
            case RESOURCE_LEMERGIUM_OXIDE:
            case RESOURCE_ZYNTHIUM_HYDRIDE:
            case RESOURCE_ZYNTHIUM_OXIDE:
            case RESOURCE_GHODIUM_HYDRIDE:
            case RESOURCE_GHODIUM_OXIDE: return 1000; // 10^3
            case RESOURCE_UTRIUM_ACID:
            case RESOURCE_UTRIUM_ALKALIDE:
            case RESOURCE_KEANIUM_ACID:
            case RESOURCE_KEANIUM_ALKALIDE:
            case RESOURCE_LEMERGIUM_ACID:
            case RESOURCE_LEMERGIUM_ALKALIDE:
            case RESOURCE_ZYNTHIUM_ACID:
            case RESOURCE_ZYNTHIUM_ALKALIDE:
            case RESOURCE_GHODIUM_ACID:
            case RESOURCE_GHODIUM_ALKALIDE: return 10000; // 10^4
            case RESOURCE_CATALYZED_UTRIUM_ACID:
            case RESOURCE_CATALYZED_UTRIUM_ALKALIDE:
            case RESOURCE_CATALYZED_KEANIUM_ACID:
            case RESOURCE_CATALYZED_KEANIUM_ALKALIDE:
            case RESOURCE_CATALYZED_LEMERGIUM_ACID:
            case RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE:
            case RESOURCE_CATALYZED_ZYNTHIUM_ACID:
            case RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE:
            case RESOURCE_CATALYZED_GHODIUM_ACID:
            case RESOURCE_CATALYZED_GHODIUM_ALKALIDE: return 100000; // 10^5
            case RESOURCE_POWER: return 1000000; // 10^6
        }
    };

    
    global.EST_SEC_PER_TICK = 4.84; // time between ticks is currently averaging ~4.84 seconds (as of 2017/05/07)
    global.EST_TICKS_PER_MIN = Math.ceil(60 / EST_SEC_PER_TICK); // 60s
    global.EST_TICKS_PER_DAY = Math.ceil(86400 / EST_SEC_PER_TICK); // 24h * 60m * 60s = 86400s
    
    global.toStr = (obj) => JSON.stringify(obj, null, 2); // shortcut to stringify an object (idea credit: warinternal, from the Screeps Slack)
    
    /*
        Cached dynamic properties: Declaration
        By warinternal, from the Screeps Slack
        NOTES:
            - This function is easiest to use when declared as a global
            - See prototype.creep for usage examples
    */
    global.defineCachedGetter = function (proto, propertyName, fn) {
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
    }
    
    /*
        The following is copied from the path finder in the screeps driver at:
        https://github.com/screeps/driver/blob/master/lib/path-finder.js
    */
    //const MAX_WORLD_SIZE = 255; // Talk to marcel before growing world larger than W127N127 :: E127S127
    // Convert a room name to/from usable coordinates ("E1N1" -> { xx: 129, yy: 126 })
    global.parseRoomName = function(roomName) {
        let room = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
        if (!room) {
            return; //throw new Error("Invalid room name " + roomName);
        }
        let rx = (WORLD_WIDTH >> 1) + ((room[1] === "W") ? (-Number(room[2])) : (Number(room[2]) + 1));
        let ry = (WORLD_HEIGHT >> 1) + ((room[3] === "N") ? (-Number(room[4])) : (Number(room[4]) + 1));
        if (((rx > 0) && (rx <= WORLD_WIDTH) && (ry > 0) && (ry <= WORLD_HEIGHT)) == false) {
            return; //throw new Error("Invalid room name " + roomName);
        }
        return { xx: rx, yy: ry };
    }
    // Converts return value of 'parseRoomName' back into a normal room name
    global.generateRoomName = function(xx, yy) {
        return (
            ((xx <= (WORLD_WIDTH >> 1)) ? ("W" + ((WORLD_WIDTH >> 1) - xx)) : ("E" + (xx - (WORLD_WIDTH >> 1) - 1))) 
            + ((yy <= (WORLD_HEIGHT >> 1)) ? ("N" + ((WORLD_HEIGHT >> 1) - yy)) : ("S" + (yy - (WORLD_HEIGHT >> 1) - 1)))
        );
    }
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
    }
    // Converts back to a RoomPosition
    global.fromWorldPosition = function(wp) {
        return new RoomPosition(
            wp[0] % 50
            , wp[1] % 50
            , generateRoomName(Math.floor(wp[0] / 50), Math.floor(wp[1] / 50))
        );
    }
    
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
