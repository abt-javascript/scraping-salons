const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function maymayUser() {
  seederModel.findOne({name:'May May'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'May May'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('may may')
              return console.log(err);
              
            }

            seederModel.create({name:'May May'}, (err, seed) => {
              if (seed) {
                console.log('seeder May May berhasil');
              }
            });
          })
        }
      })
      //categoryModel.find().exec((err, result) => {

        // salonModel.findOne({name:'May May'}).exec((err, salon) => {
        //     let arr = []
        //     result.map((item) =>{
        //         if(salon) {
        //             arr.push({salon:salon._id, category:item._id});
        //         }
                
        //     });

        //     Promise.all(result).then(() => {
        //         salonCategoryModel.create(arr, (err, salca) => {
        //           if(salca){
        //             seederModel.create({name:'May May'}, (err, seed) => {
        //                 if (seed) {
        //                 console.log('seeder May May berhasil');
        //                 }
        //             });
        //           }
        //         });
        //     })
        // });
      //});
    }
  })

}

module.exports = maymayUser()
