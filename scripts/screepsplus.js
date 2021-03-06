// Module to format data in memory for use with the https://screepspl.us
// Grafana utility run by ags131.
//
// Installation: Run a node script from https://github.com/ScreepsPlus/node-agent
// and configure your screepspl.us token and Screeps login (if you use Steam,
// you have to create a password on the Profile page in Screeps),
// then run that in the background (e.g., on Linode, AWS, your always-on Mac).
//
// Then, put whatever you want in Memory.stats, which will be collected every
// 15 seconds (yes, not every tick) by the above script and sent to screepspl.us.
// In this case, I call the collect_stats() routine below at the end of every
// trip through the main loop, with the absolute final call at the end of the
// main loop to update the final CPU usage.
//
// Then, configure a Grafana page (see example code) which graphs stuff whichever
// way you like.
//
// This module uses my resources module, which analyzes the state of affairs
// for every room you can see.


"use strict";
const resources = require('resources');
const cb = require('callback');

global.stats_callbacks = new cb.Callback();

// Tell us that you want a callback when we're collecting the stats.
// We will send you in the partially completed stats object.
function add_stats_callback(cbfunc) {
    global.stats_callbacks.subscribe(cbfunc);
}


// Update the Memory.stats with useful information for trend analysis and graphing.
// Also calls all registered stats callback functions before returning.
function collect_stats() {
    
    // Don't overwrite things if other modules are putting stuff into Memory.stats
    if (Memory.stats == null) {
        Memory.stats = { tick: Game.time };
    }
    
    let ticksPast = Game.time - _.get(Memory.stats, ["currentTick"], Game.time + 1);
    Memory.stats.ticksSkipped = ticksPast - 1;
    Memory.stats.timeSinceLastTick = (Date.now() - _.get(Memory.stats, ["currentTime"], (Date.now() + (EST_SEC_PER_TICK * ticksPast * 1000)))) / ticksPast;
    
    if (Memory.stats.ticksSkipped < 0) {
        console.log(toStr(Game.time) + " was repeated from " + (-1 * Memory.stats.ticksSkipped) + " tick(s) ago");
    }
    else if (Memory.stats.ticksSkipped > 0) {
        console.log(toStr(Memory.stats.ticksSkipped) + " tick(s) skipped");
    }
    
    if (Memory.stats.timeSinceLastTick < 1000) {
        //console.log("Low tick duration of " + Memory.stats.timeSinceLastTick + "ms between nodes " + Memory.stats.node.lastResetAt + " & " + NODE_USAGE.first + " detected after " + ((Memory.stats.currentTick == undefined) ? "?" : ticksPast) + " tick(s) and " + (Memory.stats.node.hasReset == 1 ? "a" : "no") + " global reset");
    }
    Memory.stats.node.lastResetAt = NODE_USAGE.first;
    
    Memory.stats.currentTick = Game.time;
    Memory.stats.currentTime = Date.now();
    
    if (_.get(Memory.stats, ["lastCommitTime"], 0) != require.timestamp) {
        Memory.stats.newCommit = 1;
        Memory.stats.codeUptime = 0;
        Memory.stats.lastCommitTime = require.timestamp;
        console.log("New code committed at: " + Date(Memory.stats.lastCommitTime).toString());
    }
    else {
        Memory.stats.newCommit = 0;
    }
    Memory.stats.codeUptime += 1;
    
    // Note: This is fragile and will change if the Game.cpu API changes
    Memory.stats.cpu = Game.cpu;
    // Memory.stats.cpu.used = Game.cpu.getUsed(); // AT END OF MAIN LOOP
    // Memory.stats.heap = Game.cpu.getHeapStatistics(); // AT END OF MAIN LOOP
    
    // Note: This is fragile and will change if the Game.gcl API changes
    Memory.stats.gcl = Game.gcl;
    
    const memory_used = RawMemory.get().length;
    // console.log('Memory used: ' + memory_used);
    Memory.stats.memory = {
        used: memory_used,
        // Other memory stats here?
    };
    
    Memory.stats.market = {
        credits: _.round(Game.market.credits, 2),
        num_orders: Game.market.orders ? Object.keys(Game.market.orders).length : 0,
        resources: Game.resources,
    };
    
    Memory.stats.roomSummary = resources.summarize_rooms();
    
    _.set(Memory.stats, ["debugging", "roomAvoidance"], {});
    _.forEach(Memory.rooms, (r, rn) => { if (_.get(r, ["avoidTravelUntil"], 0) > Game.time) { _.set(Memory.stats.debugging.roomAvoidance, [rn], _.get(r, ["avoidTravelUntil"], 0) - Game.time); } });
    
    // Add callback functions which we can call to add additional
    // statistics to here, and have a way to register them.
    // 1. Merge in the current repair ratchets into the room summary
    // TODO: Merge in the current creep desired numbers into the room summary
    global.stats_callbacks.fire(Memory.stats);
} // collect_stats

module.exports = {
    collect_stats,
    add_stats_callback,
};
