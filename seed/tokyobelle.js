const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function tokyoBelle() {
  seederModel.findOne({name:'Tokyo Belle'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Tokyo Belle'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Tokyo Belle')
              return console.log(err);
              
            }

            seederModel.create({name:'Tokyo Belle'}, (err, seed) => {
              if (seed) {
                console.log('seeder Tokyo Belle berhasil');
              }
            });
          })
        }
      })
    }
  })

}

module.exports = tokyoBelle()
