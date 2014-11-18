var tvShowService = require('../service/tvShowService');

module.exports = function (app, socketio) {
    app.get('/', function (req, res) {
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render("movieOverview", {'host': host});
    });

    socketio.sockets.on('connection', function (socket) {
        tvShowService.fetchOverview({"sort": "seeds", "set": "1", "limit" : "50"}, function(response) {
            socket.emit('add-media-items', response);
        });

        socket.on('request-media-items', function (receivedSet) {
            tvShowService.fetchOverview({"sort": "seeds", "set": receivedSet, "limit" : "50"}, function(response) {
                socket.emit('add-media-items', response);
            });
        });

        socket.on('request-search-suggestions', function(enteredText) {
            tvShowService.fetchOverview({"sort": "seeds", "limit" : "50", "keywords": enteredText}, function(response) {
                socket.emit("replace-media-items", response);
            });
        });

    });
};