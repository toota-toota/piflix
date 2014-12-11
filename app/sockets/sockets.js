// JSON files
module.exports.initialize = function(io) {
    require('./movie')(io);
    require('./serie')(io);
    require('./play')(io);
};

