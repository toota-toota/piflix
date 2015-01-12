var movie = require('../controllers/movie');

module.exports.initialize = function(app) {
    app.get('/', movie.overview);
    app.get('/movie/overview', movie.overview);
};