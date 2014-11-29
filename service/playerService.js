var
    torrent = null,
    torrentStream = require('torrent-stream'),
    proc = require('child_process'),
    fs = require('fs'),
    fileSystemService = require('./fileSystemService'),
    configService = require('./configService'),
    omx = require('omx-manager'),
    EventEmitter = require('events').EventEmitter,
    eventEmitter = new EventEmitter(),

    stopTorrent = function (event) {
        if (torrent != null) {
            torrent.destroy(function () {
                torrent = null;
                fileSystemService.clearTempFolder(function () {
                    eventEmitter.emit(event);
                });
            });
        }
    },

    extractVideoFile = function (torrent, callback) {
        var videoFileData = {file: {}, length: 0};
        for (var i = 0; i < torrent.files.length; i++) {
            var file = torrent.files[i];
            if (file.length > videoFileData.length) {
                videoFileData.file = file;
                videoFileData.length = file.length;
            }

            if (i == (torrent.files.length - 1)) {
                callback(videoFileData.file);
            }
        }
    };

exports.eventEmitter = eventEmitter;
exports.stopTorrent = stopTorrent;

exports.playMagnet = function (magnet_uri, subtitlePath) {
    configService.load(function (config) {
        stopTorrent('torrent-stopped');

        torrent = torrentStream(magnet_uri, {tmp: config.tempfolder});
        torrent.on('ready', function () {
            extractVideoFile(torrent, function (file) {

                eventEmitter.emit('buffered', 0.00);
                eventEmitter.emit('downloaded', 0.00);
                var readStream = file.createReadStream();
                var destinationPath = config.tempfolder + '/' + file.name;

                var writeStream = fs.createWriteStream(destinationPath);
                readStream.pipe(writeStream);

                var bytesOnComplete = file.length;
                var bytesReceived = 0;
                var playerStarted = false;

                readStream.on('data', function (chunk) {
                    bytesReceived += chunk.length;
                    var percentage = ((bytesReceived / bytesOnComplete) * 100).toFixed(2);
                    var relativePercentage = ((percentage / config.bufferPercentage) * 100).toFixed(2);

                    if (!playerStarted) {
                        if (relativePercentage < 100) {
                            eventEmitter.emit('buffered', relativePercentage);
                        } else {
                            eventEmitter.emit('buffered', 100.00);
                            configService.get('player', function (player) {

                                if (player === 'omx') {

                                    var omxConfig = {
                                        '-p': true,
                                        '-o': 'hdmi'
                                    };

                                    if (subtitlePath != null) {
                                        omxConfig['--subtitles'] = subtitlePath;
                                        omxConfig['--align'] = 'center';
                                    }

                                    omx.play(destinationPath, omxConfig);

                                } else if (player == 'vlc') {
                                    var execBuilder = '/opt/homebrew-cask/Caskroom/vlc/2.1.5/VLC.app/Contents/MacOS/VLC ';
                                    execBuilder += "\"" + destinationPath + "\"";
                                    if (subtitlePath != null) {
                                        execBuilder += ' --sub-file ';
                                        execBuilder += "\"" + subtitlePath + "\"";
                                    }
                                    console.log('Buffering done, starting VLC ...');
                                    proc.exec(execBuilder);
                                    playerStarted = true;
                                }
                            });
                        }
                    }

                    if (bytesOnComplete === bytesReceived) {
                        stopTorrent('torrent-completed');
                    }

                    eventEmitter.emit('downloaded', percentage);
                });
            });
        });
    });
};
