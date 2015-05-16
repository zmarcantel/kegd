var   nohm = require('nohm').Nohm;

nohm.setClient(require('../db'));

//
// string types
//

var BASE_STRING = {
    type: 'string',
};

var NONEMPTY_STRING = {
    type: 'string',
    unique: false,
    validations: [
        ['notEmpty']
    ]
};

var UNIQUE_STRING = {
    type: 'string',
    unique: true,
    index: true,
    validations: [
        ['notEmpty'] // implicit, but to be safe
    ]
};


//
// numeric types
//

var UNIQUE_INTEGER = {
    type: 'integer',
    unique: true,
    index: true
};

var POSITIVE_FLOAT = {
    type: 'float',
    validations: [
        //['min', 0.0 ]
    ],
    defaultValue: 0.0
}

var POSITIVE_INTEGER = {
    type: 'integer',
    validations: [
        //['min', 0.0 ]
    ],
    defaultValue: 0
}

//
// date types
//

var BASE_TIMESTAMP = {
    type: 'timestamp',
    validations: [
        //['min', 0.0 ]
    ],
    defaultValue: Math.floor((new Date).getTime() / 1000)
}

//
// keg model
//

exports.Keg = nohm.model('Keg', {
    properties: {
        tap: UNIQUE_INTEGER,
        beer: BASE_STRING,
        tap_date: BASE_TIMESTAMP,
        start_volume: POSITIVE_FLOAT,
        current_volume: POSITIVE_FLOAT,
        pours: POSITIVE_INTEGER
    },
    methods: {
    },
    idGenerator: function (cb) {
        cb(this.p('tap'));
    }
});


exports.NewKeg = function(obj, cb) {
    var keg = nohm.factory('Keg');
    keg.p(obj);

    if (typeof cb == 'function') {
        keg.valid(false, false, function (valid) {
            if (valid === false) {
                return cb(keg.errors, keg);
            }
            keg.save(function (err) {
                cb(err, keg);
            });
        });
    } else {
        return keg;
    }
};



//
// beer model
//

exports.Beer = nohm.model('Beer', {
    properties: {
        name: UNIQUE_STRING,
        brewery: BASE_STRING,
        style: BASE_STRING,
        country: BASE_STRING,
        abv: POSITIVE_FLOAT,
        ibu: POSITIVE_FLOAT,
        original_gravity: POSITIVE_FLOAT,
        final_gravity: POSITIVE_FLOAT,
        description: BASE_STRING,
    },
    methods: {
        get_slug: function() {
            return this.properties.name.value.replace(/\s{1,}/g, '-');
        }
    },
    idGenerator: function (cb) {
        cb(this.get_slug());
    }
});

exports.NewBeer = function(obj, cb) {
    var beer = nohm.factory('Beer');
    beer.p(obj);

    if (typeof cb == 'function') {
        beer.valid(false, false, function (valid) {
            if (valid === false) {
                return cb(beer.errors, beer);
            }
            beer.save(function (err) {
                cb(err, beer);
            });
        });
    } else {
        return beer;
    }
};
