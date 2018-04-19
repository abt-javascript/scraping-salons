'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function poetrespa() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://poetrespa.com/spamenu/spamenu.php?id=1', {
      'service': ['.treeview', function ($div) {
        return this.map('ul', ($item) =>{
          var abc =  $item.text().trim().replace(/(\t)/gm,"");
          abc = abc.replace(/(\n)/gm,", ")
          return abc
        })
      }]
    }, (err, result) => {
      if(result){
        return resolve(result.service)
      }

      return reject('service Poetre Spa null')
    });
  });
  var service = result[0];

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://poetrespa.com/contact.php', {
      'contact': ['table', function ($div) {
        return this.map('tr > td', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });
  result2 = result2[0];

  var contact = `${result2[0]} ${result2[2]} ${result2[7]}`;
  
  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://poetrespa.com/outlets.php', {
      'branch': ['#isiContent', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  result3 = result3[0];
  var result3a = [result3[3]+' '+result3[4]];
  result3a.push(result3[5]+' '+result3[6])
  result3a.push(result3[7]+' '+result3[8]);
  result3a.push(result3[9]+' '+result3[10]);
  result3a.push(result3[13]+' '+result3[14]);
  result3a.push(result3[15]+' '+result3[16]);

  var branch = []
  result3a.map((item) => {
    branch.push(item.substring(2, item.length).trim())
  });

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://poetrespa.com/', {
      'logo': ['#menu-header', function ($img) {
        return this.map('a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  image = image.toString();
  image = 'http://poetrespa.com/'+image
  let name = 'Poetre Spa'; //must be unique
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
        geoLoc(name, item.substring(0,25), branch[i], salon_id).then(function(loc) {
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
    baseUrl:'http://poetrespa.com/',
    created: new Date()
  }

  salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
    if(!err) {
      console.log('created succeed poetre spa');

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

module.exports = poetrespa
