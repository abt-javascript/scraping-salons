'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function umandaruspa() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://umandaruspa.com/', {
      'contact': ['#ppu8905', function ($div) {
        return this.map('div > img', ($item) =>{
          return $item.attr('alt');
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });
  result = result[0];
  var service = [`${result[0]} (${result[1]})`];
  service.push(`${result[2]} (${result[3]})`);
  service.push(`${result[4]} (${result[5]})`);
  service.push(`${result[6]} (${result[7]})`);
  service.push(`${result[8]} (${result[9]})`);

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://umandaruspa.com/', {
      'contact': ['#u13914-8', function ($img) {
        return $img.attr('alt');
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var result2a = await new Promise((resolve, reject) => {
    htmlToJson.request('http://umandaruspa.com/', {
      'contact': ['#u14957-4', function ($img) {
        return $img.attr('alt');
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var phone = await new Promise((resolve, reject) => {
    htmlToJson.request('http://umandaruspa.com/', {
      'contact': ['#u14927-4', function ($img) {
        return $img.attr('alt');
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });
  var contact = `${result2} ${result2a}`;
  phone = phone.toString();

  var latLng = {lat:-6.271208,lng:106.73887}
  var branch = [contact];

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://umandaruspa.com/', {
      'logo': ['#u13885_img', function ($img) {
        return $img.attr('src');
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  let name = 'Umandaru Spa'; //must be unique
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
    console.log('found location', item);
    return  {
      salon:salon_id,
      address: item,
      created: new Date(),
      location: {
        type: 'Point',
        coordinates:[parseFloat(latLng.lng), parseFloat(latLng.lat)],
      }
    }
  }

  let payload = {
    service: service.toString(),
    contact: contact,
    images: 'http://umandaruspa.com/images/logo%20umandaru.png',
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://umandaruspa.com/',
    created: new Date()
  }

  var finish = await new Promise(function(resolve, reject) {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed umandaru spa');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          Promise.each(branch, looping, salonId).then(function() {
            //create location
            locationModel.create(readyBranch, (err, location) => {
              if(!err) {
                salonModel.update({_id: salonId}, {location:location}, (err, salon2) => {
                  if(!err){
                    console.log('created location Umandaru salon succeed');
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

module.exports = umandaruspa
