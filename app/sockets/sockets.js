// JSON files
module.exports.initialize = function(io) {
    require('./movie')(io.of('/movie'));
    require('./serie')(io.of('/serie'));
    require('./play')(io.of('/play'));
};

