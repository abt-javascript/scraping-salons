'use strict';
const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const scrapingModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const async = require('async');

async function maymay() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id', {
      'service': ['.list-unstyled', function ($div) {
        return this.map('li', ($item) =>{
          return $item.find('a').text();
        })
      }]
    }, (err, result) => {
      resolve(result.service)
    });
  });

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/contact', {
      'contact': ['.sidecontact', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text();
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

  var result4 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://salon.maymay.co.id/', {
      'images': ['img', function ($img) {
        return $img.attr('src');
      }]
    }, function (err, result) {
      resolve(result.images);
    });
  })

  let name = 'maymay';
  let branch = result3.toString().replace(/\s+/g," ");
  branch = branch.replace( /[\u2012\u2013\u2014\u2015]/g, '' );
  branch = branch.replace( /check googlemaps/g, '' );
  let arr_branch = branch.split(',');

  Promise.each = async function(arr, fn) { // take an array and a function
     for(const item of arr) await fn(item);
  }

  let readyBranch = [];
  async function looping(item) {
    let location = new Promise((resolve, reject) => {
      geoLoc(name, item).then(function(loc) {
          resolve(loc)
        }).catch(function(err){
          reject(err);
        });
    })

    return location;
  }

  Promise.each(arr_branch, looping).then(function(abc) {
    console.log(abc);
    console.log('ready branch',readyBranch);
  });

  Promise.all(readyBranch).then(() =>{
    let payload = {
      service: result.toString().trim(),
      contact: result2.toString().trim(),
      images: result4.toString().trim(),
      branch: readyBranch,//branch.replace( /[\u2012\u2013\u2014\u2015]/g, '' ),
      name: name,
      baseUrl:'http://salon.maymay.co.id/',
      created: new Date()
    }

    scrapingModel.update({name: name}, payload, {upsert: true}, (err, ok) => {
      if(!err) {
        console.log('created succeed maymay')
      }

      if(err){
        console.log('error create', err);
      }
    });
  })

}

module.exports = maymay
