module.exports = function(app) {
    return {
        positive: require('./positive')(app),
        negative: require('./negative')(app)
    };
};
