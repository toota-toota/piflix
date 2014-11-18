var movieService = require('../service/movieService'),
    playerService = require('../service/playerService'),
    movieSubtitleService = require('../service/movieSubtitleService'),
    proc = require('child_process'),
    configService = require('../service/configService');

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
        socket.on('play', function (id) {
            movieService.fetchDetails(id, function (response) {

                // TODO do cleaning on tempPath somewhere else ...
                configService.get('tempPath', function (tempPath) {
                    proc.exec('rm -rf ' + tempPath + ' ; mkdir ' + tempPath);

                    // TODO remove the timeout
                    setTimeout(movieSubtitleService.getPathToSubtitles(response.imdbCode, function (subtitlePath) {
                        playerService.playMagnet(response.magnetUrl, subtitlePath);
                    }), 2000);
                });
            });
        });

        socket.on('stop', function () {
            playerService.stop();
        });

        playerService.eventEmitter.on('buffered', function (percentage) {
            socketio.emit('buffered', percentage);
        });

        playerService.eventEmitter.on('downloaded', function (percentage) {
            socketio.emit('downloaded', percentage);
        });

        playerService.eventEmitter.on('download-stopped', function () {
            socketio.emit('download-stopped');
        });
    });

};