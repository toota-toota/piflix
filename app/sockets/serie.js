var tvShowService = require('../service/tvShowService');

module.exports = function (socket) {
    socket.emit('connected');

    socket.on('request-tvshow-items', function (receivedSet) {
        tvShowService.fetchOverview({"set": receivedSet}, function (response) {
            socket.emit('add-tvshow-items', response);
        });
    });

    socket.on('request-tvshowsearch-suggestions', function (enteredText) {
        tvShowService.fetchOverview({"keywords": enteredText}, function (response) {
            socket.emit("replace-tvshow-items", response);
        });
    });
};