var
    WebTorrent = require('webtorrent'),
    proc = require('child_process'),
    fs = require('fs'),
    configService = require('./configService'),
    EventEmitter = require('events').EventEmitter,
    eventEmitter = new EventEmitter(),

    client = new WebTorrent(),
    tempPath = '/tmp/piflix',

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

exports.playMagnet = function (magnet_uri, subtitlePath) {

    configService.get("bufferPercentage", function (bufferPercentage) {
        client.destroy(function (data) { // destroy previous torrent downloads

            client.download(magnet_uri, function (torrent) { // start new torrent download
                extractVideoFile(torrent, function (file) {
                    eventEmitter.emit('buffered', 0.00);
                    eventEmitter.emit('downloaded', 0.00);
                    var readStream = file.createReadStream();
                    var destinationPath = tempPath + '/' + file.name;

                    var writeStream = fs.createWriteStream(destinationPath);
                    readStream.pipe(writeStream);

                    var bytesOnComplete = file.length;
                    var bytesReceived = 0;
                    var playerStarted = false;

                    readStream.on('data', function (chunk) {
                        bytesReceived += chunk.length;
                        var percentage = ((bytesReceived / bytesOnComplete) * 100).toFixed(2);
                        var relativePercentage = ((percentage / bufferPercentage) * 100).toFixed(2);

                        if (!playerStarted) {
                            if (relativePercentage < 100) {
                                eventEmitter.emit('buffered', relativePercentage);
                            } else {
                                eventEmitter.emit('buffered', 100.00);
                                configService.get('player', function (player) {
                                    var execBuilder = '';
                                    if (player === 'omx') {
                                        execBuilder += 'omxplayer -p -o hdmi ';
                                        execBuilder += "\"" + destinationPath + "\"";
                                        if (subtitlePath != null) {
                                            execBuilder += ' --subtitles ';
                                            execBuilder += "\"" + subtitlePath + "\"";
                                        }
                                    } else if (player == 'vlc') {
                                        execBuilder += '/opt/homebrew-cask/Caskroom/vlc/2.1.5/VLC.app/Contents/MacOS/VLC '
                                        execBuilder += "\"" + destinationPath + "\"";
                                        if (subtitlePath != null) {
                                            execBuilder += ' --sub-file '
                                            execBuilder += "\"" + subtitlePath + "\"";
                                        }
                                    }
                                    console.log('Buffering done, starting player');
                                    proc.exec(execBuilder);
                                    playerStarted = true;
                                });
                            }
                        }

                        eventEmitter.emit('downloaded', percentage);
                    });
                });
            });
        });
    });
};