'use strict';

const locationModel = require('../src/location/model');

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyAjWOHPrXscmVtlGBYIsi6ZrvF8ZYydteI'
});

module.exports =  async function (salon, query, address) {
const geoLoc = await new Promise((resolve, reject) => {
    googleMapsClient.geocode({
        address: query
    }, function(err, response) {
        if (!err) {
          if (response.json.results.length > 0) {
            let maps = response.json.results[0].geometry;
            maps.address = address;

            let payload = {
              salon:salon,
              address: address,
              created: new Date(),
              location: JSON.stringify(maps)
            }

            return locationModel.update({salon:salon, address:address}, payload, {upsert: true}, (err, ok) => {
              if(!err) {
                console.log('created location succeed', salon);
                resolve(maps);
              }

              if(err){
                console.log('error create', err);
                resolve(maps);
              }
            });
          }

          return resolve({address:address, data:'empty'})
        }

        if(err) {
          reject(err);
        }
    });
  });
  return geoLoc
}
