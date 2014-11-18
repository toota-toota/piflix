var movieService = require('../service/tvShowService');

module.exports = function (app, socketio) {
    app.get('/tv-show/details/:id', function (req, res) {
        var movieId = req.params.id;

        //movieService.fetchDetails(movieId, function (response) {
            res.render('tvShowDetails');
        //});
    });
}