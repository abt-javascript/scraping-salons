'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function royalgarden() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.alitattoosulam.com/', {
      'service': ['#menu-item-1026', function ($div) {
        return this.map('ul', ($item) =>{
          $item = $item.text().trim().replace(/(\t)/gm,"");
          return $item.replace(/(\n)/gm,",");
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });

  var service = result.toString();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.alitattoosulam.com/contact-us/', {
      'contact': ['.address-cabang', function ($div) {
        return $div.text().trim().replace(/(\r\n|\n|\r)/gm,"");
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });
  var contact = result2[0];
  var phone = contact.substring(59,72);
  var branch = result2;

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.alitattoosulam.com/', {
      'logo': ['.header_wrapper', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  image = image[0][0].toString();
  let name = 'Royal Garden'; //must be unique

  let readyBranch = [];
  let i = 0;

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
        geoLoc(name, item.substring(0,25), branch[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: service,
    address: contact,
    images: image,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://www.alitattoosulam.com/',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed Royal Garden');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          Promise.each(branch, looping, salonId).then(function() {
            //create location
            locationModel.create(readyBranch, (err, location) => {
              if(!err) {
                salonModel.update({_id: salonId}, {location:location}, (err, salon2) => {
                  if(!err){
                    console.log('created location Irwan salon succeed');
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

module.exports = royalgarden
