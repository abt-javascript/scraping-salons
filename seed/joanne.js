const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function Joanne() {
  seederModel.findOne({name:'Joanne'}, (err, category) => {
    if (!category) {
      categoryModel.find().exec((err, result) => {
        salonModel.findOne({name:'Joanne'}).exec((err, salon) => {
            let arr = [];

            if(salon) {
              result.map((item) =>{
                  arr.push({salon:salon._id, category:item._id});
              });

              Promise.all(result).then(() => {
                  salonCategoryModel.create(arr, (err, salca) => {
                    if(salca){
                      seederModel.create({name:'Joanne'}, (err, seed) => {
                          if (seed) {
                          console.log('seeder Joanne berhasil');
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

module.exports = Joanne()
