
const categoryModel = require('../src/category/model');
const salonCategoryModel = require('../src/salon_category/model');
const salonModel = require('../src/salon/model');
const seederModel = require('../config/seeder_model');

function Joanne() {
  seederModel.findOne({name:'Joanne'}, (err, seed) => {
    if (!seed) {
      salonModel.findOne({name:'Joanne'}).exec((err, salon) => {
        if(salon){
          categoryModel.update({},{$push:{salons:salon}},
            {
              multi: true
            },(err, ok) =>{
            if(err){
              console.log('Joanne')
              return console.log(err);

            }

            seederModel.create({name:'Joanne'}, (err, seed) => {
              if (seed) {
                console.log('seeder Joanne berhasil');
              }
            });
          })
        }
      })

    }
  })

}

module.exports = Joanne()
