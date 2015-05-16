var should = require('should');

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


module.exports = {
    is_sane: is_sane
};
