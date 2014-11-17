var yts = require('../lib/yts/yts');
var configService = require('./configService');

exports.fetchOverview = function (options, callback) {
    configService.load(function (config) {

        options.quality = config.quality;

        yts.getMovies(options, function (ytsresponse) {
            var overview = {
                items: []
            }

            console.log('Movie overview details page ' + options.set);

            if(ytsresponse) {
                ytsresponse.MovieList.forEach(function (item) {
                    overview.items.push({
                        "id": item.MovieID,
                        "title": item.MovieTitleClean,
                        "cover": item.CoverImage
                    });
                });
            }

            callback(overview);
        });
    });
};

exports.fetchDetails = function (id, callback) {
    yts.getMovieDetails(id, function (ytsresponse) {

        console.log('Showing details for: ' + ytsresponse.MovieTitleClean);
        callback({
            "id": id,
            "imdbCode": ytsresponse.ImdbCode,
            "title": ytsresponse.MovieTitleClean,
            "descriptionLong": ytsresponse.LongDescription,
            "year": ytsresponse.MovieYear,
            "runtime": ytsresponse.MovieRuntime,
            "coverLarge": ytsresponse.LargeCover,
            "torrentUrl": ytsresponse.TorrentUrl,
            "magnetUrl": ytsresponse.TorrentMagnetUrl
        });
    });
};