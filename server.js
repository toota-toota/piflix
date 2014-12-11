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
var io = socketio.listen(app.listen(config.port));

app.set('title', 'piflix');

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, 'app/views'));
app.set("view engine", "jade");

// controllers & sockets
require('./app/routes/routes').initialize(app);
require('./app/sockets/sockets').initialize(io);

// display where we're hosting the server from in the console
require('dns').lookup(os.hostname(), function(err, address, ipFamily) {
    if (!err && address) {
        console.log('PiFlix Started! Navigate to: ');
        console.log('  http://' + address + ':' + config.port);
    } else {
        console.log('  http://' + os.hostname() + ':' + config.port);
    }
});