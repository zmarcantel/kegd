var   should = require('should')
    , nohm = require('nohm').Nohm;

var models = require('../../lib/models');


var TEST_BEER_BASE = {
    name: 'test beer',
    brewery: 'test brewery',
    style: 'IPA',
    country: 'USA',
    abv: 5.8,
    original_gravity: 1.070,
    final_gravity: 1.012,
    ibu: 85,
    description: 'Sweet and bitter!'
};

module.exports = function() {
    var beer;
    before(function(done) {
        models.NewBeer(TEST_BEER_BASE, function(err, result) {
            if (err === 'invalid') {
                console.log('properties were invalid: ', result.errors);
            }
    
            should.not.exist(err);
            should.exist(result);
    
            beer = result;
            done();
        });
        
    });
    
    after(function() {
        beer.remove(function (err) {
            should.not.exist(err);
        });
    });
    
    
    describe('id generations', function() {
    
        it('should have a hyphenated slug', function() {
            beer.get_slug().should.equal('test-beer');
        });
    
    });
    
    
    
    describe('fetch and modify', function() {
    
        it('should fetch existing beer using get_slug()', function(done) {
            var fetched = nohm.factory('Beer', beer.get_slug(), function (err) {
                if (err) {
                    err.should.not.equal('not found');
                    should.not.exist(err);
                }
                var props = fetched.allProperties();
                for (key in props) {
                    if (key === 'id') continue;
                    props[key].should.equal(TEST_BEER_BASE[key]);
                }
    
                done();
            });
        });
    
        it('should reflect changes after modification', function(done) {
            var testing = nohm.factory('Beer', beer.get_slug(), function (err) {
                if (err) {
                    err.should.not.equal('not found');
                    should.not.exist(err);
                }
    
                testing.p('ibu', 70);
                testing.p('abv', 5.5);
                testing.p('brewery', 'TestCo Brewing');
    
                testing.save(function(err) {
                    if (err) {
                        console.log(testing.errors);
                        should.not.exist(err);
                    }
    
                    var fetched = nohm.factory('Beer', testing.get_slug(), function (err, got) {
                        if (err) {
                            console.log(fetched.errors);
                            should.not.exist(err);
                        }
    
                        fetched.get_slug().should.equal(beer.get_slug());
                        fetched.get_slug().should.equal(testing.get_slug());
    
    
                        got['ibu'].should.equal(70);
                        got['abv'].should.equal(5.5);
                        got['brewery'].should.equal('TestCo Brewing');
    
                        done();
                    }); // fetch modified
                }); // save modified
            }); // fetch original
        });
    
    });

};
