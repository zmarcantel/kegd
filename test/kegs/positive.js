var   request = require("supertest")
    , util // depends on app, inited in exports function

var app;


//
// single keg tests
//

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

            keg_id = res.body.id;
        });
    });


    // modify the keg
    describe('modify a keg', function() {
        var res, err;

        before(function(done) {
            request(app)
                .patch('/keg/'+keg_id)
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


    // fetch the updated keg details
    describe('get details of a keg', function() {
        var res, err;

        before(function(done) {
            request(app)
                .get('/keg/'+keg_id)
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
    });

};


//
// keg list tests
//

function list() {

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
