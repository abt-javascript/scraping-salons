'use strict';

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI'
});

module.exports =  async function (prefix, address) {
const geoLoc = await new Promise((resolve, reject) => {
    googleMapsClient.geocode({
        address: prefix +' '+address.substr(0,30)
    }, function(err, response) {
        if (!err) {
          let maps = response.json.results[0].geometry;
          maps.address = address;
          resolve(maps);
        }

        if(err){console.log('api error');
          reject(err);
        }
    });
  });

  return geoLoc
}
