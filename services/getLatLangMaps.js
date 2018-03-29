const maps = function(address) {
    var googleMapsClient = require('@google/maps').createClient({
        key: 'AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI'
    });
  
    googleMapsClient.geocode({
        address: address
    }, function(err, response) {
        if (!err) {
        let geoLoc = response.json.results[0].geometry;
        console.log(address);
        }
    });
}

module.exports = maps
  