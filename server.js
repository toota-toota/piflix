// JSON files
var config = require('./config.json');

// stdlib inclues
var os = require('os'),
    path = require('path');

// external dependencies
var express = require('express'),
    socketio = require('socket.io');

// initialize application variable; express application
var app = express();

// initialize socket.io listening with express app
var sockio = socketio.listen(app.listen(config.port));

app.set('titie', 'piflix');

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'views'));
app.set("view engine", "jade");

// controllers
require('./controllers/movieOverview')(app, sockio);
require('./controllers/movieDetails')(app, sockio);
require('./controllers/moviePlay')(app, sockio);

require('./controllers/tvShowOverview')(app, sockio);
require('./controllers/tvShowDetails')(app, sockio);


// Start at movie overview page by default
app.get('/', function(req, res) {
    res.redirect('/movie/overview');
});

// display where we're hosting the server from in the console
require('dns').lookup(os.hostname(), function(err, address, ipFamily) {
    if (!err && address) {
        console.log('PiFlix Started! Navigate to: ');
        console.log('  http://' + address + ':' + config.port);
    } else {
        console.log('  http://' + os.hostname() + ':' + config.port);
    }
})