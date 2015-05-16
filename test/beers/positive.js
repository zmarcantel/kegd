var   request = require("supertest")
    , util = require('../lib');

var app;

//
// single beer tests
//

function singles() {

    // beer id to use for the single beer tests
    // populated on first test (create)
    var beer_id;

    // create a beer
    describe('add a beer', function() {
        var res, err;

        before(function(done) {
            request(app)
                .post('/beer')
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

            beer_id = res.body.id;
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
