'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function cbc() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.cbcbeautycare.com/', {
      'service': ['.w-dropdown-list', function ($div) {
        return this.map('a', ($item) =>{
          return $item.text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service cbc null')
    });
  });

  result = result.toString().trim();
  var service = result;

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.cbcbeautycare.com/contact.html', {
      'contact': ['.contactpage', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text()//.trim().replace(/(\r\n|\n|\r)/gm," ");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });
  var contact = result2.toString();
  var phone = contact.substring(87, 103)
  var branch = [contact]

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.cbcbeautycare.com/contact.html', {
      'branch': ['.morelocation', function ($div) {
        return this.map('.otherbranch', ($item) =>{
          return $item.text();
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  branch = branch.concat(result3[0])

  var latLng = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.cbcbeautycare.com/contact.html', {
      'address': ['div', function ($div) {
        return $div.attr('data-widget-latlng');
        return this.map('.divaddressothers', ($item) =>{
          return $item.attr('data-widget-latlng');
        })
      }]
    }, (err, result) => {
      resolve(result.address)
    });
  });
  var locArr = []
  latLng.map((item) => {
    if(item && item[0]){
      var abc = item.split(',')
      locArr.push({lat:abc[0],lng:abc[1]});
    }
  });

  var images = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.cbcbeautycare.com/index.html', {
      'logo': ['.mainlogotop', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  images = 'http://www.cbcbeautycare.com'+images;

  let name = 'Cbc'; //must be unique

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
        coordinates: [parseFloat(locArr[i].lng), parseFloat(locArr[i].lat)]
      },
      lat: parseInt(locArr[i].lat),
      long: parseInt(locArr[i].lng)
    }
  }

  let payload = {
    service: service,
    address: contact,
    images: images,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://www.cbcbeautycare.com',
    created: new Date()
  }

  var finish = new Promise((resolve, reject) =>{
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed cbc');

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
                reject()
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

  return finish

}

module.exports = cbc
