var   request = require("supertest")
    , should = require('should')
    , async = require('async')
;

var   models = require('../../lib/models')
    , db = require('../../lib/db')
    , util // depends on app, inited in exports function
;

var app;


//
// single keg tests
//

var TEST_KEG_BASE = {
    tap: 3,
    beer: 10,
    tap_date: new Date,
    start_volume: Math.random(4.0, 5.0),
    current_volume: Math.random(3.0, 4.0),
    pours: Math.floor(Math.random(10))
};

function singles() {

    // keg id to use for the single keg tests
    // populated on first test (create)
    var keg_id;

    // create a keg
    describe('add a keg', function() {
        var res, err;

        before(function(done) {
            request(app)
                .post('/keg')
                .send(TEST_KEG_BASE)
                .end(function(e, r) {
                    res = r;
                    err = e;
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);

            keg_id = res.body.id;
        });

        it('should increase num_kegs', function(done) {
            db.num_kegs(function(err, count) {
                should.not.exist(err);
                count.should.equal(1);
                done();
            });
        });
    });


    // fetch the keg details
    describe('get details of a keg', function() {
        var res, err;

        before(function(done) {
            request(app)
                .get('/keg/'+keg_id)
                .end(function(e, r) {
                    res = r;
                    err = e;

                    should.not.exist(err);
                    should.exist(res);
                    done();
                });
        });

        it('is sane', function() {
            if (err) { throw err; };
            util.is_sane(res);
        });

        var props = (new models.Keg).properties;
        for (k in props) {
            (function(key) {
                it('should have matching '+key, function() {
                    if (key === 'tap_date') {
                        res.body[key].should
                            .equal( TEST_KEG_BASE[key].getTime() );
                        return;
                    }
                    res.body[key].should.equal(TEST_KEG_BASE[key]);
                });
            })(k);
        }
    });


    // modify the keg
    describe('modify a keg', function() {
        // reset the beer to the test base after we
        // butcher it
        after(function(done) {
            request(app)
                .patch('/keg/'+keg_id)
                .send(TEST_KEG_BASE)
                .end(function(e, r) {
                    should.not.exist(e);
                    done();
                });
        });

        var props = (new models.Keg).properties;
        for (k in props) {
            if (k === 'name') continue;

            (function(key) {
                it('should modify and echo '+key, function(done) {
                    var obj = {};
                    var expected;

                    switch (props[key].type) {
                    case 'string':
                        expected = 'some new string';
                        obj[key] = expected;
                        break;

                    case 'integer':
                        expected = Math.floor(Math.random(10));
                        obj[key] = expected;
                        break;

                    case 'float':
                        expected = Math.random(10.0);
                        obj[key] = expected;
                        break;

                    case 'timestamp':
                        expected = ((new Date).getTime() / 1000);
                        obj[key] = expected;
                        break;

                    default:
                        throw 'unhandled case: '+key;
                    }

                    
                    request(app)
                        .patch('/keg/'+keg_id)
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
            })(k);
        } // generated field tests
    });


    // remove the keg
    describe('remove a keg', function() {
        var res, err;

        before(function(done) {
            request(app)
                .delete('/keg/'+keg_id)
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

        it('should decrease num_kegs', function(done) {
            db.num_kegs(function(err, count) {
                should.not.exist(err);
                count.should.equal(0);
                done();
            });
        });

        it('is no longer fetchable', function(done) {
            request(app)
                .get('/keg/'+keg_id)
                .end(function(e, r) {
                    should.exist(r.body.error);
                    r.body.error.should.equal('not found');
                    done();
                });
        });
    });

};


//
// keg list tests
//

function list() {

    var keg_ids = [];
    var num_kegs = 10;

    before(function(done) {
        var funcs = [];
        for (var i = 0; i < num_kegs; ++i) {
            var b = {
                tap: i
            };

            funcs.push(util.buy_keg_wrap(b));
        }

        async.series(funcs, function(errs, responses) {
            if (errs) {
                console.log(errs);
                errs.length.should.equal(0);
            } else { should.not.exist(errs); }

            should.exist(responses);
            responses.length.should.equal(num_kegs);

            for (k in responses) {
                should.exist(responses[k].body.id);
                keg_ids.push(responses[k].body.id);
            }

            done();
        });
    });

    after(function(done) {
        var funcs = [];
        for (var i = 0; i < keg_ids.length; ++i) {
            funcs.push(util.sell_keg_wrap(keg_ids[i]));
        }

        async.parallel(funcs, function(errs, responses) {
            if (errs) {
                console.log(errs);
                errs.length.should.equal(0);
            } else { should.not.exist(errs); }

            should.exist(responses);
            responses.length.should.equal(num_kegs);
            done();
        });
    });

    // get list of kegs
    describe('list all kegs', function() {
        var res, err;

        before(function(done) {
            request(app)
                .get('/keg')
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

        it('should have '+num_kegs+' kegs', function() {
            if (err) { throw err; };
            keg_ids.length.should.equal(num_kegs);
        });

        it('should list all keg details', function() {
            res.body.kegs.length.should.equal(num_kegs);
            for (i in res.body.kegs) {
                should.exist(res.body.kegs[i].properties);
                Object.keys(res.body.kegs[i].properties).length.should.be.greaterThan(0);
            }
        });

        it('should contain all matching ids', function() {
            var fetched_ids = [];
            for (i in keg_ids) {
                fetched_ids.push(res.body.kegs[i].id);
            };

            keg_ids.sort();
            fetched_ids.sort();

            for (i in keg_ids) {
                fetched_ids[i].should.equal(keg_ids[i]);
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
