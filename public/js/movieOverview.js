$(document).ready(function () {
    var host = $('body').data('serverhost');
    console.log('host: ' + host);
    var socket = io.connect(host + '/movie');
    var set = 1;
    var torrentStartStop = $('#torrentStartStop');

    var searchField = $("#search");
    searchField.on('input', function (e) {
        socket.emit('request-moviesearch-suggestions', searchField.val());
    });

    torrentStartStop.on('click', function () {
        var id = $('#media-info').data(id);
        socket.emit('start-torrent', id);
    });

    socket.on('buffered', function (percentage) {
        console.log('buffered: ' + percentage);
        $('#streamBar').show();
        $('#streamBar').css('width', percentage+'%').attr('aria-valuenow', percentage);
        if(percentage === 100) {
            $('#media-control').show();
        }
    });

    socket.on('downloaded', function (percentage) {
        $('#completeBar').show();
        $('#completeBar').css('width', percentage+'%').attr('aria-valuenow', percentage);
    });

    socket.on('connected', function () {
        socket.emit('request-movie-items', set);
    });

    socket.on('add-movie-items', function (json) {
        json.items.forEach(function (item) {
            $("#media").append(createItemSnippet(item));
        });
        set++;
    });

    socket.on('replace-movie-items', function (json) {
        $("#media").html('');
        json.items.forEach(function (item) {
            $("#media").append(createItemSnippet(item));
        });
        set++;
    });

    $(document.body).on('click', '.contentItem', function () {
        var id = $(this).data('id');
        socket.emit('request-details', {
            id: id
        });
        socket.emit('stop-torrent');
        socket.emit('stop');
    });

    socket.on('response-details', function (details) {
        $("#media-info").data('id', details.id);
        $("#media-title").html(details.title);
        $("#media-img").attr('src', details.coverMedium);
        $("#media-description").html(details.descriptionLong.substring(0, 600) + " ...");

        $('#media-control').hide();
        $('#streamBar').hide();
        $('#completeBar').hide();
    });

    var createItemSnippet = function (item) {
        var snippet = "<li>";
        // item.id has id
        snippet += "<a href='#' class='contentItem' data-id='" + item.id + "'>";
        snippet += "<img src=\"" + item.cover + "\" />";
        snippet += "<h5>" + item.title + "</h5>";
        snippet += "</a>";
        snippet += "</li>";
        return snippet;
    };


    $(document).scroll(function () {
        var triggerScroll = $(window).scrollTop() + $(window).height() >= $(document).height();
        if (triggerScroll) {
            socket.emit("request-movie-items", set);
        }
    });

});