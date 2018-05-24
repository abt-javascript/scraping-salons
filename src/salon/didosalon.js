'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function didosalon() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('https://www.didosalon.com/blog/price-list-dido-salon-kemang', {
      'service': ['table > tbody', function ($div) {
        return this.map('tr', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm," ");
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });

  var service = [];

  result[0].map((item, index) =>{
    var abc = item.replace(index+1, "").trim();
    service.push(abc);
  });

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('https://www.didosalon.com/', {
      'contact': ['.widget-address', function ($div) {
        return this.map('li', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var result2a = [];
  result2.map((item, index) => {
    if(item.length > 0) {
      result2a.push(item)
    }
  });

  result2a = result2a[0];
  var branch = [result2a[0]+' '+result2a[1]+' '+result2a[2]]
  var contact = result2a[3]+' '+result2a[4];
  branch.push(result2a[3]+' '+result2a[4]+' '+result2a[5]);

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('https://www.didosalon.com/', {
      'logo': ['.navbar-brand', function ($img) {
        return this.map('img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  let name = 'Dido Salon'; //must be unique
  image = image[0][0];
  image = 'https://www.didosalon.com'+image

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
        geoLoc(name, item.substring(0,15), branch[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: service.toString(),
    address: contact,
    images: image,
    name: name,
    branch:[],
    baseUrl:'https://www.didosalon.com',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed didosalon');

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

module.exports = didosalon
