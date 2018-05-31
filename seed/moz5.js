const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function moz5() {
  seederModel.findOne({name:'Moz5'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Moz5'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({name:['Hair', 'Bridal And Spa', 'Nails']},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Moz5')
              return console.log(err);

            }

            seederModel.create({name:'Moz5'}, (err, seed) => {
              if (seed) {
                console.log('seeder Moz5 berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = moz5()
