const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function anitaSalon() {
  seederModel.findOne({name:'Zanita Salon'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Zanita Salon'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({name:'Bridal And Spa'},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Zanita Salon')
              return console.log(err);

            }

            seederModel.create({name:'Zanita Salon'}, (err, seed) => {
              if (seed) {
                console.log('seeder Zanita Salon berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = anitaSalon()
