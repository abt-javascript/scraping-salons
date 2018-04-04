const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function maymayUser() {
  seederModel.findOne({name:'Magadalena'}, (err, category) => {
    if (!category) {
      categoryModel.find().exec((err, result) => {
        salonModel.findOne({name:'Magadalena'}).exec((err, salon) => {
            let arr = []
            result.map((item) =>{
                if(salon) {
                    arr.push({salon:salon._id, category:item._id});
                }
                
            });

            Promise.all(result).then(() => {
                salonCategoryModel.create(arr, (err, salca) => {
                  if(salca){
                    seederModel.create({name:'Magadalena'}, (err, seed) => {
                        if (seed) {
                        console.log('seeder Magadalena berhasil');
                        }
                    });
                  }
                });
            })
        });
      });
    }
  })

}

module.exports = maymayUser()
