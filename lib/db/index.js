var   redis = require("redis");

//
// base beer operations
//

redis.RedisClient.prototype.num_beers = function() {
    if (arguments.length === 0) return;

    var offset = 0;
    var pass_err = true;
    var cb = function(){};
    if (typeof arguments[0] === typeof false) {
        pass_err = arguments[offset];
        offset += 1;
        cb = arguments[offset];
    } else  {
        cb = arguments[offset];
    }

    offset += 1

    var preset = Array.prototype.slice.call(arguments, offset);
    this.get('num_beers', function (err, value) {
        var add = pass_err ? [ err, parseInt(value) ]
                         : [ parseInt(value) ];

        cb.apply(cb, preset.concat(add));
    });
};

redis.RedisClient.prototype.next_beer_id = function() {
    return this.num_beers();
};


//
// base keg operations
//

redis.RedisClient.prototype.num_kegs = function() {
    if (arguments.length === 0) return;

    var offset = 0;
    var pass_err = true;
    var cb = function(){};
    if (typeof arguments[0] === typeof false) {
        pass_err = arguments[offset];
        offset += 1;
        cb = arguments[offset];
    } else  {
        cb = arguments[offset];
    }

    offset += 1

    var preset = Array.prototype.slice.call(arguments, offset);
    this.get('num_kegs', function (err, value) {
        var add = pass_err ? [ err, parseInt(value) ]
                         : [ parseInt(value) ];

        cb.apply(cb, preset.concat(add));
    });
};

redis.RedisClient.prototype.next_keg_id = function() {
    return this.num_kegs();
};

var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
    throw err;
});

client.on("connect", function (err) {
    if (err) {
        throw err;
    } else {
        console.log('connected to Redis');
    }
});

module.exports = client;
