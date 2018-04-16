'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function maymay() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id', {
      'service': ['.list-unstyled', function ($div) {
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

  result = result.toString().trim();

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/contact', {
      'contact': ['.sidecontact', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/our-shop', {
      'branch': ['.shop-box', function ($div) {
        return this.map('figcaption', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });
  var result3a = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/our-shop', {
      'address': ['.shop-box', function ($div) {
        return this.map('figcaption > h3', ($item) =>{
          return $item.text().trim();
        })
      }]
    }, (err, result) => {
      resolve(result.address)
    });
  });

  result3a = result3a.toString();

  var result4 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/', {
      'logo': ['.logo', function ($img) {
        return this.map('figure > a > img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      resolve(result.logo);
    });
  });

  let name = 'May May'; //must be unique

  let branch = result3.toString().replace(/\s+/g," ");
  branch = branch.replace( /[\u2012\u2013\u2014\u2015]/g, '' );
  branch = branch.replace( /check googlemaps/g, '' );
  let arr_branch = branch.split(',');
  let arr_branch_query = result3a.split(',');
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
        geoLoc(name, item, arr_branch[i], salon_id).then(function(loc) {
            resolve(loc)
          }).catch(function(err){
            reject(err);
          });
      }, 1000);
    });
  }

  var url = 'http://salon.maymay.co.id' + result4.toString().trim();
  imgBuffer(url).then((img) => {
    let payload = {
      service: result,
      contact: result2.toString().trim(),
      images: img,
      name: name,
      branch:[],
      baseUrl:'http://salon.maymay.co.id/',
      created: new Date()
    }

    salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
      if(!err) {
        console.log('created succeed maymay');

        if(salon.upserted && salon.upserted.length > 0) {
          let salonId = salon.upserted[0]._id;

          Promise.each(arr_branch_query, looping, salonId).then(function() {
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
  });
}

module.exports = maymay
