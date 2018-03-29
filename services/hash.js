'use strict';

const bcrypt = require('bcrypt');
const promise = require('bluebird');

const password = async (pass) => {
  const salt = await new promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {
        reject(err);
      }

      if (salt) {
        resolve(salt)
      }
    });
  });

  const hash = await new promise((resolve, reject) => {
    bcrypt.hash(pass, salt, (err, hash) => {
      if(err){
        reject(err);
      }

      if (hash) {
        resolve(hash);
      }
    });
  });

  return hash;
}

module.exports = password
