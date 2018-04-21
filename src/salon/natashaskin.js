'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');
const axios = require('axios');

async function natashaskin() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.natasha-skin.com/treatment', {
      'service': ['.text', function ($div) {
        return this.map('a', ($item) =>{
          return $item.find('h3').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });

  var resulta = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.natasha-skin.com/treatment?page=2', {
      'service': ['.text', function ($div) {
        return this.map('a', ($item) =>{
          return $item.find('h3').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });

  var resultb = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.natasha-skin.com/treatment?page=3', {
      'service': ['.text', function ($div) {
        return this.map('a', ($item) =>{
          return $item.find('h3').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });

  var resultc = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.natasha-skin.com/treatment?page=4', {
      'service': ['.text', function ($div) {
        return this.map('a', ($item) =>{
          return $item.find('h3').text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service maymay null')
    });
  });

  resulta = result.concat(resulta);
  resultb = resulta.concat(resultb);
  var service = resultb.concat(resultc);
  service = service.toString().trim();

  var result2 = await new Promise((resolve, reject) => {
    axios.post('http://www.natasha-skin.com/provinsi?id=12').then((response) => {
      if(response.data) {
        htmlToJson.parse(response.data, {
          branch: function ($doc, $) {
            return this.map('option', function ($item) {
             return $item.attr('value');
           });
          }
        }).done(function (result) {
          resolve(result.branch);
        }, function (err) {
          reject(err);
        });
      }
      else{
        resolve(response)
      }
    })
    .catch(function (error) {
      reject(error);
    });
  });

  var result2a = await new Promise((resolve, reject) => {
    axios.post('http://www.natasha-skin.com/provinsi?id=11').then((response) => {
      if(response.data) {
        htmlToJson.parse(response.data, {
          branch: function ($doc, $) {
            return this.map('option', function ($item) {
             return $item.attr('value');
           });
          }
        }).done(function (result) {
          resolve(result.branch);
        }, function (err) {
          reject(err);
        });
      }
      else{
        resolve(response)
      }
    })
    .catch(function (error) {
      reject(error);
    });
  });
  var result2b = [];
  result2.map((item) => {
    if(item !== '') {
      item = item.split('#');
      result2b.push(item);
    }
  });

  result2a.map((item) => {
    if(item !== '') {
      item = item.split('#');
      result2b.push(item);
    }
  });

  var result2c = result2b[0]
  result2b.map((item, index) =>{
    if(index > 0) {
      result2c = result2c.concat(item);
    }
  });

  var branch = [];
  result2c.map((item) => {
    item = item.split('*');
    branch.push(item);
  });

  var contact = branch[0][2];
  var phone = contact.substring(94, contact.length)

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.natasha-skin.com', {
      'logo': ['.logo', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });
  image = image.toString();

  let name = 'Natasha Skin'; //must be unique

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
    console.log('location found', item[2]);
    return  {
      salon:salon_id,
      address: item[2],
      created: new Date(),
      location: JSON.stringify({lat:item[0], lng:item[1]})
    }
  }

  let payload = {
    service: service,
    contact: contact,
    images: image,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://www.natasha-skin.com',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) =>{
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed Natasha Skin');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          Promise.each(branch, looping, salonId).then(function() {
            //create location
            locationModel.create(readyBranch, (err, location) => {
              if(!err) {
                console.log('created location Natasha Skin succeed');
                return resolve();
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

module.exports = natashaskin
