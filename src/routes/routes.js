var movie = require('../controllers/movie'),
    play = require('../controllers/play');

module.exports.initialize = function(app) {

    app.get('/', movie.overview);

    app.get('/movie/overview', movie.overview);
    app.get('/movie/details/:id', movie.details);
    app.get('/movie/play/:id', play.playMovie);


};