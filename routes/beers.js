var   db = require('../lib/db')
    , models = require('../lib/models');

/**
 * @api {post} /beer Add a new beer
 * @apiName AddBeer
 * @apiGroup Beer
 *
 * @apiParam {String} name Name of the beer
 * @apiParam {String} [brewery] Brewer of the beer
 * @apiParam {String} [style] Style of the beer
 * @apiParam {String} [country] Country of origin of the beer
 * @apiParam {Number} [abv] Alcohol by volume
 * @apiParam {Number} [ibu] IIBU of the beer
 * @apiParam {Number} [original_gravity] Original gravity of the beer
 * @apiParam {Number} [final_gravity] Final gravity of the beer
 * @apiParam {String} [description] Description of the beer
 *
 * @apiSuccess (Success) {Number} id ID of the beer just created
 *
 * @apiError (Errors) {String} error The error string
 */
function add(req, res) {
    var beer = models.nohm.factory('Beer');
    beer.p(req.body);
    beer.save(function(err) {
        if (err) {
            if (err === 'invalid') {
                res.status(400).json({error: models.format_invalid(err)});
            } else {
                res.status(500).json({error: err});
            }
            return;
        }

        db.incr('num_beers');
        res.status(200).json(beer.allProperties());
    });
};


/**
 * @api {delete} /beer/:id Remove a beer
 * @apiName RemoveBeer
 * @apiGroup Beer
 *
 * @apiError (Errors) {String} error The error string
 */
function remove(req, res) {
    if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'non-string beer id detected' });
        return;
    }

    var beer = models.nohm.factory('Beer', req.params.id, function(err) {
        beer.remove(function(err) {
            if (err) {
                if (err === 'invalid') {
                    res.status(400).json({error: models.format_invalid(err)});
                } else {
                    res.status(500).json({error: err});
                }
                return;
            }

            db.decr('num_beers');
            res.status(200).json({});
        });
    });
};


/**
 * @api {patch} /beer Modify a beer
 * @apiName ModifyBeer
 * @apiGroup Beer
 *
 * Because the 'name' field is the indexed unique key, any renames
 * (where name is given in PATCH json) will be a fetch, modify, save, delete-old.
 *
 * @apiParam {String} [name] Name of the beer
 * @apiParam {String} [brewery] Brewer of the beer
 * @apiParam {String} [style] Style of the beer
 * @apiParam {String} [country] Country of origin of the beer
 * @apiParam {Number} [abv] Alcohol by volume
 * @apiParam {Number} [ibu] IBUE of the beer
 * @apiParam {Number} [original_gravity] Original gravity of the beer
 * @apiParam {Number} [final_gravity] Final gravity of the beer
 * @apiParam {String} [description] Description of the beer
 *
 * @apiSuccess (Echo On Success If Given) {String} [name] Name of the beer
 * @apiSuccess (Echo On Success If Given) {String} [brewery] Brewer of the beer
 * @apiSuccess (Echo On Success If Given) {String} [style] Style of the beer
 * @apiSuccess (Echo On Success If Given) {String} [country] Country of origin of the beer
 * @apiSuccess (Echo On Success If Given) {Number} [abv] Alcohol by volume
 * @apiSuccess (Echo On Success If Given) {Number} [ibu] IBU of the beer
 * @apiSuccess (Echo On Success If Given) {Number} [original_gravity] Original gravity of the beer
 * @apiSuccess (Echo On Success If Given) {Number} [final_gravity] Final gravity of the beer
 * @apiSuccess (Echo On Success If Given) {String} [description] Description of the beer
 *
 * @apiError (Errors) {String} error The error string
 */
function modify(req, res) {
    if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'non-string beer id detected' });
        return;
    }

    var beer = models.nohm.factory('Beer', req.params.id, function(err, properties) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        beer.p(req.body)
        beer.save(function(err) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
            res.status(200).json(req.body);
        });
    });
};


/**
 * @api {get} /beer Get a list of all known beers
 * @apiName ListBeers
 * @apiGroup Beer List
 *
 * @apiSuccess (Success) {Array} beers Array of beer objects matching the format of a GET:/beer/:id
 *
 * @apiError (Errors) {String} error The error string
 */
function list(req, res) {
    models.Beer.findAndLoad({}, function (err, beers) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        res.status(200).json({beers: beers});
    });
};


/**
 * @api {get} /beer/:id Get the details of a beer
 * @apiName ViewBeer
 * @apiGroup Beer
 *
 * @apiSuccess (Success) {String} name Name of the beer
 * @apiSuccess (Success) {String} brewery Brewer of the beer
 * @apiSuccess (Success) {String} style Style of the beer
 * @apiSuccess (Success) {String} country Country of origin of the beer
 * @apiSuccess (Success) {Number} abv Alcohol by volume
 * @apiSuccess (Success) {Number} ibu IBU of the beer
 * @apiSuccess (Success) {Number} original_gravity Original gravity of the beer
 * @apiSuccess (Success) {Number} final_gravity Final gravity of the beer
 * @apiSuccess (Success) {String} description Description of the beer
 *
 * @apiError (Errors) {String} error The error string
 */
function detail(req, res) {
    if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'non-string beer id detected' });
        return;
    }

    var beer = models.nohm.factory('Beer', req.params.id, function(err, properties) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        res.status(200).json(beer.allProperties());
    });
};

exports.add = add;
exports.remove = remove;
exports.modify = modify;
exports.list = list;
exports.detail = detail;
