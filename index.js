var   express = require('express')
    , exphbs  = require('express-handlebars')
    , fs = require('fs');

var   keg = require("./routes/kegs")
    , beer = require("./routes/beers");

//
// init
//

var app = express();

var have_docs = fs.existsSync('./docs');

//
// layouts
//

app.engine('hbs', exphbs({defaultLayout: 'main', extname: 'hbs'}));
app.set('view engine', 'hbs');


//
// route registration
//

// docs
if (have_docs) {
    console.log('Serving documentation at /docs');
    app.use('/docs', express.static(__dirname + '/docs', {
        dotfiles: 'ignore',
        etag: false,
        index: 'index.html'
    }));
}


// index
app.get('/', function (req, res) {
    res.render('index');
});

// keg routes
app.route('/keg')
    .get(keg.list)
    .post(keg.add);
app.route('/keg/:id')
    .get(keg.detail)
    .delete(keg.remove)
    .patch(keg.modify);

// beer routes
app.route('/beer')
    .get(beer.list)
    .post(beer.add);
app.route('/beer/:id')
    .get(beer.detail)
    .delete(beer.remove)
    .patch(beer.modify);


//
// kick the server
//

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Kegbot listening at http://%s:%s', host, port);
});


module.exports = app;
