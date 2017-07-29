let prototypeGameMarket = function() {
    
    _.defaults(Game.market._orderCache, {
        tick: Game.time
        , [ORDER_SELL]: {}
        , [ORDER_BUY]: {}
    });
    
    if (_.get(Game.market._orderCache, ["tick"], 0) != Game.time) {
        Game.market._orderCache = {
            tick: Game.time
            , [ORDER_SELL]: {}
            , [ORDER_BUY]: {}
        };
    }
    
    if (Game.market.orderCache == undefined) {
        Game.market.orderCache = function(orderType, resourceType) {
            if (_.isString(orderType) == false 
                || _.isString(resourceType) == false) {
                console.log("ERROR: Incorrect order or resource type given to order cache. orderType: " + orderType + ", resourceType: " + resourceType);
                return [];
            }
            let theOrders = _.get(Game.market._orderCache, [orderType, resourceType], undefined);
            if (_.isArray(theOrders) == false) {
                theOrders = Game.market.getAllOrders((o) => (
                    o.type == orderType 
                    && o.resourceType == resourceType
                    && o.amount >= 10 
                    && o.price >= 0.001
                ));
                _.set(Game.market._orderCache, [orderType, resourceType], theOrders);
            }
            return theOrders;
        }
    }
}

module.exports = prototypeGameMarket;
