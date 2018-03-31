const generateHash = require('../services/hash.js');
const categoryModel = require('../src/category/model');
const seederModel = require('../config/seeder_model');

function seederUser() {
  seederModel.findOne({name:'category'}, (err, category) => {
    if (!category) {
      const payload = [{name:'Hair'},{name:'Eyelashes'},{name:'Brow'},{name:'Bridal'},{name:'Nails'}];

      categoryModel.create(payload, (err, ok) => {
          if(!err) {
            seederModel.create({name:'category'}, (err, seed) => {
              if (seed) {
                console.log('seeder category berhasil');
              }
            });
          }

          if(err && err.code === 11000) {
            console.log('duplicate payload');
          }

          console.log(err);
        });
    }
  })

}

module.exports = seederUser()
