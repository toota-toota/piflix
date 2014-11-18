var tvShowService = require('../service/tvShowService');

module.exports = function (app, socketio) {
    app.get('/tv-show/overview', function (req, res) {
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render("tvShowOverview", {'host': host});
    });

    socketio.sockets.on('connection', function (socket) {
        tvShowService.fetchOverview({"set": "1"}, function(response) {
            socket.emit('add-tvshow-items', response);
        });

        socket.on('request-tvshow-items', function (receivedSet) {
            tvShowService.fetchOverview({"set": receivedSet}, function(response) {
                socket.emit('add-tvshow-items', response);
            });
        });

        socket.on('request-tvshowsearch-suggestions', function(enteredText) {
            tvShowService.fetchOverview({"keywords": enteredText}, function(response) {
                socket.emit("replace-tvshow-items", response);
            });
        });

    });
};