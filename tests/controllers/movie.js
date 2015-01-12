var proxyquire = require('proxyquire'),

// Stubs
    movieServiceStub = {},
    movieSubtitleServiceStub = {},

// module under test:
    movie = proxyquire('../../src/controllers/movie', {
        '../service/movieService': movieServiceStub,
        '../service/movieSubtitleService': movieSubtitleServiceStub
    });

describe('Movie controller', function() {
    it('should exist', function() {
       expect(movie).to.exist;
    });
});

describe('overview', function() {
   it('should be defined', function() {
       expect(movie.overview).to.be.a.('function');
   }) ;
});







