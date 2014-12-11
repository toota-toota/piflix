$(function () {
    var host = $('body').data('serverhost');
    var socket = io.connect(host + '/serie');
    var set = 1;

    var searchField = $("#search");
    searchField.on('input',function(e){
        socket.emit('request-tvshowsearch-suggestions', searchField.val());
    });

    socket.on('connected', function() {
        socket.emit('request-tvshow-items', set);
    });

    socket.on('add-tvshow-items', function(json) {
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        set++;
    });

    socket.on('replace-tvshow-items', function(json) {
        $("#media").html('');
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        set++;
    });

    var createItemSnippet = function(item) {
        var snippet = "<li>";
        snippet += "<a href=\"/tv-show/details/" + item.id + "\">";
        snippet += "<img src=\"" + item.cover + "\" class='cover-small'/>";
        snippet += "<h5>" + item.title + "</h5>";
        snippet += "</a>";
        snippet += "</li>";
        return snippet;
    };

    $(document).scroll(function () {
        var triggerScroll = $(window).scrollTop() + $(window).height() >= $(document).height();
        if (triggerScroll) {
            socket.emit("request-tvshow-items", set);
        }
    });

});