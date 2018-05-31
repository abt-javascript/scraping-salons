'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');

async function anitasalon() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://anitasalon-rempoa.com/klinik.php', {
      'service': ['#submenu > ul', function ($div) {
        return this.map('li', ($item) =>{
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service anitasalon null')
    });
  });

  var resulta = await new Promise((resolve, reject) => {
    htmlToJson.request('http://anitasalon-rempoa.com/perawatan.php', {
      'service': ['#submenu > ul', function ($div) {
        return this.map('li', ($item) =>{
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service anitasalon null')
    });
  });

  var resultb = await new Promise((resolve, reject) => {
    htmlToJson.request('http://anitasalon-rempoa.com/tatarias.php', {
      'service': ['#submenu > ul', function ($div) {
        return this.map('li', ($item) =>{
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service anitasalon null')
    });
  });

  result = result.toString().trim();
  resulta = result.toString().trim();
  resultb = result.toString().trim();

  let service = ['Klinik ('+result+')', 'Perawatan ('+resulta+')', 'Tatarias ('+resultb+')'];

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://anitasalon-rempoa.com/about.php', {
      'contact': ['#alamat', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  result2 = result2.toString().trim().replace(/(\r\n|\n|\r)/gm,"");
  result2 = result2.replace(/\s\s+/g, ' ');

  var address = result2
  var phone = '02174864475'
console.log(phone);
  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/our-shop', {
      'branch': ['.shop-box', function ($div) {
        return this.map('figcaption', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var address = result2.substring(0, 18) + result2.substring(19, 39) + result2.substring(39, 63);

  var logo = 'http://www.anitasalon-rempoa.com/images/logo.jpg'

  let name = 'Anita Salon'; //must be unique

  Promise.each = async function(arr, fn, salon_id) {
     for(const item of arr) {
       const locData = await fn(item, i, salon_id);

       //collect address to db
       if(locData.location){
         readyBranch.push(locData);
       }
       i++;
     }
  }

  function looping(item, i, salon_id) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        //get lat and lang from maps by address
        geoLoc(name, 'Jl Rempoa Raya No. 17 Jakarta Selatan', 'Jl Rempoa Raya #17 Jakarta Selatan', salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: service.toString(),
    address: address,
    images: logo,
    name: name,
    branch:[],
    phone:phone,
    baseUrl:'http://www.anitasalon-rempoa.com/',
    created: new Date()
  }

  var finish = new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed Anita Salon');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          geoLoc(name, 'Jl Rempoa Raya No. 17 Jakarta Selatan', 'Jl Rempoa Raya #17 Jakarta Selatan', salonId).then(function(loc) {
              locationModel.create(loc, (err, location) => {
                if(!err) {
                  salonModel.update({_id: salonId}, {location:location}, (err, salon2) => {
                    if(!err){
                      console.log('created location anita salon succeed');
                      return resolve();
                    }
                  });
                }

                if(err){
                  console.log('error create', err);
                  return reject();
                }
              });
            }).catch(function(err){
              reject(err);
            });
        }
        else{
          resolve('no update data');
        }
      }

      if(err){
        console.log('error create', err);
      }
    });
  });

  return finish;

}

module.exports = anitasalon
