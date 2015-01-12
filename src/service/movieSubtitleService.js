var yifysubs = require('yifysubs');
var configService = require('./configService');
var http = require('http');
var fs = require('fs');
var AdmZip = require('adm-zip');

var getSubtitlesUrl = function (imdb, callback) {
    configService.get("subtitleLanguage", function (lang) {
        if (lang == "All") {
            return callback(null);
        } else {
            yifysubs.searchSubtitles(lang, imdb, function (result) {
                if (result[lang.toLowerCase()]) {
                    var url = result[lang.toLowerCase()].url;
                    return callback(url);
                } else {
                    return callback(null);
                }
            });
        }
    });
};

var endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

exports.getAvailableLanguages = function (callback) {
    var languages = require('../data/subtitleLanguages.json'); // require caches, that's an advantage in this case
    return callback(languages);
};

exports.setLanguage = function (language, callback) {
    configService.set("subtitleLanguage", language, function (data) {
        return callback(data);
    });
};

exports.getAvailableForMovie = function (imdb, callback) {
    getSubtitlesUrl(imdb, function (url) {
        console.log(url);
        if (url != null) {
            configService.get("subtitleLanguage", function (lang) {
                return callback(lang);
            });
        } else {
            return callback(null);
        }
    });
};

exports.getPathToSubtitles = function (imdb, callback) {
    getSubtitlesUrl(imdb, function (url) {

        if (url != null) {
            var urlArray = url.split('/');
            var fileName = urlArray[urlArray.length - 1];

            configService.get("tempfolder", function (tmpFolder) {
                var localZipPath = tmpFolder + "/" + fileName;
                var writeZipFileStream = fs.createWriteStream(localZipPath);

                http.get(url, function (response) {
                    response.pipe(writeZipFileStream);
                    writeZipFileStream.on('finish', function (data) {
                        var zip = new AdmZip(localZipPath);
                        var zipEntries = zip.getEntries();

                        zipEntries.forEach(function (zipEntry) {
                            var fileName = zipEntry.name.toString();
                            if (endsWith(fileName.toLowerCase(), 'srt')) {
                                zip.extractEntryTo(zipEntry, tmpFolder, false, true);
                                var pathToSubtitle = tmpFolder + '/' + fileName;
                                return callback(pathToSubtitle);
                            }
                        });
                    });
                });
            });
        }
        return callback(null);
    });
};