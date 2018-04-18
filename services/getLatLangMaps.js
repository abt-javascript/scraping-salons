'use strict';
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI'
});

module.exports =  async function (salon, query, address, salonId) {
const geoLoc = await new Promise((resolve, reject) => {
    googleMapsClient.geocode({
        address: query
    }, function(err, response) {
        if (!err) {
          if (response.json.results.length > 0) {console.log('ini query loc berhasil', query);
            let maps = response.json.results[0].geometry;

            let payload = {
              salon:salonId,
              address: address,
              created: new Date(),
              location: JSON.stringify(maps.location)
            }

            return resolve(payload);
          }

          console.log('ini yg return zero', query);
          return resolve({address:address, data:'empty'})
        }

        if(err) {
          reject(err);
        }
    });
  });
  return geoLoc
}
