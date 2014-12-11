$(function () {
    var host = $('body').data('serverhost');
    var id = $('body').data('id');
    var socket = io.connect(host + '/play');

    var fastBackward = $("#fastBackward");
    var backward = $("#backward");
    var stop = $("#stop");
    var play = $("#play");
    var pause = $("#pause");
    var forward = $("#forward");
    var fastForward = $("#fastForward");

    var stopTorrentButton = $("#stopTorrent");

    socket.on('connected', function() {
        socket.emit('start', id);
    });

    socket.on('buffered', function(percentage) {
        if(percentage == 100) {
            $('#buffered').html('Buffering complete, movie should be playing on your screen!');
        } else {
            $('#buffered').html(percentage + '% buffered');
        }
    });

    socket.on('downloaded', function(percentage) {
        $('#downloaded').html(percentage + '% of download completed');
    });

    socket.on('torrent-stopped', function() {
        $('#buffered').html('Torrent stopped');
        $("#downloaded").html('Player stopped');
    });

    socket.on('torrent-completed', function() {
        $("#downloaded").html('Torrent completed & stopped!');
    });

    stopTorrentButton.on('click', function() {
        socket.emit('stop-torrent');
    });

    fastBackward.on('click', function() {
        socket.emit('fastBackward');
    });

    backward.on('click', function() {
        socket.emit('backward');
    });

    stop.on('click', function() {
        socket.emit('stop');
    });

    play.on('click', function() {
        socket.emit('play');
    });

    pause.on('click', function() {
        socket.emit('pause');
    });

    forward.on('click', function() {
        socket.emit('forward');
    });

    fastForward.on('click', function() {
        socket.emit('fastForward');
    });

});