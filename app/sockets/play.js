var fileSystemService = require('../service/fileSystemService'),
    playerService = require('../service/playerService'),
    movieService = require('../service/movieService'),
    movieSubtitleService = require('../service/movieSubtitleService');

module.exports = function (io) {

    io.on('connection', function(socket) {
       socket.emit('connected');

        socket.on('start', function (id) {

            console.log('socket on start');

            fileSystemService.clearTempFolder(function () {
                console.log('cleared temp folder');
                movieService.fetchDetails(id, function (response) {
                    // TODO remove the timeout
                    console.log('fetched movie details');
                    setTimeout(movieSubtitleService.getPathToSubtitles(response.imdbCode, function (subtitlePath) {

                        console.log("magnet: " + response.magnetUrl);

                        playerService.playMagnet(response.magnetUrl, subtitlePath);
                    }), 2000);
                });
            });
        });

        socket.on('stop-torrent', function () {
            playerService.stopTorrent('torrent-stopped');
        });

        socket.on('play-pause', function () {
            playerService.playPause('play-paused');
        });

        socket.on('stop', function () {
            playerService.stop();
        });

        socket.on('pause', function () {
            playerService.pause();
        });

        socket.on('play', function () {
            playerService.play();
        });

        socket.on('forward', function () {
            playerService.seekForward();
        });

        socket.on('fastForward', function () {
            playerService.seekFastForward();
        });

        socket.on('backward', function () {
            playerService.seekBackward();
        });

        socket.on('fastBackward', function () {
            playerService.seekFastBackward();
        });

        playerService.eventEmitter.on('buffered', function (percentage) {
            console.log('buffered: ' + percentage);
            socket.emit('buffered', percentage);
        });

        playerService.eventEmitter.on('downloaded', function (percentage) {
            console.log('downloaded: ' + percentage);
            socket.emit('downloaded', percentage);
        });

        playerService.eventEmitter.on('play-paused', function () {
            // whatever ..
        });

        playerService.eventEmitter.on('torrent-stopped', function () {
            console.log('torrent stopped');
            socket.emit('torrent-stopped');
        });

        playerService.eventEmitter.on('torrent-completed', function () {
            console.log('torrent completed');
            socket.emit('torrent-completed');
        });
    });


};