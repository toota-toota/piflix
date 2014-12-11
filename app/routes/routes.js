var movie = require('../controllers/movie'),
    serie = require('../controllers/serie'),
    play = require('../controllers/play');

module.exports.initialize = function(app) {

    app.get('/', movie.overview);

    app.get('/movie/overview', movie.overview);
    app.get('/movie/details/:id', movie.details);
    app.get('/movie/play/:id', play.playMovie);

    app.get('/serie/overview', serie.overview);
    app.get('/serie/details/:id', serie.details);

};