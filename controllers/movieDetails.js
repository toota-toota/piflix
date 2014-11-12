var movieService = require('../service/movieService');

module.exports = function (app, socketio) {
    app.get('/movie/details/:id', function (req, res) {
        var movieId = req.params.id;

        movieService.fetchDetails(movieId, function (response) {
            res.render('movieDetails', response);
        });
    });
}