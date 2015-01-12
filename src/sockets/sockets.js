// JSON files
module.exports.initialize = function(io) {
    require('./movie')(io.of('/movie'));
    require('./play')(io.of('/play'));
};

