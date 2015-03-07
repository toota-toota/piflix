"use strict";
var yts = require('yts');
//var yts = require('../lib/yts/yts');
var configService = require('./configService');

exports.fetchOverview = function (options, callback) {

    configService.load(function (config) {
        options.quality = config.quality;
        options.sort_by = "seeds";
        yts.listMovies(options, function (err, ytsresponse) {
            var overview = {
                items: []
            };

            if(typeof ytsresponse.data.movies !== "undefined") {
                ytsresponse.data.movies.forEach(function (item) {
                    overview.items.push({
                        "id": item.id,
                        "title": item.title,
                        "cover": item.medium_cover_image
                    });
                });
            }

            callback(overview);
        });
    });
};

exports.fetchDetails = function (id, callback) {
    yts.movieDetails({movie_id: id, with_images: true}, function (err, ytsresponse) {
        return  callback({
            "id": id,
            "imdbCode": ytsresponse.data.imdb_code,
            "title": ytsresponse.data.title,
            "descriptionLong": ytsresponse.data.description_intro,
            "year": ytsresponse.data.year,
            "runtime": ytsresponse.data.runtime,
            "coverLarge": ytsresponse.data.images.large_cover_image,
            "coverMedium": ytsresponse.data.images.medium_cover_image,
            "hash": ytsresponse.data.torrents[0].hash
        });
    });
};