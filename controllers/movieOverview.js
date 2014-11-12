var movieService = require('../service/movieService');

module.exports = function (app, socketio) {
    app.get('/', function (req, res) {
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render("movieOverview", {'host': host});
    });

    socketio.sockets.on('connection', function (socket) {
        movieService.fetchOverview({"sort": "seeds", "set": "1"}, function(response) {
            socket.emit('add-media-items', response);
        });

        socket.on('request-media-items', function (receivedSet) {
            movieService.fetchOverview({"sort": "seeds", "set": receivedSet}, function(response) {
                socket.emit('add-media-items', response);
            });
        });
    });
};