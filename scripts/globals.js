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
        , repairer: require("role.repairer")
        , scout: require("role.scout")
        , builder: require("role.builder")
        , claimer: require("role.claimer")
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
        , attack: "\uD83D\uDDE1"
        , build: "\uD83D\uDD28"
        , repair: "\uD83D\uDD27"
        , harvest: "\u26CF"
        , pickup: "\u2B07" // NOTE: Same as withdraw
        , withdraw: "\u2B07" // NOTE: Same as pickup
        , transfer: "\u2B06" // NOTE: Same as upgradeController
        , upgradeController: "\u2B06" // NOTE: Same as transfer
        , claimController: "\uD83D\uDDDD"
        , reserveController: "\uD83D\uDD12"
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
        , testPassed: "\uD83C\uDF89" // for when scout reaches its goal location
        , testFinished: "\uD83C\uDFC1" // for when scout has finished its test run
    }
    
    global.EST_SEC_PER_TICK = 3.85; // time between ticks is currently averaging ~3.85 seconds (as of 2017/01/24)
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
