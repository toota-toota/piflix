
var movieService = require('../service/movieService'),
    movieSubtitleService = require('../service/movieSubtitleService');

module.exports = {
    overview: function (req, res) {
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render("movie/movieOverview", {'host': host});
    },
    details: function (req, res) {
        var movieId = req.params.id;

        movieService.fetchDetails(movieId, function (response) {
            movieSubtitleService.getAvailableForMovie(response.imdbCode, function (language) {
                response.subtitles = language;
                res.render('movie/movieDetails', response);
            });
        });
    }
};