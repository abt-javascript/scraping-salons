'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function dianmustika() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.dianmustika.com/perawatan-pasca-melahirkan/', {
      'service': ['ul', function ($div) {
        return this.map('li', ($item) =>{
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });
  var service = result[3].toString();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.dianmustika.com/promo/', {
      'contact': ['ol', function ($div) {
        return this.map('li', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var contact = result2[3];

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.dianmustika.com/gerai/', {
      'branch': ['table', function ($div) {
        return this.map('tr', ($item) =>{
          return $item.find('td').text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });
  var branch = [];

  result3[0].map((item, index) => {
    if(index > 0){
      item = item.replace(index+'.', '');
      item = item.replace('KLIK', '');
      branch.push(item)
    }
  });

  let name = 'Dian Mustika'; //must be unique

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
        geoLoc(name, item.substring(0,20), branch[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: service,
    contact: contact.toString(),
    images: 'empty',
    name: name,
    branch:[],
    baseUrl:'http://salon.maymay.co.id/',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed Dian Mustika');

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

module.exports = dianmustika
