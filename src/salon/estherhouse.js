'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');
const axios = require('axios');

async function estherhouse() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://estherhouseofbeauty.co.id', {
      'service': ['.focus-box', function ($div) {
        return $div.text().replace(/(\r\n|\n|\t|\r)/gm,"");
        return this.map('div', ($item) =>{
          return $item.text();
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
  var branch = []
  var url = 'http://estherhouseofbeauty.co.id/?hcs=locatoraid&hca=search%3Asearch%2F_SEARCH_%2Fproduct%2F_PRODUCT_%2Flat%2F_LAT_%2Flng%2F_LNG_%2Flimit%2F200'

  var result2 = await new Promise((resolve, reject) => {
    axios.get(url).then((response) => {
      if(response.data) {
        return resolve(response.data);
      }

      reject(response);
    });

  });

  var branch = [];
  result2.results.map((item) => {
    if(item.id === '15' || item.id === '3') {
      branch.push(item);
    }
  })
  var contact = `${branch[0].name} ${branch[0].street1} ${branch[0].phone}`;
  var phone = branch[0].phone;

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://estherhouseofbeauty.co.id', {
      'logo': ['.responsive-logo', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  image = image.toString();

  let name = 'Esther House'; //must be unique;

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
    console.log('Location Found', item.street1);
    return  {
      salon:salon_id,
      address: `${item.street1} ${item.city} ${item.state}`,
      created: new Date(),
      location: JSON.stringify({lat:item.latitude, lng:item.longitude})
    };
  }

  let payload = {
    service: service,
    contact: contact,
    images: image,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://estherhouseofbeauty.co.id',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) => {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed esther house');

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

module.exports = estherhouse
