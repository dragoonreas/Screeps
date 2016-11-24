var roleRepairer = require("role.repairer");

var roleMason = {

    run: function(creep) {

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
            creep.memory.wallID = undefined;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
			var wall = Game.getObjectById(creep.memory.wallID);
			if (wall == undefined || wall.hits == wall.hitsMax) {
                if (wall != undefined && wall.hits == wall.hitsMax) {
                    creep.say("Maxed HP!");
                }
				var walls = creep.room.find(FIND_STRUCTURES, {
                	filter: (s) => (s.hits < s.hitsMax 
                        && (s.structureType == STRUCTURE_WALL
                            || s.structureType == STRUCTURE_RAMPART)
            	)});
            	if (walls.length > 0) {
            	    Memory.wallRepairerCarryCapacity = creep.carryCapacity * 100;
            		wall = walls.sort(function(a,b){
                        return Math.floor((b.hitsMax-b.hits)/Memory.wallRepairerCarryCapacity) 
                            - Math.floor((a.hitsMax-a.hits)/Memory.wallRepairerCarryCapacity);
                    })[0];
					creep.memory.wallID = wall.id;
            	}
				else {
					creep.memory.wallID = undefined;
				}
			}
            
            if (wall != undefined) {
                if (creep.repair(wall) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(wall);
                }
            }
            else {
                roleRepairer.run(creep);
            }
        }
        else {
            /*
            var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE, {
                filter: (s) => s.id != "57ef9efc86f108ae6e610381"
            });
            */
            var source = Game.getObjectById("57ef9efc86f108ae6e610380");
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};

module.exports = roleMason;
