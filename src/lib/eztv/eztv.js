"use strict";

var request = require('request');
var baseUrl = 'https://popcorntimece.ch/api/v2/';

var doRequest = function (url, callback) {
    request(url, function (err, res, body) {
        console.log(url);
        if (!err && res.statusCode == 200) {
            var json = JSON.parse(body);
            callback(json);
        } else {
            console.log('ERROR: ' + err + ' ' + res.statusCode);
            callback(null);
        }
    });
};

var replaceWithDefaultsWhenMissing = function (options, callback) {
    if (!options.set) {
        options.set = 1;
    }
    if (!options.sort) {
        options.sort = 'Updated';
    }
    if (!options.keywords) {
        options.keywords = '';
    }

    callback(options);
};

exports.getOverview = function (options, callback) {
    replaceWithDefaultsWhenMissing(options, function(o) {
        var url = baseUrl + 'shows/' + o.set +
            '?sort=' + o.sort +
            '&keywords=' + o.keywords;
        doRequest(url, callback);
    });
};

exports.getDetails = function(id, callback) {
    var url = baseUrl + 'show/' + id;
    doRequest(url, callback);
};
