const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function umandaruSpa() {
  seederModel.findOne({name:'Umandaru Spa'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Umandaru Spa'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({name:['Bridal And Spa', 'Nails', 'Brow']},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Umandaru Spa')
              return console.log(err);

            }

            seederModel.create({name:'Umandaru Spa'}, (err, seed) => {
              if (seed) {
                console.log('seeder Umandaru Spa berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = umandaruSpa()
