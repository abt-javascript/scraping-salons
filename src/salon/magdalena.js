'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');

async function magdalena() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.magdalenayoungbridal.com/Service.htm', {
      'service': ['.lay_598_43', function ($div) {
        return this.map('div', ($item) =>{
          return $item.find('div').text();
        })
      }]
    }, (err, result) => {
      resolve(result.service)
    });
  });

  var resultA = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.magdalenayoungbridal.com/Service.htm', {
      'service': ['.facenter', function ($div) {
        return this.map('span', ($item) =>{
          return $item.text();
        })
      }]
    }, (err, result) => {
      resolve(result.service)
    });
  });

  var resultB = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.magdalenayoungbridal.com/Service.htm', {
      'service': ['.popup', function ($div) {
        return this.map('a', ($item) =>{
          return $item.text();
        })
      }]
    }, (err, result) => {
      resolve(result.service)
    });
  });

  let service = [];
  let PromiseEach = async function(arr, fn) {
    for(const item of arr) {
        let data = await fn(item);

        service.push(JSON.stringify({type:data.type, value:data.data}));
    }      
  }

  function loopingB(item) {
    return new Promise((resolve, reject) => {
      let type = item.splice(0, 1)
      resolve({type:type[0], data:item});
    });
  }

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.magdalenayoungbridal.com/Page/About-Magdalena-Young-Bridal.html', {
      'contact': ['.fc28282a', function ($span) {
        return $span.text();
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var result4 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://www.magdalenayoungbridal.com/', {
      'logo': ['a.data_2494_340 > img', function ($img) {
        return $img.attr('src');
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  let name = 'Magadalena'; //must be unique

  return PromiseEach(resultB, loopingB).then((item) => {
    let payload = {
      service: service.toString().trim(),
      contact: result2.toString().trim(),
      images: result4.toString().trim(),
      name: name,
      branch:[],
      baseUrl:'http://www.magdalenayoungbridal.com/',
      created: new Date()
    }
    
    salonModel.update({name: name}, payload, {upsert: true}, (err, result) => {
      if(!err) {
        console.log('created succeed magdalena');
  
        if(result.upserted && result.upserted.length > 0) {
          let salonId = result.upserted[0]._id;
  
            geoLoc(name, 'Alam Sutera - Serpong', result2.toString().trim(), salonId).then(function(loc) {
              console.log('ini loc',loc) 
              //create location
              locationModel.create(loc, (err, location) => {
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
  });
 
}

module.exports = magdalena
