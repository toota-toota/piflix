var movieService = require('../service/movieService'),
    movieSubtitleService = require('../service/movieSubtitleService');

module.exports = function (app, socketio) {
    app.get('/movie/details/:id', function (req, res) {
        var movieId = req.params.id;

        movieService.fetchDetails(movieId, function (response) {
            movieSubtitleService.getAvailableForMovie(response.imdbCode, function(language) {
                response.subtitles = language;
                res.render('movieDetails', response);
            });
        });
    });
}