var roleClaimer = {

    run: function(creep) {
        
        if (creep.room.name != "E68N44") {
            creep.moveTo(new RoomPosition(25, 11, "E68N44"));
        }
        else {
            var err = creep.claimController(creep.room.controller);
            if (err == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            else if (err == ERR_GCL_NOT_ENOUGH) {
                err == creep.reserveController(creep.room.controller);
                console.log(err);
                if (err == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                else {
                    creep.memory.role = "upgrader";
                    Memory.creepMins.claimers = 0;
                    console.log("No neutral controller in " + creep.room.name);
                }
            }
        }
    }
};

module.exports = roleClaimer;
