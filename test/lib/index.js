var   should = require('should')
    , request = require("supertest");

var app;

function no_error(res) {
    should.not.exist(res.body.error);
};

function is_ok(res) {
    res.status.should.equal(200);
};

function is_json(res) {
    res.headers['content-type'].should.match(/json/);
};

function is_sane(res) {
    no_error(res);
    is_ok(res);
    is_json(res);
};

//
// helper functions
//

function brew(obj, cb) {
    request(app)
        .post('/beer')
        .send(obj)
        .end(function(err, res) {
            cb(err, res);
        });
}
function brew_wrap(obj) {
    return function(cb) {
        brew(obj, cb);
    }
}
function clean_brew(id, cb) {
    request(app)
        .delete('/beer/'+id)
        .end(function(err, res) {
            cb(err, res);
        });
}
function brew_cleanup(id) {
    return function(cb) {
        clean_brew(id, cb);
    }
}



module.exports = function(exp_app) {
    app = exp_app;
    return {
          is_sane: is_sane
        , brew: brew
        , brew_wrap: brew_wrap
        , clean_brew: clean_brew
        , brew_cleanup: brew_cleanup
    };
};
