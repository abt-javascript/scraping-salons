'use strict';

const htmlToJson = require('html-to-json');
const cheerio = require('cheerio');
const _ = require('lodash');
const salonModel = require('./model');
const geoLoc =  require('../../services/getLatLangMaps.js');
const locationModel = require('../location/model');
const imgBuffer =  require('../../services/image_to_buffer.js');

async function irwansalon() {
  var result = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/other_service', {
      'service': ['.sidebar-item', function ($div) {
        return this.map('ul > li', ($item) =>{
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

  var service = [];
  result.map((item, index) => {
    if(item.length > 0) {
      service.push(item);
    }
  });

  var result2 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/6/bintaro-jaya', {
      'contact': ['.text-desc', function ($div) {
        return this.map('p', ($item) =>{
          return $item.text().trim().replace(/(\r\n|\n|\r)/gm,"");
        })
      }]
    }, (err, result) => {
      resolve(result.contact)
    });
  });

  var contact = 'Cabang Bintaro Jaya '+result2[0][0]

  var result3 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/14/pik-avenue-mal', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
        return this.map('figcaption', ($item) =>{
          return $item
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var branch = [result3[0]];

  var result3a = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/13/lippo-mal-puri-indah-', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
        return this.map('figcaption', ($item) =>{
          return $item
        })
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch)
      }
      
    });
  });

  branch.push(result3a[0]);

  var result3b = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/12/pointcut-salon-by-irwan-team-hairdesign', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
        return this.map('figcaption', ($item) =>{
          return $item
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  branch.push(result3b[0]);

  var result3c = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/11/summarecon-mal-bekasi-', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
        return this.map('figcaption', ($item) =>{
          return $item
        })
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var result3c1 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/11/summarecon-mal-bekasi-', {
      'branch': ['.text-desc', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var bekasi = result3c[0]+result3c1.toString().substring(0,33);
 
  branch.push(bekasi);

  var result3d = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/10/kota-kasablanka', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var result3d1 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/10/kota-kasablanka', {
      'branch': ['.text-desc', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      resolve(result.branch)
    });
  });

  var kokas = result3d[0] + result3d1.toString().substring(0,35);
  branch.push(kokas);

  var result3e = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/9/summarecon-mal-serpong', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch);
      }
      
    });
  });

  var result3e1 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/9/summarecon-mal-serpong', {
      'branch': ['.text-desc', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch)
      }
      
    });
  });

  var serpong = result3e[0] + ' ' +result3e1.toString().substring(0,33);
  branch.push(serpong);

  var result3f = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/8/grand-indonesia', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch);
      }
      
    });
  });

  var result3f1 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/8/grand-indonesia', {
      'branch': ['.text-desc', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch)
      }
    });
  });
  result3f1 = result3f1.toString();
  var gi = result3f[0] +' '+result3f1.substring(0,35);
  
  branch.push(gi);

  var result3g = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/7/pondok-indah-mall', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch);
      }
      
    });
  });

 
  var result3g1 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/7/pondok-indah-mall', {
      'branch': ['.text-desc', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result) {
        resolve(result.branch);
      }
      
    });
  });

  result3g1 = result3g1.toString();
  var pim  = result3g[0]+' '+result3g1.substring(0,30);
 
  branch.push(pim);

  var result3h = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/7/pondok-indah-mall', {
      'branch': ['.lined', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result){
        resolve(result.branch);
      }
      
    });
  });

  var result3h1 = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/branch/show/6/bintaro-jaya', {
      'branch': ['.text-desc', function ($div) {
        return $div.text().trim().replace(/(\r\n\t|\n|\r|\t)/gm,"");
      }]
    }, (err, result) => {
      if(result) {
        resolve(result.branch);
      }
      
    });
  });

  result3h1 = result3h1.toString();
  var bintaro  = result3h[0]+' '+result3h1.substring(0,36);
 
  branch.push(bintaro);
  // return console.log(branch);
  // var result312 = await new Promise((resolve, reject) => {
  //   htmlToJson.request('http://salon.maymay.co.id/our-shop', {
  //     'address': ['.shop-box', function ($div) {
  //       return this.map('figcaption > h3', ($item) =>{
  //         return $item.text().trim();
  //       })
  //     }]
  //   }, (err, result) => {
  //     resolve(result.address)
  //   });
  // });

  // result3a = result3a.toString();

  var image = await new Promise((resolve, reject) => {
    htmlToJson.request('http://irwanteam.com/main', {
      'logo': ['.brand', function ($img) {
        return this.map('img', ($item) => {
          return $item.attr('src');
        })
      }]
    }, function (err, result) {
      if(result){
        resolve(result.logo);
      }
    });
  });

  image = image.toString();
  let name = 'Irwan Salon'; //must be unique

  // let branch = result3.toString().replace(/\s+/g," ");
  // branch = branch.replace( /[\u2012\u2013\u2014\u2015]/g, '' );
  // branch = branch.replace( /check googlemaps/g, '' );
  // let arr_branch = branch.split(',');
  // let arr_branch_query = result3a.split(',');
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
        geoLoc(name, item.substring(0,15), branch[i], salon_id).then(function(loc) {
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
    baseUrl:'http://irwanteam.com/',
    created: new Date()
  }

  salonModel.update({name: name}, payload, {upsert: true}, (err, salon) => {
    if(!err) {
      console.log('created succeed Irwan Salon');

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

module.exports = irwansalon
