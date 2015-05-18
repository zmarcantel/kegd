var   request = require("supertest")
    , util // depends on app, inited in exports function
    , db = require('../../lib/db')
    , should = require('should')
    , async = require('async')
;

var models = require('../../lib/models');

var app;

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


//
// single beer tests
//

function singles() {

    // beer id to use for the single beer tests
    // populated on first test (create)
    var beer_id;


    // new name after the rename test
    var renamed_beer = 'just a new test name';

    // create a beer
    describe('add a beer', function() {
        var res, err;

        before(function(done) {
            util.brew(TEST_BEER_BASE, function(e, r) {
                err = e;
                res = r;
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

        // reset the beer to the test base after we
        // butcher it
        after(function(done) {
            request(app)
                .patch('/beer/'+beer_id)
                .send(TEST_BEER_BASE)
                .end(function(e, r) {
                    should.not.exist(e);
                    done();
                });
        });

        describe('with a rename', function() {
            var res, err;

            before(function(done) {
                request(app)
                    .patch('/beer/'+beer_id)
                    .send({name: renamed_beer})
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

            it('should not increase number of beers', function() {
                db.num_beers(function(err, count) {
                    should.not.exist(err);
                    count.should.equal(1);
                    done();
                });
            });

            it('should contain new name on lookup', function(done) {
                request(app)
                    .get('/beer/'+beer_id)
                    .end(function(e, r) {
                        should.not.exist(e);
                        should.exist(r);
                        util.is_sane(r);

                        r.body.name.should.equal('just a new test name');
                        done();
                    });
            });

            it('should only echo name', function() {
                Object.keys (res.body).length.should.equal(1);
                should.exist(res.body.name);
            });
        });

        describe('with fields', function() {
            describe('individually', function() {
                var props = (new models.Beer).properties;
                for (key in props) {
                    if (key === 'name') continue;

                    it('should modify and echo '+key, function(done) {
                        var obj = {};
                        var expected;

                        switch (props[key].type) {
                        case 'string':
                            expected = 'some new string';
                            obj[key] = expected;
                            break;

                        case 'integer':
                            expected = Math.rand(10);
                            obj[key] = expected;
                            break;

                        case 'float':
                            expected = Math.randFloat(10.0);
                            obj[key] = expected;
                            break;

                        default:
                            throw 'hunhandled case: '+key;
                        }

                        
                        request(app)
                            .patch('/beer/'+beer_id)
                            .send(obj)
                            .end(function(e, r) {
                                util.is_sane(r);
                                should.not.exist(e);
                                should.exist(r);
                                Object.keys(r.body).length.should.equal(1);
                                should.exist(r.body[key]);
                                r.body[key].should.equal(expected);
                                done();
                            });
                    });
                } // generated field tests
            });
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

        var obj_keys = Object.keys(TEST_BEER_BASE);
        for (var k = 0; k < obj_keys.length; ++k) {
            (function(index) {
                var key = obj_keys[index];
                it('should have matching '+key, function() {
                    res.body[key].should.equal(TEST_BEER_BASE[key]);
                });
            })(k);
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

    var beer_ids = [];
    var num_beers = 10;

    before(function(done) {
        var funcs = [];
        for (var i = 0; i < num_beers; ++i) {
            var b = {
                name: "Test beer #"+i,
            };

            funcs.push(util.brew_wrap(b));
        }

        async.parallel(funcs, function(errs, responses) {
            if (errs) {
                errs.length.should.equal(0);
            } else { should.not.exist(errs); }

            should.exist(responses);
            responses.length.should.equal(num_beers);

            for (k in responses) {
                should.exist(responses[k].body.id);
                beer_ids.push(responses[k].body.id);
            }

            done();
        });
    });

    after(function(done) {
        var funcs = [];
        for (var i = 0; i < beer_ids.length; ++i) {
            funcs.push(util.brew_cleanup(beer_ids[i]));
        }

        async.parallel(funcs, function(errs, responses) {
            if (errs) {
                console.log(errs);
                errs.length.should.equal(0);
            } else { should.not.exist(errs); }

            should.exist(responses);
            responses.length.should.equal(num_beers);
            done();
        });
    });

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

        it('should have '+num_beers+' beers', function() {
            if (err) { throw err; };
            beer_ids.length.should.equal(num_beers);
        });

        it('should list all beer details', function() {
            res.body.beers.length.should.equal(num_beers);
            for (i in res.body.beers) {
                should.exist(res.body.beers[i].properties);
                Object.keys(res.body.beers[i].properties).length.should.be.greaterThan(0);
            }
        });

        it('should contain all matching ids', function() {
            var fetched_ids = [];
            for (i in beer_ids) {
                fetched_ids.push(res.body.beers[i].id);
            };

            beer_ids.sort();
            fetched_ids.sort();
            for (i in beer_ids) {
                fetched_ids[i].should.equal(beer_ids[i]);
            }
        });
    });

};


module.exports = function(exp_app) {
    app = exp_app;
    util = require('../lib')(app);
    return {
        singles: singles,
        list: list
    };
};
