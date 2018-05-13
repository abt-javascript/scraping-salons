
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function estherHouse() {
  seederModel.findOne({name:'Esther House'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Esther House'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Esther House')
              return console.log(err);

            }

            seederModel.create({name:'Esther House'}, (err, seed) => {
              if (seed) {
                console.log('seeder Esther House berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = estherHouse()
