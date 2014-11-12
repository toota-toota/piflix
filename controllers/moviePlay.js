var movieService = require('../service/movieService'),
    magnetVideoService = require('../service/magnetVideoService');

module.exports = function (app, socketio) {

    app.get('/movie/play/:id', function (req, res) {
        var id = req.params.id;
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render('moviePlay', {
            "id": id,
            "host": host
        });
    });

    socketio.sockets.on('connection', function (socket) {
        socket.on('play', function(id) {
            movieService.fetchDetails(id, function (response) {
                magnetVideoService.play(response.magnetUrl);
            });
        });

        magnetVideoService.eventEmitter.on('buffered', function (percentage) {
            socketio.emit('buffered', percentage);
        });

        magnetVideoService.eventEmitter.on('downloaded', function (percentage) {
            socketio.emit('downloaded', percentage);
        });
    });

};