'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');

async function saloncantik() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.geraisaloncantik.com/paket-perawatan/', {
      'service': ['table', function ($table) {
        return this.map('tr > td > h3', ($item) =>{
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      resolve(result.service)
    });
  });

  result = result.toString().trim();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.geraisaloncantik.com/kontak/', {
      'contact': ['table', function ($div) {
        return this.map('tr', ($item) =>{
          return $item.find('td > span').text().trim().replace(/(\r\n|\n|\r)/gm,",");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.geraisaloncantik.com/cabang/', {
      'branch': ['table', function ($div) {
        return this.map('tr > td > h3', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var result3a = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.geraisaloncantik.com/cabang/', {
      'address': ['table', function ($div) {
        return this.map('tr > td > p', ($item) => {
          return $item.text().trim();
        })
      }]
    }, (err, result) => {
      resolve(result.address)
    });
  });

 let result3b = _.remove(result3a[0], function(n) {
    return n !== 'Lihat>';
  });

  let result3c = [];

  result3[0].map((item, index) => {
    result3c.push(item +' ('+result3b[index]+')');
  });

  var result4 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.geraisaloncantik.com', {
      'logo': ['.headerinnerwrap', function ($img) {
        return this.map('a > span > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  let name = 'Salon Cantik'; //must be unique
  var readyBranch = [];

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

  var i = 0;
  function looping(item, i, salon_id) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        //get lat and lang from maps by address
        var address = result3c[i].trim().replace(/(\r\n|\n|\r)/gm," ");
        geoLoc(name, item.substring(0, 25), address, salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: result,
    address: result2.toString().trim(),
    images: result4.toString().trim(),
    name: name,
    branch:[],//result3c.toString().trim().replace(/(\r\n|\n|\r)/gm,","),
    baseUrl:'http://www.geraisaloncantik.com',
    created: new Date()
  }

  var finish = await new Promise(function(resolve, reject) {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed salon cantik');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          Promise.each(result3b, looping, salonId).then(function() {
            //create location
            locationModel.create(readyBranch, (err, location) => {
              if(!err) {
                salonModel.update({_id: salonId}, {location:location}, (err, salon2) => {
                  if(!err){
                    console.log('created location salon cantik succeed');
                    return resolve();
                  }
                });
              }

              if(err){
                console.log('error create', err);
                reject();
              }
            });
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

module.exports = saloncantik
