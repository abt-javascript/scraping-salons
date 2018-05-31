const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function didoSalon() {
  seederModel.findOne({name:'Dido Salon'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Dido Salon'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({name: 'Hair'},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Dido Salon')
              return console.log(err);

            }

            seederModel.create({name:'Dido Salon'}, (err, seed) => {
              if (seed) {
                console.log('seeder Dido Salon berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = didoSalon()
