$(function () {
    var host = $('body').data('serverhost');
    var socket = io.connect(host);
    var receivedSet = 1;

    socket.on('add-media-items', function(json) {
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        receivedSet++;
    });

    var createItemSnippet = function(item) {
        var snippet = "<li>";
        snippet += "<a href=\"movie/details/" + item.id + "\">";
        snippet += "<img src=\"" + item.cover + "\" />";
        snippet += "<h5>" + item.title + "</h5>";
        snippet += "</a>";
        snippet += "</li>";
        return snippet;
    }

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            socket.emit("request-media-items", receivedSet);
        }
    });

});