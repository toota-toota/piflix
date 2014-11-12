var yts = require('../lib/yts/yts');

exports.fetchOverview = function(options, callback) {
    yts.getMovies(options, function(ytsresponse) {
        var overview = {
            items: []
        }

        console.log('Movie overview details page ' + options.set);
        ytsresponse.MovieList.forEach(function (item) {

            overview.items.push({
                "id": item.MovieID,
                "title": item.MovieTitleClean,
                "cover": item.CoverImage
            });
        });

        callback(overview);
    });
};

exports.fetchDetails = function(id, callback) {
    yts.getMovieDetails(id, function(ytsresponse) {

        console.log('Showing details for: ' + ytsresponse.MovieTitleClean);
        var details = {
            "id": id,
            "title": ytsresponse.MovieTitleClean,
            "descriptionLong": ytsresponse.LongDescription,
            "year": ytsresponse.MovieYear,
            "runtime": ytsresponse.MovieRuntime,
            "coverLarge": ytsresponse.LargeCover,
            "torrentUrl": ytsresponse.TorrentUrl,
            "magnetUrl": ytsresponse.TorrentMagnetUrl
        };

        callback(details);
    });
};