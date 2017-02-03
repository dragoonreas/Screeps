// TODO: Make globals for emoji characters
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
    
    global.EST_SEC_PER_TICK = 3.85; // time between ticks is currently averaging ~3.85 seconds (as of 2017/01/24)
    global.EST_TICKS_PER_MIN = Math.ceil(60 / EST_SEC_PER_TICK); // 60s
    global.EST_TICKS_PER_DAY = Math.ceil(86400 / EST_SEC_PER_TICK); // 24h * 60m * 60s = 86400s
    
    /*
        Cached dynamic properties: Declaration
        By warinternal, from the Screeps Slack
        NOTES:
            - This function is best used when declared as a global
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
    global.Visual = require('visual');
    global.loadVisual = function() {
        return console.log('<script>' + 
            'if(!window.visualLoaded){' + 
            '  $.getScript("https://screepers.github.io/screeps-visual/src/visual.screeps.user.js");' + 
            '  window.visualLoaded = true;' + 
            '}</script>'
        );
    };
};

module.exports = globals;
