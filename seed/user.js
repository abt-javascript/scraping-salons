const generateHash = require('../services/hash.js');
const userModel = require('../src/user/model');
const seederModel = require('../config/seeder_model');

function seederUser() {
  seederModel.findOne({name:'user'}, (err, user) => {
    if (!user) {
      generateHash('admin1234').then(hash => {
        let payload = {
          name: 'admin',
          username:'admin',
          created: new Date()
        }

        payload.password = hash;

        userModel.create(payload, (err, ok) => {
          if(!err) {
            seederModel.create({name:'user'}, (err, seed) => {
              if (seed) {
                console.log('seeder user berhasil');
              }
            })

          }

          if(err && err.code === 11000){
            console.log('duplicate payload');
          }

        });
      }).catch(err => {
        console.log(err)
      });
    }
  })

}

module.exports = seederUser()
