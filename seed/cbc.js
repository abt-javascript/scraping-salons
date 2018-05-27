const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function Cbc() {
  seederModel.findOne({name:'CBC Beauty Care'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'CBC Beauty Care'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({name:'Bridal And Spa'},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Cbc')
              return console.log(err);

            }

            seederModel.create({name:'CBC Beauty Care'}, (err, seed) => {
              if (seed) {
                console.log('seeder Cbc berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = Cbc()
