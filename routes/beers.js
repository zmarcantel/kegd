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
 * @apiParam {Number} [original_gravity] Original gravity of the beer
 * @apiParam {Number} [final_gravity] Final gravity of the beer
 * @apiParam {String} [description] Description of the beer
 *
 * @apiSuccess (Success) {Number} id ID of the beer just created
 *
 * @apiError (Errors) {String} error The error string
 */
function add(req, res) {
    res.json({});
};


/**
 * @api {delete} /beer/:id Remove a beer
 * @apiName RemoveBeer
 * @apiGroup Beer
 *
 * @apiError (Errors) {String} error The error string
 */
function remove(req, res) {
    res.json({});
};


/**
 * @api {patch} /beer Modify a beer
 * @apiName ModifyBeer
 * @apiGroup Beer
 *
 * @apiParam {String} [name] Name of the beer
 * @apiParam {String} [brewery] Brewer of the beer
 * @apiParam {String} [style] Style of the beer
 * @apiParam {String} [country] Country of origin of the beer
 * @apiParam {Number} [abv] Alcohol by volume
 * @apiParam {Number} [original_gravity] Original gravity of the beer
 * @apiParam {Number} [final_gravity] Final gravity of the beer
 * @apiParam {String} [description] Description of the beer
 *
 * @apiSuccess (Echo On Success If Given) {String} [name] Name of the beer
 * @apiSuccess (Echo On Success If Given) {String} [brewery] Brewer of the beer
 * @apiSuccess (Echo On Success If Given) {String} [style] Style of the beer
 * @apiSuccess (Echo On Success If Given) {String} [country] Country of origin of the beer
 * @apiSuccess (Echo On Success If Given) {Number} [abv] Alcohol by volume
 * @apiSuccess (Echo On Success If Given) {Number} [original_gravity] Original gravity of the beer
 * @apiSuccess (Echo On Success If Given) {Number} [final_gravity] Final gravity of the beer
 * @apiSuccess (Echo On Success If Given) {String} [description] Description of the beer
 *
 * @apiError (Errors) {String} error The error string
 */
function modify(req, res) {
    res.json({});
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
    res.json({});
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
 * @apiSuccess (Success) {Number} original_gravity Original gravity of the beer
 * @apiSuccess (Success) {Number} final_gravity Final gravity of the beer
 * @apiSuccess (Success) {String} description Description of the beer
 *
 * @apiError (Errors) {String} error The error string
 */
function detail(req, res) {
    res.json({});
};

exports.add = add;
exports.remove = remove;
exports.modify = modify;
exports.list = list;
exports.detail = detail;
