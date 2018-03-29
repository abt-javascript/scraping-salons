'use strict';
const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const scrapingModel = require('./model');

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

  let payload = {
    service: result.toString().trim(),
    contact: result2.toString().trim(),
    images: result4.toString().trim(),
    branch:result3.toString().replace(/\s+/g," "),
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
}

module.exports = maymay
