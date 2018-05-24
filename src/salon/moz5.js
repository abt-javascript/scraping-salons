'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function moz5() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://moz5salonmuslimah.com/index.php/page/service.html', {
      'service': ['.MsoListParagraphCxSpLast', function ($div) {
        return this.map('strong', ($item) => {
          return $item.text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service Moz5 null')
    });
  });

  var resulta = await new Promise((resolve, reject) => {
    htmlToJson.request('http://moz5salonmuslimah.com/index.php/page/service.html', {
      'service': ['.MsoNormal', function ($div) {
        return this.map('strong', ($item) => {
          return $item.text();
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service Moz5 null')
    });
  });
  var arr =[]
  resulta.map((item,index) => {
    if(item.length > 0) {
      arr.push(item);
    }

  });

  result.map((item,index) => {
    if(item.length > 0) {
      arr.push(item);
    }
  });

  arr.splice(2, 1);
  var service = arr.toString();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://moz5salonmuslimah.com/index.php/page/contact.html', {
      'contact': ['#content_content', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var contact = result2[0][0];
  var address = result2[0][2]

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://moz5salonmuslimah.com/index.php/page/view_reg/2.html', {
      'branch': ['.link_lokasi', function ($div) {
        return this.map('div > a', ($item) =>{
          return $item.find('p').text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var branch = [];
  result3[0].map((item, index) => {
    if(item !== ''){
      branch.push(item)
    }
  });

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://moz5salonmuslimah.com/', {
      'logo': ['#logo', function ($img) {
        return this.map('img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  image = image.toString();

  let name = 'Moz5'; //must be unique;
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
        geoLoc(name, item.substring(0,25), branch[i], salon_id).then(function(loc) {
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
    branch:[],
    baseUrl:'http://moz5salonmuslimah.com/',
    created: new Date()
  }

  var finish = await new Promise((resolve, reject) =>{
    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed Moz5');

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

module.exports = moz5
