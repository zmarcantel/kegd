var   request = require("supertest")
    , util = require('../lib')
    , db = require('../../lib/db')
    , should = require('should');

var app;

//
// single beer tests
//

function singles() {

    var TEST_BEER_BASE = {
        name: 'test beer',
        brewery: 'test brewery',
        style: 'IPA',
        country: 'USA',
        abv: 5.8,
        original_gravity: 1.070,
        final_gravity: 1.012,
        ibu: 85,
        description: 'Sweet and bitter!'
    };


    // beer id to use for the single beer tests
    // populated on first test (create)
    var beer_id;

    // create a beer
    describe('add a beer', function() {
        var res, err;

        before(function(done) {
            request(app)
                .post('/beer')
                .send(TEST_BEER_BASE)
                .end(function(e, r) {
                    res = r;
                    err = e;
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);

            beer_id = res.body.id;
        });

        it('should increase num_beers', function(done) {
            db.num_beers(function(err, count) {
                should.not.exist(err);
                count.should.equal(1);
                done();
            });
        });
    });


    // modify the beer
    describe('modify a beer', function() {
        var res, err;

        before(function(done) {
            request(app)
                .patch('/beer/'+beer_id)
                .send({})
                .end(function(e, r) {
                    res = r;
                    err = e;
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);
        });
    });


    // fetch the updated beer details
    describe('get details of a beer', function() {
        var res, err;

        before(function(done) {
            request(app)
                .get('/beer/'+beer_id)
                .end(function(e, r) {
                    res = r;
                    err = e;
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);
        });

        for (key in TEST_BEER_BASE) {
            it('should have matching '+key, function() {
                res.body[key].should.equal(TEST_BEER_BASE[key]);
            });
        };
    });


    // remove the beer
    describe('remove a beer', function() {
        var res, err;

        before(function(done) {
            request(app)
                .delete('/beer/'+beer_id)
                .end(function(e, r) {
                    res = r;
                    err = e;
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);
        });

        it('should decrease num_beers', function(done) {
            db.num_beers(function(err, count) {
                should.not.exist(err);
                count.should.equal(0);
                done();
            });
        });
    });

};


//
// beer list tests
//

function list() {

    // get list of beers
    describe('list all beers', function() {
        var res, err;

        before(function(done) {
            request(app)
                .get('/beer')
                .end(function(e, r) {
                    res = r;
                    err = e;
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);
        });
    });

};


module.exports = function(exp_app) {
    app = exp_app;
    return {
        singles: singles,
        list: list
    };
};
