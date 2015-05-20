var   models = require('../lib/models')
    , db = require('../lib/db');

/**
 * @api {post} /keg Add a new keg
 * @apiName AddKeg
 * @apiGroup Keg
 *
 * @apiParam {Number} tap Tap number the keg is attached to
 * @apiParam {Number} [beer] ID of the beer in the keg
 * @apiParam {Object} [beer] Beer object to place in keg. Creates if not exist.
 *
 * @apiSuccess (Success) {Number} tap Echo the tap attached to
 * @apiSuccess (Success) {Number} [beer] Echo the beer we filled the keg with [if given]
 *
 * @apiError (Errors) {String} error The error string
 */
function add(req, res) {
    if ( ! req.body) {
        res.status(400).json({ error: "empty or unreadable body" });
        return;
    }

    if (req.body.beer === undefined) {
        res.status(400).json({ error: "beer id not given" });
        return;
    }

    models.nohm.factory('Beer').exists(req.body.beer, function(exists) {
        if (!exists) {
            res.status(400).json({ error: "beer ("+req.body.beer+") does not exist"});
            return;
        }

        models.NewKeg(req.body, function(err, keg) {
            if (err) {
                if (err === 'invalid') {
                    res.status(400).json({error: models.format_invalid(err)});
                } else {
                    res.status(500).json({error: err});
                }
                return;
            }

            db.incr('num_kegs');
            res.status(200).json(keg.allProperties());

        });
    });
};


/**
 * @api {delete} /keg/:id Remove a keg
 * @apiName RemoveKeg
 * @apiGroup Keg
 *
 * @apiSuccess (Success) {Number} tap_date Unix (UTC) timestamp of when the keg was first tapped
 * @apiSuccess (Success) {Number} dead_date Unix (UTC) timestamp of when the keg was last tapped
 * @apiSuccess (Success) {Number} longevity Unix (UTC) timestamp of how long the keg lasted
 *
 * @apiError (Errors) {String} error The error string
 */
function remove(req, res) {
    if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'non-string keg id detected' });
        return;
    }

    var keg = models.nohm.factory('Keg', req.params.id, function(err) {
        keg.remove(function(err) {
            if (err) {
                if (err === 'invalid') {
                    res.status(400).json({error: models.format_invalid(err)});
                } else {
                    res.status(500).json({error: err});
                }
                return;
            }

            db.decr('num_kegs');
            res.status(200).json({});
        });
    });
};


/**
 * @api {patch} /keg Modify a keg
 * @apiName ModifyKeg
 * @apiGroup Keg
 *
 * @apiParam {Number} [tap Change the tap number the keg is attached to
 * @apiParam {Number} [beer] Change the ID of the beer in the keg
 * @apiParam {Object} [beer] Change the beer object in the keg. Creates if not exist.
 * @apiParam {Number} [tap_date] Change the Unix (UTC) timestamp of when the keg was first tapped
 * @apiParam {Number} [start_volume] Change the starting volume of the keg
 * @apiParam {Number} [current_volume] Set the current estimated volume
 * @apiParam {Number} [pours] Number of pours to adjust the keg by
 *
 * @apiSuccess (Echo On Success If Given) {Number} [tap]
 * @apiSuccess (Echo On Success If Given) {Number} [beer]
 * @apiSuccess (Echo On Success If Given) {Object} [beer]
 * @apiSuccess (Echo On Success If Given) {Number} [tap]
 * @apiSuccess (Echo On Success If Given) {Number} [tap_date]
 * @apiSuccess (Echo On Success If Given) {Number} [start_volume]
 * @apiSuccess (Echo On Success If Given) {Number} [current_volume]
 * @apiSuccess (Echo On Success If Given) {Number} [pours]
 *
 * @apiError (Errors) {String} error The error string
 */
function modify(req, res) {
    if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'non-string keg id detected' });
        return;
    }

    var keg = models.nohm.factory('Keg', req.params.id, function(err, properties) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        keg.p(req.body)
        keg.save(function(err) {
            if (err) {
                res.status(500).json({ error: err });
                return;
            }
            res.status(200).json(req.body);
        });
    });
};


/**
 * @api {get} /keg Get a list of all active kegs
 * @apiName ListKegs
 * @apiGroup Keg List
 *
 * @apiSuccess (Success) {Array} kegs Array of keg objects matching the format of a GET:/keg/:id
 *
 * @apiError (Errors) {String} error The error string
 */
function list(req, res) {
    models.Keg.findAndLoad({}, function (err, kegs) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        // TODO: make a "view generator" to handle these sort of things
        for (i in kegs) {
            kegs[i].id = parseInt(kegs[i].id);
        }

        res.status(200).json({kegs: kegs});
    });
};


/**
 * @api {get} /keg/:id Get the details of a keg
 * @apiName ViewKeg
 * @apiGroup Keg
 *
 * @apiSuccess (Success) {Object} beer Beer object matching the format of a GET:/beer/:id that is in the keg
 * @apiSuccess (Success) {Number} tap Tap index the keg is attached to
 * @apiSuccess (Success) {Number} tap_date Unix (UTC) timestamp of when the keg was first tapped
 * @apiSuccess (Success) {Number} start_volume Volume the keg started with
 * @apiSuccess (Success) {Number} current_volume Current (estimated) volume in the keg
 * @apiSuccess (Success) {Number} pours Number of pours recorded from the keg
 *
 * @apiError (Errors) {String} error The error string
 */
function detail(req, res) {
    if (typeof req.params.id !== 'string') {
        res.status(400).json({ error: 'non-string keg id detected' });
        return;
    }

    var keg = models.nohm.factory('Keg', req.params.id, function(err, properties) {
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        res.status(200).json(keg.allProperties());
    });
};

exports.add = add;
exports.remove = remove;
exports.modify = modify;
exports.list = list;
exports.detail = detail;
