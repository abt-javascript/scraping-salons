const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function anitaSalon() {
  seederModel.findOne({name:'Anita Salon'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Anita Salon'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Anita Salon')
              return console.log(err);
              
            }

            seederModel.create({name:'Anita Salon'}, (err, seed) => {
              if (seed) {
                console.log('seeder Anita Salon berhasil');
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

module.exports = anitaSalon()
