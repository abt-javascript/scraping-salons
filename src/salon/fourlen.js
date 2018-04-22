'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function fourlen() {
  var service = await new Promise((resolve, reject) => {
    htmlToJson.request('http://fourlensalon.com/services.html', {
      'service': ['.nopad', function ($div) {
        return this.map('table', ($item) =>{
          return $item.find('p').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service fourlen null')
    });
  });

  service = service.toString().trim();

  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://fourlensalon.com/', {
      'contact': ['table', function ($div) {
        return this.map('ul > li', ($item) =>{
          return $item.text() //.trim().replace(/(\r\n|\n|\r)/gm,",");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var cabang =  result[6];
  var tlp = '(021) '+cabang[0].substring(66, 76);
  let name = 'Fourlen'; //must be unique

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
        geoLoc(name, item.substring(0, 15), cabang[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  let payload = {
    service: service,
    contact: tlp,
    images: '',
    name: name,
    branch:[],
    baseUrl:'http://fourlensalon.com',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
        if(!err) {
          console.log('created succeed Fourlen');

          if(salon.upserted && salon.upserted.length > 0) {

            let salonId = salon.upserted[0]._id;

            Promise.each(cabang, looping, salonId).then(function() {
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

module.exports = fourlen
