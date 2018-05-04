const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function poetreSpa() {
  seederModel.findOne({name:'Poetre Spa'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Poetre Spa'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Poetre Spa')
              return console.log(err);
              
            }

            seederModel.create({name:'Poetre Spa'}, (err, seed) => {
              if (seed) {
                console.log('seeder Poetre Spa berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = poetreSpa()
