var   request = require("supertest")
    , util = require('../lib');

var app;

function singles() {
    //
    // add error tests here
    //
};

function list() {
    //
    // add error tests here
    //
};

module.exports = function(exp_app) {
    app = exp_app;
    return {
        singles: singles,
        list: list
    };
};
