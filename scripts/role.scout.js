var roleScout = {

    run: function(creep) {
        
        if (creep.room.name != "E67N45") {
            creep.moveTo(new RoomPosition(25, 25, "E67N45"));
        }
        else {
            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length > 0) {
                Game.notify("Hostiles from " + hostiles[0].owner.username + " sighted in " + creep.room.name, 5);
            }
            else {
                creep.moveTo(new RoomPosition(25, 25, "E67N45"));
            }
        }
    }
};

module.exports = roleScout;
