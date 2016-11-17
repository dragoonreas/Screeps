module.exports = {
    run: function(creep) {
        if (creep.room != "E68N44") {
            creep.moveTo(new RoomPosition(25, 11, "E68N44"));
        } else {
            if (creep.room.controller) {
                if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};
