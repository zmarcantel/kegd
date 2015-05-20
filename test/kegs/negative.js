var   request = require("supertest")
    , should = require('should')
    , async = require('async')
;

var   models = require('../../lib/models')
    , db = require('../../lib/db')
    , util // depends on app, inited in exports function
;

var app;

function singles() {
    describe('keg creation', function() {
        describe('non-existant beer in keg', function() {
            it('should give "no such beer" error', function(done) {
                request(app)
                    .post('/keg')
                    .send({tap: 50, beer:100000})
                    .end(function(err, res) {
                        should.exist(err);
                        res.body.error.should.equal('beer (100000) does not exist');
                        done();
                    });
            });
        });
    });
};

function list() {
    //
    // add error tests here
    //
};

module.exports = function(exp_app) {
    app = exp_app;
    util = require('../lib')(app);
    return {
        singles: singles,
        list: list
    };
};
