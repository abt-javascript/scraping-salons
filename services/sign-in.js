'use strict'

const bcrypt = require('bcrypt');
const promise = require('bluebird');

function compare(password, obj){
  return new promise((resolve, reject) => {
    bcrypt.compare(password, obj.password, (err, result) => {
      if (err) {
        console.log('bcrypt compare error', err);
        reject(err);
      }

      resolve(result);
    });
  });
}

const signin = async (password, obj) => {
  const auth = await compare(password, obj);

  return auth;
}

module.exports = signin;
