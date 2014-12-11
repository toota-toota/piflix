var fs = require('fs');
var concat = require('concat-stream');

var defaultPath = "./app/config/default.json";
var userPath = "./app/config/user.json";

var cached = null;

exports.set = function (key, value, callback) {
    load(function (config) {
        config[key] = value;
        save(config, function (persistedConfig) {
            callback(persistedConfig);
        })
    });
};

exports.get = function (key, callback) {
    load(function (config) {
        callback(config[key]);
    })
};

var load = function (callback) {
    if (cached != null) {
        callback(cached);
    } else {
        fs.exists(userPath, function (exists) {
            if (!exists) {
                var readStream = fs.createReadStream(defaultPath);
                var writeStream = fs.createWriteStream(userPath);
                readStream.pipe(writeStream);
                writeStream.on('finish', function () {
                    load(callback);
                });
            } else {
                var readStream = fs.createReadStream(userPath);
                readStream.pipe(concat(function (s) {
                    var config = JSON.parse(s.toString());
                    cached = config;
                    callback(cached);
                }));
            }
        });
    }
};

var save = function (config, callback) {
    cached = config;
    var str = JSON.stringify(config, null, 2);
    fs.writeFile(userPath, str, function (err) {
        if (err) throw err;
        callback(config);
    });
};

exports.load = load;
exports.save = save;