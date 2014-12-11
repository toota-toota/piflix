var eztv = require('../lib/eztv/eztv');

exports.fetchOverview = function (options, callback) {

    eztv.getOverview(options, function (eztvResponse) {
        var overview = {
            items: []
        };

        eztvResponse.forEach(function (show) {
            overview.items.push({
                "id": show._id,
                "title": show.title,
                "cover": show.images.poster
            });
        });

        callback(overview);
    });

};

exports.fetchDetails = function (id, callback) {

    eztv.getDetails(id, new function(eztvResponse) {

        // TODO implement

        //console.log('Showing details for: ' + ytsresponse.MovieTitleClean);
        //callback({
        //    "id": id,
        //    "imdbCode": ytsresponse.ImdbCode,
        //    "title": ytsresponse.MovieTitleClean,
        //    "descriptionLong": ytsresponse.LongDescription,
        //    "year": ytsresponse.MovieYear,
        //    "runtime": ytsresponse.MovieRuntime,
        //    "coverLarge": ytsresponse.LargeCover,
        //    "torrentUrl": ytsresponse.TorrentUrl,
        //    "magnetUrl": ytsresponse.TorrentMagnetUrl
        //});
        //

    });

};