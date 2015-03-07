"use strict";

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
        if (torrent) {
            torrent.destroy(function () {
                torrent = null;
                fileSystemService.clearTempFolder(function () {
                    eventEmitter.emit(event);
                });
            });
        }
    },

    play = function() {
        console.log('omx => play');
        omx.play();
    },

    pause = function() {
        console.log('omx => pause');
        omx.pause();
    },

    stop = function() {
        console.log('omx => stop');
        omx.stop();
    },

    seekForward = function() {
        console.log('omx => seek forward');
        omx.seekForward();
    },

    seekFastForward = function() {
        console.log('omx => seek fast forward');
        omx.seekFastForward();
    },

    seekBackward = function() {
        console.log('omx => seek backward');
        omx.seekBackward();
    },

    seekFastBackward = function() {
        console.log('omx => seek fast backward');
        omx.seekFastBackward();
    },

    playPause = function (event) {
        if (omx.isPlaying()) {
            console.log('omx => play to pause');
            omx.pause();
        } else {
            console.log('omx => pause to play');
            omx.play();
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
exports.stop = stop;
exports.pause = pause;
exports.play = play;
exports.seekForward = seekForward;
exports.seekFastForward = seekFastForward;
exports.seekBackward = seekBackward;
exports.seekFastBackward = seekFastBackward;
exports.playPause = playPause;

exports.playMagnet = function (hash, subtitlePath) {
    configService.load(function (config) {
        var magnet = "magnet:?xt=urn:btih:" + hash + "&tr=udp://open.demonii.com:1337&tr=udp://tracker.istole.it:80&tr=http://tracker.yify-torrents.com/announce&tr=udp://tracker.publicbt.com:80&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.coppersurfer.tk:6969&tr=udp://exodus.desync.com:6969&tr=http://exodus.desync.com:6969/announce";
        torrent = torrentStream(magnet, {tmp: config.tempfolder});
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

                                    if (subtitlePath) {
                                        omxConfig['--subtitles'] = subtitlePath;
                                        omxConfig['--align'] = 'center';
                                    }

                                    omx.play(destinationPath, omxConfig);

                                } else if (player === 'vlc') {
                                    var execBuilder = '/opt/homebrew-cask/Caskroom/vlc/2.1.5/VLC.app/Contents/MacOS/VLC ';
                                    execBuilder += "\"" + destinationPath + "\"";
                                    if (subtitlePath) {
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
