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
            console.log('ini retrun cordinate', maps.location)
            let payload = {
              salon:salonId,
              address: address,
              created: new Date(),
              location: {
                type: 'Point',
                coordinates: [parseFloat(maps.location.lng), parseFloat(maps.location.lat)]
              },
              loc_string: JSON.stringify(maps.location)
            }

            if(!maps.location.lng || !maps.location.lat) {
              payload = {}
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
