const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function fourlen() {
  seederModel.findOne({name:'Fourlen'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Fourlen'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Fourlen')
              return console.log(err);
              
            }

            seederModel.create({name:'Fourlen'}, (err, seed) => {
              if (seed) {
                console.log('seeder Fourlen berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = fourlen()
