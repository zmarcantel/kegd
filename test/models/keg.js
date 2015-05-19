var   should = require('should')
    , nohm = require('nohm').Nohm;

var models = require('../../lib/models');


var TEST_KEG_BASE = {
    tap: 3,
    beer: 10,
    tap_date: Math.floor((new Date).getTime() / 1000),
    start_volume: 4.7,
    current_volume: 4.2,
    pours: 8
};

module.exports = function() {
    var keg;
    before(function(done) {
        models.NewKeg(TEST_KEG_BASE, function(err, result) {
            if (err === 'invalid') {
                console.log('properties were invalid: ', result.errors);
                err.should.not.equal('invalid');
            }
    
            should.not.exist(err);
            should.exist(result);
    
            keg = result;
            done();
        });
        
    });
    
    after(function() {
        keg.remove(function (err) {
            should.not.exist(err);
        });
    });
    
    
    describe('fetch and modify', function() {
    
        it('should fetch existing keg using tap number', function(done) {
            var fetched = nohm.factory('Keg', keg.p('tap'), function (err) {
                if (err) {
                    err.should.not.equal('not found');
                    should.not.exist(err);
                }
                var props = fetched.allProperties();
                for (key in props) {
                    if (key === 'id') continue;
                    props[key].should.equal(TEST_KEG_BASE[key]);
                }
    
                done();
            });
        });
    
        it('should reflect changes after modification', function(done) {
            var testing = nohm.factory('Keg', keg.p('tap'), function (err) {
                if (err) {
                    err.should.not.equal('not found');
                    should.not.exist(err);
                }

                var tap_date = Math.floor((new Date).getTime() / 1000);
                testing.p('beer', 4);
                testing.p('tap_date', tap_date);
                testing.p('current_volume', 3.5);
    
                testing.save(function(err) {
                    if (err) {
                        console.log(testing.errors);
                        should.not.exist(err);
                    }
    
                    var fetched = nohm.factory('Keg', testing.p('tap'), function (err, got) {
                        if (err) {
                            console.log(fetched.errors);
                            should.not.exist(err);
                        }
    
                        fetched.p('tap').should.equal(keg.id); // taps == id
                        fetched.p('tap').should.equal(testing.id); // taps == id
    
    
                        got['beer'].should.equal(4);
                        got['tap_date'].should.equal(tap_date);
                        got['current_volume'].should.equal(3.5);
    
                        done();
                    }); // fetch modified
                }); // save modified
            }); // fetch original
        });
    
    });

};
