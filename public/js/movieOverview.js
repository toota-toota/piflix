$(function () {
    var host = $('body').data('serverhost');
    var socket = io.connect(host);
    var receivedSet = 1;

    var searchField = $("#search");
    searchField.on('input',function(e){
        socket.emit('request-moviesearch-suggestions', searchField.val());
    });


    socket.on('add-movie-items', function(json) {
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        receivedSet++;
    });

    socket.on('replace-movie-items', function(json) {
        $("#media").html('');
        json.items.forEach(function(item) {
            $("#media").append(createItemSnippet(item));
        });
        receivedSet++;
    });

    var createItemSnippet = function(item) {
        var snippet = "<li>";
        snippet += "<a href=\"/movie/details/" + item.id + "\">";
        snippet += "<img src=\"" + item.cover + "\" />";
        snippet += "<h5>" + item.title + "</h5>";
        snippet += "</a>";
        snippet += "</li>";
        return snippet;
    }

    $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
            socket.emit("request-movie-items", receivedSet);
        }
    });

});