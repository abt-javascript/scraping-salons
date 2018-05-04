const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function dianMustika() {
  seederModel.findOne({name:'Dian Mustika'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Dian Mustika'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Dian Mustika')
              return console.log(err);
              
            }

            seederModel.create({name:'Dian Mustika'}, (err, seed) => {
              if (seed) {
                console.log('seeder Dian Mustika berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = dianMustika()

