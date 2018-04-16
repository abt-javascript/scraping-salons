const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function maymayUser() {
  seederModel.findOne({name:'Moz5'}, (err, category) => {
    if (!category) {
      categoryModel.find().exec((err, result) => {
        salonModel.findOne({name:'Moz5'}).exec((err, salon) => {
            let arr = [];

            if(salon) {
              result.map((item) =>{
                  if(item.name !== 'Bridal'){
                    arr.push({salon:salon._id, category:item._id});
                  }
              });

              Promise.all(result).then(() => {
                  salonCategoryModel.create(arr, (err, salca) => {
                    if(salca){
                      seederModel.create({name:'Moz5'}, (err, seed) => {
                          if (seed) {
                          console.log('seeder Moz5 berhasil');
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

module.exports = maymayUser()
