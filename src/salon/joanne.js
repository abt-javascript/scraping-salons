'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function joanne() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://joannestudio.co.id/korean-eyelash-extension/', {
      'service': ['.w-tabs-list-h', function ($div) {
        return this.map('.w-tabs-item', ($item) => {
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service cgupta null')
    });
  });
  result = result[0];
  var service = [];
  result.map((item,index) =>{
    if(index > 0) {
      service.push(item);
    }

  });
  var resulta = await new Promise((resolve, reject) => {
    htmlToJson.request('http://joannestudio.co.id/ipl-hair-removal/', {
      'service': ['.wpb_wrapper', function ($div) {
        return this.map('ul', ($item) => {
          return $item.text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service joanne null')
    });
  });
  var bcl = resulta[2][0].replace(/(\n)/gm,", ");
  service = service.concat(bcl);

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://joannestudio.co.id/about-us/', {
      'contact': ['.w-contacts-item-value', function ($div) {

        return $div.text();
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var contact = result2.toString();

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://joannestudio.co.id/about-us/', {
      'branch': ['.wpb_wrapper', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,", ");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var address = [];
  var branch = []
  result3[1].map((item, index) => {
    if(index > 1) {
      var abc = item.replace(index-1+'.', '').trim();
      var arr = abc.split(",");
      address.push(abc);
      if(index <= 3) {
        branch.push(arr[0])
      }
      else{
        branch.push(arr[1]+' '+arr[2])
      }

    }
  });

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://joannestudio.co.id/', {
      'logo': ['.w-img-h', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  let name = 'Joanne'; //must be unique
  image = image.toString();

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
        geoLoc(name, item.substring(0,20), address[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: service.toString(),
    contact: contact,
    images: image,
    name: name,
    branch:[],
    baseUrl:'http://joannestudio.co.id/',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed maymay');

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

module.exports = joanne
