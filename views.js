const views = function(server) {
    server.views({
        engines: {
            ejs: require('ejs')
        },
        relativeTo: __dirname,
        path: './views'
    });
}

module.exports = views