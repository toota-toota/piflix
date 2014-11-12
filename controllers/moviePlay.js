var movieService = require('../service/movieService'),
    WebTorrent = require('webtorrent'),
    client = new WebTorrent(),
    proc = require('child_process'),
    fs = require('fs');

var endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

module.exports = function (app, socketio) {

    // TODO should not be a GET, refactor later
    app.get('/movie/play/:id', function (req, res) {
        var id = req.params.id;

        movieService.fetchDetails(id, function (response) {

            var magnet_uri = response.magnetUrl;

            client.download(magnet_uri, function (torrent) {
                proc.exec('rm -rf /tmp');
                torrent.files.forEach(function (file) {
                    // Get the file data as a Buffer (Uint8Array typed array)

                    var destinationPath = '/tmp/' + file.name;
                    console.log('creating: ' + destinationPath);
                    var writeStream = fs.createWriteStream(destinationPath);

                    if (endsWith(destinationPath, 'mp4')) {
                        console.log('MOVIE FILE: ' + destinationPath);

                        var readStream = file.createReadStream();

                        file.createReadStream().pipe(writeStream);
                        var bytesReceived = 0;
                        readStream.on('data', function(chunk) {
                            bytesReceived += chunk.length;
                            console.log('bytes received: ' + bytesReceived);
                            if(bytesReceived > 5000000) {
                                // TODO proof of concept works, but we get the data too slow ...
                                console.log('More than 5 MB received, starting movie ...');
                                proc.exec('omxplayer -p -o hdmi ' + destinationPath);
                            }
                        });
                    }
                })
            })
        });
        res.render('playing');
    });
};