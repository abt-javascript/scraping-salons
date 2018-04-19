'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function naomi() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://naomi-beautyskin.com/service', {
      'service': ['.row', function ($div) {
        return this.map('.feature', ($item) =>{
          return $item.find('h3').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service Naomi null')
    });
  });

  var service = result.toString().trim();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://naomi-beautyskin.com/service', {
      'contact': ['.contact-widget', function ($div) {
        return $div.text().trim().replace(/(\r\n|\n|\r)/gm," ");
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var contact = result2[0].toString();
  var phone = contact.substring(contact.length-11, contact.length);
  var branch = [result2[0].substring(35, result2[0].length)]
  branch.push(result2[1].substring(38, result2[1].length));

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://naomi-beautyskin.com/', {
      'logo': ['.feature', function ($img) {
        return this.map('img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  image = image[0].toString();
  let name = 'Naomi'; //must be unique

  let readyBranch = [];
  let i = 0;

  Promise.each = async function(arr, fn, salon_id) {
     for(const item of arr) {
       const locData = await fn(item, i, salon_id);

       //collect address to db
       readyBranch.push(locData);
       i++;
     }
  }

  function looping(item, i, salon_id) {
    return new Promise((resolve, reject) => {
      setTimeout(function() {
        //get lat and lang from maps by address
        geoLoc(name, item.substring(0,50), branch[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }


  let payload = {
    service: service,
    contact: contact,
    images: image,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://naomi-beautyskin.com/',
    created: new Date()
  }

  salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
    if(!err) {
      console.log('created succeed naomi');

      if(salon.upserted && salon.upserted.length > 0) {
        let salonId = salon.upserted[0]._id;

        Promise.each(branch, looping, salonId).then(function() {
          //create location
          locationModel.create(readyBranch, (err, location) => {
            if(!err) {
              console.log('created location succeed');
            }

            if(err){
              console.log('error create', err);
            }
          });
        });
      }
    }

    if(err){
      console.log('error create', err);
    }
  });

}

module.exports = naomi
