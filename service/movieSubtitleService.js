var yifysubs = require('yifysubs');
var configService = require('./configService');
var http = require('http');
var fs = require('fs');
var AdmZip = require('adm-zip');

var getSubtitlesUrl = function (imdb, callback) {
    configService.get("subtitleLanguage", function (lang) {
        if (lang == "All") {
            callback(null);
        } else {
            yifysubs.searchSubtitles(lang, imdb, function (result) {
                if (result[lang.toLowerCase()]) {
                    var url = result[lang.toLowerCase()].url;
                    callback(url);
                } else {
                    callback(null);
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
    callback(languages);
};

exports.setLanguage = function (language, callback) {
    configService.set("subtitleLanguage", language, function (data) {
        callback(data);
    });
};

exports.getAvailableForMovie = function (imdb, callback) {
    getSubtitlesUrl(imdb, function (url) {
        console.log(url);
        if (url != null) {
            configService.get("subtitleLanguage", function (lang) {
                callback(lang);
            });
        } else {
            callback(null);
        }
    });
};

exports.getPathToSubtitles = function (imdb, callback) {
    getSubtitlesUrl(imdb, function (url) {
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
                            callback(pathToSubtitle);
                        }
                    });
                });
            });
        });
    });
};