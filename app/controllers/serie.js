module.exports = {
    overview: function (req, res) {
        var host = 'http://' + req.headers.host.split(':')[0];
        res.render("serie/tvShowOverview", {'host': host});
    },
    details: function (req, res) {
        var movieId = req.params.id;

        //movieService.fetchDetails(movieId, function (response) {
        res.render('tvShowDetails');
        //});
    }
};