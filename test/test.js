var   should = require("should")
    , request = require("supertest")
    , util = require('./lib');

var   app = require('../');

//
// beer tests
//

describe('Kegs', function() {

    var keg_tests = require('./kegs')(app);

    describe('single kegs', function() {
        describe('positive', keg_tests.positive.singles);
        describe('negative', keg_tests.negative.singles);
    });

    describe('keg list', function() {
        describe('positive', keg_tests.positive.list);
        describe('negative', keg_tests.negative.list);
    });

});

//
// beer tests
//

describe('Beers', function() {

    var beer_tests = require('./beers')(app);

    describe('single beers', function() {
        describe('positive', beer_tests.positive.singles);
        describe('negative', beer_tests.negative.singles);
    });

    describe('beer list', function() {
        describe('positive', beer_tests.positive.list);
        describe('negative', beer_tests.negative.list);
    });

});

//
// database model tests
//

describe('Models', function() {
    var model_tests = require('./models');

    describe('Beer', model_tests.beer);
    describe('Keg', model_tests.keg);

});
