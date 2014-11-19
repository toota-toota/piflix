var movieService = require('../service/movieService');

module.exports = function (app, socketio) {
    app.get('/movie/overview', function (req, res) {
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render("movieOverview", {'host': host});
    });

    socketio.sockets.on('connection', function (socket) {

        socket.emit('connected');

        socket.on('request-movie-items', function (receivedSet) {
            movieService.fetchOverview({"sort": "seeds", "set": receivedSet, "limit" : "50"}, function(response) {
                socket.emit('add-movie-items', response);
            });
        });

        socket.on('request-moviesearch-suggestions', function(enteredText) {
            movieService.fetchOverview({"sort": "seeds", "limit" : "50", "keywords": enteredText}, function(response) {
               socket.emit("replace-movie-items", response);
            });
        });

    });
};