module.exports = function (io) {
    var movieService = require('../service/movieService');
    var playerService = require('../service/playerService');
    var fileSystemService = require('../service/fileSystemService');

    var movieSubtitleService = require('../service/movieSubtitleService');

    io.on('connection', function (socket) {
        socket.emit('connected');
        socket.on('request-movie-items', function (receivedSet) {
            movieService.fetchOverview({"sort": "seeds", "set": receivedSet, "limit": "50"}, function (response) {
                socket.emit('add-movie-items', response);
            });
        });

        socket.on('request-moviesearch-suggestions', function (enteredText) {
            movieService.fetchOverview({"sort": "seeds", "limit": "50", "keywords": enteredText}, function (response) {
                socket.emit("replace-movie-items", response);
            });
        });

        socket.on('request-details', function (data) {
            console.log('server got request for details of id: ' + data.id);
            movieService.fetchDetails(data.id, function (details) {
                socket.emit('response-details', details);
            })
        });


        socket.on('start-torrent', function (data) {

            console.log('socket on start');

            fileSystemService.clearTempFolder(function () {
                console.log('cleared temp folder');
                movieService.fetchDetails(data.id, function (response) {
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