var express = require('express');
var app = express();
var socketio = require('socket.io').listen(app.listen(3000));

app.set("views", __dirname + "/views");
app.set("view engine", "jade");
app.use(express.static(__dirname + '/public'));


require('./controllers/movieOverview')(app, socketio);
require('./controllers/movieDetails')(app, socketio);
require('./controllers/moviePlay')(app, socketio);


console.log('PiFlix started, navigate with a browser to http://raspberry-pi:3000');