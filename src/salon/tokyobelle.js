'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function tokyobelle() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.tokyo-belle.com/id/service', {
      'service': ['.mb3', function ($div) {
        return this.map('.w-third-l', ($item) =>{
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

  var service = result[0].toString();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.tokyo-belle.com/id/reservation', {
      'contact': ['.ph3', function ($div) {
        return this.map('div', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  //result2 = result2[0];
  var contact = `${result2[2][2]} ${result2[2][4]} ${result2[2][6]}`;
  var phone = result2[2][6].substring(0, 13)
  var branch = [contact];
  branch.push(`${result2[2][15]} ${result2[2][17]} ${result2[2][19]}`);
  branch.push(`${result2[2][27]} ${result2[2][29]} ${result2[2][31]}`);
  branch.push(`${result2[2][38]} ${result2[2][40]}`);
  branch.push(`${result2[2][47]} ${result2[2][49]}`);
  branch.push(`${result2[2][55]} ${result2[2][57]} ${result2[2][59]}`);
  branch.push(`${result2[2][55]} ${result2[2][57]}`);
  branch.push(`${result2[2][67]} ${result2[2][69]}`);
  branch.push(`${result2[2][77]} ${result2[2][79]}`);

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.tokyo-belle.com/id', {
      'logo': ['.dim', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });
  image = image[0][0]

  let name = 'Tokyo Belle'; //must be unique
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
    contact: contact,
    images: image,
    name: name,
    phone: phone,
    branch:[],
    baseUrl:'http://www.tokyo-belle.com/',
    created: new Date()
  }

  var finish = await new Promise(function(resolve, reject) {
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed Tokyo Belle');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          Promise.each(branch, looping, salonId).then(function() {
            //create location
            locationModel.create(readyBranch, (err, location) => {
              if(!err) {
                console.log('created location Tokyo Belle succeed');
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

module.exports = tokyobelle
