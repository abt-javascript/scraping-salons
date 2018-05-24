const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function naoimi() {
  seederModel.findOne({name:'Naomi'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Naomi'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Naomi')
              return console.log(err);

            }

            seederModel.create({name:'Naomi'}, (err, seed) => {
              if (seed) {
                console.log('seeder Naoimi berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = naoimi()
