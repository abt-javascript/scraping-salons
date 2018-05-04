const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function salonCantik() {
  seederModel.findOne({name:'Salon Cantik'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Salon Cantik'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Salon Cantik')
              return console.log(err);
              
            }

            seederModel.create({name:'Salon Cantik'}, (err, seed) => {
              if (seed) {
                console.log('seeder Salon Cantik berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = salonCantik()

