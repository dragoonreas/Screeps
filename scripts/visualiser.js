// Functions for use with Screeps Visual: https://github.com/screepers/screeps-visual
let colours = [];
let COLOUR_BLACK = colours.push('#000000') - 1;
let COLOUR_PATH = colours.push('rgba(255,255,255,0.5)') - 1;

let visualiser = {
    /*
        Example function to render creep paths from: https://github.com/screepers/screeps-visual
        Modified to also show paths created by the traveler script by bonzaiferroni
    */
    movePaths: function() {
        _.each(Game.rooms, (r,rn) => {
            let visual = new Visual(rn);
            visual.defineColors(colours);
            visual.setLineWidth = 0.5;
            
            _.each(Game.creeps, (c) => {
                if (c.room.name != rn) { return; }
                
                let pathingMethod = "_move";
                let pathData = _.get(c.memory, [pathingMethod, "path"], undefined);
                if (pathData == undefined) {
                    pathingMethod = "_travel";
                    
                    if (_.get(c.memory, [pathingMethod, "tick"], 0) != Game.time) {
                        return;
                    }
                    else {
                        pathData = _.get(c.memory, [pathingMethod, "path"], undefined);
                    }
                }
                else {
                    pathData = Room.deserializePath(pathData);
                }
                
                if (pathData == undefined || pathData.length <= 0) { return; }
                
                let path = undefined;
                if (pathingMethod == "_move") {
                    path = _.map(pathData, (sP) => ([sP.x, sP.y]));
                }
                else if (pathingMethod == "_travel") {
                    let stepPos = {
                        x: _.get(c.memory, [pathingMethod, "prev", "x"], c.pos.x)
                        , y: _.get(c.memory, [pathingMethod, "prev", "y"], c.pos.y)
                    };
                    path = [[stepPos.x, stepPos.y]];
                    _.each(pathData, (d) => {
                        switch (Number(d)) {
                            case TOP_RIGHT: stepPos.y = stepPos.y - 1;
                            case RIGHT: stepPos.x = stepPos.x + 1; break;
                            case BOTTOM_RIGHT: stepPos.x = stepPos.x + 1;
                            case BOTTOM: stepPos.y = stepPos.y + 1; break;
                            case BOTTOM_LEFT: stepPos.y = stepPos.y + 1;
                            case LEFT: stepPos.x = stepPos.x - 1; break;
                            case TOP_LEFT: stepPos.x = stepPos.x - 1;
                            case TOP: stepPos.y = stepPos.y - 1; break;
                            default: console.log(d + " didn't match a direction during path visualisation for: " + c.name); break;
                        }
                        
                        if (stepPos.x < 0 || stepPos.x >= 50 || stepPos.y < 0 || stepPos.y >= 50) {
                            return false; // stop if the path goes into a new room
                        }
                        else {
                            path.push([stepPos.x, stepPos.y]);
                        }
                    });
                }
                else {
                    return;
                }
                
                visual.drawLine(path
                    , COLOUR_PATH
                    , { lineWidth: 0.1 }
                );
            });
            
            visual.commit();
        });
    }
};

module.exports = visualiser;
