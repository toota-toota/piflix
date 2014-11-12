var movieService = require('../service/movieService'),
    magnetVideoService = require('../service/magnetVideoService');

module.exports = function (app, socketio) {

    // TODO should not be a GET, refactor later
    app.get('/movie/play/:id', function (req, res) {
        var id = req.params.id;

        movieService.fetchDetails(id, function (response) {
            magnetVideoService.play(response.magnetUrl);
        });

        res.render('playing');
    });
};