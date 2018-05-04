const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function royalGarden() {
  seederModel.findOne({name:'Royal Garden'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Royal Garden'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Royal Garden')
              return console.log(err);
              
            }

            seederModel.create({name:'Royal Garden'}, (err, seed) => {
              if (seed) {
                console.log('seeder Royal Garden berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = royalGarden()
