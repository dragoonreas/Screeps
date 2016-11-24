var roleWallRepairer = require('role.wallrepairer');

module.exports = {

    run: function(creep) {
        
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            creep.memory.rampartID = undefined;
        }
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
            var rampart = Game.getObjectById(creep.memory.rampartID);
            if (rampart == undefined) {
                var ramparts = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => (s.hits < s.hitsMax 
                        && s.structureType == STRUCTURE_RAMPART
                )});
                if (ramparts.length > 0) {
                    Memory.rampartRepairerCarryCapacity = creep.carryCapacity * 100;
                    rampart = ramparts.sort(function(a,b){return Math.floor((b.hitsMax-b.hits)/Memory.rampartRepairerCarryCapacity) - Math.floor((a.hitsMax-a.hits)/Memory.rampartRepairerCarryCapacity)})[0];
                    creep.memory.rampartID = rampart.id;
                }
            }
    
            if (rampart != undefined) {
                if (rampart.hits < rampart.hitsMax) {
                    if (creep.repair(rampart) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(rampart);
                    }
                }
                else {
                    creep.memory.rampartID = undefined;
                    creep.say("Repaired!");
                }
            }
            else {
                roleWallRepairer.run(creep);
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
