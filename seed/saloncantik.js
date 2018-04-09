const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function maymayUser() {
  seederModel.findOne({name:'Salon Cantik'}, (err, category) => {
    if (!category) {
      categoryModel.find().exec((err, result) => {
        salonModel.findOne({name:'Salon Cantik'}).exec((err, salon) => {
            let arr = []
            result.map((item) =>{
                if(salon) {
                    arr.push({salon:salon._id, category:item._id});
                }

            });

            Promise.all(result).then(() => {
                salonCategoryModel.create(arr, (err, salca) => {
                  if(salca){
                    seederModel.create({name:'Salon Cantik'}, (err, seed) => {
                        if (seed) {
                        console.log('seeder Salon Cantik berhasil');
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
