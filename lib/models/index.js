var   nohm = require('nohm').Nohm;

nohm.setClient(require('../db'));

//
// string types
//

var BASE_STRING = {
    type: 'string',
    defaultValue: ''
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

var INDEXED_STRING = {
    type: 'string',
    index: true
};


//
// numeric types
//

var UNIQUE_INTEGER = {
    type: 'integer',
    unique: true,
    index: true,
    defaultValue: 0
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
// contructed IDs
//

// seems silly, actaully pretty fast
var BEER_ID = JSON.parse(JSON.stringify(POSITIVE_INTEGER));
BEER_ID.unique = true;
BEER_ID.indexed = true;
BEER_ID.defaultValue = 0;

// seems silly, actaully pretty fast
var KEG_ID = JSON.parse(JSON.stringify(POSITIVE_INTEGER));
KEG_ID.unique = true;
KEG_ID.indexed = true;
KEG_ID.defaultValue = 0;


//
// keg model
//

exports.Keg = nohm.model('Keg', {
    properties: {
        tap: KEG_ID,
        beer: POSITIVE_INTEGER,
        capacity: POSITIVE_FLOAT,
        tap_date: BASE_TIMESTAMP,
        start_volume: POSITIVE_FLOAT,
        current_volume: POSITIVE_FLOAT,
        pours: POSITIVE_INTEGER
    },
    methods: {
    },
    idGenerator: function (cb) {
        cb(this.p("tap"));
    }
});


exports.NewKeg = function(obj, cb) {
    var keg = nohm.factory('Keg');
    keg.p(obj);

    if (typeof cb == 'function') {
        keg.valid(false, false, function (valid) {
            if (valid === false) {
                return cb(format_invalid(keg.errors), keg);
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
        brewery: INDEXED_STRING,
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
    idGenerator: 'increment'
});

exports.NewBeer = function(obj, cb) {
    var beer = nohm.factory('Beer');
    beer.p(obj);

    if (typeof cb == 'function') {
        beer.valid(false, false, function (valid) {
            if (valid === false) {
                return cb(format_invalid(beer.errors), beer);
            }
            beer.save(function (err) {
                cb(err, beer);
            });
        });
    } else {
        return beer;
    }
};

function format_invalid(err) {
    var result = {};
    for (key in err) {
        if (err[key].length > 0) {
            result[key] = err[key][0];
        }
    }

    return result;
};
exports.format_invalid = format_invalid;

exports.nohm = nohm;
