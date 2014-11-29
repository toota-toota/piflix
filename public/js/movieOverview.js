$(function () {
    var host = $('body').data('serverhost');
    var socket = io.connect(host);
    var set = 1;

    var searchField = $("#search");
    searchField.on('input',function(e){
        socket.emit('request-moviesearch-suggestions', searchField.val());
    });

    socket.on('connected', function() {
       socket.emit('request-movie-items', set);
    });

    socket.on('add-movie-items', function(json) {
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        set++;
    });

    socket.on('replace-movie-items', function(json) {
        $("#media").html('');
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        set++;
    });

    var createItemSnippet = function(item) {
        var snippet = "<li>";
        snippet += "<a href=\"/movie/details/" + item.id + "\">";
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