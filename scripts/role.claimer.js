var roleClaimer = {

    run: function(creep) {
        
        if (creep.room.name != "E68N45") {
            creep.moveTo(new RoomPosition(26, 23, "E68N45"));
        }
        else {
            var err = creep.claimController(creep.room.controller);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            else if (err == ERR_GCL_NOT_ENOUGH) {
                err == creep.reserveController(creep.room.controller);
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                else {
                    creep.memory.role = "upgrader";
                    Memory.creepMins.claimers = 0;
                    console.log("Can't reserve controller in " + creep.room.name);
                }
            }
        }
    }
};

module.exports = roleClaimer;
