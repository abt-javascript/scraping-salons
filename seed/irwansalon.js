const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function irwanSalon() {
  seederModel.findOne({name:'Irwan Salon'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Irwan Salon'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Irwan Salon')
              return console.log(err);
              
            }

            seederModel.create({name:'Irwan Salon'}, (err, seed) => {
              if (seed) {
                console.log('seeder Irwan Salon berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = irwanSalon()

