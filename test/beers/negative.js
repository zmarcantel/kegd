var   request = require("supertest")
    , util; // depends on app, inited in exports function

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
    util = require('../lib')(app);
    return {
        singles: singles,
        list: list
    };
};
