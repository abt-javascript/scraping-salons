const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function natashaSkin() {
  seederModel.findOne({name:'Natasha Skin'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Natasha Skin'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Natasha Skin')
              return console.log(err);
              
            }

            seederModel.create({name:'Natasha Skin'}, (err, seed) => {
              if (seed) {
                console.log('seeder Natasha Skin berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = natashaSkin()
