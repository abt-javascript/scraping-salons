const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function tokyobelle() {
  seederModel.findOne({name:'Tokyo Belle'}, (err, category) => {
    if (!category) {
      categoryModel.find().exec((err, result) => {
        salonModel.findOne({name:'Tokyo Belle'}).exec((err, salon) => {
            let arr = [];

            if(salon) {
              result.map((item) =>{
                  if(item.name === 'Hair'){
                    arr.push({salon:salon._id, category:item._id});
                  }
              });

              Promise.all(result).then(() => {
                  salonCategoryModel.create(arr, (err, salca) => {
                    if(salca){
                      seederModel.create({name:'Tokyo Belle'}, (err, seed) => {
                          if (seed) {
                          console.log('seeder Tokyo Belle berhasil');
                          }
                      });
                    }
                  });
              })
            }
        });
      });
    }
  })

}

module.exports = tokyobelle()