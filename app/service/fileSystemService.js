var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var configService = require('./configService');

exports.clearTempFolder = function (callback) {
    configService.get('tempfolder', function (tempfolder) {
        rimraf(tempfolder, function () {
            mkdirp(tempfolder, function (err) {
                if (err) {
                    console.error(err)
                        callback(err);
                } else {
                    rimraf('/tmp/torrent-stream', function () {
                        callback();
                    });
                }
            })
        });
    });
};
