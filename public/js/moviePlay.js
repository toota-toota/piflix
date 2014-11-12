$(function () {
    var host = $('body').data('serverhost');
    var id = $('body').data('id');
    var socket = io.connect(host);

    socket.emit('play', id);

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
});