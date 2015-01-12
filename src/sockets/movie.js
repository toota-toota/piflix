
module.exports = function(io) {
    var movieService = require('../service/movieService');
    io.on('connection', function (socket) {
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

        socket.on('request-details', function(data) {
            console.log('server got request for details of id: ' + data.id);
            movieService.fetchDetails(data.id, function(details) {
                socket.emit('response-details', details);
            })
        });

    });
};