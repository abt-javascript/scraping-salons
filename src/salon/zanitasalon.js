'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');
const chalk = require('chalk');

async function zanitasalon() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.zanitasalon.com/salon-perawatan-di-tangerang/', {
      'service': ['.et_pb_tab_content', function ($div) {
        return this.map('ul > li', ($item) =>{
          return $item.text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service zanita null');
    });
  });

  var service = result.toString().replace(/\s\s+/g, " ").trim();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.zanitasalon.com', {
      'address': ['.et_pb_blurb_description', function ($div) {
        return $div.text().trim().replace(/(\r\n|\n|\r)/gm,"");
      }]
    }, (err, result) => {
      resolve(result.address)
    });
  });

  var address = result2[9];
  console.log('ini alamat ', address);
return;
  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.zanitasalon.com/', {
      'logo': ['iframe', function ($ifrm) {
          return $ifrm.attr('src');
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  result3 = result3[0].split('!');
  var lat = result3[6].substring(2, result3[6].length);
  var long = result3[5].substring(2, result3[5].length);

return console.log(lat, result3[6], long, result3[5]);
  var result4 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.zanitasalon.com/', {
      'logo': ['.logo_container', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  var logo = result4[0][0];
  var phone = result2[6].substring(10,23);
  let name = 'Zanita Salon'; //must be unique;

  let payload = {
    service: service,
    address: address,
    images: logo,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://www.zanitasalon.com/',
    created: new Date()
  }
  console.log(payload);
return
  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed maymay');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

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

          //create location
          locationModel.create(readyBranch, (err, location) => {
            if(!err) {
              salonModel.update({_id: salonId}, {location:location}, (err, salon2) => {
                if (!err) {
                  console.log('created location Zanita salon succeed');
                  return resolve();
                }
              });
            }

            if(err){
              reject()
              console.log('error create', err);
            }
          });
        }
        else{
          resolve('no update data')
        }
      }

      if(err){
        console.log('error create', err);
      }
    });
  });

  return finish
}

module.exports = zanitasalon
