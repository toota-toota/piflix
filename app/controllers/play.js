module.exports = {
    playMovie : function (req, res) {
        var id = req.params.id;
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render('movie/moviePlay', {
            "id": id,
            "host": host
        });
    }
};

