var   redis = require("redis");

//
// base beer operations
//

redis.RedisClient.prototype.num_beers = function() {
    var num = this.get('num_beers');
    if (num === false) { // no such key
        this.set('num_beers', 0);
        num = 0;
    }

    return num;
};

redis.RedisClient.prototype.next_beer_id = function() {
    return this.num_beers();
};


//
// base keg operations
//

redis.RedisClient.prototype.num_kegs = function() {
    var num =  this.get('num_kegs');
    if (num === false) { // no such key
        this.set('num_kegs', 0);
        num = 0;
    }

    return num;
};

redis.RedisClient.prototype.next_keg_id = function() {
    return this.num_kegs();
};

module.exports = redis.createClient();
