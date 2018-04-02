const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function maymayUser() {
  seederModel.findOne({name:'May May'}, (err, category) => {
    if (!category) {
      categoryModel.find().exec((err, result) => {
        salonModel.findOne({name:'May May'}).exec((err, salon) => {
            let arr = []
            result.map((item) =>{
                if(salon) {
                    arr.push({salon:salon._id, category:item._id});
                }
                
            });

            Promise.all(result).then(() => {
                salonCategoryModel.create(arr, (err, salca) => {
                  if(salca){
                    seederModel.create({name:'May May'}, (err, seed) => {
                        if (seed) {
                        console.log('seeder May May berhasil');
                        }
                    });
                  }
                });
            })
        });
      });
    //   const payload = [{name:'Hair'},{name:'Eyelashes'},{name:'Brow'},{name:'Bridal'},{name:'Nails'}];

    //   categoryModel.create(payload, (err, ok) => {
    //       if(!err) {
    //         seederModel.create({name:'May May'}, (err, seed) => {
    //           if (seed) {
    //             console.log('seeder May May berhasil');
    //           }
    //         });
    //       }

    //       if(err && err.code === 11000) {
    //         console.log('duplicate payload');
    //       }

    //       console.log(err);
    //     });
    }
  })

}

module.exports = maymayUser()
